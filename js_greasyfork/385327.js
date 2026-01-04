// ==UserScript==
// @name         2345678
// @namespace    https://greasyfork.org/users/218490
// @description  对百度盘播放器的功能进行增强, c加速, x减速, z恢复原始速度。
// @version      0.9
// @author       lianghaikun@sina.com
// @match        *://twmeiju.com/player/*
// @match        *://twmeiju.com/player/*
// @grant        none
// @require    http://code.jquery.com/jquery-1.11.0.min.js
// @downloadURL https://update.greasyfork.org/scripts/385327/2345678.user.js
// @updateURL https://update.greasyfork.org/scripts/385327/2345678.meta.js
// ==/UserScript==


/*

 快捷键说明：

 播放时间定位：
 方向键右→：快进3秒
 方向键左←：后退3秒

 音量调节：
 方向键上↑：音量升高 1%
 方向键下↓：音量降低 1%

 播放速度调节：
 按键C：加速播放 +0.1
 按键X：减速播放 -0.1
 按键Z、1：正常速度播放
 按键2：2倍速度播放
 按键3：3倍速度播放

 画面调节：
 按键回车：进入全屏
 */
(function() {
    'use strict';
    // $(".header-box").append("<div id='course1'>html1</div>");
    $("#video-wrap-outer").append("<div id=\"html_player_enhance_tips\">tipps</div>");
    $("#video-warp-outer").append("<div id=\"html_player_enhance_tips\">tipps</div>");
    $("#html_player_enhance_tips").attr("style", "position: absolute;z-index: 999999;padding: 10px;background: rgba(0,0,0,0.8);color:white;top: 50%;left: 50%;transform: translate(-50%,-50%);transition: all 500ms ease;display: none; -webkit-font-smoothing: subpixel-antialiased;font-family: 'microsoft yahei', Verdana, Geneva, sans-serif;-webkit-user-select: none;fontSize: 20px;");

    var tempRate = 0;
    document.onkeydown = function (event) {
            //按键X：减速播放 -0.1
            if (event.keyCode === 88) {
                tempRate = player().playbackRate()
                tempRate -= 0.1;
                player().setPlaybackRate(tempRate)
                settips("播放速度：" +tempRate.toFixed(1) + "倍");
            }
            //按键C：加速播放 +0.1
            if (event.keyCode === 67) {
                tempRate = player().playbackRate()
                tempRate += 0.1;
                player().setPlaybackRate(tempRate)
                settips("播放速度：" +tempRate.toFixed(1) + "倍");
            }
            //按键Z：正常速度播放
            if (event.keyCode === 90) {
                tempRate = 1;
                player().setPlaybackRate(tempRate)
                settips("播放速度：" +tempRate + "倍");
            }
            //按键1：播放*1
            if (event.keyCode === 49) {
                tempRate = player().playbackRate()
                tempRate = 1;
                player().setPlaybackRate(tempRate)
                settips("播放速度：" +tempRate + "倍");
            }
            //按键2：播放*2
            if (event.keyCode === 50) {
                tempRate = player().playbackRate()
                tempRate = 2;
                player().setPlaybackRate(tempRate)
                settips("播放速度：" +tempRate + "倍");
            }
            //按键3：播放*3
            if (event.keyCode === 51) {
                tempRate = player().playbackRate()
                tempRate = 3;
                player().setPlaybackRate(tempRate)
                settips("播放速度：" +tempRate + "倍");
            }

            //方向键右→：快进10秒
            if (event.keyCode === 39) {
                player().setCurrentTime(player().currentTime() + 10);
                event.stopPropagation();
                settips("快进：10秒");
            }
            //方向键左←：后退10秒
            if (event.keyCode === 37) {
                player().setCurrentTime(player().currentTime() - 10);
                event.stopPropagation();
                settips("后退：10秒");
            }
            //方向键上↑：音量升高 1%
            if (event.keyCode === 38) {
                settips("音量：升高1%");
            }
            //方向键下↓：音量降低 1%
            if (event.keyCode === 40) {
                settips("音量：降低1%");
            }
            //按键回车，进入全屏
            if(event.keyCode == 13){
                player().enterFullScreen();
            }
        // $(".header-box").html(tempRate);
    }
    function settips (tempRate) {
        $('#html_player_enhance_tips').html(tempRate);
        $('#html_player_enhance_tips').show();
        $('#html_player_enhance_tips').fadeOut(1000);

    }
    function player() {
        return videojs.getPlayers("video-player").html5player.tech_
    }
    // Your code here...
})();