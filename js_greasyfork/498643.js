// ==UserScript==
// @name         色花堂BT链接获取
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  从sehuatang.net提取所有链接并获取磁力链接
// @author       You
// @license      MIT
// @match        https://sehuatang.net/*
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/498643/%E8%89%B2%E8%8A%B1%E5%A0%82BT%E9%93%BE%E6%8E%A5%E8%8E%B7%E5%8F%96.user.js
// @updateURL https://update.greasyfork.org/scripts/498643/%E8%89%B2%E8%8A%B1%E5%A0%82BT%E9%93%BE%E6%8E%A5%E8%8E%B7%E5%8F%96.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 获取所有符合条件的链接
    const links = document.querySelectorAll('tbody[id] th.common a');

    // 创建一个数组来存储链接
    let linkArray = [];

    links.forEach(link => {
        // 将链接添加到数组中
        linkArray.push(link.href);
    });

    // 创建一个容器元素，用于显示磁力链接和复制按钮
    const container = document.createElement('div');
    container.style.position = 'fixed';
    container.style.top = '50px'; // 调整容器位置，避免遮挡页面内容
    container.style.left = '10px'; // 调整容器位置，左侧距离10px
    container.style.backgroundColor = '#ffffff'; // 纯白背景
    container.style.padding = '10px';
    container.style.zIndex = '1000';
    container.style.maxHeight = '60vh'; // 限制容器最大高度，避免超出屏幕
    container.style.overflow = 'hidden';
    container.style.border = '2px solid #007bff'; // 蓝色边框
    container.style.boxShadow = '0 2px 5px rgba(0, 0, 0, 0.1)'; // 添加阴影效果
    container.style.width = '300px'; // 设置固定宽度
    document.body.appendChild(container);

    // 创建一个头部区域，用于显示按钮和标题
    const header = document.createElement('div');
    header.style.backgroundColor = '#ffffff';
    header.style.zIndex = '1001';
    header.style.borderBottom = '1px solid #007bff'; // 底部边框
    header.style.paddingBottom = '10px'; // 底部内边距
    container.appendChild(header);

    // 在头部区域中显示链接标题
    const title = document.createElement('h2');
    title.textContent = '磁力链接';
    title.style.fontSize = '1.2em';
    title.style.marginBottom = '10px';
    header.appendChild(title);

    // 创建一个显示链接数量的元素
    const countElement = document.createElement('p');
    countElement.textContent = '链接数量: 0';
    countElement.style.fontSize = '1em';
    countElement.style.marginBottom = '10px';
    header.appendChild(countElement);

    // 创建一个一键复制按钮
    const copyAllButton = document.createElement('button');
    copyAllButton.textContent = '复制所有链接';
    copyAllButton.style.padding = '8px 16px';
    copyAllButton.style.backgroundColor = '#007bff';
    copyAllButton.style.color = '#fff';
    copyAllButton.style.border = 'none';
    copyAllButton.style.borderRadius = '4px';
    copyAllButton.style.cursor = 'pointer';
    copyAllButton.style.marginRight = '10px'; // 按钮之间的间距
    header.appendChild(copyAllButton);

    // 创建一个一键下载按钮
    const downloadAllButton = document.createElement('button');
    downloadAllButton.textContent = '下载所有链接';
    downloadAllButton.style.padding = '8px 16px';
    downloadAllButton.style.backgroundColor = '#28a745';
    downloadAllButton.style.color = '#fff';
    downloadAllButton.style.border = 'none';
    downloadAllButton.style.borderRadius = '4px';
    downloadAllButton.style.cursor = 'pointer';
    header.appendChild(downloadAllButton);

    // 创建一个内容区域，用于包含所有磁力链接，并允许滚动
    const linksContainer = document.createElement('div');
    linksContainer.style.maxHeight = '40vh'; // 设置最大高度，允许滚动
    linksContainer.style.overflowY = 'scroll';
    container.appendChild(linksContainer);

    let linkCount = 0; // 计数器，用于限制显示的链接数量

    // 遍历每个链接并抓取磁力链接
    linkArray.forEach(url => {
        GM_xmlhttpRequest({
            method: "GET",
            url: url,
            onload: function(response) {
                if (response.status === 200) {
                    // 创建一个虚拟的 DOM 解析响应文本
                    let parser = new DOMParser();
                    let doc = parser.parseFromString(response.responseText, 'text/html');
                    // 获取所有 class="blockcode" 的元素
                    let blockcodes = doc.querySelectorAll('.blockcode li');
                    blockcodes.forEach(li => {
                        let magnetLink = li.textContent.trim();
                        if (magnetLink.startsWith('magnet:?')) {
                            // 创建一个链接元素
                            const linkElement = document.createElement('a');
                            linkElement.href = magnetLink;
                            linkElement.textContent = magnetLink;
                            linkElement.style.display = 'block';
                            linkElement.style.marginBottom = '5px';
                            linkElement.style.textOverflow = 'ellipsis';
                            linkElement.style.overflow = 'hidden';
                            linkElement.style.whiteSpace = 'nowrap';
                            linkElement.style.color = '#333';
                            linkElement.style.textDecoration = 'none';
                            linkElement.title = magnetLink;
                            linksContainer.appendChild(linkElement);
                            linkCount++; // 计数器加1
                            countElement.textContent = `链接数量: ${linkCount}`; // 更新链接数量显示
                        }
                    });
                }
            }
        });
    });

    // 点击复制按钮时将所有链接复制到剪贴板
    copyAllButton.addEventListener('click', function() {
        const magnetLinks = linksContainer.querySelectorAll('a');
        let linksToCopy = '';
        magnetLinks.forEach(link => {
            linksToCopy += link.href + '\n';
        });

        // 复制链接到剪贴板
        navigator.clipboard.writeText(linksToCopy).then(function() {
            alert('所有磁力链接已复制到剪贴板！');
        }, function(err) {
            console.error('复制链接失败：', err);
        });
    });

    // 点击下载按钮时将所有链接保存到一个文本文件并下载
    downloadAllButton.addEventListener('click', function() {
        const magnetLinks = linksContainer.querySelectorAll('a');
        let linksToDownload = '';
        magnetLinks.forEach(link => {
            linksToDownload += link.href + '\n';
        });

        // 创建一个 Blob 对象并触发下载
        const blob = new Blob([linksToDownload], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'magnet_links.txt';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    });

})();
