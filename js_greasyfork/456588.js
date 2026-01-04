// ==UserScript==
// @name         mail.ru Компактные панели
// @namespace    http://tampermonkey.net/
// @version      1.8
// @description  Компактные панели
// @license      MIT
// @author       Igor_K
// @match        *.mail.ru/*
// @icon         https://www.google.com/s2/favicons?domain=mail.ru
// @run-at       document-idle
// @grant        GM_addStyle
// @require      https://greasyfork.org/scripts/456593-libtest/code/LibTEST.js

// @downloadURL https://update.greasyfork.org/scripts/456588/mailru%20%D0%9A%D0%BE%D0%BC%D0%BF%D0%B0%D0%BA%D1%82%D0%BD%D1%8B%D0%B5%20%D0%BF%D0%B0%D0%BD%D0%B5%D0%BB%D0%B8.user.js
// @updateURL https://update.greasyfork.org/scripts/456588/mailru%20%D0%9A%D0%BE%D0%BC%D0%BF%D0%B0%D0%BA%D1%82%D0%BD%D1%8B%D0%B5%20%D0%BF%D0%B0%D0%BD%D0%B5%D0%BB%D0%B8.meta.js
// ==/UserScript==

(function() {
    'use strict';
    console.log("!!!!!!!!!!++//");

    GM_addStyle('.nav__item {height: 14px !important;}');
    //GM_addStyle('#headline {margin-top: -7px;}');
    GM_addStyle('.ph-whiteline {top: -3px;}');

    //GM_addStyle('#ph-whiteline {height: 10px !important;}');
    //GM_addStyle('#headline, #headline > div.ph-container {height: 27px;}');

    GM_addStyle('.nav__folder {height: 14px !important;}');

    GM_addStyle('.ph-container {font-size: 11px !important;}');
    //GM_addStyle('.portal-menu {margin-top: -9px !important;}');
    GM_addStyle('.portal-menu {height: 46px !important;}');
    GM_addStyle('.portal-menu > span > div {transform: scale(0.8) !important;}');
    //GM_addStyle('.application-mail__layout {margin-top: -9px;}');
    GM_addStyle('.search-panel__wrapper {background-color: transparent !important;}');
    GM_addStyle('.portal-menu > span > div.search-panel {margin-top: 7px !important;}');
    GM_addStyle('.portal-menu > span > div.layout__column_left {margin-top: 2px !important;}');
    GM_addStyle('.portal-menu > span > div.layout__main-frame {margin-left: -1.2%;}');
    //GM_addStyle('.portal-menu > span > div.layout__main-frame {margin-top: 9px !important;}');
    GM_addStyle('.portal-menu > span > div.search-panel {margin-right: -9%;}');

    GM_addStyle('.application-mail__layout_main {height: calc(100% - 28px) !important;}');
    GM_addStyle('#app-canvas {margin-top: -10px;}');
    //GM_addStyle('.nav_pony-mode {font-size: 11px;}');

    //GM_addStyle('.nav_pony-mode {font-size: 14px !important;}');
    GM_addStyle(`.badge_size_m .badge__text {
    font-Size: 13px !important;
    font-Weight: bold;
    background-Color: #ffff0057;
    padding: 0px 10px;
    font-Stretch: ultra-expanded;}`);



})();