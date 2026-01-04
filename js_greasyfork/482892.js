// ==UserScript==
// @name         隱藏 Mojim 更多更詳盡歌詞
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  把 Mojim 的更多更詳盡歌詞及其所在行隱藏起來
// @author       abc0922001
// @match        https://mojim.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/482892/%E9%9A%B1%E8%97%8F%20Mojim%20%E6%9B%B4%E5%A4%9A%E6%9B%B4%E8%A9%B3%E7%9B%A1%E6%AD%8C%E8%A9%9E.user.js
// @updateURL https://update.greasyfork.org/scripts/482892/%E9%9A%B1%E8%97%8F%20Mojim%20%E6%9B%B4%E5%A4%9A%E6%9B%B4%E8%A9%B3%E7%9B%A1%E6%AD%8C%E8%A9%9E.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 選擇器直接定位到包含特定文本的<a>標籤
    let links = document.querySelectorAll("dd > a[href*='mojim.com']");

    links.forEach(link => {
        // 隱藏連結
        link.style.display = 'none';

        // 獲取與<a>標籤相關的dd元素
        let dd = link.parentNode;
        if (!dd) return;

        // 尋找並處理特定文本節點
        Array.from(dd.childNodes).forEach(node => {
            if (node.nodeType === Node.TEXT_NODE && node.textContent.includes('更多更詳盡歌詞 在')) {
                // 直接移除該文本節點
                dd.removeChild(node);

                // 尋找並隱藏隨後的<br>標籤
                let next = node.nextSibling;
                while (next && next.nodeName === 'BR') {
                    let following = next.nextSibling;
                    dd.removeChild(next);
                    next = following;
                }
            }
        });
    });
})();
