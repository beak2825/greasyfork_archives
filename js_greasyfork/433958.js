// ==UserScript==
// @name               Dcard Guest
// @namespace          snkoarashi_dcard
// @version            1.4
// @description        簡單移除Dcard在未登入狀態下的註冊視窗及禁止捲動
// @author             SN-Koarashi (5026)
// @match              https://*.dcard.tw/*
// @icon               https://www.google.com/s2/favicons?domain=dcard.tw
// @grant              GM_setValue
// @grant              GM_getValue
// @require            https://code.jquery.com/jquery-3.6.3.min.js#sha256-pvPw+upLPUjgMXY0G+8O0xUf+/Im1MZjXxxgOcBQBXU=
// @downloadURL https://update.greasyfork.org/scripts/433958/Dcard%20Guest.user.js
// @updateURL https://update.greasyfork.org/scripts/433958/Dcard%20Guest.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var dialog = false;
    var oldURL = location.href;
    var $ = window.jQuery;

    // Main Timer
    var timer = setInterval(function(){
        if($('#__next > iframe').length === 0 && $('.dcard_captcha').length === 0 && $('.dcard_ray_id_container').length === 0){
            $(".__portal").remove();
            $("body").css("overflow","");

            let re = /^(https:\/\/www.dcard.tw\/)(.*?)\/p\/([0-9]+)/g;
            let URLs = location.href;
            if(URLs.match(re)){
                if (location.href != oldURL){
                    oldURL = location.href;
                    location.reload(true);
                }
            }


            oldURL = location.href;
        }
    },500);
})();