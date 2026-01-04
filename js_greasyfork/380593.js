// ==UserScript==
// @name         Chaoxing Video Helper
// @namespace    https://greasyfork.org/zh-CN/users/220174-linepro
// @version      0.1
// @description  超星视频暂停提醒
// @author       LinePro
// @match        *://mooc1-1.chaoxing.com/mycourse/*
// @grant        GM_notification
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/380593/Chaoxing%20Video%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/380593/Chaoxing%20Video%20Helper.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function notify() {
        GM_notification('视频停啦！');
    }

    function checkPlaying() {
        var ifr = document.getElementsByTagName('iframe')[0];
        var ifr1 = ifr.contentDocument.getElementsByTagName('iframe')[0];
        const videos = ifr1.contentDocument.getElementsByTagName('video');
        if (videos.length > 0) {
            const playing = !videos[0].paused;
            console.log(playing, videos[0].__my_last_state__);
            if (videos[0].__my_last_state__) { // playing
                if (!playing) {
                    notify();
                    videos[0].__my_last_state__ = false;
                }
            } else { // not playing
                if (playing) videos[0].__my_last_state__ = true;
            }
        }
    }
    window.onload = function(){
        setInterval(checkPlaying, 3000);
    }
})();