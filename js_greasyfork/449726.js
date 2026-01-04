// ==UserScript==
// @name         可乐影视去广告
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  可乐影视去除右下角广告和弹窗和视频下方广告
// @author       ziuch
// @match        https://klyingshi.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=klyingshi.com
// @require      http://cdn.bootcss.com/jquery/1.8.3/jquery.min.js
// @license MIT
// @grant        GM_log
// @downloadURL https://update.greasyfork.org/scripts/449726/%E5%8F%AF%E4%B9%90%E5%BD%B1%E8%A7%86%E5%8E%BB%E5%B9%BF%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/449726/%E5%8F%AF%E4%B9%90%E5%BD%B1%E8%A7%86%E5%8E%BB%E5%B9%BF%E5%91%8A.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...

    $('#note').remove();
    $('.module-adslist').remove();
    let interval_ad = setInterval(close_ad, 25);
    //$('#HMRichBox').remove();
    function close_ad() {
        let ad = document.getElementById("HMRichBox");
        if(ad !== null) {
            ad.style.display = "none";
            clearInterval(interval_ad);
        }
    };
})();