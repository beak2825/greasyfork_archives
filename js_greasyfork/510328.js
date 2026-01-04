// ==UserScript==
// @name         Readwise Stylesheet with LXGW Fonts
// @name:zh-CN   Readwise 样式表与霞鹜文楷字体
// @name:zh-TW   Readwise 樣式表與霞鶩文楷字體
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Applies LXGW fonts to Readwise for improved Chinese text display
// @description:zh-CN  为 Readwise 应用霞鹜文楷字体以改善中文文本显示
// @description:zh-TW  為 Readwise 應用霞鶩文楷字體以改善中文文本顯示
// @match        https://read.readwise.io/*
// @license      MIT
// @locale       en
// @locale       zh-CN
// @locale       zh-TW
// @downloadURL https://update.greasyfork.org/scripts/510328/Readwise%20Stylesheet%20with%20LXGW%20Fonts.user.js
// @updateURL https://update.greasyfork.org/scripts/510328/Readwise%20Stylesheet%20with%20LXGW%20Fonts.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Add the external stylesheets
    var stylesheets = [
        'https://cdn.jsdelivr.net/npm/@callmebill/lxgw-wenkai-web@latest/style.css',
        'https://cdn.jsdelivr.net/npm/lxgw-wenkai-tc-webfont@1.0.0/style.css',
        'https://cdn.jsdelivr.net/npm/lxgw-wenkai-screen-webfont@1.1.0/style.css'
    ];

    stylesheets.forEach(function(href) {
        var link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = href;
        document.head.appendChild(link);
    });

    // Add custom styles
    var style = document.createElement('style');
    style.textContent = `
        #document-text-content p, #document-text-content li, #document-text-content span {
            font-family: 'Source Serif VF', 'LXGW ZhenKai', 'LXGW WenKai Screen', 'LXGW WenKai TC"', sans-serif;
            unicode-range: U+4E00-9FFF;
        }

        #document-header h1, #document-text-content h1, #document-text-content h2, #document-text-content h3, #document-text-content h4, #document-text-content h5, #document-text-content h6 {
            font-family: serif;
            unicode-range: U+4E00-9FFF;
        }
    `;
    document.head.appendChild(style);
})();