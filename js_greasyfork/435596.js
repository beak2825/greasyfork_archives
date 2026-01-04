
// ==UserScript==
// @name            wallhaven图片不显示缩略图解决
// @description	    延迟加载导致的wallhaven图片不显示缩略图解决
// @author          cab
// @namespace       https://greasyfork.org/zh-CN/
// @version         0.3
// @match           https://wallhaven.cc/*

// @grant           none
// @connect         agefans.tv
// @license         MIT
// @downloadURL https://update.greasyfork.org/scripts/435596/wallhaven%E5%9B%BE%E7%89%87%E4%B8%8D%E6%98%BE%E7%A4%BA%E7%BC%A9%E7%95%A5%E5%9B%BE%E8%A7%A3%E5%86%B3.user.js
// @updateURL https://update.greasyfork.org/scripts/435596/wallhaven%E5%9B%BE%E7%89%87%E4%B8%8D%E6%98%BE%E7%A4%BA%E7%BC%A9%E7%95%A5%E5%9B%BE%E8%A7%A3%E5%86%B3.meta.js
// ==/UserScript==

(function () {
    'use strict';
    var list = document.getElementsByClassName('lazyload')
    for (var i = 0; i < list.length; i++) {
        list[i].src = list[i].getAttribute('data-src')
        list[i].style.opacity = 1
    }
})();