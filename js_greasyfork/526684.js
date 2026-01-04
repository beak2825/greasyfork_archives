// ==UserScript==
// @name         huggingface下载地址提取
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Extract all download links on Hugging Face page and support hf-mirror.com. Show the number of extracted files when closing the panel and only display 5 URLs in the DIV.
// @author       3588
// @match        https://huggingface.co/*
// @match        https://hf-mirror.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/526684/huggingface%E4%B8%8B%E8%BD%BD%E5%9C%B0%E5%9D%80%E6%8F%90%E5%8F%96.user.js
// @updateURL https://update.greasyfork.org/scripts/526684/huggingface%E4%B8%8B%E8%BD%BD%E5%9C%B0%E5%9D%80%E6%8F%90%E5%8F%96.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 创建提取按钮
    const extractButton = document.createElement('button');
    extractButton.style.position = 'fixed';
    extractButton.style.top = '10px';
    extractButton.style.left = '10px';
    extractButton.style.width = '50px';
    extractButton.style.height = '50px';
    extractButton.textContent = '提取';
    extractButton.style.backgroundColor = 'yellow';
    document.body.appendChild(extractButton);

    // 创建弹出 DIV
    const popupDiv = document.createElement('div');
    popupDiv.style.position = 'fixed';
    popupDiv.style.top = '50%';
    popupDiv.style.left = '50%';
    popupDiv.style.transform = 'translate(-50%, -50%)';
    popupDiv.style.backgroundColor = 'white';
    popupDiv.style.border = '1px solid black';
    popupDiv.style.padding = '10px';
    popupDiv.style.zIndex = '9999';
    popupDiv.style.display = 'none';
    popupDiv.style.minWidth = '300px';

    // 创建关闭按钮
    const closeButton = document.createElement('button');
    closeButton.textContent = '关闭';
    closeButton.style.marginRight = '10px';
    closeButton.style.backgroundColor = '#f44336';
    closeButton.style.color = 'white';
    closeButton.addEventListener('click', () => {
        const links = getDownloadLinks();
        alert(`共提取到 ${links.length} 个文件的下载链接`);
        popupDiv.style.display = 'none';
    });
    popupDiv.appendChild(closeButton);

    // 创建复制第一个链接按钮
    const copyFirstLinkButton = document.createElement('button');
    copyFirstLinkButton.textContent = '复制第一个链接';
    copyFirstLinkButton.style.marginRight = '10px';
    copyFirstLinkButton.style.backgroundColor = '#2196F3';
    copyFirstLinkButton.style.color = 'white';
    copyFirstLinkButton.addEventListener('click', () => {
        const links = getDownloadLinks();
        if (links.length > 0) {
            navigator.clipboard.writeText(links[0]).then(() => {
                alert('第一个链接已复制到剪贴板');
            }).catch((err) => {
                console.error('无法复制链接: ', err);
            });
        } else {
            alert('未找到下载链接');
        }
    });
    popupDiv.appendChild(copyFirstLinkButton);

    // 创建复制全部链接按钮
    const copyAllLinksButton = document.createElement('button');
    copyAllLinksButton.textContent = '复制全部链接';
    copyAllLinksButton.style.backgroundColor = '#4CAF50';
    copyAllLinksButton.style.color = 'white';
    copyAllLinksButton.addEventListener('click', () => {
        const links = getDownloadLinks();
        if (links.length > 0) {
            const allLinksText = links.join('\n');
            navigator.clipboard.writeText(allLinksText).then(() => {
                alert('全部链接已复制到剪贴板');
            }).catch((err) => {
                console.error('无法复制链接: ', err);
            });
        } else {
            alert('未找到下载链接');
        }
    });
    popupDiv.appendChild(copyAllLinksButton);

    // 创建用于显示链接的区域
    const linkList = document.createElement('div');
    linkList.style.marginTop = '10px';
    popupDiv.appendChild(linkList);

    document.body.appendChild(popupDiv);

    // 提取下载链接的函数
    function getDownloadLinks() {
        const links = [];
        const elements = document.querySelectorAll('a[download][href]');
        console.log('找到的符合条件的元素数量:', elements.length);

        const currentHost = window.location.host;
        let baseUrl;
        if (currentHost.includes('huggingface.co')) {
            baseUrl = 'https://huggingface.co';
        } else if (currentHost.includes('hf-mirror.com')) {
            baseUrl = 'https://hf-mirror.com';
        }

        elements.forEach((element) => {
            const href = element.getAttribute('href');
            if (href) {
                const fullLink = baseUrl + href;
                links.push(fullLink);
                console.log('提取到的链接:', fullLink);
            }
        });
        return links;
    }

    // 点击提取按钮时显示弹出 DIV 并更新链接列表
    extractButton.addEventListener('click', () => {
        const links = getDownloadLinks();
        linkList.innerHTML = '';
        if (links.length > 0) {
            const displayCount = Math.min(links.length, 5);
            for (let i = 0; i < displayCount; i++) {
                const linkElement = document.createElement('p');
                linkElement.textContent = links[i];
                linkList.appendChild(linkElement);
            }
        } else {
            const noLinksElement = document.createElement('p');
            noLinksElement.textContent = '未找到下载链接';
            linkList.appendChild(noLinksElement);
        }
        popupDiv.style.display = 'block';
    });
})();