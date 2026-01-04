// ==UserScript==
// @name         車型維修資料網站直接打開pdf
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Replace <a> href with <li> data-href
// @description:zh-tw 車型維修資料網站直接打開pdf
// @match        https://library.yasn.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/492246/%E8%BB%8A%E5%9E%8B%E7%B6%AD%E4%BF%AE%E8%B3%87%E6%96%99%E7%B6%B2%E7%AB%99%E7%9B%B4%E6%8E%A5%E6%89%93%E9%96%8Bpdf.user.js
// @updateURL https://update.greasyfork.org/scripts/492246/%E8%BB%8A%E5%9E%8B%E7%B6%AD%E4%BF%AE%E8%B3%87%E6%96%99%E7%B6%B2%E7%AB%99%E7%9B%B4%E6%8E%A5%E6%89%93%E9%96%8Bpdf.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var listItems = document.querySelectorAll('#directory-listing li');

    listItems.forEach(function(item) {
        var link = item.querySelector('a');
        var dataHref = item.getAttribute('data-href');

        if (link && dataHref) {
            // 检查 dataHref 是否包含 pdf viewer 的 URL
            if (dataHref.includes('pdf/web/viewer.html?file=')) {
                // 将 pdf viewer 的 URL 转换为直接的 pdf URL
                dataHref = dataHref.replace('pdf/web/viewer.html?file=', '');
            }

            link.setAttribute('href', dataHref);
            link.removeAttribute('onclick'); // 移除 onclick 属性
        }
    });
})();