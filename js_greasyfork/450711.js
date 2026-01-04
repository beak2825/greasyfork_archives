// ==UserScript==
// @name         FuckTieba
// @version      0.1
// @description  移除百度贴吧smartapp的广告
// @author       duoduo
// @match        https://byokpg.smartapps.cn/showslave/*
// @grant        none
// @icon         https://www.google.com/s2/favicons?domain=tieba.baidu.com&sz=256
// @run-at       document-end
// @license      MIT
// @namespace https://greasyfork.org/users/954393
// @downloadURL https://update.greasyfork.org/scripts/450711/FuckTieba.user.js
// @updateURL https://update.greasyfork.org/scripts/450711/FuckTieba.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function log(s) {
        console.log("[FuckTieba]", s);
    }

    document.addEventListener('DOMNodeInserted',(e) => {
        if (e.relatedNode.className.includes("bdad")) {
            e.relatedNode.remove();
        }
        if (e.relatedNode.className.includes("comment-cut-btn")) {
            e.relatedNode.remove();
        }
        if (e.relatedNode.tagName.toLowerCase() === "swan-topic-list") {
            e.relatedNode.remove();
        }
        if (e.relatedNode.className.includes("feed-recommendation")) {
            e.relatedNode.remove();
        }
        if (e.relatedNode.className.includes("search-hot")) {
            e.relatedNode.remove();
        }
        if (e.relatedNode.tagName.toLowerCase() === "swan-tb-wakeup") {
            e.relatedNode.remove();
        }
        if (e.relatedNode.className.includes("ad-expose")) {
            e.relatedNode.remove();
        }
    })

    log("hello, world");
})();