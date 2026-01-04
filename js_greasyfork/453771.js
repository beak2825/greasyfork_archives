// ==UserScript==
// @name         设置blur网站全局字体
// @namespace    https://blur.io/*
// @version      0.1
// @description  设置blur网站全局字体为“微软雅黑”
// @author       @Nuggets1024
// @match        https://blur.io/*
// @icon         https://blur.io/favicons/16.png
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/453771/%E8%AE%BE%E7%BD%AEblur%E7%BD%91%E7%AB%99%E5%85%A8%E5%B1%80%E5%AD%97%E4%BD%93.user.js
// @updateURL https://update.greasyfork.org/scripts/453771/%E8%AE%BE%E7%BD%AEblur%E7%BD%91%E7%AB%99%E5%85%A8%E5%B1%80%E5%AD%97%E4%BD%93.meta.js
// ==/UserScript==

(function() {
var font_style = document.createElement("style");
    font_style.type = 'text/css';
    font_style.innerHTML = " *:not([class*='icon']):not(.fa):not(.fas):not(i) {font-family: 'PingFang SC','Heiti SC','myfont','Microsoft YaHei','Source Han Sans SC','Noto Sans CJK SC','HanHei SC', 'sans-serif' ,'icomoon','Icons' ,'brand-icons' ,'FontAwesome','Material Icons','Material Icons Extended','Glyphicons Halflings'  !important;} font-family: 'PingFang SC','Microsoft YaHei';}";
document.head.append(font_style);
})();