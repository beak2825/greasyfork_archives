// ==UserScript==
// @name         删除 Bilibili 搜索栏提示词
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  删除 Bilibili 搜索栏提示词，保护隐私，减少浏览干扰
// @author       Ganlv
// @match        https://www.bilibili.com/*
// @match        https://t.bilibili.com/*
// @match        https://live.bilibili.com/*
// @match        https://link.bilibili.com/*
// @match        https://space.bilibili.com/*
// @match        https://account.bilibili.com/*
// @match        https://message.bilibili.com/*
// @match        https://bangumi.bilibili.com/*
// @match        https://search.bilibili.com/*
// @icon         https://www.bilibili.com/favicon.ico
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/475386/%E5%88%A0%E9%99%A4%20Bilibili%20%E6%90%9C%E7%B4%A2%E6%A0%8F%E6%8F%90%E7%A4%BA%E8%AF%8D.user.js
// @updateURL https://update.greasyfork.org/scripts/475386/%E5%88%A0%E9%99%A4%20Bilibili%20%E6%90%9C%E7%B4%A2%E6%A0%8F%E6%8F%90%E7%A4%BA%E8%AF%8D.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let i = 0;
    const run = () => {
        const el = document.querySelector('input.nav-search-input, input.nav-search-content, input.search-input-el, input.nav-search-keyword');
        if (el) {
            el.removeAttribute('placeholder');
            el.removeAttribute('title');
            const observer = new MutationObserver((mutationsList, observer) => {
                for (const mutation of mutationsList) {
                    if (mutation.type === "attributes") {
                        if (mutation.attributeName == 'placeholder' || mutation.attributeName == 'title') {
                            if (mutation.target.getAttribute(mutation.attributeName)) {
                                mutation.target.removeAttribute(mutation.attributeName);
                            }
                        }
                    }
                }
            });
            observer.observe(el, { attributes: true });
        } else{
            i++;
            if (i < 200) {
                setTimeout(run, 16);
            }
        }
    };

    run();
})();