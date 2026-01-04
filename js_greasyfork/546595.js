// ==UserScript==
// @name         shopee-share
// @namespace    ticket-check_AndrewWang
// @version      0.0.1
// @description  縮短蝦皮有中文的網址
// @icon         https://www.google.com/s2/favicons?sz=64&domain=shopee.tw
// @author       AndrewWang
// @match        https://shopee.tw/*

// @run-at       document-start
// @license      GPL-3.0
// @downloadURL https://update.greasyfork.org/scripts/546595/shopee-share.user.js
// @updateURL https://update.greasyfork.org/scripts/546595/shopee-share.meta.js
// ==/UserScript==

(function() {
    'use strict';

    setTimeout(() => {
        var urlMatch = location.href.match(/.*\-i\.(\d+)\.(\d+)/);
        if (urlMatch) {
            var url = `https://shopee.tw/product/${urlMatch[1]}/${urlMatch[2]}`;
            if (url !== location.href) {
                location.replace(url);
            }
        }
    }, 1000);
})();
