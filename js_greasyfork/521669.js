// ==UserScript==
// @name         洛谷口苗语（其实是空文本链接）翻译
// @namespace    http://tampermonkey.net/
// @version      2024-12-24-2
// @description  none
// @author       928418
// @match        https://www.luogu.com.cn/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=luogu.com.cn
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/521669/%E6%B4%9B%E8%B0%B7%E5%8F%A3%E8%8B%97%E8%AF%AD%EF%BC%88%E5%85%B6%E5%AE%9E%E6%98%AF%E7%A9%BA%E6%96%87%E6%9C%AC%E9%93%BE%E6%8E%A5%EF%BC%89%E7%BF%BB%E8%AF%91.user.js
// @updateURL https://update.greasyfork.org/scripts/521669/%E6%B4%9B%E8%B0%B7%E5%8F%A3%E8%8B%97%E8%AF%AD%EF%BC%88%E5%85%B6%E5%AE%9E%E6%98%AF%E7%A9%BA%E6%96%87%E6%9C%AC%E9%93%BE%E6%8E%A5%EF%BC%89%E7%BF%BB%E8%AF%91.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    setInterval(function awa() {
        var feeds = document.getElementsByClassName("feed-comment");
        feeds.forEach((x) => {
            var links = x.getElementsByTagName("a");
            links.forEach((x) => {
                if (!x.innerHTML.trim())
                {
                    x.outerHTML = "<p>[口苗语翻译：“" + decodeURI((new URL(x.href)).pathname.slice(1)) + "”]</p>";
                }
            });
        });
    }, 100);
})();