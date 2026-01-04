// ==UserScript==
// @name         arxiv跳转readpaper 以及下载重命名
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  1.go to readpaper.com; 2.rename downloaded paper
// @author       Wu
// @match        https://arxiv.org/abs/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/495285/arxiv%E8%B7%B3%E8%BD%ACreadpaper%20%E4%BB%A5%E5%8F%8A%E4%B8%8B%E8%BD%BD%E9%87%8D%E5%91%BD%E5%90%8D.user.js
// @updateURL https://update.greasyfork.org/scripts/495285/arxiv%E8%B7%B3%E8%BD%ACreadpaper%20%E4%BB%A5%E5%8F%8A%E4%B8%8B%E8%BD%BD%E9%87%8D%E5%91%BD%E5%90%8D.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 获取论文标题
    const titleElement = document.querySelector(".title.mathjax");
    if (!titleElement) {
        console.error("无法找到论文标题");
        return;
    }
    const title = titleElement.innerText;

    // 构造链接
    const encodedTitle = encodeURIComponent(title);
    const readPaperURL = `https://readpaper.com/search/${encodedTitle}`;
    const dblpURL = `https://dblp.uni-trier.de/search?q=${encodedTitle}`;

    // 获取PDF链接
    const pdfLinkElement = document.querySelector("#abs-outer .extra-services .full-text ul li a");
    if (!pdfLinkElement) {
        console.error("无法找到PDF链接");
        return;
    }
    let pdfURL = pdfLinkElement.href;
    if (!pdfURL.endsWith(".pdf")) {
        pdfURL += '.pdf';
    }

    // 生成文件名
    const fileName = title.replace(/:/g, '--') + '.pdf';

    // 创建新列表项
    const createListItem = (href, text, download) => {
        const li = document.createElement("li");
        const a = document.createElement("a");
        a.href = href;
        a.innerText = text;
        if (download) {
            a.download = download;
        }
        li.appendChild(a);
        return li;
    };

    const readPaperItem = createListItem(readPaperURL, "ReadPaper");
    const saveRenameItem = createListItem(pdfURL, "Save&Rename", fileName);
    const dblpItem = createListItem(dblpURL, "dblp");

    // 插入新列表项
    const fullTextList = document.querySelector(".full-text ul");
    if (!fullTextList) {
        console.error("无法找到插入位置");
        return;
    }
    fullTextList.insertBefore(dblpItem, fullTextList.firstChild);
    fullTextList.insertBefore(saveRenameItem, fullTextList.firstChild);
    fullTextList.insertBefore(readPaperItem, fullTextList.firstChild);

})();
