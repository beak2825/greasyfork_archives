// ==UserScript==
// @name         嘉兴市专业技术人员继续教育平台自动刷课
// @namespace    http://jxkp.net/
// @version      1.11
// @description  自动刷课,续播,自动静音，支持后台播放
// @author       ZXPLDQ
// @match        *://zy.jxkp.net/Person/Play/*
// @grant        unsafeWindow
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/442737/%E5%98%89%E5%85%B4%E5%B8%82%E4%B8%93%E4%B8%9A%E6%8A%80%E6%9C%AF%E4%BA%BA%E5%91%98%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2%E5%B9%B3%E5%8F%B0%E8%87%AA%E5%8A%A8%E5%88%B7%E8%AF%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/442737/%E5%98%89%E5%85%B4%E5%B8%82%E4%B8%93%E4%B8%9A%E6%8A%80%E6%9C%AF%E4%BA%BA%E5%91%98%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2%E5%B9%B3%E5%8F%B0%E8%87%AA%E5%8A%A8%E5%88%B7%E8%AF%BE.meta.js
// ==/UserScript==
//建议保持前台运行，否则容易提示错误
(function() {
    'use strict';
    var title = document.title;
    if (!title.match("嘉兴市专业技术人员继续教育平台")){
        window.location.reload();
    }
    var _self = unsafeWindow
    var $ = _self.jQuery
    var mute_btn = document.getElementsByClassName("vjs-mute-control vjs-control")[0];
    mute_btn.click();
        // 模拟鼠标点击
    var to_click = new MouseEvent("click");
    var play_btn = document.getElementsByClassName("vjs-big-play-button")[0];
    play_btn.dispatchEvent(to_click);



setInterval(function() {
    //console.log(hasFocus)
    $(window).blur(function () {
            hasFocus = true;
            //console.log('失去焦点');
        });
    document.getElementById("kj_player").setAttribute("class", "video-js vjs-default-skin  vjs-controls-enabled vjs-has-started vjs-playing vjs-user-active");
        // 获取已学习时长和课程总时长
    var now = document.getElementsByClassName("vjs-current-time-display")[0].innerText.slice(-5);
    var finish = document.getElementsByClassName("vjs-duration-display")[0].innerText.slice(-5);
    //console.log(now+"___"+finish)
    var next_link = document.getElementsByClassName("pull-right")[1].childNodes[1].href;
    //console.log(next_link);
        // 如果已学习=总时长
        if (now == finish) {
            setTimeout(function(){window.location.href=next_link;},5000);//延时5秒，防止因暂停导致的时间错误
        } else {
            var player = document.getElementById("kj_player_html5_api");
            hasFocus = true;
            if (player.paused) {
                player.play();
            }
            window.focus();
        }
    }, 1000);})();
