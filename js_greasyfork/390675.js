// ==UserScript==
// @name         解决知乎外链与Clickable Links拓展冲突
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  解决知乎外链与Clickable Links拓展冲突的问题
// @author       Chen
// @match        https://www.zhihu.com/question/*
// @match        https://zhuanlan.zhihu.com/p/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/390675/%E8%A7%A3%E5%86%B3%E7%9F%A5%E4%B9%8E%E5%A4%96%E9%93%BE%E4%B8%8EClickable%20Links%E6%8B%93%E5%B1%95%E5%86%B2%E7%AA%81.user.js
// @updateURL https://update.greasyfork.org/scripts/390675/%E8%A7%A3%E5%86%B3%E7%9F%A5%E4%B9%8E%E5%A4%96%E9%93%BE%E4%B8%8EClickable%20Links%E6%8B%93%E5%B1%95%E5%86%B2%E7%AA%81.meta.js
// ==/UserScript==

const observedElement = [];

(function () {
    'use strict';
    const bodyObserver = new MutationObserver(function (mutationsList) {
        observeExternal();
    });
    bodyObserver.observe(document.querySelector("body"), { childList: true, subtree: true });
})();

function observeExternal() {
    document.querySelectorAll('.external > .visible').forEach(function (it) {
        if (!observedElement.includes(it)) {
            observedElement.push(it);
            const externalObserver = new MutationObserver(function (mutationsList) {
                const tags = it.getElementsByTagName("a")
                for (let index = 0; index < tags.length; index++) {
                    const element = tags[index];
                    element.removeAttribute("href");
                    console.log(".external > .visible > a href removed");
                }
            });
            externalObserver.observe(it, { childList: true });
        }
    });
}