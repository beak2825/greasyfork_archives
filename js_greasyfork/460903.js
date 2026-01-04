// ==UserScript==
// @name         【飞书文档】真的兼容我的浏览器 | Feishu doc is really compatible with my browser
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  隐藏“浏览器不兼容”提示 | Hide "not compatible" banner
// @author       lideming
// @match        https://*.feishu.cn/docx/*
// @match        https://*.feishu.cn/drive/*
// @match        https://*.feishu.cn/wiki/*
// @icon         https://www.feishu.cn/favicon.ico
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/460903/%E3%80%90%E9%A3%9E%E4%B9%A6%E6%96%87%E6%A1%A3%E3%80%91%E7%9C%9F%E7%9A%84%E5%85%BC%E5%AE%B9%E6%88%91%E7%9A%84%E6%B5%8F%E8%A7%88%E5%99%A8%20%7C%20Feishu%20doc%20is%20really%20compatible%20with%20my%20browser.user.js
// @updateURL https://update.greasyfork.org/scripts/460903/%E3%80%90%E9%A3%9E%E4%B9%A6%E6%96%87%E6%A1%A3%E3%80%91%E7%9C%9F%E7%9A%84%E5%85%BC%E5%AE%B9%E6%88%91%E7%9A%84%E6%B5%8F%E8%A7%88%E5%99%A8%20%7C%20Feishu%20doc%20is%20really%20compatible%20with%20my%20browser.meta.js
// ==/UserScript==

(function() {
    'use strict';
    waitForElm('.not-compatible__announce').then(dom => {
        // dom.querySelector('.not-compatible__announce .ud__notice__close').click();
        dom.hidden = true;
    });

    function waitForElm(selector) {
        return new Promise(resolve => {
            if (document.querySelector(selector)) {
                return resolve(document.querySelector(selector));
            }

            let found = false;
            const timer = setTimeout(() => {
                observer.disconnect();
                console.error("waitForElm timeout");
                // not resolving/rejecting
            }, 5000);
            const observer = new MutationObserver(mutations => {
                for (const m of mutations) {
                    for (const node of m.addedNodes) {
                        if (node.matches(selector)) {
                            clearTimeout(timer);
                            found = true;
                            observer.disconnect();
                            return resolve(node);
                        }
                    }
                }
            });

            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
        });
    }
})();