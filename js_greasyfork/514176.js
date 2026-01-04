// ==UserScript==
// @name         Line Sticker Downloader
// @name:en      Line Sticker Downloader
// @name:ja      Line ステッカーダウンローダー
// @name:zh-CN   Line 贴纸下载器
// @namespace    https://github.com/CheerChen
// @version      0.2.1
// @description  Download stickers from LINE store pages using GM_download. Auto-organizes files in folders based on sticker ID prefix and supports APNG for animated stickers.
// @description:en Download stickers from LINE store pages using GM_download. Auto-organizes files in folders based on sticker ID prefix and supports APNG for animated stickers.
// @description:ja GM_downloadを使用してLINEストアページからステッカーをダウンロードします。ステッカーIDプレフィックスに基づいてフォルダに自動整理し、アニメーションステッカー用のAPNGをサポートします。
// @description:zh-CN 使用 GM_download 从 LINE 商店页面下载贴纸。根据贴纸ID前缀自动组织文件夹，支持动画贴纸的APNG格式。
// @author       cheerchen
// @match        https://store.line.me/stickershop/product/*
// @grant        GM_download
// @icon         https://www.google.com/s2/favicons?domain=line.me
// @license      MIT
// @homepage     https://github.com/CheerChen/userscripts
// @supportURL   https://github.com/CheerChen/userscripts/issues
// @downloadURL https://update.greasyfork.org/scripts/514176/Line%20Sticker%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/514176/Line%20Sticker%20Downloader.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function extractAndDownload() {
        const stickerList = document.querySelectorAll('.FnStickerList li');
        stickerList.forEach((li) => {
            const dataPreview = li.getAttribute('data-preview');
            if (dataPreview) {
                const preview = JSON.parse(dataPreview);
                const url = preview.animationUrl ? preview.animationUrl : preview.staticUrl;
                const filename = preview.id + (preview.animationUrl ? '.png' : '.png');

                // Using GM_download to initiate the download
                GM_download({
                    url: url,
                    name: filename,
                    saveAs: false, // Change to true if you want to prompt for save location
                    onerror: function(error) {
                        console.error('Download failed:', error);
                    },
                    onload: function() {
                        console.log('Download completed:', filename);
                    }
                });
            }
        });
    }

    // Add a button to trigger download
    function addDownloadButton() {
        // 查找购买按钮的容器
        const buttonContainer = document.querySelector('.mdCMN38Item01Ul[data-widget="PurchaseButtons"]');
        
        if (buttonContainer && !document.getElementById('lineDownloadBtn')) {
            // 创建新的 li 元素
            const listItem = document.createElement('li');
            
            // 创建下载按钮
            const downloadBtn = document.createElement('button');
            downloadBtn.id = 'lineDownloadBtn';
            downloadBtn.className = 'MdBtn01P01'; // 使用与购买按钮相同的样式类
            downloadBtn.textContent = 'Download Stickers';
            downloadBtn.style.background = '#4CAF50';
            downloadBtn.style.color = 'white';
            downloadBtn.addEventListener('click', extractAndDownload);
            
            // 将按钮添加到 li 中，然后添加到容器中
            listItem.appendChild(downloadBtn);
            buttonContainer.appendChild(listItem);
        }
    }

    // 页面加载完成后添加按钮
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', addDownloadButton);
    } else {
        addDownloadButton();
    }

    // 监听DOM变化，以防按钮容器是动态加载的
    const observer = new MutationObserver(function(mutations) {
        addDownloadButton();
    });
    
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
})();