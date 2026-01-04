// ==UserScript==
// @name         百度直链
// @namespace    http://xxx.icu/
// @license      WTFPL
// @version      2024.09.13
// @description  替换百度搜索结果真实地址
// @author       underbed
// @match        https://baidu.com/
// @match        https://baidu.com/s?*
// @match        https://baidu.com/baidu?*
// @match        https://*.baidu.com/
// @match        https://*.baidu.com/s?*
// @match        https://*.baidu.com/baidu?*
// @match        https://www.baidu.com/
// @match        https://www.baidu.com/s?*
// @match        https://www.baidu.com/baidu?*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=baidu.com
// @grant        GM_addStyle
// @grant        unsafeWindow
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/503827/%E7%99%BE%E5%BA%A6%E7%9B%B4%E9%93%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/503827/%E7%99%BE%E5%BA%A6%E7%9B%B4%E9%93%BE.meta.js
// ==/UserScript==

(function () {
    "use strict";

    function addCSS() {
        GM_addStyle('a.faster:after{content:" 🚀";position:absolute;white-space:pre}');
        GM_addStyle('p.faster:after{content:" 🚀";position:absolute;white-space:pre}');
        GM_addStyle('a.faster-official:after{content:"          🚀";position:absolute;white-space:pre}');
    }

    function toActualURL(node) {
        let linkNode = node.querySelector("h3 > a");
        if (linkNode == null || !("mu" in node.attributes)) return;
        let realURL = node.attributes.mu.nodeValue;
        if (
            [/^http(s)?:\/\/nourl\.(ubs\.)?baidu\.com\//, /^http(s)?:\/\/www\.baidu\.com\/s\?/].some((r) =>
                r.test(realURL)
            )
        ) {
            return;
        }
        linkNode.href = realURL;
        if (
            linkNode.parentNode.childElementCount == 1 ||
            linkNode == linkNode.parentNode.children[linkNode.parentNode.childElementCount - 1]
        ) {
            let p_in_link = linkNode.querySelector("p");
            if (p_in_link) p_in_link.classList.add("faster");
            else linkNode.classList.add("faster");
        } else linkNode.classList.add("faster-official");
    }

    new MutationObserver(function (mutations, observer) {
        for (const mutation of mutations) {
            if (mutation.addedNodes.length > 0) {
                for (const addNode of mutation.addedNodes) {
                    if (addNode.id != "container") continue;
                    addCSS();
                    for (const add of addNode.querySelectorAll("DIV.c-container")) {
                        toActualURL(add);
                    }
                }
            }
            if (mutation.target.id == "content_left") {
                if (mutation.target.querySelectorAll("DIV.c-container").length != 0) {
                    addCSS();
                    for (const result of mutation.target.querySelectorAll("DIV.c-container")) {
                        toActualURL(result);
                    }
                }
            }
        }
    }).observe(unsafeWindow.document, { childList: true, subtree: true });
})();
