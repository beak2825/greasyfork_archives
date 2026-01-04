// ==UserScript==
// @name        淘寶移除商品頁懸浮卡片DS
// @namespace   dsTaobaoRemoveDetailHoverCard
// @match       *s.taobao.com/*
// @author      Dabinn
// @icon        https://taobao.com/favicon.ico
// @run-at      document-idle
// @license     GNU GPLv3
// @description 移除淘寶商品頁mouse hover時顯示的額外DIV
// @version 0.2
// @downloadURL https://update.greasyfork.org/scripts/520689/%E6%B7%98%E5%AF%B6%E7%A7%BB%E9%99%A4%E5%95%86%E5%93%81%E9%A0%81%E6%87%B8%E6%B5%AE%E5%8D%A1%E7%89%87DS.user.js
// @updateURL https://update.greasyfork.org/scripts/520689/%E6%B7%98%E5%AF%B6%E7%A7%BB%E9%99%A4%E5%95%86%E5%93%81%E9%A0%81%E6%87%B8%E6%B5%AE%E5%8D%A1%E7%89%87DS.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function MainFun() {
        var container = document.querySelector('[class^="detailHoverCard"]');
        if (container) {
            // console.log("Target container found:", container);
            container.remove();
        } else {
            // console.log("Target container not found");
        }

    }
    MainFun()
})();