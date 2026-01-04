// ==UserScript==
// @name         百度净化
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  百度净化，去热搜，右侧广告，关联推广
// @author       LeeShaoYu
// @match        https://www.baidu.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/406430/%E7%99%BE%E5%BA%A6%E5%87%80%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/406430/%E7%99%BE%E5%BA%A6%E5%87%80%E5%8C%96.meta.js
// ==/UserScript==

(function () {
    'use strict';
    var right = $('.cr-offset')
    var top_nav = $('.s-top-nav')
    var s_menu_gurd = $('#s_menu_gurd')
    var s_main =  $('#s_main')
    var hotsearch = $('#s-hotsearch-wrapper')
    if (right.length) {
        $(right).hide()
    }
    if (top_nav.length) {
        $(top_nav).hide()
    }
    if (s_menu_gurd.length) {
        $(s_menu_gurd).hide()
    }
    if (s_main.length) {
        $(s_main).hide()
    }
    if (hotsearch.length) {
        $(hotsearch).hide()
    }

})();