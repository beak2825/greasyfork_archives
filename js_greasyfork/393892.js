// ==UserScript==
// @name         url_redirect
// @namespace    http://tampermonkey.net/
// @version      2.1
// @description  automatically block certain websites and jump to a specified domain name
// @author       lecrane

// @include      /^https?://www\..*(see|bus|dmm|fan|jav|cdn)\.(in|co|zone|men|cloud|cam|one|life|icu|com|net|blog|bar|xyz)/.*$/
// @include      *://*missav.com/*
// @include      *://*njav.tv/*
// @include      *://*mimi9.icu/*
// @include      *://*koube8.com/*
// @include      *://*98ddt.xyz/*
// @include      *://*hjd.yunfi2048.net/*
// @include      *://*hjd.yuey2048.net/*
// @include      *://*sdfert.space/*
// @include      *://*ty.bty2048.net/*
// @include      *://*hjd.yhu2048.net/*
// @include      *://*hjd2048.com/*
// @include      *://*hjd2048.net/*
// @include      *://*sehuatang.net/*
// @include      *://*sdfasf.space/*
// @include      *://*pornhub.com/*
// @include      *://*yespornplease.com/*
// @include      *://*xvideos.com/*
// @include      *://*loveherfeet.com/*
// @grant        unsafeWindow
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_listValues
// @downloadURL https://update.greasyfork.org/scripts/393892/url_redirect.user.js
// @updateURL https://update.greasyfork.org/scripts/393892/url_redirect.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var url = "https://www.bilibili.com/video/av69155635";
    window.location.replace(url);

})();