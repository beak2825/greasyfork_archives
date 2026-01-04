// ==UserScript==
// @name         查看百度云分享列表
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  访问百度网盘pc端分享页时，会跳转到盘多多的分享页面列表（百度云官方已停分享列表）
// @author       ilxdh.com
// @match        *://pan.baidu.com/share/home*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/31643/%E6%9F%A5%E7%9C%8B%E7%99%BE%E5%BA%A6%E4%BA%91%E5%88%86%E4%BA%AB%E5%88%97%E8%A1%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/31643/%E6%9F%A5%E7%9C%8B%E7%99%BE%E5%BA%A6%E4%BA%91%E5%88%86%E4%BA%AB%E5%88%97%E8%A1%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var curHref = window.location.href;
    var curHref0 = curHref.split('home?uk=')[1].split('&suk')[0].split('#category/type=0')[0];
    var newHref = 'http://www.panduoduo.net/u/bd-' + curHref0;
    window.location.href = newHref;
})();