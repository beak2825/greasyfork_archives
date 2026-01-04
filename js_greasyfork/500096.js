// ==UserScript==
// @name         bing搜索去除CSDN
// @namespace    http://tampermonkey.net/
// @version      2024-07-09
// @description  bing搜索结果去除CSDN
// @author       bytebuf
// @match        *://*.bing.com/*
// @icon         https://th.bing.com/th/id/OIP.F714JC_Yqnw0GNto5jK4fgHaFj?rs=1&pid=ImgDetMain
// @grant        none
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/500096/bing%E6%90%9C%E7%B4%A2%E5%8E%BB%E9%99%A4CSDN.user.js
// @updateURL https://update.greasyfork.org/scripts/500096/bing%E6%90%9C%E7%B4%A2%E5%8E%BB%E9%99%A4CSDN.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    (function() {
        document.querySelectorAll('#b_results > li').forEach(item => {
            const link = item.querySelector('a');
            if(link !== null) {
                const isCSDN = link.getAttribute('href').indexOf('csdn.net') !== -1;
                if(isCSDN) {
                    item.remove();
                }
            }
        })
    })();
})();