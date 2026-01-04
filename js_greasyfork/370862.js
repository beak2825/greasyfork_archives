// ==UserScript==
// @name         盘多多自动跳转下载
// @namespace    snomiao@gmail.com
// @version      0.1
// @description  rt
// @run-at       document-start
// @author       snomiao
// @match        http://www.panduoduo.net/r/*
// @match        https://www.panduoduo.net/r/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/370862/%E7%9B%98%E5%A4%9A%E5%A4%9A%E8%87%AA%E5%8A%A8%E8%B7%B3%E8%BD%AC%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/370862/%E7%9B%98%E5%A4%9A%E5%A4%9A%E8%87%AA%E5%8A%A8%E8%B7%B3%E8%BD%AC%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var href = location.href.replace(/(https?):\/\/www.panduoduo.net\/r\/(\d+)/,"$1://pdd.19mi.net/go/$2");
    if( href != location.href ) {
        location.href = href;
    }
})();
