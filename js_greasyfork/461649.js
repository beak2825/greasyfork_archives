// ==UserScript==
// @name         GBF调整窗口宽度
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  GBF调整窗口宽度，需要先设置成移动端user agent比如iphone
// @author       Ai
// @match        *://game.granbluefantasy.jp/*
// @match        *://gbf.game.mbga.jp/*
// @icon         http://game.granbluefantasy.jp/favicon.ico
// @run-at       document-body
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/461649/GBF%E8%B0%83%E6%95%B4%E7%AA%97%E5%8F%A3%E5%AE%BD%E5%BA%A6.user.js
// @updateURL https://update.greasyfork.org/scripts/461649/GBF%E8%B0%83%E6%95%B4%E7%AA%97%E5%8F%A3%E5%AE%BD%E5%BA%A6.meta.js
// ==/UserScript==

(function() {
    // Your code here...
    'use strict';
    var deviceRatio = window.innerWidth / 320;
    var html = document.getElementsByTagName('html')[0];
    html.style.zoom = deviceRatio;


})();