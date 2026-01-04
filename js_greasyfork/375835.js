// ==UserScript==
// @name         xuetangx video speedup
// @name:zh      学堂云视频加速
// @name:zh-CN   学堂云视频加速
// @namespace    http://tampermonkey.net/
// @version      0.0.1
// @description        A xuetangx video speedup script.
// @description:zh     一个学堂云视频播放加速脚本
// @description:zh-CN  一个学堂云视频播放加速脚本
// @author       SHLLL
// @include      https://*.xuetangx.com/lms*
// @grant        unsafeWindow
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/375835/xuetangx%20video%20speedup.user.js
// @updateURL https://update.greasyfork.org/scripts/375835/xuetangx%20video%20speedup.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function speedUp() {
        let ele = document.getElementsByClassName('xt_video_player_speed')[0].getElementsByClassName('xt_video_player_common_list')[0].firstChild;
        ele.setAttribute('data-speed', 64);
        ele.innerText = '64.0x';
        if(window.Notification && Notification.permission !== "denied") {
            Notification.requestPermission(function(status) {
                var n = new Notification('学堂云加速', { body:'在播放器中选择播放速度吧！' });
            });
        }
    }

    unsafeWindow.onload = ()=>{
        console.log('学堂云视频加速器');
        let url = unsafeWindow.location.href;
        if(url.indexOf('video') !== -1) {
            setTimeout(speedUp, 100);
        }
        unsafeWindow.onhashchange = (e)=>{
                console.log('检测到url更改');
                let curUrl = e.newURL;
                if(url.indexOf('video') !== -1) {
                    setTimeout(speedUp, 100);
                }
            }
    }


})();