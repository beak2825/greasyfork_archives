// ==UserScript==
// @name         b站白嫖助手
// @namespace    DuckBurnIncense
// @version      0.0.2
// @description  隐藏点赞, 投币, 收藏按钮
// @author       DuckBurnIncense
// @match        *://www.bilibili.com/video/*
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/443474/b%E7%AB%99%E7%99%BD%E5%AB%96%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/443474/b%E7%AB%99%E7%99%BD%E5%AB%96%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    while (1) {
        if (aaa = document.querySelector("#arc_toolbar_report > div.toolbar-left")) {
            aaa.style.display = 'none';
            break;
        }
    }
})();