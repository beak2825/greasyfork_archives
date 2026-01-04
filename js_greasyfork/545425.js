// ==UserScript==
// @name         Bilibili Article Image/GIF One-Click Downloader
// @name:zh-TW   Bilibili 專欄圖片/GIF 一鍵下載器
// @name:zh-CN   Bilibili 专栏图片/GIF 一键下载器
// @namespace    http://tampermonkey.net/
// @version      2.7
// @description  One-click download of images/GIFs from Bilibili article posts, excluding avatars and comment images. Displays progress and completion notifications, with filenames including the post ID! Supports both fast download and sequential download modes, using GM_download for packaging and downloading.And WebP to PNG conversion mode.
// @description:zh-TW 一鍵下載 Bilibili 專欄貼文圖片/GIF，排除頭像與留言圖，顯示進度與完成提示，檔名含貼文 ID！使用 GM_download 進行下載打包，快速下載、逐一下載兩種模式，以及Webp轉png模式。
// @description:zh-CN 一键下载 Bilibili 专栏贴文图片/GIF，排除头像与留言图，显示进度与完成提示，档名含贴文 ID！使用 GM_download 进行下载打包，快速下载、逐一下载两种模式，以及Webp转png模式。
// @author       Hzbrrbmin + ChatGPT + Gemini
// @match        https://www.bilibili.com/opus/*
// @grant        GM_download
// @grant        GM_xmlhttpRequest
// @connect      bilibili.com
// @connect      hdslb.com
// @connect      bfs.xyz
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/545425/Bilibili%20Article%20ImageGIF%20One-Click%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/545425/Bilibili%20Article%20ImageGIF%20One-Click%20Downloader.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // --- 全域變數設定 ---
    let fastMode = false; // 是否開啟快速下載模式（非同步下載）
    let pngMode = false;  // 是否開啟 WebP 轉 PNG 模式（預設關閉）

    // --- 初始化函數 ---
    function init() {
        // 檢查頁面是否已經存在按鈕，避免重複生成
        if (!document.querySelector('#bili-download-button')) {
            addDownloadControls();
        }
    }

    // 由於 Bilibili 是單頁應用 (SPA)，頁面跳轉不會重新整理，故使用定時器檢查按鈕是否存在
    setInterval(init, 2000);

    // --- 介面控制按鈕生成 ---
    function addDownloadControls() {
        if (document.querySelector('#bili-download-button')) return;

        // 1. 建立主下載按鈕
        const button = document.createElement('button');
        button.id = 'bili-download-button';
        updateButtonText(button);
        Object.assign(button.style, {
            position: 'fixed', bottom: '100px', left: '20px', zIndex: '9999',
            padding: '10px 15px', backgroundColor: '#00a1d6', color: 'white',
            border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '14px',
            boxShadow: '0 2px 5px rgba(0,0,0,0.3)', width: '160px'
        });

        // 2. 建立快速模式切換開關
        const fastToggle = document.createElement('button');
        fastToggle.textContent = `⚡ 快速模式：❌`;
        Object.assign(fastToggle.style, {
            position: 'fixed', bottom: '60px', left: '20px', zIndex: '9999',
            padding: '6px 12px', backgroundColor: '#666', color: 'white',
            border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '12px', width: '160px'
        });

        // 3. 建立 WebP 轉 PNG 切換開關
        const pngToggle = document.createElement('button');
        pngToggle.textContent = `🖼️ WebP轉PNG：❌`;
        Object.assign(pngToggle.style, {
            position: 'fixed', bottom: '20px', left: '20px', zIndex: '9999',
            padding: '6px 12px', backgroundColor: '#666', color: 'white',
            border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '12px', width: '160px'
        });

        // 快速模式開關點擊邏輯
        fastToggle.addEventListener('click', () => {
            fastMode = !fastMode;
            fastToggle.textContent = `⚡ 快速模式：${fastMode ? '✅' : '❌'}`;
            fastToggle.style.backgroundColor = fastMode ? '#fb7299' : '#666';
            updateButtonText(button);
        });

        // 轉檔模式開關點擊邏輯
        pngToggle.addEventListener('click', () => {
            pngMode = !pngMode;
            pngToggle.textContent = `🖼️ WebP轉PNG：${pngMode ? '✅' : '❌'}`;
            pngToggle.style.backgroundColor = pngMode ? '#fb7299' : '#666';
        });

        // 主按鈕點擊：禁用按鈕並開始執行收集圖片流程
        button.addEventListener('click', () => {
            button.disabled = true;
            button.style.backgroundColor = '#999';
            collectImageUrls(button);
        });

        document.body.appendChild(button);
        document.body.appendChild(fastToggle);
        document.body.appendChild(pngToggle);
    }

    // 更新主按鈕文字內容
    function updateButtonText(btn) {
        btn.textContent = fastMode ? '🚀 快速下載' : '📥 逐張下載';
    }

    // --- 圖片處理引擎 ---
    /**
     * 將指定的圖片 URL 透過 Canvas 轉換為 PNG Blob URL
     * @param {string} url 原始圖片網址
     * @returns {Promise<string>} PNG 的 Blob URL
     */
    async function convertToPng(url) {
        return new Promise((resolve, reject) => {
            // 使用 GM_xmlhttpRequest 獲取二進制數據以避開 CORS 跨域限制
            GM_xmlhttpRequest({
                method: "GET", url: url, responseType: "blob",
                onload: function(response) {
                    const blob = response.response;
                    const img = new Image();
                    img.src = URL.createObjectURL(blob);
                    img.onload = () => {
                        // 建立隱形畫布進行繪製
                        const canvas = document.createElement('canvas');
                        canvas.width = img.width; canvas.height = img.height;
                        const ctx = canvas.getContext('2d');
                        ctx.drawImage(img, 0, 0);
                        // 將畫布內容輸出為 PNG 格式的 Blob
                        canvas.toBlob((pngBlob) => {
                            const pngUrl = URL.createObjectURL(pngBlob);
                            resolve(pngUrl);
                        }, 'image/png');
                    };
                    img.onerror = () => reject('圖片加載失敗');
                },
                onerror: (err) => reject(err)
            });
        });
    }

    // --- 圖片收集邏輯 ---
    async function collectImageUrls(button) {
        // 定義 Bilibili 專欄可能出現內容的選擇器
        const contentContainer = document.querySelector('.opus-module-content, .article-content, .opus-detail');
        if (!contentContainer) {
            alert("⚠️ 找不到內容區塊！");
            button.disabled = false; return;
        }

        const images = Array.from(contentContainer.querySelectorAll('img'));
        const urls = [];

        images.forEach(img => {
            // 優先取得 data-src (懶加載原圖網址)，若無則取 src
            let url = img.getAttribute('data-src') || img.src;
            if (!url || url.startsWith('data:')) return;

            // 排除邏輯：頭像區塊內的圖片以及尺寸過小 (小於100px) 的圖標
            const isAvatar = img.closest('.avatar, .user-face, .bili-avatar, .opus-module-author__avatar');
            const isSmall = (img.naturalWidth > 0 && img.naturalWidth < 100);
            if (isAvatar || isSmall) return;

            // 格式化網址：補全協議頭並移除 B站圖片後綴 (如 @...webp)
            url = url.startsWith('//') ? 'https:' + url : url;
            url = url.replace(/@.*$/, '');
            if (!urls.includes(url)) urls.push(url); // 避免重複收集
        });

        if (urls.length === 0) {
            alert("⚠️ 未發現可下載圖片。");
            button.disabled = false; updateButtonText(button); return;
        }

        // 進入下載管理階段
        await downloadManager(urls, button);
    }

    // --- 下載流程管理 ---
    async function downloadManager(urls, button) {
        // 從網址提取專欄 ID 作為檔名前綴
        const postId = window.location.pathname.match(/\/opus\/(\d+)/)?.[1] || 'opus';
        let finishedCount = 0;

        // 定義單個圖片處理任務
        const runTask = async (url, index) => {
            try {
                // 利用正則表達式識別原始副檔名
                const extMatch = url.match(/\.(png|jpg|jpeg|gif|webp|bmp)/i);
                const originalExt = extMatch ? extMatch[1].toLowerCase() : 'jpg';

                let finalUrl = url;
                let finalExt = originalExt;

                // 核心判定：當開啟轉檔且原格式為 WebP 時才執行轉換
                if (pngMode && originalExt === 'webp') {
                    finalUrl = await convertToPng(url);
                    finalExt = 'png';
                }

                return new Promise((resolve) => {
                    GM_download({
                        url: finalUrl,
                        // 檔名格式：專欄ID_流水號.副檔名
                        name: `${postId}_${String(index + 1).padStart(3, '0')}.${finalExt}`,
                        onload: () => {
                            finishedCount++;
                            button.textContent = `⏳ 下載 (${finishedCount}/${urls.length})`;
                            // 若是 Blob URL (轉檔產生的)，下載完後釋放記憶體避免瀏覽器卡頓
                            if (pngMode && originalExt === 'webp') URL.revokeObjectURL(finalUrl);
                            resolve();
                        },
                        onerror: () => { resolve(); } // 下載出錯亦繼續執行下一個
                    });
                });
            } catch (e) {
                console.error('處理失敗:', e);
            }
        };

        // 根據模式執行：快速模式則使用 Promise.all 並發，逐張模式則使用 for 迴圈序列執行
        if (fastMode) {
            const tasks = urls.map((url, i) => runTask(url, i));
            await Promise.all(tasks);
        } else {
            for (let i = 0; i < urls.length; i++) {
                await runTask(urls[i], i);
            }
        }

        // --- 下載完成後的 UI 反饋 ---
        button.textContent = '✅ 下載完成';
        button.style.backgroundColor = '#4caf50';
        setTimeout(() => {
            button.disabled = false;
            button.style.backgroundColor = '#00a1d6';
            updateButtonText(button);
        }, 5000); // 5秒後恢復按鈕狀態
    }
})();