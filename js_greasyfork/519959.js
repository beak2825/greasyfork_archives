// ==UserScript==
// @name                Flickr Download Link Plus
// @name:zh-CN          Flickr下载助手增强版
// @name:zh-TW          Flickr下載助手增強版
// @version             4.2
// @description         Adds download links to photos with size selection and batch download support for Flickr
// @description:zh-CN   为Flickr添加图片下载按钮，支持选择不同尺寸和批量下载功能
// @description:zh-TW   為Flickr添加圖片下載按鈕，支持選擇不同尺寸和批量下載功能
// @author              powcai
// @namespace           cuzi
// @license             MIT
// @grant              none
// @icon               https://combo.staticflickr.com/pw/images/favicons/favicon-228.png
// @match              https://flickr.com/*
// @match              https://*.flickr.com/*
// @require            https://cdn.jsdelivr.net/npm/sweetalert2@11
// @run-at             document-end
// @noframes
// @connect           flickr.com
// @connect           staticflickr.com
// @downloadURL https://update.greasyfork.org/scripts/519959/Flickr%20Download%20Link%20Plus.user.js
// @updateURL https://update.greasyfork.org/scripts/519959/Flickr%20Download%20Link%20Plus.meta.js
// ==/UserScript==

/* jshint asi: true, esversion: 8 */

(function () {
    'use strict'

    // 下载图片函数
    const downloadImage = async (imageUrl) => {
        try {
            const response = await fetch('https:' + imageUrl);
            const blob = await response.blob();
            const blobUrl = URL.createObjectURL(blob);

            const link = document.createElement('a');
            link.href = blobUrl;
            link.download = imageUrl.split('/').pop();
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            setTimeout(() => URL.revokeObjectURL(blobUrl), 100);
        } catch (error) {
            console.error('Download error:', error);
        }
    };

    // 获取最大尺寸的图片URL
    const getLargestSize = (sizes) => {
        const availableSizes = Object.entries(sizes)
        .map(([key, data]) => ({
            src: data.src,
            pixels: data.width * data.height
        }))
        .sort((a, b) => b.pixels - a.pixels);

        return availableSizes[0]?.src;
    };

const createBatchButton = () => {
    const buttonId = 'batch-download-button';
    if (!document.getElementById(buttonId)) {
        const batchButton = document.createElement('div');
        batchButton.id = buttonId;
        batchButton.innerHTML = `
            <div style="
                position: fixed;
                right: 20px;
                top: 50%;
                transform: translateY(-50%);
                background: rgba(0,0,0,0.8);
                color: white;
                padding: 10px 15px;
                border-radius: 5px;
                cursor: pointer;
                z-index: 9999;
                display: flex;
                align-items: center;
                gap: 5px;
            ">
                <span>⬇️</span>
                <span>Download All (Max Size)</span>
            </div>
        `;
        document.body.appendChild(batchButton);
        return batchButton;
    }
    return document.getElementById(buttonId);
};

// 添加下载按钮的通用函数
function addDownloadButtons(containers, linkClass) {
    containers.forEach(container => {
        if (!container.querySelector('.download-button')) {
            const detailLink = container.querySelector(`.${linkClass}`).href;
            const photoName = container.querySelector(`.${linkClass}`).getAttribute('title') || '';

            const downloadButton = document.createElement('div');
            downloadButton.className = 'download-button';
            downloadButton.innerHTML = `
                <span style="
                    position: fixed;
                    right: 10px;
                    top: 10px;
                    background: rgba(0,0,0,0.5);
                    color: white;
                    padding: 5px;
                    border-radius: 3px;
                    cursor: pointer;
                    z-index: 9999
                ">⬇️</span>
                <div class="size-menu" style="
                    display: none;
                    position: fixed;
                    right: 45px;
                    top: 10px;
                    background: rgba(0,0,0,0.8);
                    border-radius: 3px;
                    padding: 5px;
                    z-index: 9999;
                    max-height: 300px;
                    overflow-y: auto;
                "></div>
            `;

            // 点击下载按钮显示尺寸菜单
            downloadButton.onclick = async function(e) {
                e.preventDefault();
                e.stopPropagation();
                const menu = downloadButton.querySelector('.size-menu');

                if (menu.style.display === 'none') {
                    try {
                        const response = await fetch(detailLink);
                        const text = await response.text();
                        const regex = /"sizes":\s*({[^}]*(?:}[^}]*)*?}),"descendingSizes"/;
                        const match = text.match(regex);

                        if (match) {
                            const sizes = JSON.parse(match[1]);
                            createSizeMenu(sizes, menu);
                            menu.style.display = 'block';
                        }
                    } catch (error) {
                        console.error('Error:', error);
                    }
                } else {
                    menu.style.display = 'none';
                }
            };

            // 点击其他地方关闭菜单
            document.addEventListener('click', (e) => {
                if (!downloadButton.contains(e.target)) {
                    downloadButton.querySelector('.size-menu').style.display = 'none';
                }
            });

            container.style.position = 'relative';
            container.appendChild(downloadButton);
        }
    });
}

// 创建尺寸选择菜单内容
const createSizeMenu = (sizes, menu) => {
    menu.innerHTML = '';

    const sizeNames = {
        'o': 'Original',
        '6k': '6K',
        '5k': '5K',
        '4k': '4K',
        '3k': '3K',
        'k': '2K',
        'h': 'Large 1600',
        'l': 'Large',
        'c': 'Medium 800',
        'z': 'Medium 640',
        'm': 'Medium'
    };

    const availableSizes = Object.entries(sizes)
        .map(([key, data]) => ({
            key,
            width: data.width,
            height: data.height,
            src: data.src,
            pixels: data.width * data.height
        }))
        .sort((a, b) => b.pixels - a.pixels);

    availableSizes.forEach(size => {
        const button = document.createElement('div');
        button.style.cssText = `
            color: white;
            padding: 5px 10px;
            cursor: pointer;
            white-space: nowrap;
            margin: 2px 0;
        `;

        const sizeName = sizeNames[size.key] || `Size ${size.key.toUpperCase()}`;
        button.textContent = `${sizeName} (${size.width}×${size.height})`;

        button.onmouseover = () => {
            button.style.backgroundColor = 'rgba(255,255,255,0.2)';
        };
        button.onmouseout = () => {
            button.style.backgroundColor = 'transparent';
        };

        button.onclick = (e) => {
            e.stopPropagation();
            downloadImage(size.src);
            menu.style.display = 'none';
        };

        menu.appendChild(button);
    });
};
    // 处理列表视图
    function page_photo_list() {
        const photoContainers = document.querySelectorAll('.photo-list-photo-container');
        if (photoContainers.length === 0) return;

        const batchButton = createBatchButton('right');

        // 批量下载处理
        batchButton.onclick = async () => {
            for (const container of photoContainers) {
                try {
                    const detailLink = container.querySelector('.overlay').href;
                    const response = await fetch(detailLink);
                    const text = await response.text();
                    const regex = /"sizes":\s*({[^}]*(?:}[^}]*)*?}),"descendingSizes"/;
                    const match = text.match(regex);

                    if (match) {
                        const sizes = JSON.parse(match[1]);
                        const largestSrc = getLargestSize(sizes);
                        if (largestSrc) {
                            await downloadImage(largestSrc);
                        }
                    }
                } catch (error) {
                    console.error('Error downloading image:', error);
                }
            }
        };

        addDownloadButtons(photoContainers, 'overlay');
    }

    // 处理卡片视图
    function card_photo_list() {
        const photoContainers = document.querySelectorAll('.photo-card-content');
        if (photoContainers.length === 0) return;

        const batchButton = createBatchButton('left');

        // 批量下载处理
        batchButton.onclick = async () => {
            for (const container of photoContainers) {
                try {
                    const detailLink = container.querySelector('.photo-link').href;
                    const response = await fetch(detailLink);
                    const text = await response.text();
                    const regex = /"sizes":\s*({[^}]*(?:}[^}]*)*?}),"descendingSizes"/;
                    const match = text.match(regex);

                    if (match) {
                        const sizes = JSON.parse(match[1]);
                        const largestSrc = getLargestSize(sizes);
                        if (largestSrc) {
                            await downloadImage(largestSrc);
                        }
                    }
                } catch (error) {
                    console.error('Error downloading image:', error);
                }
            }
        };

        addDownloadButtons(photoContainers, 'photo-link');
    }

    function main() {
        page_photo_list();
        card_photo_list();
    }

    const observer = new MutationObserver((mutations) => {
        main();
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    main();
})();
