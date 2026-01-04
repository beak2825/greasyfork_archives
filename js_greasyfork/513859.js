// ==UserScript==
// @name         18comic-ID提取器
// @namespace    http://tampermonkey.net/
// @version      0.8
// @description  从18comic网站提取特定链接和ID，提供手动和自动提取选项，支持自定义页面范围
// @author       xkatld
// @match        https://18comic-gura.me/*
// @match        https://18comic.vip/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/513859/18comic-ID%E6%8F%90%E5%8F%96%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/513859/18comic-ID%E6%8F%90%E5%8F%96%E5%99%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 创建控制面板
    var controlPanel = document.createElement('div');
    controlPanel.style.position = 'fixed';
    controlPanel.style.top = '10px';
    controlPanel.style.right = '10px';
    controlPanel.style.zIndex = '9999';
    controlPanel.style.backgroundColor = 'rgba(255, 255, 255, 0.8)'; // 设置透明度
    controlPanel.style.padding = '10px';
    controlPanel.style.border = '1px solid black';
    controlPanel.style.borderRadius = '8px'; // 设置圆角
    controlPanel.style.cursor = 'move'; // 添加移动光标样式
    document.body.appendChild(controlPanel);

    // 添加拖动功能
    let isDragging = false;
    let currentX;
    let currentY;
    let initialX;
    let initialY;
    let xOffset = 0;
    let yOffset = 0;

    controlPanel.addEventListener('mousedown', dragStart);
    document.addEventListener('mousemove', drag);
    document.addEventListener('mouseup', dragEnd);

    function dragStart(e) {
        initialX = e.clientX - xOffset;
        initialY = e.clientY - yOffset;

        if (e.target === controlPanel) {
            isDragging = true;
        }
    }

    function drag(e) {
        if (isDragging) {
            e.preventDefault();
            currentX = e.clientX - initialX;
            currentY = e.clientY - initialY;

            xOffset = currentX;
            yOffset = currentY;

            setTranslate(currentX, currentY, controlPanel);
        }
    }

    function dragEnd() {
        initialX = currentX;
        initialY = currentY;
        isDragging = false;
    }

    function setTranslate(xPos, yPos, el) {
        el.style.transform = `translate3d(${xPos}px, ${yPos}px, 0)`;
    }

    // 创建手动提取按钮
    var extractButton = createButton('提取链接');
    controlPanel.appendChild(extractButton);

    // 创建下载链接列表按钮
    var downloadLinksButton = createButton('下载链接列表');
    downloadLinksButton.style.display = 'none';
    controlPanel.appendChild(downloadLinksButton);

    // 创建下载ID列表按钮
    var downloadIDsButton = createButton('下载ID列表');
    downloadIDsButton.style.display = 'none';
    controlPanel.appendChild(downloadIDsButton);

    // 创建页面范围输入框
    var pageRangeInput = document.createElement('input');
    pageRangeInput.type = 'text';
    pageRangeInput.placeholder = '例如: 1-3,13-15,19-21';
    pageRangeInput.style.width = '200px';
    pageRangeInput.style.marginTop = '10px';
    controlPanel.appendChild(pageRangeInput);

    // 创建自动提取按钮
    var autoExtractButton = createButton('自动提取');
    controlPanel.appendChild(autoExtractButton);

    var extractedLinks = [];
    var extractedIDs = [];

    extractButton.addEventListener('click', function() {
        extractFromCurrentPage();
    });

    downloadLinksButton.addEventListener('click', function() {
        downloadList(extractedLinks, 'extracted_links.txt');
    });

    downloadIDsButton.addEventListener('click', function() {
        var idString = extractedIDs.join('-');
        downloadList([idString], 'extracted_ids.txt');
    });

    autoExtractButton.addEventListener('click', function() {
        var pageRanges = parsePageRanges(pageRangeInput.value);
        if (pageRanges.length > 0) {
            fetchAllPages(pageRanges);
        } else {
            alert('请输入有效的页面范围');
        }
    });

    function extractFromCurrentPage() {
        var uniqueLinks = new Set();

        // 提取第一个div中的链接（主要内容区）
        var firstDiv = document.querySelector('.row .col-xs-12.col-md-12.col-sm-12 .row');
        if (firstDiv) {
            var links = firstDiv.querySelectorAll('a[href^="/album/"]');
            links.forEach(function(link) {
                uniqueLinks.add(link.href);
            });
        }

        // 提取第二个div中的链接（侧边栏）
        var secondDiv = document.querySelector('.row .col-xs-12.col-md-9.col-sm-8 .row.m-0');
        if (secondDiv) {
            var links = secondDiv.querySelectorAll('a[href^="/album/"]');
            links.forEach(function(link) {
                uniqueLinks.add(link.href);
            });
        }

        extractedLinks = Array.from(uniqueLinks);
        extractedIDs = extractedLinks.map(link => {
            var match = link.match(/\/album\/(\d+)/);
            return match ? match[1] : null;
        }).filter(id => id !== null);

        showPopup(extractedLinks, extractedIDs);
        downloadLinksButton.style.display = 'block';
        downloadIDsButton.style.display = 'block';
    }

    function parsePageRanges(input) {
        var ranges = input.split(',').map(range => range.trim());
        var pages = [];
        for (var range of ranges) {
            var [start, end] = range.split('-').map(num => parseInt(num.trim()));
            if (isNaN(start)) continue;
            if (isNaN(end)) end = start;
            for (var i = start; i <= end; i++) {
                pages.push(i);
            }
        }
        return pages;
    }

    async function fetchAllPages(pageNumbers) {
        let allIDs = new Set();
        let baseUrl = window.location.href.split('&page=')[0];
        if (!baseUrl.includes('search/photos')) {
            alert('请在搜索结果页面使用自动提取功能');
            return;
        }

        for (let pageNum of pageNumbers) {
            let ids = await fetchPage(`${baseUrl}&page=${pageNum}`);
            ids.forEach(id => allIDs.add(id));
            await new Promise(resolve => setTimeout(resolve, 1000)); // 1秒延迟，避免请求过快
        }

        downloadIDs(Array.from(allIDs));
    }

    async function fetchPage(url) {
        let response = await fetch(url);
        let text = await response.text();
        let parser = new DOMParser();
        let doc = parser.parseFromString(text, 'text/html');

        let uniqueLinks = new Set();

        // 提取第一个div中的链接
        let firstDiv = doc.querySelector('.row .col-xs-12.col-md-12.col-sm-12 .row');
        if (firstDiv) {
            let links = firstDiv.querySelectorAll('a[href^="/album/"]');
            links.forEach(link => uniqueLinks.add(link.href));
        }

        // 提取第二个div中的链接
        let secondDiv = doc.querySelector('.row .col-xs-12.col-md-9.col-sm-8 .row.m-0');
        if (secondDiv) {
            let links = secondDiv.querySelectorAll('a[href^="/album/"]');
            links.forEach(link => uniqueLinks.add(link.href));
        }

        return Array.from(uniqueLinks).map(link => {
            let match = link.match(/\/album\/(\d+)/);
            return match ? match[1] : null;
        }).filter(id => id !== null);
    }

    function createButton(text) {
        var button = document.createElement('button');
        button.textContent = text;
        button.style.display = 'block';
        button.style.marginBottom = '5px';
        return button;
    }

    function showPopup(links, ids) {
        var popup = window.open('', '提取结果', 'width=600,height=400');
        popup.document.write('<h2>提取的链接：</h2>');
        popup.document.write('<ul>');
        links.forEach(function(link) {
            popup.document.write('<li><a href="' + link + '" target="_blank">' + link + '</a></li>');
        });
        popup.document.write('</ul>');
        popup.document.write('<h2>提取的ID：</h2>');
        popup.document.write('<p>' + ids.join('-') + '</p>');
        popup.document.write('<p>总共提取了 ' + links.length + ' 个唯一链接和ID</p>');
        popup.document.close();
    }

    function downloadList(list, filename) {
        var blob = new Blob([list.join('\n')], {type: 'text/plain'});
        var url = URL.createObjectURL(blob);
        var a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    function downloadIDs(ids) {
        let idString = ids.join('-');
        downloadList([idString], 'extracted_ids.txt');
    }
})();