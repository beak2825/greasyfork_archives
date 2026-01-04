// ==UserScript==
// @name         就创业直播平台倍速播放
// @namespace    http://tampermonkey.net/
// @version      1.2.1
// @description  倍速播放
// @author       Gargantua7
// @match        https://*.wnssedu.com/course/newcourse/watch.htm*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/423958/%E5%B0%B1%E5%88%9B%E4%B8%9A%E7%9B%B4%E6%92%AD%E5%B9%B3%E5%8F%B0%E5%80%8D%E9%80%9F%E6%92%AD%E6%94%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/423958/%E5%B0%B1%E5%88%9B%E4%B8%9A%E7%9B%B4%E6%92%AD%E5%B9%B3%E5%8F%B0%E5%80%8D%E9%80%9F%E6%92%AD%E6%94%BE.meta.js
// ==/UserScript==
(function() {
    'use strict';
    var speed = 5.0;//更改这个数字更改倍率
    setInterval(function() {
        document.querySelector("video").playbackRate=speed;
    }, 2000);
    let i = 0;
    setInterval(function() {
        if(i < speed) {
            i++;
            sendRecordTime();
        } else {
            i = 0;
        }
    }, 1000 * 60 / speed);
})();