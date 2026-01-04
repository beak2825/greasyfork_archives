// ==UserScript==
// @name         Remove Gamekee custom pointers
// @namespace    https://github.com/systemannounce/RBCM
// @version      v1.0.0
// @description  Remove Gamekee/BA custom pointers
// @author       Felix_SANA
// @match        https://www.gamekee.com/ba/*
// @icon         https://www.gamekee.com/favicon.ico
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/489487/Remove%20Gamekee%20custom%20pointers.user.js
// @updateURL https://update.greasyfork.org/scripts/489487/Remove%20Gamekee%20custom%20pointers.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 创建一个观察器实例
    var observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.attributeName === "style") {
                document.body.removeAttribute("style");
            }
        });
    });

    // 配置观察选项:
    var config = { attributes: true };

    // 传入目标节点和观察选项
    observer.observe(document.body, config);
})();