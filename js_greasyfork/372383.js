// ==UserScript==
// @name         修改有道云笔记分享页面宽度
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  修改有道云笔记分享页面宽度，以便更加适合阅读。
// @author       High Jiang
// @match        *://note.youdao.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/372383/%E4%BF%AE%E6%94%B9%E6%9C%89%E9%81%93%E4%BA%91%E7%AC%94%E8%AE%B0%E5%88%86%E4%BA%AB%E9%A1%B5%E9%9D%A2%E5%AE%BD%E5%BA%A6.user.js
// @updateURL https://update.greasyfork.org/scripts/372383/%E4%BF%AE%E6%94%B9%E6%9C%89%E9%81%93%E4%BA%91%E7%AC%94%E8%AE%B0%E5%88%86%E4%BA%AB%E9%A1%B5%E9%9D%A2%E5%AE%BD%E5%BA%A6.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var style = document.createElement('style');
    style.innerHTML = '.file{ min-width: 256px; max-width: 1080px; width: 100%; padding-left: 0px; padding-right: 0px;} .file-name-container{ padding-left: 5%;}';
    document.head.appendChild(style);
})();