// ==UserScript==
// @name         臺灣閩南語字典網頁快速查詢
// @namespace    your-namespace
// @version      1.0
// @description  抓取你的選取範圍並搜尋字典
// @match        *://*/*
// @licence      CC BY-SA 4.0 88x31
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/471034/%E8%87%BA%E7%81%A3%E9%96%A9%E5%8D%97%E8%AA%9E%E5%AD%97%E5%85%B8%E7%B6%B2%E9%A0%81%E5%BF%AB%E9%80%9F%E6%9F%A5%E8%A9%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/471034/%E8%87%BA%E7%81%A3%E9%96%A9%E5%8D%97%E8%AA%9E%E5%AD%97%E5%85%B8%E7%B6%B2%E9%A0%81%E5%BF%AB%E9%80%9F%E6%9F%A5%E8%A9%A2.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var capturedText = '';
    var banner = document.createElement('div');
    banner.id = 'text-selection-banner';
    banner.style.position = 'fixed';
    banner.style.top = '0';
    banner.style.left = '0';
    banner.style.width = '100%';
    banner.style.backgroundColor = '#f2f2f2';
    banner.style.padding = '10px';
    banner.style.zIndex = '9999';
    banner.style.display = 'flex';
    banner.style.alignItems = 'center';

    var memoryButton = document.createElement('button');
    memoryButton.innerText = '記憶';
    memoryButton.style.marginRight = '10px';
    memoryButton.addEventListener('click', function() {
        capturedText = window.getSelection().toString().trim();
        console.log('Captured text:', capturedText);
    });

    var searchButton = document.createElement('button');
    searchButton.innerText = '搜尋';
    searchButton.style.marginRight = '10px';
    searchButton.addEventListener('click', function() {
        if (capturedText !== '') {
            var searchUrl = 'https://sutian.moe.edu.tw/zh-hant/tshiau/?lui=tai_su&tsha=' + encodeURIComponent(capturedText);
            window.open(searchUrl, '_blank');
        }
    });

    var clearButton = document.createElement('button');
    clearButton.innerText = '刪除';
    clearButton.addEventListener('click', function() {
        capturedText = '';
        console.log('Captured text cleared');
    });

    banner.appendChild(memoryButton);
    banner.appendChild(searchButton);
    banner.appendChild(clearButton);

    document.body.appendChild(banner);
})();