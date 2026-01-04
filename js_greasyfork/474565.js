// ==UserScript==
// @name         森空岛简易净化
// @namespace    http://tampermonkey.net/
// @version      0.1
// @license      MIT LICENSE
// @description  移除非森空岛客户端请求给的app引导
// @author       WuYilingwei
// @match        https://www.skland.com/h/detail*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=skland.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/474565/%E6%A3%AE%E7%A9%BA%E5%B2%9B%E7%AE%80%E6%98%93%E5%87%80%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/474565/%E6%A3%AE%E7%A9%BA%E5%B2%9B%E7%AE%80%E6%98%93%E5%87%80%E5%8C%96.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function removeElements() {
        // 移除 header
        let headers = document.querySelectorAll('header');
        for (let header of headers) {
            if (header.className.includes('ZSPuvXb3')) {
                header.remove();
            }
        }

        // 移除 footer
        let footers = document.querySelectorAll('footer');
        for (let footer of footers) {
            if (footer.className.includes('mobileFixedFooter')) {
                footer.remove();
            }
        }
    }

    // 立即执行一次
    removeElements();

    // 处理动态加载的元素
    new MutationObserver(removeElements).observe(document.body, { childList: true, subtree: true });
})();
