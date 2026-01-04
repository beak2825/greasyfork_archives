// ==UserScript==
// @name            reCAPTCHA ShortLink Clicker
// @name:ja         reCAPTCHAのShortLinkボタンを自動クリック
// @namespace       http://fdjaosfijoasfsaf/
// @version         2.5
// @description     This script is not resolver, only can click. Currently wi.cr, adsrt.com
// @description:ja  現在wi.crとadsrt.comのみ動作
// @author          plgdown
// @include         *://wi.cr/*
// @include         *://adsrt.com/*
// @grant           none
// @run-at          document-end
// @downloadURL https://update.greasyfork.org/scripts/40883/reCAPTCHA%20ShortLink%20Clicker.user.js
// @updateURL https://update.greasyfork.org/scripts/40883/reCAPTCHA%20ShortLink%20Clicker.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var count = 0;
    var inter = function(){
        console.info("exec");
        document.getElementById("invisibleCaptchaShortlink").click();
    };
    
    if(document.getElementById("link-view") !== null){
        setInterval(inter, 2000);
    }
})();