// ==UserScript==
// @name         Facebook 相册一键下载
// @namespace    麦克
// @version      2.1.6
// @description  Bulk download Facebook album photos in full resolution with background support and auto-refresh prevention.
// @author       麦克
// @match        https://www.facebook.com/*/photos/*
// @match        https://www.facebook.com/photo.php?*
// @match        https://www.facebook.com/photo?*
// @match        https://www.facebook.com/photo/*
// @grant        GM_download
// @grant        GM_notification
// @license      GPL-3.0-or-later
// @downloadURL https://update.greasyfork.org/scripts/517262/Facebook%20%E7%9B%B8%E5%86%8C%E4%B8%80%E9%94%AE%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/517262/Facebook%20%E7%9B%B8%E5%86%8C%E4%B8%80%E9%94%AE%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==

let iter = 0;
let MAXITER = 10000;
let stopDownload = false;

// 防止页面自动刷新
window.addEventListener('beforeunload', function (e) {
    e.preventDefault();
    e.returnValue = '';
});

// 创建 Fetch 按钮
(function () {
    const observer = new MutationObserver(() => {
        if (document.body && !document.querySelector('#fetch-button')) {
            let fetchBtn = document.createElement("div");
            fetchBtn.id = "fetch-button";
            fetchBtn.textContent = "⇩ Fetch Photos";
            fetchBtn.style.cssText = 'position:fixed;top:10px;right:10px;z-index:9999;padding:8px;background-color:#4caf50;color:white;border-radius:5px;cursor:pointer;';
            fetchBtn.onclick = startBatchDownload;
            document.body.appendChild(fetchBtn);
        }
    });
    observer.observe(document.body, { childList: true, subtree: true });
})();

// 获取当前图片 URL
function getImageUrl() {
    const imgElement = document.querySelector('img[src*="scontent"]');
    return imgElement ? imgElement.src : null;
}

// 点击“下一张”按钮
function clickNextImage() {
    const nextBtn = document.querySelector('div[aria-label="下一张"], div[aria-label="Next"]');
    if (nextBtn) {
        nextBtn.click();
        return true;
    } else {
        const complexNextBtn = document.querySelector('div[role="button"][tabindex="0"] div[style*="background-image"]');
        if (complexNextBtn) {
            complexNextBtn.click();
            return true;
        }
    }
    return false;
}

// 下载图片的异步函数
async function downloadImage(imgUrl) {
    return new Promise((resolve) => {
        if (imgUrl) {
            const filename = imgUrl.split('?')[0].split('/').pop();
            console.log(`Downloading: ${filename}`);
            GM_download({
                url: imgUrl,
                name: filename,
                saveAs: false,
                onload: () => resolve(true),
                onerror: () => resolve(false),
            });
        } else {
            console.error('Failed to fetch image URL.');
            resolve(false);
        }
    });
}

// 批量下载的递归函数
async function batchDownload() {
    if (iter >= MAXITER || stopDownload) {
        console.log('Download process completed or stopped.');
        GM_notification({
            text: `Download completed: ${iter} photos`,
            title: 'Facebook Bulk Downloader',
            timeout: 5000
        });
        return;
    }

    const imgUrl = getImageUrl();
    if (imgUrl) {
        const success = await downloadImage(imgUrl);
        iter++;
        if (success && clickNextImage()) {
            console.log(`Moving to image ${iter + 1}`);
            setTimeout(batchDownload, 1000); // 等待 1 秒后继续下载
        } else {
            console.log('No more images found or failed to click next.');
            GM_notification({
                text: `Download completed: ${iter} photos`,
                title: 'Facebook Bulk Downloader',
                timeout: 5000
            });
        }
    } else {
        console.error('Retry fetching image...');
        setTimeout(batchDownload, 1000);
    }
}

// 开始批量下载
function startBatchDownload() {
    iter = 0;
    stopDownload = false;
    const input = parseInt(prompt("Enter the number of photos to download:", "10000"));
    MAXITER = isNaN(input) ? 10000 : input;
    console.log(`Starting download of ${MAXITER} photos...`);
    GM_notification({
        text: 'Download started...',
        title: 'Facebook Bulk Downloader',
        timeout: 3000
    });
    batchDownload();
}

// 用户按下 Escape 键可随时停止下载
document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
        stopDownload = true;
        console.log('Download stopped by user.');
        GM_notification({
            text: 'Download stopped by user.',
            title: 'Facebook Bulk Downloader',
            timeout: 3000
        });
    }
});

// 监听页面刷新和导航更改，防止下载中断
window.addEventListener('visibilitychange', function () {
    if (document.visibilityState === 'hidden' && !stopDownload) {
        console.log('Attempting to prevent tab from unloading...');
        window.stop(); // 阻止页面刷新或导航
    }
});
