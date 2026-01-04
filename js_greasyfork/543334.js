// ==UserScript==
// @name         X 媒体批量下载器
// @namespace    https://github.com/Camellia895
// @version      2.9
// @description  采用事件驱动的悬浮下载按钮，解决了图标出现迟缓的问题。
// @author       Gemini & Camellia895
// @match        *://*.twitter.com/*
// @match        *://*.x.com/*
// @grant        GM_getValue
// @grant        GM_setValue
// @license      MIT
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/543334/X%20%E5%AA%92%E4%BD%93%E6%89%B9%E9%87%8F%E4%B8%8B%E8%BD%BD%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/543334/X%20%E5%AA%92%E4%BD%93%E6%89%B9%E9%87%8F%E4%B8%8B%E8%BD%BD%E5%99%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- 全局状态和设置 ---
    const BATCH_SIZE = 30;
    const DOWNLOAD_SVG_ICON = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" width="60%" height="60%"><path d="M12 15.5l-5-5h3V2h4v8.5h3l-5 5zM5 20h14v-2H5v2z"></path></svg>`;

    // 媒体页批量下载器状态
    let isCollecting = false;
    let downloadQueue = new Set();
    let mediaPageObserver = null;
    let batchDownloadBtn = null;
    let copyLinksBtn = null;
    let activeButton = null;

    // --- 工具函数: 节流 ---
    function throttle(func, limit) {
        let inThrottle;
        return function() {
            if (!inThrottle) { func.apply(this, arguments); inThrottle = true; setTimeout(() => inThrottle = false, limit); }
        };
    }

    // --- 核心下载与URL处理 ---
    async function download(url, filename) {
        try {
            const response = await fetch(url);
            if (!response.ok) {
                console.error(`下载失败: ${response.status}`, url);
                const fallbackUrl = url.replace('format=png', 'format=jpg');
                const fallbackResponse = await fetch(fallbackUrl);
                if (!fallbackResponse.ok) return;
                const blob = await fallbackResponse.blob();
                const blobUrl = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = blobUrl; a.download = filename.replace('.png', '.jpg');
                document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(blobUrl);
                return;
            }
            const blob = await response.blob();
            const blobUrl = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = blobUrl; a.download = filename;
            document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(blobUrl);
        } catch (error) { console.error('下载时发生网络错误:', error); }
    }

    function getOriginalUrl(thumbnailUrl) {
        const baseUrl = thumbnailUrl.split('?')[0];
        return `${baseUrl}?format=png&name=4096x4096`;
    }

    function getImageIdFromUrl(url) {
        return url.split('/').pop().split('?')[0];
    }

    // ===================================================================
    // 功能1: 单条推文下载
    // ===================================================================
    function addSingleTweetButton(tweet) {
        const grp = tweet.querySelector('div[role="group"]:not(:has(.download-images-btn))');
        if (!grp) return;
        const btn = document.createElement('button');
        btn.innerText = '下载图片';
        btn.className = 'download-images-btn';
        btn.style.cssText = 'margin-left:8px;cursor:pointer;background:#1da1f2;color:#fff;border:none;padding:4px 8px;border-radius:99px;font-size:12px;';
        btn.addEventListener('click', async (e) => {
            e.preventDefault(); e.stopPropagation();
            const currentTweet = e.target.closest('article[role="article"]');
            if (!currentTweet) return;
            const imgs = currentTweet.querySelectorAll('img[src*="pbs.twimg.com/media"]');
            const urls = Array.from(imgs, img => getOriginalUrl(img.src));
            if (!urls.length) { alert('在这条推文中没有找到可下载的图片。'); return; }
            for (const url of urls) {
                const fn = `${getImageIdFromUrl(url)}.png`;
                await download(url, fn);
                if (urls.length > 1) await new Promise(resolve => setTimeout(resolve, 500));
            }
        });
        grp.appendChild(btn);
    }
    
    // ===================================================================
    // 【全新实现】功能2: 媒体页悬浮下载 (事件驱动)
    // ===================================================================
    function addHoverDownloader(imageLink) {
        if (imageLink.dataset.hoverListenerAdded) return;
        imageLink.style.position = 'relative';

        imageLink.addEventListener('mouseenter', () => {
            if (imageLink.querySelector('.hover-download-overlay')) return;

            const overlay = document.createElement('div');
            overlay.className = 'hover-download-overlay';
            overlay.style.cssText = `
                position: absolute; top: 0; left: 0; width: 100%; height: 100%;
                background-color: rgba(0, 0, 0, 0.4);
                display: flex; align-items: center; justify-content: center;
                cursor: pointer;
            `;

            const iconContainer = document.createElement('div');
            iconContainer.style.cssText = `
                width: 50%; height: 50%; max-width: 70px; max-height: 70px;
                background-color: rgba(0, 0, 0, 0.6);
                border-radius: 50%; display: flex; align-items: center; justify-content: center;
                border: 2px solid white;
            `;
            iconContainer.innerHTML = DOWNLOAD_SVG_ICON;
            overlay.appendChild(iconContainer);

            overlay.onclick = async (e) => {
                e.preventDefault(); e.stopPropagation();
                
                const img = imageLink.querySelector('img[src*="pbs.twimg.com/media"]');
                if (!img) return;

                iconContainer.innerHTML = '...';
                const originalUrl = getOriginalUrl(img.src);
                const filename = `${getImageIdFromUrl(originalUrl)}.png`;
                await download(originalUrl, filename);
                overlay.remove(); // 下载后移除
            };
            
            imageLink.appendChild(overlay);
        });

        imageLink.addEventListener('mouseleave', () => {
            const overlay = imageLink.querySelector('.hover-download-overlay');
            if (overlay) overlay.remove();
        });

        imageLink.dataset.hoverListenerAdded = 'true';
    }


    // ===================================================================
    // 功能3: 媒体页批量操作
    // ===================================================================
    function updateActiveButtonText() {
        if (isCollecting && activeButton) {
            activeButton.textContent = `收集中(${downloadQueue.size})... 再点一次执行`;
        }
    }

    function scanForMediaImages() {
        const images = document.querySelectorAll('a[href*="/photo/"] img[src*="pbs.twimg.com/media"]');
        const initialSize = downloadQueue.size;
        images.forEach(img => downloadQueue.add(img.src));
        if (downloadQueue.size > initialSize) updateActiveButtonText();
    }
    const throttledScan = throttle(scanForMediaImages, 500);
    
    function resetButtons() {
        activeButton = null;
        if(batchDownloadBtn) {
            batchDownloadBtn.textContent = '批量下载';
            batchDownloadBtn.style.backgroundColor = '#1da1f2';
            batchDownloadBtn.style.opacity = '1';
            batchDownloadBtn.disabled = false;
        }
        if(copyLinksBtn) {
            copyLinksBtn.textContent = '复制链接';
            copyLinksBtn.style.backgroundColor = '#28a745';
            copyLinksBtn.style.opacity = '1';
            copyLinksBtn.disabled = false;
        }
    }

    function startCollecting(triggerButton) {
        isCollecting = true;
        activeButton = triggerButton;
        downloadQueue.clear();
        if (triggerButton === batchDownloadBtn && copyLinksBtn) {
            copyLinksBtn.disabled = true; copyLinksBtn.style.opacity = '0.5';
        }
        if (triggerButton === copyLinksBtn && batchDownloadBtn) {
            batchDownloadBtn.disabled = true; batchDownloadBtn.style.opacity = '0.5';
        }
        triggerButton.style.backgroundColor = '#ff69b4';
        updateActiveButtonText();
        throttledScan();
        const targetNode = document.querySelector('main[role="main"]');
        if (!targetNode) { console.error("找不到主要内容区域。"); return; }
        mediaPageObserver = new MutationObserver(throttledScan);
        mediaPageObserver.observe(targetNode, { childList: true, subtree: true });
    }

    async function stopCollectingAndDownload() {
        isCollecting = false;
        if (mediaPageObserver) mediaPageObserver.disconnect();
        const urlsToDownload = Array.from(downloadQueue);
        if (urlsToDownload.length === 0) { alert("无图片链接！"); resetButtons(); return; }
        for (let i = 0; i < urlsToDownload.length; i++) {
            if (i > 0 && i % BATCH_SIZE === 0) {
                if (!confirm(`已下载 ${i}/${urlsToDownload.length}。继续?`)) {
                    alert(`下载已暂停。`); resetButtons(); return;
                }
            }
            const url = urlsToDownload[i];
            const originalUrl = getOriginalUrl(url);
            const filename = `${getImageIdFromUrl(url)}.png`;
            if (batchDownloadBtn) {
                batchDownloadBtn.textContent = `下载中: ${i + 1}/${urlsToDownload.length}`;
                batchDownloadBtn.style.backgroundColor = '#f44336';
            }
            await download(originalUrl, filename);
            await new Promise(resolve => setTimeout(resolve, 1500));
        }
        alert(`下载完成！共 ${urlsToDownload.length} 张。`);
        resetButtons();
    }
    
    async function stopCollectingAndCopy() {
        isCollecting = false;
        if (mediaPageObserver) mediaPageObserver.disconnect();
        const urlsToCopy = Array.from(downloadQueue);
        if (urlsToCopy.length === 0) { alert("无图片链接！"); resetButtons(); return; }
        const originalUrls = urlsToCopy.map(getOriginalUrl);
        const textToCopy = originalUrls.join('\n');
        try {
            await navigator.clipboard.writeText(textToCopy);
            if(copyLinksBtn) {
                copyLinksBtn.textContent = `已复制 ${urlsToCopy.length} 条!`;
                copyLinksBtn.style.backgroundColor = '#28a745';
            }
            alert(`成功复制 ${urlsToCopy.length} 条链接！`);
            setTimeout(resetButtons, 2000);
        } catch (err) {
            console.error('复制失败: ', err); alert('复制失败！'); resetButtons();
        }
    }

    function addBatchActionButtons() {
        const userNameElement = document.querySelector('[data-testid="UserName"]');
        if (!userNameElement) return;
        const buttonContainer = userNameElement.parentElement;
        if (!buttonContainer || document.getElementById('batch-action-container')) return;
        const container = document.createElement('div');
        container.id = 'batch-action-container';
        container.style.cssText = 'display: flex; gap: 8px; margin-left: 12px;';
        batchDownloadBtn = document.createElement('button');
        batchDownloadBtn.textContent = '批量下载';
        batchDownloadBtn.style.cssText = 'padding: 6px 12px; background-color: #1da1f2; color: white; border: none; border-radius: 999px; cursor: pointer; font-weight: bold;';
        batchDownloadBtn.onclick = () => { isCollecting ? stopCollectingAndDownload() : startCollecting(batchDownloadBtn); };
        copyLinksBtn = document.createElement('button');
        copyLinksBtn.textContent = '复制链接';
        copyLinksBtn.style.cssText = 'padding: 6px 12px; background-color: #28a745; color: white; border: none; border-radius: 999px; cursor: pointer; font-weight: bold;';
        copyLinksBtn.onclick = () => { isCollecting ? stopCollectingAndCopy() : startCollecting(copyLinksBtn); };
        container.appendChild(batchDownloadBtn);
        container.appendChild(copyLinksBtn);
        buttonContainer.appendChild(container);
    }

    // --- 主函数：统一处理页面变化 ---
    function handlePageChanges() {
        document.querySelectorAll('article[role="article"]').forEach(addSingleTweetButton);
        if (window.location.href.includes('/media')) {
            document.querySelectorAll('a[href*="/photo/"]').forEach(addHoverDownloader);
            addBatchActionButtons();
        } else {
            if (isCollecting) {
                isCollecting = false;
                if(mediaPageObserver) mediaPageObserver.disconnect();
                downloadQueue.clear();
                activeButton = null;
            }
        }
    }

    const mainObserver = new MutationObserver(throttle(handlePageChanges, 500));
    mainObserver.observe(document.body, { childList: true, subtree: true });
    handlePageChanges();

})();