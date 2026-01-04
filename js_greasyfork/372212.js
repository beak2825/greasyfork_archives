// ==UserScript==
// @name         DMZJ 修复上下滚动浏览
// @namespace    https://unlucky.ninja/
// @version      0.1
// @description  修复DMZJ上下滚动浏览图片加载失败问题
// @author       UnluckyNinja
// @match        http*://manhua.dmzj.com/*
// @grant        unsafeWindow
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/372212/DMZJ%20%E4%BF%AE%E5%A4%8D%E4%B8%8A%E4%B8%8B%E6%BB%9A%E5%8A%A8%E6%B5%8F%E8%A7%88.user.js
// @updateURL https://update.greasyfork.org/scripts/372212/DMZJ%20%E4%BF%AE%E5%A4%8D%E4%B8%8A%E4%B8%8B%E6%BB%9A%E5%8A%A8%E6%B5%8F%E8%A7%88.meta.js
// ==/UserScript==

(function($, window) {
    'use strict';

    // DMZJ 错把app_html打成了app_heml,还好引用的全局作用域，直接这里写个就好
    window.app_html = '<div id="app_manhua" style="width:800px; height:120px; padding:20px; background:#fff; display:block; border:1px solid #ccc; margin:20px auto"></div>'
}).call(unsafeWindow || window, (unsafeWindow || window).$, unsafeWindow || window);