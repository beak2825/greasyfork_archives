// ==UserScript==
// @name         下载天猫主图和详情图
// @namespace    http://your-namespace.com
// @version      1.3
// @description  在天猫详情页添加浮动按钮，一键下载天猫的主图和详情页。
// @author       Kailous
// @match        https://detail.tmall.com/*
// @match        https://*.detail.tmall.com/*
// @grant        GM_download
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/477237/%E4%B8%8B%E8%BD%BD%E5%A4%A9%E7%8C%AB%E4%B8%BB%E5%9B%BE%E5%92%8C%E8%AF%A6%E6%83%85%E5%9B%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/477237/%E4%B8%8B%E8%BD%BD%E5%A4%A9%E7%8C%AB%E4%B8%BB%E5%9B%BE%E5%92%8C%E8%AF%A6%E6%83%85%E5%9B%BE.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 创建下载按钮容器
    const downloadButtonContainer = document.createElement('div');
    downloadButtonContainer.className = 'downloadImgButton';
    document.body.appendChild(downloadButtonContainer);

    // 创建下载按钮
    function createDownloadButtons() {
        // 创建下载主图按钮
        const thumbnailButton = document.createElement('button');
        thumbnailButton.innerHTML = `
            <svg width="24" height="24" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M44 24C44 22.8954 43.1046 22 42 22C40.8954 22 40 22.8954 40 24H44ZM24 8C25.1046 8 26 7.10457 26 6C26 4.89543 25.1046 4 24 4V8ZM39 40H9V44H39V40ZM8 39V9H4V39H8ZM40 24V39H44V24H40ZM9 8H24V4H9V8ZM9 40C8.44772 40 8 39.5523 8 39H4C4 41.7614 6.23857 44 9 44V40ZM39 44C41.7614 44 44 41.7614 44 39H40C40 39.5523 39.5523 40 39 40V44ZM8 9C8 8.44772 8.44771 8 9 8V4C6.23858 4 4 6.23857 4 9H8Z" fill="#333"/><path d="M6 35L16.6931 25.198C17.4389 24.5143 18.5779 24.4953 19.3461 25.1538L32 36" stroke="#333" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><path d="M28 31L32.7735 26.2265C33.4772 25.5228 34.5914 25.4436 35.3877 26.0408L42 31" stroke="#333" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><path d="M32 13L37 18L42 13" stroke="#333" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><path d="M37 6L37 18" stroke="#333" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/></svg>
            下载主图`;
        thumbnailButton.addEventListener('click', () => {
            downloadThumbnails();
        });
        downloadButtonContainer.appendChild(thumbnailButton);

        // 创建下载详情页图片按钮
        const detailButton = document.createElement('button');
        detailButton.innerHTML = `
            <svg width="24" height="24" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M27 40H7C5.34315 40 4 38.6569 4 37V11C4 9.34315 5.34315 8 7 8H41C42.6569 8 44 9.34315 44 11V24" stroke="#333" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><path d="M34 36L39 41L44 36" stroke="#333" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><path d="M39 29L39 41" stroke="#333" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><path d="M4 11C4 9.34315 5.34315 8 7 8H41C42.6569 8 44 9.34315 44 11V20H4V11Z" fill="none" stroke="#333" stroke-width="4"/><circle r="2" transform="matrix(-1.31134e-07 -1 -1 1.31134e-07 10 14)" fill="#333"/><circle r="2" transform="matrix(-1.31134e-07 -1 -1 1.31134e-07 16 14)" fill="#333"/></svg>
            下载详情`;
        detailButton.addEventListener('click', () => {
            downloadImages();
        });
        downloadButtonContainer.appendChild(detailButton);
    }

    // 获取商品主标题
    function getMainTitle() {
        const mainTitleElement = document.querySelector('h1[class^="ItemHeader--mainTitle"]');
        if (mainTitleElement) {
            return mainTitleElement.innerText;
        }
        return '';
    }

    // 下载主图函数
function downloadThumbnails() {
    const mainTitle = getMainTitle();
    const thumbnailsContainer = document.querySelector('ul[class^="PicGallery--thumbnails"]'); // 选择主图缩略图容器
    if (!thumbnailsContainer) {
        console.log('Thumbnails container not found.');
        return;
    }

    const thumbnails = thumbnailsContainer.querySelectorAll('img'); // 选择缩略图图片

    let imageCount = 0;

    thumbnails.forEach((thumbnail, index) => {
        const imageUrl = thumbnail.getAttribute('src');

        // 过滤掉图片链接中的 "_110x10000Q75.jpg_.webp"
        const filteredImageUrl = imageUrl.replace(/_\w*\.jpg_\w*\.webp/g, '');

        // 只下载以 '//gw.alicdn.com' 开头的图片
        if (filteredImageUrl && filteredImageUrl.startsWith('//gw.alicdn.com')) {
            imageCount++;
            const fileExtension = imageUrl.split('.').pop();
            const paddedIndex = String(imageCount).padStart(2, '0');
            const fileName = `${mainTitle}_主图_${paddedIndex}.${fileExtension}`;

            // 使用 GM_download 下载图片
            GM_download({
                url: 'https:' + filteredImageUrl,
                name: fileName,
                saveAs: true
            });
        }
    });

    if (imageCount === 0) {
        console.log('No images found for download.');
    }
}


    // 下载详情页图片函数
    function downloadImages() {
        const mainTitle = getMainTitle();

        const descRoot = document.querySelector('div.desc-root'); // 选择详情页图片容器
        if (!descRoot) return;

        const images = descRoot.querySelectorAll('img[data-src], img[src]'); // 选择带有 data-src 或 src 属性的图片

        images.forEach((image, index) => {
            let imageUrl = image.getAttribute('data-src');
            if (!imageUrl) {
                imageUrl = image.getAttribute('src');
            }

            // 只下载以 'https://img.alicdn.com' 开头的图片
            if (imageUrl && imageUrl.startsWith('https://img.alicdn.com')) {
                const fileExtension = imageUrl.substring(imageUrl.lastIndexOf('.') + 1);
                const paddedIndex = String(index).padStart(2, '0');
                const fileName = `${mainTitle}_${paddedIndex}.${fileExtension}`;

                // 使用 GM_download 下载图片
                GM_download({
                    url: imageUrl,
                    name: fileName,
                    saveAs: true
                });
            }
        });
    }

    // 调用函数创建下载按钮
    createDownloadButtons();
})();

// 添加样式
const style = document.createElement('style');
style.textContent = `
.downloadImgButton {
    position: fixed;
    bottom: 50%;
    left: 0;
    z-index: 9999;
    padding: 26px 0;
    display: flex;
    flex-direction: column;
    border-radius: 0 18px 18px 0;
    overflow: hidden;
        -webkit-transform: translateY(50%);
    -moz-transform: translateY(50%);
    -ms-transform: translateY(50%);
    -o-transform: translateY(50%);
    transform: translateY(50%);
    z-index: 999;
    background-color: #F7F9FA;
    -webkit-box-shadow: -2px 0 30px 2px rgba(97, 105, 119, 0.18);
    -moz-box-shadow: -2px 0 30px 2px rgba(97, 105, 119, 0.18);
    box-shadow: -2px 0 30px 2px rgba(97, 105, 119, 0.18);
}

.downloadImgButton button {
    border: none;
    background: none;
    width: 60px;
    height: 60px;
    cursor: pointer;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
    font-size: 12px;
    color: #333;
    text-decoration: none;
    justify-content: center;
}
.downloadImgButton button:hover {
    background-color: #fff;
}
`;
document.head.appendChild(style);
