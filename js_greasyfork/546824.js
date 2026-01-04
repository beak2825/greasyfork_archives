// ==UserScript==
// @name         图片下载器 (修复版)
// @namespace    http://tampermonkey.net/
// @version      3.3
// @description  支持进度显示和选择序号的图片批量下载工具（修复 zip 损坏问题）
// @author       陈粥子
// @license      MIT
// @match        *://*/*
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @grant        GM_download
// @connect      *
// @run-at       document-end
// @require      https://cdnjs.cloudflare.com/ajax/libs/jszip/3.7.1/jszip.min.js
/*　　　　　　　　　　　　　　　　　　　　　　　　　
　　　　　　　　　　　　■■　　　　　　　　　■　　
　■■■■■■■■　　　■■　　　　■■■■■■■　
　　　　　　■■　　　　■■　　　　　　　　　■■　
　　　　　　■■　■　　■■　　■■　　　　　■■　
　　　　　　■■　■■　■■　　■　　　　　　■■　
　　　　　　■■　　■　■■　■■　　　　　　■■　
　　　　　　■■　　■　■■　■　　　　　　　■■　
　　■■■■■■　　■　■■　■　　　■■■■■■　
　　■■　　■■　　　　■■　　　　■■　　　■　　
　　■■　　　　　　　　■■　　■　■■　　　　　　
　　■■　　　　　■■■■■■■■■■■　　　　　　
　　■　　　　　　　　　■■　　　　■■　　　　　　
　■■　　　■■　　　■■■　　　　■■　　　■■　
　■■■■■■■■　　■■■■　　　■■■■■■■　
　　　　　　■■　　　■■■　■■　　　　　　■■　
　　　　　　■■　　■■■■　■■　　　　　　■■　
　　　　　　■■　　■　■■　　■■　　　　　■■　
　　　　　　■■　　■　■■　　■　　　　　　■　　
　　　　　　■■　■　　■■　　　　　　　　　■　　
　　　　　　■■■　　　■■　　　　　　　　■■　　
　　　　　　■■　　　　■■　　　　　　　　■■　　
　　　　　■■　　　　　■■　　　　　　　　■■　　
　　■■■■■　　　　　■■　　　　　■■■■　　　
　　　　■■　　　　　　　■　　　　　　■■　　　　
*/
// @downloadURL https://update.greasyfork.org/scripts/546824/%E5%9B%BE%E7%89%87%E4%B8%8B%E8%BD%BD%E5%99%A8%20%28%E4%BF%AE%E5%A4%8D%E7%89%88%29.user.js
// @updateURL https://update.greasyfork.org/scripts/546824/%E5%9B%BE%E7%89%87%E4%B8%8B%E8%BD%BD%E5%99%A8%20%28%E4%BF%AE%E5%A4%8D%E7%89%88%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 全局变量
    let imageUrls = new Set();
    let selectedItems = [];
    const isMobile = window.innerWidth <= 768;

    /* -------------------- UI 创建 & 样式（与之前相同） -------------------- */
    function createUI() {
        const downloadBtn = document.createElement('div');
        downloadBtn.id = 'img-dl-btn';
        downloadBtn.innerHTML = '↓';
        downloadBtn.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            z-index: 2147483647;
            width: ${isMobile ? '40px' : '50px'};
            height: ${isMobile ? '40px' : '50px'};
            background: #2196F3;
            color: white;
            font-size: ${isMobile ? '20px' : '24px'};
            font-weight: bold;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 50%;
            box-shadow: 0 2px 10px rgba(0,0,0,0.3);
            cursor: pointer;
            user-select: none;
        `;

        const modal = document.createElement('div');
        modal.id = 'img-dl-modal';
        modal.innerHTML = `
            <div class="modal-header">
                <span>图片预览</span>
                <span class="close-btn">×</span>
            </div>
            <div class="image-grid"></div>
            <div class="modal-footer">
                <button class="select-btn">全选</button>
                <span class="count">0张</span>
                <button class="download-btn" disabled>下载</button>
            </div>
        `;
        modal.style.cssText = `
            display: none;
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            z-index: 2147483646;
            width: ${isMobile ? '95vw' : '80vw'};
            height: ${isMobile ? '85vh' : '75vh'};
            background: white;
            border-radius: ${isMobile ? '8px' : '12px'};
            box-shadow: 0 4px 20px rgba(0,0,0,0.15);
            flex-direction: column;
            overflow: hidden;
        `;

        const progressModal = document.createElement('div');
        progressModal.id = 'progress-modal';
        progressModal.innerHTML = `
            <div class="progress-header">
                <span>下载进度</span>
            </div>
            <div class="progress-container">
                <div class="progress-bar">
                    <div class="progress-fill"></div>
                </div>
                <div class="progress-text">准备开始下载...</div>
                <div class="progress-stats">
                    <span class="success-count">成功: 0</span>
                    <span class="fail-count">失败: 0</span>
                </div>
            </div>
            <div class="progress-footer">
                <button class="cancel-btn">取消</button>
            </div>
        `;
        progressModal.style.cssText = `
            display: none;
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            z-index: 2147483646;
            width: ${isMobile ? '80vw' : '400px'};
            background: white;
            border-radius: ${isMobile ? '8px' : '12px'};
            box-shadow: 0 4px 20px rgba(0,0,0,0.15);
            flex-direction: column;
            overflow: hidden;
        `;

        const overlay = document.createElement('div');
        overlay.id = 'img-dl-overlay';
        overlay.style.cssText = `
            display: none;
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0,0,0,0.6);
            z-index: 2147483645;
        `;

        document.body.appendChild(downloadBtn);
        document.body.appendChild(modal);
        document.body.appendChild(progressModal);
        document.body.appendChild(overlay);
    }

    function addStyles() {
        const css = `
            #img-dl-modal { display:flex; flex-direction: column; }
            #img-dl-modal .modal-header { padding: 12px 16px; border-bottom: 1px solid #eee; display:flex; justify-content:space-between; align-items:center; font-size:${isMobile?'16px':'18px'}; background:#f8f8f8; flex-shrink:0; }
            #img-dl-modal .close-btn { font-size:24px; cursor:pointer; width:30px; height:30px; display:flex; align-items:center; justify-content:center; border-radius:50%; }
            #img-dl-modal .image-grid { flex:1; padding:10px; overflow-y:auto; display:grid; grid-template-columns:repeat(auto-fill, minmax(${isMobile?'100px':'120px'}, 1fr)); grid-auto-rows:min-content; gap:12px; background:#fff; }
            .image-item { position:relative; border:2px solid #eee; border-radius:8px; overflow:hidden; aspect-ratio:1/1; background:#f5f5f5; display:flex; align-items:center; justify-content:center; box-sizing:border-box; }
            .image-item.selected { border-color:#2196F3; box-shadow:0 0 0 2px rgba(33,150,243,0.3); }
            .image-item img { max-width:100%; max-height:100%; object-fit:contain; display:block; background:#fff; padding:4px; box-sizing:border-box; }
            #img-dl-modal .modal-footer { padding:12px 16px; border-top:1px solid #eee; display:flex; justify-content:space-between; align-items:center; background:#f8f8f8; flex-shrink:0; }
            #img-dl-modal button { padding:8px 16px; border:none; border-radius:4px; background:#2196F3; color:white; cursor:pointer; font-size:${isMobile?'14px':'16px'}; display:flex; align-items:center; justify-content:center; }
            #img-dl-modal .refresh-btn { background:#4CAF50; margin-left:8px; }
            #img-dl-modal .download-btn:disabled { background:#ccc; cursor:not-allowed; }
            #progress-modal { display:flex; flex-direction:column; }
            #progress-modal .progress-header { padding:16px; background:#2196F3; color:white; font-size:18px; text-align:center; }
            #progress-modal .progress-container { padding:20px; }
            #progress-modal .progress-bar { height:20px; background:#eee; border-radius:10px; overflow:hidden; margin-bottom:10px; }
            #progress-modal .progress-fill { height:100%; background:#4CAF50; width:0%; transition:width 0.3s; }
            #progress-modal .progress-text { text-align:center; margin-bottom:10px; font-size:14px; color:#555; }
            #progress-modal .progress-stats { display:flex; justify-content:space-around; font-size:14px; color:#555; }
            #progress-modal .progress-footer { padding:16px; display:flex; justify-content:center; border-top:1px solid #eee; }
            #progress-modal .cancel-btn { padding:8px 24px; background:#f44336; color:white; border:none; border-radius:4px; cursor:pointer; font-size:16px; }
            .image-index { position:absolute; top:0; right:0; background:rgba(33,150,243,0.85); color:white; font-size:14px; width:22px; height:22px; border-radius:0 0 0 12px; display:flex; align-items:center; justify-content:center; font-weight:bold; z-index:1; }
            @media (max-width:480px) {
                #img-dl-modal .image-grid { grid-template-columns:repeat(auto-fill, minmax(80px, 1fr)); gap:10px; padding:8px; }
                .image-item { border-radius:6px; border-width:1px; }
                #img-dl-modal .modal-footer { flex-wrap:wrap; gap:8px; }
                #img-dl-modal .count { order:3; width:100%; text-align:center; }
                #progress-modal { width:90vw; }
                .image-index { width:18px; height:18px; font-size:10px; border-radius:0 0 0 8px; }
                #img-dl-modal button { padding:6px 12px; font-size:13px; }
            }
        `;
        GM_addStyle(css);
    }

    /* -------------------- 获取页面图片（保持原逻辑） -------------------- */
    function getPageImages() {
        const images = new Set();

        document.querySelectorAll('img').forEach(img => {
            if (!img) return;
            const srcs = new Set([
                img.src,
                img.dataset.src,
                img.dataset.original,
                img.dataset.srcset,
                img.dataset.lazySrc,
                img.dataset.lazyload,
                img.dataset.thumb,
                img.getAttribute('data-src'),
                img.getAttribute('data-original'),
                img.getAttribute('data-srcset'),
                img.getAttribute('data-lazy'),
                img.getAttribute('data-lazy-src')
            ].filter(Boolean));

            srcs.forEach(src => {
                if (src.includes(',')) {
                    src.split(',').forEach(part => {
                        const url = part.trim().split(' ')[0];
                        if (url) images.add(cleanImageUrl(url));
                    });
                } else {
                    images.add(cleanImageUrl(src));
                }
            });
        });

        document.querySelectorAll('picture source').forEach(source => {
            if (!source) return;
            const srcset = source.srcset;
            if (!srcset) return;
            srcset.split(',').forEach(part => {
                const url = part.trim().split(' ')[0];
                if (url) images.add(cleanImageUrl(url));
            });
        });

        document.querySelectorAll('*').forEach(el => {
            try {
                const style = window.getComputedStyle(el);
                const bgImages = [];
                if (style.backgroundImage && style.backgroundImage !== 'none') bgImages.push(style.backgroundImage);
                if (style.background && style.background !== 'none') bgImages.push(style.background);
                bgImages.forEach(bg => {
                    const urls = bg.match(/url\(['"]?(.*?)['"]?\)/g);
                    if (urls) {
                        urls.forEach(u => {
                            const clean = u.replace(/^url\(['"]?/, '').replace(/['"]?\)$/, '');
                            images.add(cleanImageUrl(clean));
                        });
                    }
                    const imageSetMatches = bg.match(/image-set\((.*?)\)/g);
                    if (imageSetMatches) {
                        imageSetMatches.forEach(set => {
                            const items = set.match(/url\(['"]?(.*?)['"]?\)/g);
                            if (items) {
                                items.forEach(u => {
                                    const clean = u.replace(/^url\(['"]?/, '').replace(/['"]?\)$/, '');
                                    images.add(cleanImageUrl(clean));
                                });
                            }
                        });
                    }
                });
            } catch (e) {}
        });

        document.querySelectorAll('canvas').forEach(canvas => {
            try {
                const dataURL = canvas.toDataURL('image/png');
                images.add(dataURL);
            } catch (e) {}
        });

        document.querySelectorAll('svg').forEach(svg => {
            try {
                const serializer = new XMLSerializer();
                const svgStr = serializer.serializeToString(svg);
                const blob = new Blob([svgStr], { type: 'image/svg+xml' });
                const url = URL.createObjectURL(blob);
                images.add(url);
            } catch (e) {}
        });

        document.querySelectorAll('video').forEach(video => {
            if (video.poster) images.add(cleanImageUrl(video.poster));
        });

        return Array.from(images);
    }

    function cleanImageUrl(url) {
        if (!url) return '';
        const [baseUrl] = url.split(/[?#]/);
        if (baseUrl.startsWith('//')) return location.protocol + baseUrl;
        if (baseUrl.startsWith('/')) return location.origin + baseUrl;
        if (baseUrl.startsWith('./') || baseUrl.startsWith('../')) return new URL(baseUrl, location.href).href;
        return baseUrl;
    }

    /* -------------------- —— 关键：扩展名相关函数（替换/修复版） —— -------------------- */

    // 1. 仅从 URL 提取扩展名（回退使用）
    function getImageExtension(url) {
        try {
            let cleanUrl = (url || '').split('?')[0].split('#')[0];
            const match = cleanUrl.match(/\.([a-z0-9]{2,5})$/i);
            if (match) {
                const ext = match[1].toLowerCase();
                if (['jpg','jpeg','png','gif','webp','bmp','svg','ico'].includes(ext)) {
                    return ext === 'jpeg' ? 'jpg' : ext;
                }
            }
            return 'jpg';
        } catch (e) {
            return 'jpg';
        }
    }

    // 2. 根据远程响应判断扩展名（支持 GM_xmlhttpRequest 返回的 arraybuffer）
    async function getImageExtensionFromResponse(respObj, url) {
        try {
            // 先从响应头中找 Content-Type（respObj.headers 可能是字符串）
            const headersStr = respObj.responseHeaders || respObj.headers || '';
            const ctMatch = headersStr.match(/content-type:\s*([^\r\n;]+)/i);
            if (ctMatch) {
                const ct = ctMatch[1].toLowerCase();
                if (ct.includes('jpeg') || ct.includes('jpg')) return 'jpg';
                if (ct.includes('png')) return 'png';
                if (ct.includes('gif')) return 'gif';
                if (ct.includes('webp')) return 'webp';
                if (ct.includes('bmp')) return 'bmp';
                if (ct.includes('svg')) return 'svg';
                if (ct.includes('x-icon') || ct.includes('ico')) return 'ico';
            }

            // 再用前几个字节判断（respObj.arrayBuffer 是 ArrayBuffer）
            const arrayBuffer = respObj.arrayBuffer;
            if (arrayBuffer && arrayBuffer.byteLength > 0) {
                const bytes = new Uint8Array(arrayBuffer.slice(0, 12));
                // png
                if (bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4E && bytes[3] === 0x47) return 'png';
                // jpg
                if (bytes[0] === 0xFF && bytes[1] === 0xD8) return 'jpg';
                // gif
                if (bytes[0] === 0x47 && bytes[1] === 0x49 && bytes[2] === 0x46) return 'gif';
                // webp (RIFF....WEBP)
                if (bytes[0] === 0x52 && bytes[1] === 0x49 && bytes[2] === 0x46 && bytes[3] === 0x46) {
                    const sub = String.fromCharCode(bytes[8], bytes[9], bytes[10], bytes[11]);
                    if (sub === 'WEBP') return 'webp';
                }
                // bmp
                if (bytes[0] === 0x42 && bytes[1] === 0x4D) return 'bmp';
                // svg 文件通常是文本 "<svg"
                const textStart = new TextDecoder().decode(bytes);
                if (textStart.trim().startsWith('<svg')) return 'svg';
            }

            // 最后回退到 URL
            return getImageExtension(url);
        } catch (e) {
            return getImageExtension(url);
        }
    }

    // 3. 正确把图片内容加入 zip（使用 ArrayBuffer）
    async function addImageToZip(zip, respObj, filename) {
        // respObj.arrayBuffer 必须存在（fetchImage 会确保）
        const arrayBuffer = respObj.arrayBuffer;
        if (!arrayBuffer) throw new Error('没有可用的 ArrayBuffer 数据');
        zip.file(filename, arrayBuffer);
    }

    /* -------------------- 网络请求：使用 GM_xmlhttpRequest，返回 arraybuffer（改良） -------------------- */
    function fetchImage(url, timeout = 20000) {
        return new Promise((resolve, reject) => {
            try {
                GM_xmlhttpRequest({
                    method: 'GET',
                    url: url,
                    responseType: 'arraybuffer', // 直接拿到 ArrayBuffer，便于 zip 使用
                    headers: {
                        'Referer': location.href,
                        'Origin': location.origin
                    },
                    timeout: timeout,
                    onload: function(resp) {
                        if (resp.status >= 400) return reject(new Error(`HTTP ${resp.status}`));
                        resolve({
                            arrayBuffer: resp.response, // ArrayBuffer
                            responseHeaders: resp.responseHeaders || '',
                            finalUrl: resp.finalUrl || url,
                            url: url
                        });
                    },
                    onerror: function(err) { reject(new Error('网络错误')); },
                    ontimeout: function() { reject(new Error('请求超时')); },
                    onabort: function() { reject(new Error('请求中止')); }
                });
            } catch (e) {
                reject(e);
            }
        });
    }

    /* -------------------- 预览 / 选择 / 下载 主流程（使用上面修复的函数） -------------------- */

    function showPreview() {
        const modal = document.getElementById('img-dl-modal');
        const grid = modal.querySelector('.image-grid');
        const images = getPageImages();

        imageUrls = new Set(images);
        grid.innerHTML = '';
        selectedItems = [];

        images.forEach((url, index) => {
            const item = document.createElement('div');
            item.className = 'image-item';

            const img = document.createElement('img');
            img.src = url;
            img.alt = `Image ${index + 1}`;
            img.onerror = function() { item.style.display = 'none'; };

            const indexElement = document.createElement('div');
            indexElement.className = 'image-index';
            indexElement.style.display = 'none';
            indexElement.textContent = '0';

            item.appendChild(img);
            item.appendChild(indexElement);
            item.dataset.url = url;

            item.addEventListener('click', () => {
                toggleSelection(item);
                updateSelectionCount();
            });

            grid.appendChild(item);
        });

        modal.style.display = 'flex';
        document.getElementById('img-dl-overlay').style.display = 'block';
        updateSelectionCount();
    }

    function refreshPreview() {
        const modal = document.getElementById('img-dl-modal');
        const grid = modal.querySelector('.image-grid');
        selectedItems = [];
        document.querySelector('.select-btn').textContent = '全选';

        const images = getPageImages();
        imageUrls = new Set(images);
        grid.innerHTML = '';

        images.forEach((url, index) => {
            const item = document.createElement('div');
            item.className = 'image-item';

            const img = document.createElement('img');
            img.src = url;
            img.alt = `Image ${index + 1}`;
            img.onerror = function() { item.style.display = 'none'; };

            const indexElement = document.createElement('div');
            indexElement.className = 'image-index';
            indexElement.style.display = 'none';
            indexElement.textContent = '0';

            item.appendChild(img);
            item.appendChild(indexElement);
            item.dataset.url = url;

            item.addEventListener('click', () => {
                toggleSelection(item);
                updateSelectionCount();
            });

            grid.appendChild(item);
        });

        updateSelectionCount();
    }

    function toggleSelection(item) {
        const isSelected = item.classList.contains('selected');

        if (isSelected) {
            item.classList.remove('selected');
            item.querySelector('.image-index').style.display = 'none';
            const index = selectedItems.indexOf(item);
            if (index !== -1) selectedItems.splice(index, 1);
        } else {
            item.classList.add('selected');
            const indexTag = item.querySelector('.image-index');
            const selectionNumber = selectedItems.length + 1;
            indexTag.textContent = selectionNumber;
            indexTag.style.display = 'block';
            selectedItems.push(item);
        }

        updateSelectedIndexes();
    }

    function updateSelectedIndexes() {
        selectedItems.forEach((item, index) => {
            const indexTag = item.querySelector('.image-index');
            indexTag.textContent = index + 1;
            indexTag.style.display = 'block';
        });
    }

    function updateSelectionCount() {
        const modal = document.getElementById('img-dl-modal');
        modal.querySelector('.count').textContent = `${selectedItems.length}张`;
        modal.querySelector('.download-btn').disabled = selectedItems.length === 0;
    }

    function showProgress(total) {
        const progressModal = document.getElementById('progress-modal');
        progressModal.style.display = 'block';
        document.getElementById('img-dl-overlay').style.display = 'block';
        updateProgress(0, 0, 0, total, '准备开始下载...');
    }

    function updateProgress(current, success, fail, total, message) {
        const progressModal = document.getElementById('progress-modal');
        const progressFill = progressModal.querySelector('.progress-fill');
        const progressText = progressModal.querySelector('.progress-text');
        const successCount = progressModal.querySelector('.success-count');
        const failCount = progressModal.querySelector('.fail-count');

        const percent = total > 0 ? Math.round((current / total) * 100) : 0;
        progressFill.style.width = `${percent}%`;
        progressText.textContent = message || `正在下载 ${current}/${total}...`;
        successCount.textContent = `成功: ${success}`;
        failCount.textContent = `失败: ${fail}`;
    }

    function hideProgress() {
        const progressModal = document.getElementById('progress-modal');
        progressModal.style.display = 'none';
        document.getElementById('img-dl-overlay').style.display = 'none';
    }

    // 核心：批量下载并压缩（使用修复后的 fetch/getExt/addToZip）
    async function downloadSelected() {
        const modal = document.getElementById('img-dl-modal');

        if (selectedItems.length === 0) return;

        modal.querySelector('.download-btn').disabled = true;
        showProgress(selectedItems.length);

        const zip = new JSZip();
        let successCount = 0;
        let failCount = 0;
        let isCancelled = false;

        const cancelBtn = document.querySelector('#progress-modal .cancel-btn');
        const onCancel = () => { isCancelled = true; hideProgress(); modal.querySelector('.download-btn').disabled = false; };
        cancelBtn.addEventListener('click', onCancel, { once: true });

        for (let i = 0; i < selectedItems.length; i++) {
            if (isCancelled) {
                updateProgress(i, successCount, failCount, selectedItems.length, '下载已取消');
                setTimeout(() => hideProgress(), 1200);
                return;
            }

            const url = selectedItems[i].dataset.url;
            updateProgress(i, successCount, failCount, selectedItems.length, `正在请求: ${url.split('/').pop()}`);

            try {
                const respObj = await fetchImage(url);
                const ext = await getImageExtensionFromResponse(respObj, url);
                await addImageToZip(zip, respObj, `image_${i + 1}.${ext}`);
                successCount++;
                updateProgress(i + 1, successCount, failCount, selectedItems.length);
            } catch (err) {
                console.error('下载或压缩单张失败:', url, err);
                failCount++;
                updateProgress(i + 1, successCount, failCount, selectedItems.length, `下载失败: ${url.split('/').pop()}`);
            }

            // 小间隔避免阻塞
            await new Promise(r => setTimeout(r, 100));
        }

        if (successCount > 0 && !isCancelled) {
            updateProgress(selectedItems.length, successCount, failCount, selectedItems.length, '正在生成压缩包...');
            await new Promise(r => setTimeout(r, 300));
            try {
                const content = await zip.generateAsync({ type: 'blob' });
                const blobUrl = URL.createObjectURL(content);
                const a = document.createElement('a');
                a.href = blobUrl;
                a.download = `images_${Date.now()}.zip`;
                a.click();
                URL.revokeObjectURL(blobUrl);
                updateProgress(selectedItems.length, successCount, failCount, selectedItems.length, '下载完成！');
                setTimeout(() => hideProgress(), 1200);
            } catch (e) {
                console.error('生成 zip 失败', e);
                updateProgress(selectedItems.length, successCount, failCount, selectedItems.length, '生成压缩包失败');
                setTimeout(() => hideProgress(), 1200);
            }
        } else if (!isCancelled) {
            updateProgress(selectedItems.length, successCount, failCount, selectedItems.length, '没有成功下载任何图片');
            setTimeout(() => hideProgress(), 1200);
        }

        closeModal();
        modal.querySelector('.download-btn').disabled = false;
    }

    function closeModal() {
        document.getElementById('img-dl-modal').style.display = 'none';
        document.getElementById('img-dl-overlay').style.display = 'none';
    }

    function addRefreshButtonToFooter() {
        const footer = document.querySelector('.modal-footer');
        const refreshBtn = document.createElement('button');
        refreshBtn.className = 'refresh-btn';
        refreshBtn.innerHTML = '刷新';
        refreshBtn.style.cssText = `background:#4CAF50;margin-left:8px;`;
        footer.insertBefore(refreshBtn, footer.querySelector('.count'));
        refreshBtn.addEventListener('click', refreshPreview);
    }

    function init() {
        createUI();
        addStyles();
        addRefreshButtonToFooter();

        document.getElementById('img-dl-btn').addEventListener('click', showPreview);
        document.querySelector('#img-dl-modal .close-btn').addEventListener('click', closeModal);

        document.querySelector('#img-dl-modal .select-btn').addEventListener('click', function() {
            const items = document.querySelectorAll('.image-item');
            const allSelected = items.length > 0 && Array.from(items).every(item => item.classList.contains('selected'));

            selectedItems.forEach(item => { item.classList.remove('selected'); item.querySelector('.image-index').style.display = 'none'; });
            selectedItems = [];

            items.forEach(item => {
                item.classList.toggle('selected', !allSelected);
                if (!allSelected) selectedItems.push(item);
            });

            updateSelectedIndexes();
            updateSelectionCount();
            this.textContent = allSelected ? '全选' : '取消全选';
        });

        document.querySelector('#img-dl-modal .download-btn').addEventListener('click', downloadSelected);
        document.getElementById('img-dl-overlay').addEventListener('click', closeModal);

        imageUrls = new Set(getPageImages());
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();