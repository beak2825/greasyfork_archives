this.$ = this.jQuery = jQuery.noConflict(true);
// ==UserScript==
// @name         test
// @namespace    15home
// @version      1.0
// @description  youtube最大化不显示进度条
// @author       jarry.potter
// @match        https://www.youtube.com/*
// @grant        none
// @require      https://cdn.bootcss.com/jquery/1.12.4/jquery.min.js
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/464673/test.user.js
// @updateURL https://update.greasyfork.org/scripts/464673/test.meta.js
// ==/UserScript==

(function () {
    'use strict';

 console.log('yt::准备清除youtube播放条');
    (function ($) { // dialogtip-text
        $(document).ready(function () {
            var timesRun = 0
            var inter = setInterval(function () {
                console.log('youtube star--')
                var obj = $("div.ytp-gradient-bottom")[0].style.height.replace('px','');
                if(obj>200){
                    $("div.ytp-title-text").hide();
                    $("div.ytp-chrome-bottom").hide();
                    $("ytp-chrome-top-buttons").hide();
                    console.log('ytb-title and ytp-chrome-bottom hidden is ok ')
                }else{
                    $("div.ytp-title-text").show();
                    $("div.ytp-chrome-bottom").show();
                }
            }, 2000);
        })
    })(jQuery);
})();