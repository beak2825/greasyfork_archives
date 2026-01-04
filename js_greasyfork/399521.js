// ==UserScript==
// @name 拒绝黑白回归彩色
// @namespace http://www.zslm.org
// @version      0.5
// @description  让网页的黑白颜色消失,理论所有支持最新css标准的浏览器均可,最新标准指的滤镜的命名统一为filter的浏览器
// @author GeniusLe
// @match *://*/*
// @grant none
// @downloadURL https://update.greasyfork.org/scripts/399521/%E6%8B%92%E7%BB%9D%E9%BB%91%E7%99%BD%E5%9B%9E%E5%BD%92%E5%BD%A9%E8%89%B2.user.js
// @updateURL https://update.greasyfork.org/scripts/399521/%E6%8B%92%E7%BB%9D%E9%BB%91%E7%99%BD%E5%9B%9E%E5%BD%92%E5%BD%A9%E8%89%B2.meta.js
// ==/UserScript==
(function() {
    'use strict';
    console.log("Start");
    document.documentElement.style.filter = "grayscale(0)";
    document.body.style.filter = "grayscale(0)";
    console.log("End");
})();