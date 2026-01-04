// ==UserScript==
// @name        华为ilearningX平台视频自动播放，自动下一章，自动静音
// @namespace   3290172897@qq.com
// @version      0.51
// @description 华为ilearningX平台视频自动播放下一章自动静音，鸣谢@明钊
// @author       azheng9929
// @match         https://ilearningx.huawei.com/courses/*
// @grant        unsafewindow
// @grant        GM_xmlhttpRequest
// @grant        GM_getValue
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/420240/%E5%8D%8E%E4%B8%BAilearningX%E5%B9%B3%E5%8F%B0%E8%A7%86%E9%A2%91%E8%87%AA%E5%8A%A8%E6%92%AD%E6%94%BE%EF%BC%8C%E8%87%AA%E5%8A%A8%E4%B8%8B%E4%B8%80%E7%AB%A0%EF%BC%8C%E8%87%AA%E5%8A%A8%E9%9D%99%E9%9F%B3.user.js
// @updateURL https://update.greasyfork.org/scripts/420240/%E5%8D%8E%E4%B8%BAilearningX%E5%B9%B3%E5%8F%B0%E8%A7%86%E9%A2%91%E8%87%AA%E5%8A%A8%E6%92%AD%E6%94%BE%EF%BC%8C%E8%87%AA%E5%8A%A8%E4%B8%8B%E4%B8%80%E7%AB%A0%EF%BC%8C%E8%87%AA%E5%8A%A8%E9%9D%99%E9%9F%B3.meta.js
// ==/UserScript==
window.addEventListener("load", Greasemonkey_main, false);

function Greasemonkey_main() {
    setInterval(function () {
        //Because of page lodaing speed, we check page type in interval.
        var v1 = document.querySelector('video');

        //Handle non-video page
        if (v1 == null) {
            //By default, just pass.
            document.querySelector('.sequence-nav-button.button-next').click();
        }

        //Handle video page
        if (document.querySelector('video') != null) {

            //Click next
            if (document.querySelector('video').ended == true) {
                document.querySelector('.sequence-nav-button.button-next').click();
            }

            //Play
            if (document.querySelector('video').paused == true) {
                document.querySelector('video').play();
            }

            //Mute
            if(document.querySelector('video').volume > 0){
                document.querySelector('video').volume=0;
            }
        }
    }
        //判断播放进度是否到达100%
        , 10000)
}