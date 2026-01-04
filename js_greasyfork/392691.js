// ==UserScript==
// @name         根本停不下来
// @namespace    a23187.cn
// @version      1.0.1
// @author       sudongpo
// @description  炫迈，根本停不下来
// @icon64       https://addons.cdn.mozilla.net/user-media/addon_icons/2273/2273929-64.png?modified=bb95c65b
// @supportURL   https://addons.mozilla.org/zh-CN/firefox/addon/%E6%A0%B9%E6%9C%AC%E5%81%9C%E4%B8%8D%E4%B8%8B%E6%9D%A5/
// @match        https://*.xuetangx.com/*
// @require      http://code.jquery.com/jquery-3.4.1.min.js
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/392691/%E6%A0%B9%E6%9C%AC%E5%81%9C%E4%B8%8D%E4%B8%8B%E6%9D%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/392691/%E6%A0%B9%E6%9C%AC%E5%81%9C%E4%B8%8D%E4%B8%8B%E6%9D%A5.meta.js
// ==/UserScript==

(function() {
    'use strict';
    if(window.location.hash.match(/^#\/video\//)) {
        var timeoutHandle;
        var refresh_wait_time = 40;

        var time_remain = refresh_wait_time;

        var intervalHandle = setInterval(() => {
            if($(".spinner").css("display") != "none") {
                document.title = "视频加载中 ( " + time_remain +"s 后自动刷新 )";
                if(time_remain == refresh_wait_time) {
                    timeoutHandle = setTimeout(() => location.reload(true), time_remain * 1000);
                }
                time_remain--;
            } else {
                clearTimeout(timeoutHandle);
                time_remain = refresh_wait_time;
                var play_btn = $(".xt_video_player_play_btn");
                if(!play_btn.hasClass("xt_video_player_play_btn_pause")) {
                    play_btn.click();
                }
                document.title = "根本停不下来";
            }
        }, 1000);

        $("#video").on("ended", () => {
            clearInterval(intervalHandle);
            document.title = "看完啦";
        });
    }
})();