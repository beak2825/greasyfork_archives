// ==UserScript==
// @name         斗鱼净化
// @namespace    http://tampermonkey.net/
// @version      0.1.2
// @description  斗鱼净化,隐藏评论区
// @description  斗鱼净化,隐藏礼物栏
// @description  斗鱼净化,隐藏首页下面的推荐
// @author       LeeShaoyu
// @match        *://www.douyu.com/**
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/3.5.0/jquery.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/406600/%E6%96%97%E9%B1%BC%E5%87%80%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/406600/%E6%96%97%E9%B1%BC%E5%87%80%E5%8C%96.meta.js
// ==/UserScript==

(function () {
    'use strict';
    var toolbar = $('#js-player-toolbar')
    var asideMain = $('#js-player-asideMain')
    var Customize = $('.layout-Customize')
    var js_main = $('#js-main')
    if (toolbar.length) {
        $(toolbar).hide()
    }
    if (asideMain.length) {
        $(asideMain).hide()
    }
    if (Customize.length) {
        $(Customize).hide()
    }
    if (js_main.length) {
        $(js_main).attr("style","display:none;")
    }
})();