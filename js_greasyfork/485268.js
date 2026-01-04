// ==UserScript==
// @name         蜜柑计划 强制桌面版
// @namespace    https://www.mikanani.me/
// @version      1.0
// @description  强制显示桌面版的蜜柑计划
// @author       gf0txj3
// @match        *://mikanani.me/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/485268/%E8%9C%9C%E6%9F%91%E8%AE%A1%E5%88%92%20%E5%BC%BA%E5%88%B6%E6%A1%8C%E9%9D%A2%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/485268/%E8%9C%9C%E6%9F%91%E8%AE%A1%E5%88%92%20%E5%BC%BA%E5%88%B6%E6%A1%8C%E9%9D%A2%E7%89%88.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var ts=document.createElement('style');
    ts.textContent='.hidden-sm.hidden-sm{display:block !important;}.hidden-xs.hidden-xs{display:block !important;}.hidden-md.hidden-md{display:none !important;}.hidden-lg.hidden-lg{display:none !important;}';
    document.head.append(ts);
})();