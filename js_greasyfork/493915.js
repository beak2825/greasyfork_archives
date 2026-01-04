// ==UserScript==
// @name         读秀个人网站部署
// @namespace    https://www.greasespot.net
// @version      1.1
// @description  读秀个人网站部署（包括前端后端一并打包）本程序可部署独立网站，可自用，可部署网站
// @author       ChatGPT
// @match        *://book.dglib.superlib.net/*
// @match        *://book.ucdrs.superlib.net/*
// @match        *://book.duxiu.com/*
// @match        *://img.duxiu.com/*
// @match        *://www.duxiu.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/493915/%E8%AF%BB%E7%A7%80%E4%B8%AA%E4%BA%BA%E7%BD%91%E7%AB%99%E9%83%A8%E7%BD%B2.user.js
// @updateURL https://update.greasyfork.org/scripts/493915/%E8%AF%BB%E7%A7%80%E4%B8%AA%E4%BA%BA%E7%BD%91%E7%AB%99%E9%83%A8%E7%BD%B2.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 当文档完全加载后执行
    document.addEventListener('DOMContentLoaded', function() {
        // 定位包含ISBN的元素
        const isbnElement = document.querySelector('div.isbn');
        const ssElement = document.querySelector('div.ss');

        // 如果元素存在，则提取内容
        let isbn = isbnElement ? isbnElement.textContent : 'ISBN信息未找到';
        let ss = ssElement ? ssElement.textContent : 'SS号信息未找到';

        // 在页面顶部创建一个显示区域
        const displayDiv = document.createElement('div');
        displayDiv.style.position = 'fixed';
        displayDiv.style.top = '0';
        displayDiv.style.left = '0';
        displayDiv.style.background = 'yellow';
        displayDiv.style.color = 'black';
        displayDiv.style.zIndex = '1000';
        displayDiv.style.padding = '10px';
        displayDiv.style.fontSize = '16px';
        displayDiv.textContent = `ISBN: ${isbn} | SS号: ${ss}`;

        // 将显示区域添加到页面
        document.body.appendChild(displayDiv);
    });
})();
