// ==UserScript==
// @name         Baidu Tieba Image Auto Expand
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  自动展开百度贴吧贴子中的折叠图
// @author       apkipa
// @match        http*://tieba.baidu.com/p/*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/421691/Baidu%20Tieba%20Image%20Auto%20Expand.user.js
// @updateURL https://update.greasyfork.org/scripts/421691/Baidu%20Tieba%20Image%20Auto%20Expand.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const callback = function(mutationsList, observer) {
        for (let mutation of mutationsList) {
            var tips = mutation.target.getElementsByClassName("replace_tip");
            for (let item of tips) {
                item.style.display = "none";
                item.parentElement.style.height = "auto";
            }
        }
    }

    const observer = new MutationObserver(callback);
    const config = { attributes: false, childList: true, subtree: true };
    observer.observe(document.getElementsByClassName("wrap1")[0], config);
})();