// ==UserScript==
// @name         Ambr & honeyhunterworld remove ads
// @namespace    https://greasyfork.org/zh-CN/scripts/461265
// @license      WTFPL
// @version      1.0
// @description  安柏网、内鬼网去广告
// @author       lance715
// @match        *://ambr.top/*
// @match        *://genshin.honeyhunterworld.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=mihoyo.com
// @downloadURL https://update.greasyfork.org/scripts/461265/Ambr%20%20honeyhunterworld%20remove%20ads.user.js
// @updateURL https://update.greasyfork.org/scripts/461265/Ambr%20%20honeyhunterworld%20remove%20ads.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var ambr = [
        '#avatar-middle-video',
        '#avatar-bottom-wide',
        '.vm-footer',
        '.vm-placement',
        '[name="Advertisment"]'
    ];
    var ghhw = [
        '.ad_sidebar_left',
        '.ad_sidebar_right',
        '.ad_header_top',
        '.sidebar_cont.ad_content_bottom',
        '.ad_sidebar_video',
    ];
    var removeDom = function(ads) {
        for (var i = 0; i < ads.length; i++) {
            var q = ads[i];
            var dom = document.querySelector(q);
            if (dom && dom.remove) {
                dom.remove();
            }
        }
    }
    var cleanAd = function() {
        if (/ambr\.top/.test(window.location.hostname)) removeDom(ambr);
        if (/genshin\.honeyhunterworld\.com/.test(window.location.hostname)) removeDom(ghhw);
        setTimeout(cleanAd, 2000);
    }
    cleanAd();
    window.addEventListener('hashchange', cleanAd);
    setTimeout(cleanAd, 2000);
})();