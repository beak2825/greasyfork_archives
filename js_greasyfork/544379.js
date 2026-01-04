// ==UserScript==
// @name         WordPress網站圖片原檔下載器
// @namespace    https://greasyfork.org/scripts/544379
// @version      1.1
// @description  WordPress網站圖片原檔批量下載器 - 優先原始圖片，CRC32去重，自動檢測網站是否為WordPress網站
// @author       fmnijk
// @license      MIT
// @match        https://*/*
// @match        http://*/*
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @connect      *
// @require      https://cdn.jsdelivr.net/npm/fflate@0.8.2/umd/index.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/crc-32/1.2.2/crc32.min.js
// @icon         https://s0.wp.com/i/favicon.ico
// @downloadURL https://update.greasyfork.org/scripts/544379/WordPress%E7%B6%B2%E7%AB%99%E5%9C%96%E7%89%87%E5%8E%9F%E6%AA%94%E4%B8%8B%E8%BC%89%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/544379/WordPress%E7%B6%B2%E7%AB%99%E5%9C%96%E7%89%87%E5%8E%9F%E6%AA%94%E4%B8%8B%E8%BC%89%E5%99%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let isDownloading = false;
    let shouldStop = false;

    // 全域開關變數（不顯示在UI上）
    const useAPIDownload = true;
    const useImgElements = true;

    // 跳過的附檔名
    const skipExtensions = ['.svg'];

    // 改進版的WordPress檢測函數
    async function isWordPressSite() {
        let score = 0;
        const checks = [];

        // 1. 檢查generator標籤 (權重: 3)
        const generatorMeta = document.querySelector('meta[name="generator"][content*="WordPress"]');
        if (generatorMeta) {
            score += 3;
            checks.push('generator標籤');
        }

        // 2. 檢查WordPress特有的CSS/JS檔案 (權重: 2)
        const wpAssets = document.querySelectorAll('link[href*="wp-includes"], script[src*="wp-includes"]');
        if (wpAssets.length > 0) {
            score += 2;
            checks.push('wp-includes資源');
        }

        // 3. 檢查WordPress特有的CSS類名 (權重: 1)
        const wpClasses = ['wp-admin-bar', 'wp-block', 'wp-content', 'wp-caption'];
        const foundClasses = wpClasses.filter(cls => document.querySelector(`.${cls}`));
        if (foundClasses.length > 0) {
            score += Math.min(foundClasses.length, 2);
            checks.push(`WordPress類名: ${foundClasses.join(', ')}`);
        }

        // 4. 檢查WordPress特有的HTML註釋 (權重: 1)
        const htmlContent = document.documentElement.outerHTML;
        const wpComments = [
            /<!--.*?WordPress.*?-->/i,
            /<!--.*?wp-.*?-->/i,
            /<!--.*?WP_.*?-->/i
        ];
        if (wpComments.some(regex => regex.test(htmlContent))) {
            score += 1;
            checks.push('WordPress註釋');
        }

        // 5. 檢查WordPress REST API (權重: 3) - 最可靠的方法
        try {
            const apiResponse = await fetch(`${location.origin}/wp-json/wp/v2/types`, {
                method: 'HEAD',
                timeout: 5000
            });
            if (apiResponse.ok) {
                score += 3;
                checks.push('REST API可用');
            }
        } catch (e) {
            // API不可用，不加分也不扣分
        }

        // 6. 檢查wp-content路徑（降低權重，因為可能被其他CMS使用）
        if (/\/wp-content\//i.test(htmlContent)) {
            score += 1;
            checks.push('wp-content路徑');
        }

        // 7. 檢查WordPress特有的函數或變數 (權重: 2)
        if (window.wp || window.wpApiSettings || window.wc_add_to_cart_params) {
            score += 2;
            checks.push('WordPress JS物件');
        }

        // 8. 檢查WordPress特有的body class (權重: 1)
        const bodyClasses = document.body.className;
        if (/\b(wordpress|wp-|page-id-|postid-)\b/i.test(bodyClasses)) {
            score += 1;
            checks.push('WordPress body類名');
        }

        console.log(`[WP檢測] 得分: ${score}, 檢測到: ${checks.join(', ')}`);

        // 設定閾值：得分>=4才認為是WordPress網站
        return score >= 4;
    }

    async function testAPI() {
        try {
            const response = await fetch(`${location.origin}/wp-json/wp/v2/media?per_page=1`);
            return response.ok;
        } catch { return false; }
    }

    async function checkImageExists(url) {
        try {
            const response = await fetch(url, { method: 'HEAD' });
            return response.ok;
        } catch { return false; }
    }

    // 檢查是否應該跳過此檔案
    function shouldSkipFile(url) {
        const lowerUrl = url.toLowerCase();
        return skipExtensions.some(ext => lowerUrl.includes(ext));
    }

    // 簡化樣式
    GM_addStyle(`
        #wp-dl {
            position: fixed; top: 20px; right: 20px;
            background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
            border: 1px solid #404040; border-radius: 12px; padding: 16px;
            box-shadow: 0 8px 32px rgba(0,0,0,0.4); z-index: 10000;
            font: 13px/1.4 -apple-system, BlinkMacSystemFont, sans-serif;
            min-width: 280px; color: #e0e0e0; backdrop-filter: blur(10px);
        }
        #wp-dl .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; }
        #wp-dl h3 { margin: 0; color: #64b5f6; font-size: 15px; font-weight: 600; }
        #wp-dl .close {
            background: #f44336; color: white; border: none; width: 24px; height: 24px;
            border-radius: 50%; cursor: pointer; font-size: 12px; font-weight: bold;
        }
        #wp-dl .close:hover { background: #d32f2f; }
        #wp-dl button:not(.close) {
            background: linear-gradient(135deg, #2196f3 0%, #1976d2 100%);
            color: white; border: none; padding: 10px 16px; border-radius: 8px;
            cursor: pointer; margin: 4px 0; width: 100%; font-weight: 500; transition: all 0.2s ease;
        }
        #wp-dl button:hover:not(:disabled) { background: linear-gradient(135deg, #1976d2 0%, #1565c0 100%); }
        #wp-dl button:disabled { background: #424242 !important; opacity: 0.6; cursor: not-allowed; }
        #wp-dl .info {
            background: rgba(255,255,255,0.05); padding: 10px; border-radius: 6px;
            margin: 6px 0; border-left: 3px solid #64b5f6;
        }
        #wp-dl .details { font-size: 11px; color: #b0b0b0; margin-top: 4px; }
    `);

    // 簡化UI
    function createUI() {
        const ui = document.createElement('div');
        ui.id = 'wp-dl';
        ui.innerHTML = `
            <div class="header">
                <h3>🖼️ WP圖片下載器</h3>
                <button class="close">×</button>
            </div>
            <button id="start">開始下載（CRC32去重）</button>
            <button id="stop" disabled>停止</button>
            <div class="info" id="status">準備就緒</div>
            <div class="details" id="details">優先original，CRC32去重，跳過SVG</div>
        `;
        document.body.appendChild(ui);

        ui.querySelector('.close').onclick = () => ui.remove();
        ui.querySelector('#start').onclick = startDownload;
        ui.querySelector('#stop').onclick = () => {
            shouldStop = true;
        };
    }

    function updateStatus(msg, detail = '') {
        const status = document.getElementById('status');
        const details = document.getElementById('details');
        if (status) status.textContent = msg;
        if (details && detail) details.textContent = detail;
        console.log(`[WP-DL] ${msg}${detail ? ' | ' + detail : ''}`);
    }

    // 解碼URL檔名
    function decodeFilename(filename) {
        try {
            return decodeURIComponent(filename);
        } catch {
            return filename;
        }
    }

    function cleanFileName(title, id) {
        const cleanTitle = title || `image_${id}`;
        return cleanTitle
            .replace(/[<>:"/\\|?*\x00-\x1f]/g, '_')
            .replace(/\s+/g, '_')
            .replace(/_+/g, '_')
            .trim();
    }

    // 下載圖片並返回數據和CRC32
    function downloadImage(url, filename) {
        return new Promise(resolve => {
            GM_xmlhttpRequest({
                method: 'GET',
                url: url,
                responseType: 'arraybuffer',
                timeout: 30000,
                onload: res => {
                    if (res.status === 200) {
                        const data = new Uint8Array(res.response);
                        const hash = CRC32.buf(data).toString(16);
                        resolve({ data, filename: decodeFilename(filename), hash, url });
                    } else {
                        resolve(null);
                    }
                },
                onerror: () => resolve(null),
                ontimeout: () => resolve(null)
            });
        });
    }

    // 處理單個媒體項目
    function processMediaItem(item) {
        const base = cleanFileName(item.title?.rendered, item.id);
        const domain = location.origin;

        // 優先使用 original_image
        if (item.media_details?.original_image) {
            const filePath = item.media_details.file;
            const originalName = item.media_details.original_image;
            const pathParts = filePath.split('/');
            pathParts[pathParts.length - 1] = originalName;
            const url = `${domain}/wp-content/uploads/${pathParts.join('/')}`;
            const ext = originalName.split('.').pop();

            return {
                url,
                filename: `${base}.${ext}`,
                baseKey: base,
                isOriginal: true
            };
        } else {
            const url = item.media_details?.sizes?.full?.source_url || item.source_url;
            const ext = url.split('.').pop().split('?')[0];

            return {
                url,
                filename: `${base}.${ext}`,
                baseKey: base,
                isOriginal: false
            };
        }
    }

    // 獲取API圖片
    async function getAPIImages() {
        const images = [];
        let page = 1;

        while (!shouldStop) {
            try {
                const res = await fetch(`${location.origin}/wp-json/wp/v2/media?per_page=100&page=${page}`);
                if (!res.ok) break;

                const data = await res.json();
                if (!data?.length) break;

                const imageItems = data
                    .filter(item => item.media_type === 'image')
                    .map(processMediaItem)
                    .filter(item => !shouldSkipFile(item.url)); // 過濾掉要跳過的檔案

                images.push(...imageItems);

                updateStatus(`掃描API第${page}頁`, `找到${images.length}張圖片`);
                page++;
                await new Promise(r => setTimeout(r, 100));
            } catch (e) {
                console.log(`獲取第${page}頁失敗:`, e);
                break;
            }
        }
        return images;
    }

    // 處理單個圖片元素
    async function processImageElement(img, index) {
        const src = img.src;

        // 跳過不相關的圖片和要跳過的檔案類型
        if (!src || src.startsWith('data:') || src.includes('base64') || shouldSkipFile(src)) {
            return null;
        }

        console.log(`${index + 1}. ${src}`);

        // 嘗試移除scale後綴獲得原始圖片URL
        const originalSrc = src.replace(/-scale.*\./g, '.');
        const isScaled = src !== originalSrc;

        let finalUrl = src;
        let isOriginal = !isScaled;
        let filename = decodeFilename(src.split('/').pop().split('?')[0]);

        // 如果是scaled版本，檢查原始版本是否存在
        if (isScaled) {
            const originalExists = await checkImageExists(originalSrc);
            if (originalExists) {
                finalUrl = originalSrc;
                isOriginal = true;
                filename = decodeFilename(originalSrc.split('/').pop().split('?')[0]);
                console.log(`  → 使用原始版本: ${originalSrc}`);
            } else {
                console.log(`  → 原始版本不存在，使用scaled版本`);
            }
        }

        const baseKey = filename.replace(/\.[^.]+$/, '');

        return {
            url: finalUrl,
            filename,
            baseKey,
            isOriginal
        };
    }

    // 使用您建議的方法獲取頁面圖片
    async function getPageImages() {
        const images = [];
        const imgElements = Array.from(document.querySelectorAll('img'));

        updateStatus(`🔍 掃描頁面圖片...`, `發現${imgElements.length}個img標籤`);

        for (let i = 0; i < imgElements.length && !shouldStop; i++) {
            const img = imgElements[i];
            const result = await processImageElement(img, i);

            if (result) {
                images.push(result);
            }

            // 更新進度
            if (i % 10 === 0) {
                updateStatus(`🔍 掃描頁面圖片 ${i + 1}/${imgElements.length}`, `已處理${images.length}張`);
            }
        }

        return images;
    }

    // CRC32去重函數
    function deduplicateByCRC32(downloadedImages) {
        const hashMap = new Map();

        downloadedImages.forEach(img => {
            if (!hashMap.has(img.hash)) {
                hashMap.set(img.hash, []);
            }
            hashMap.get(img.hash).push(img);
        });

        const uniqueImages = {};
        let removedCount = 0;

        hashMap.forEach(duplicates => {
            // 按檔名排序，取第一個
            duplicates.sort((a, b) => a.filename.localeCompare(b.filename));
            const chosen = duplicates[0];
            uniqueImages[chosen.filename] = chosen.data;

            // 記錄去重數量
            if (duplicates.length > 1) {
                removedCount += duplicates.length - 1;
                console.log(`[去重] ${chosen.filename} 有 ${duplicates.length} 個重複檔案`);
            }
        });

        console.log(`[去重完成] 移除了 ${removedCount} 個重複檔案`);
        return uniqueImages;
    }

    // 分片壓縮函數
    async function createZipInChunks(files) {
        return new Promise(resolve => {
            setTimeout(() => {
                const zipData = fflate.zipSync(files, { level: 0 }); // 無壓縮，最快速度
                resolve(zipData);
            }, 0);
        });
    }

    // 主下載函數
    async function startDownload() {
        if (isDownloading) return;

        isDownloading = true;
        shouldStop = false;

        const startBtn = document.getElementById('start');
        const stopBtn = document.getElementById('stop');
        startBtn.disabled = true;
        stopBtn.disabled = false;

        try {
            const allImages = [];

            if (useAPIDownload) {
                updateStatus('🔍 掃描API圖片...');
                const apiImages = await getAPIImages();
                allImages.push(...apiImages);
                console.log(`[API] 找到 ${apiImages.length} 張圖片`);
            }

            if (useImgElements) {
                updateStatus('🔍 掃描頁面圖片...');
                const pageImages = await getPageImages();
                allImages.push(...pageImages);
                console.log(`[頁面] 找到 ${pageImages.length} 張圖片`);
            }

            if (!allImages.length) {
                updateStatus('❌ 未找到圖片');
                return;
            }

            // 基礎去重（相同baseKey優先保留原始）
            const imageMap = new Map();
            allImages.forEach(info => {
                const existing = imageMap.get(info.baseKey);
                if (!existing || (info.isOriginal && !existing.isOriginal)) {
                    imageMap.set(info.baseKey, info);
                }
            });

            const finalImages = Array.from(imageMap.values());
            updateStatus(`📦 開始下載${finalImages.length}張`, '準備CRC32去重');

            // 批量下載
            const downloadedImages = [];
            let success = 0;
            for (let i = 0; i < finalImages.length && !shouldStop; i += 8) {
                const batch = finalImages.slice(i, i + 8);
                const results = await Promise.all(
                    batch.map(info => downloadImage(info.url, info.filename))
                );

                // 使用 filter 替代 forEach
                const validResults = results.filter(result => result !== null);
                downloadedImages.push(...validResults);
                success += validResults.length;

                updateStatus(`⬇️ 已下載 ${success}/${finalImages.length}`, 'CRC32計算中');
            }

            if (!downloadedImages.length) {
                updateStatus('❌ 下載失敗');
                return;
            }

            // CRC32去重
            updateStatus('🔄 CRC32去重中...', `${downloadedImages.length}張圖片`);
            const uniqueFiles = deduplicateByCRC32(downloadedImages);
            const uniqueCount = Object.keys(uniqueFiles).length;
            const duplicateCount = downloadedImages.length - uniqueCount;

            // 分片壓縮
            updateStatus('📦 打包中...', `${uniqueCount}張 (去重${duplicateCount}張)`);
            const zipData = await createZipInChunks(uniqueFiles);

            const blob = new Blob([zipData], { type: 'application/zip' });
            const url = URL.createObjectURL(blob);

            const a = document.createElement('a');
            a.href = url;
            a.download = `wp_images_${Date.now()}.zip`;
            a.click();
            URL.revokeObjectURL(url);

            updateStatus('✅ 完成！', `下載${uniqueCount}張 (去重${duplicateCount}張)`);

        } catch (e) {
            updateStatus('❌ 錯誤', e.message);
            console.error('[WP-DL] 錯誤:', e);
        } finally {
            isDownloading = false;
            startBtn.disabled = false;
            stopBtn.disabled = true;
        }
    }

    // 初始化
    async function init() {
        const isWP = await isWordPressSite();
        if (!isWP) {
            console.log('[WP-DL] 非WordPress網站，腳本不會載入');
            return;
        }

        if (useAPIDownload && !await testAPI()) {
            console.log('[WP-DL] API不可用，僅使用頁面掃描模式');
        }
        createUI();
        console.log('[WP-DL] 已載入 - WordPress網站檢測通過');
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();