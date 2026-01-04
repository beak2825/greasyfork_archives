// ==UserScript==
// @name 素描黑白插件
// @namespace 方圆
// @version      1.0
// @description  让网页的颜色变黑白,素描黑白插件理论所有支持最新css标准的浏览器均可,最新标准指的滤镜的命名统一为filter的浏览器
// @author 方圆
// @match *://*/*
// @grant none
// @downloadURL https://update.greasyfork.org/scripts/456481/%E7%B4%A0%E6%8F%8F%E9%BB%91%E7%99%BD%E6%8F%92%E4%BB%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/456481/%E7%B4%A0%E6%8F%8F%E9%BB%91%E7%99%BD%E6%8F%92%E4%BB%B6.meta.js
// ==/UserScript==
(function() {
    'use strict';
    console.log("Start");
    document.documentElement.style.filter = "grayscale(1)";
    document.body.style.filter = "grayscale(1)";
    console.log("End");
})();