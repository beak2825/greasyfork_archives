// ==UserScript==
// @name         百度首页样式微调
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  百度首页(已登录)样式微调
// @author       IOL0ol1
// @match        https://www.baidu.com/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/391751/%E7%99%BE%E5%BA%A6%E9%A6%96%E9%A1%B5%E6%A0%B7%E5%BC%8F%E5%BE%AE%E8%B0%83.user.js
// @updateURL https://update.greasyfork.org/scripts/391751/%E7%99%BE%E5%BA%A6%E9%A6%96%E9%A1%B5%E6%A0%B7%E5%BC%8F%E5%BE%AE%E8%B0%83.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var bottom_layer = document.getElementById("bottom_layer");
    bottom_layer.parentNode.removeChild(bottom_layer);
    var s_top_wrap = document.getElementById("s_top_wrap");
    s_top_wrap.parentNode.removeChild(s_top_wrap);
    var s_upfunc_menus = document.getElementById("s_upfunc_menus");
    s_upfunc_menus.parentNode.removeChild(s_upfunc_menus);
    var u_sp = document.getElementById("u_sp");
    u_sp.parentNode.removeChild(u_sp);
})();