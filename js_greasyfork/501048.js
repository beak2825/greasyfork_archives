// ==UserScript==
// @name         FUXX V2EX || V2EX REDIRECT
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Modify all V2EX links to use global.v2ex.co
// @author       systemoutprintlnhelloworld 
// @match        *://*/*
// @grant        none
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/501048/FUXX%20V2EX%20%7C%7C%20V2EX%20REDIRECT.user.js
// @updateURL https://update.greasyfork.org/scripts/501048/FUXX%20V2EX%20%7C%7C%20V2EX%20REDIRECT.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const DEBUG_MODE = true;

    // 检查并修改链接
    function modifyLinks() {
        // 获取所有链接
        let links = document.querySelectorAll('a[href*="v2ex.com"]');

        // 遍历所有链接
        links.forEach(function(link) {
            // 如果链接包含 .v2ex.com 或 v2ex.com，则替换为 global.v2ex.co
            if (/v2ex\.com/.test(link.href)) {
                let newHref = link.href.replace(/:\/\/(.*\.)?v2ex\.com/, '://global.v2ex.co');
                if (DEBUG_MODE) {
                    console.log(`Modifying link: ${link.href} to ${newHref}`);
                }
                link.href = newHref;
            }
        });
    }

    // 初始修改
    modifyLinks();

    // 监听DOM变化，动态修改新增的链接
    let observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                modifyLinks();
            }
        });
    });

    observer.observe(document.body, { childList: true, subtree: true });
})();
