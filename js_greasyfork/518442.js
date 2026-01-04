// ==UserScript==
// @name         即梦无水印下载
// @namespace    http://tampermonkey.net/
// @version      2024-11-15
// @description  在即梦平台上添加无水印视频下载按钮，方便快速下载AI生成的视频。
// @author       您的名字
// @match        https://*.jianying.com/*
// @match        https://jimeng.jianying.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=jianying.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/518442/%E5%8D%B3%E6%A2%A6%E6%97%A0%E6%B0%B4%E5%8D%B0%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/518442/%E5%8D%B3%E6%A2%A6%E6%97%A0%E6%B0%B4%E5%8D%B0%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==

(function() {
'use strict';

// 添加下载按钮的样式
const style = document.createElement('style');
style.textContent = `
.custom-download-btn-wrapper {
position: absolute;
top: 15px;
left: 15px;
z-index: 999999;
pointer-events: auto;
}
.custom-download-btn {
background: rgba(0, 0, 0, 0.75);
color: white;
border: none;
padding: 8px 16px;
border-radius: 6px;
cursor: pointer;
font-size: 14px;
font-weight: 500;
pointer-events: auto;
display: flex;
align-items: center;
gap: 6px;
transition: all 0.2s ease;
backdrop-filter: blur(5px);
box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}
.custom-download-btn:hover {
background: rgba(0, 0, 0, 0.85);
transform: translateY(-1px);
box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}
.custom-download-btn:active {
transform: translateY(0);
}
.custom-download-btn.downloading {
background: rgba(0, 0, 0, 0.6);
cursor: not-allowed;
}
.custom-download-btn svg {
width: 16px;
height: 16px;
fill: currentColor;
}
@keyframes spin {
to { transform: rotate(360deg); }
}
.loading-spinner {
animation: spin 1s linear infinite;
}
`;
document.head.appendChild(style);

// 下载图标 SVG
const downloadIcon = `
<svg viewBox="0 0 24 24" width="16" height="16">
<path d="M12 16l-5-5h3V4h4v7h3l-5 5zm-5 4h10v-2H7v2z"/>
</svg>
`;

// 加载中图标 SVG
const loadingIcon = `
<svg class="loading-spinner" viewBox="0 0 24 24" width="16" height="16">
<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z"/>
<path d="M12 2v4c4.42 0 8 3.58 8 8h4c0-6.62-5.38-12-12-12z" fill="white"/>
</svg>
`;

function addDownloadButton() {
const videoContainers = document.querySelectorAll('.videoWrapper-yY21WT');

videoContainers.forEach(container => {
if (container.querySelector('.custom-download-btn-wrapper')) return;

const video = container.querySelector('video');
if (!video) return;

const wrapper = document.createElement('div');
wrapper.className = 'custom-download-btn-wrapper';

const downloadBtn = document.createElement('button');
downloadBtn.className = 'custom-download-btn';
downloadBtn.innerHTML = `${downloadIcon}<span>无水印下载</span>`;

downloadBtn.onclick = async function(e) {
e.preventDefault();
e.stopPropagation();
e.stopImmediatePropagation();

const videoUrl = video.src;
if (!videoUrl) {
alert('无法获取视频地址');
return;
}

try {
downloadBtn.classList.add('downloading');
downloadBtn.innerHTML = `${loadingIcon}<span>下载中...</span>`;
downloadBtn.disabled = true;

const response = await fetch(videoUrl);
const blob = await response.blob();

const url = window.URL.createObjectURL(blob);
const a = document.createElement('a');
a.href = url;
a.download = `video_${Date.now()}.mp4`;
document.body.appendChild(a);
a.click();

window.URL.revokeObjectURL(url);
document.body.removeChild(a);
} catch (error) {
console.error('下载失败:', error);
alert('下载失败，请重试');
} finally {
downloadBtn.classList.remove('downloading');
downloadBtn.innerHTML = `${downloadIcon}<span>无水印下载</span>`;
downloadBtn.disabled = false;
}

return false;
};

wrapper.appendChild(downloadBtn);

const controlsContainer = container.querySelector('.videoCustomControlSlotWrapper-uFXNzG') || container;
controlsContainer.appendChild(wrapper);
});
}

function checkAndAddButton() {
addDownloadButton();
setTimeout(checkAndAddButton, 2000);
}

setTimeout(() => {
checkAndAddButton();
}, 1500);

const observer = new MutationObserver(() => {
addDownloadButton();
});

observer.observe(document.body, {
childList: true,
subtree: true
});
})();