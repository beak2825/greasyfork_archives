// ==UserScript==
// @name         Dizipal AdBlock
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Dizipal Ads Blocker and intro ads skipper (tampermonkey / greasemonkey chrome extension)
// @author       Yasin Kuyu
// @date         17/09/2022
// @license      MIT
// @grant        unsafeWindow
// @grant        GM_xmlhttpRequest
// @include      *dizipal*.com/*
// @include      *dizipal*.net/*
// @include      *dizipal*.org/*
// @include      *stream.dizipal*.com/*

// @downloadURL https://update.greasyfork.org/scripts/451534/Dizipal%20AdBlock.user.js
// @updateURL https://update.greasyfork.org/scripts/451534/Dizipal%20AdBlock.meta.js
// ==/UserScript==
(function() {
    'use strict';

    var remove_ads = true;
    var skip_video_ads = true;
    var mute_ads = true;

    if(mute_ads){
        soundToggle();
    }

    if(remove_ads){
        document.querySelectorAll(".containerAds").forEach(e => e.remove());
        adHide('bottomAd');
    }

    while (skip_video_ads) {
        skipAd();
    }

})();