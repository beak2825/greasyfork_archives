// ==UserScript==
// @name         Chaoxing Fuck
// @name:zh-CN   Chaoxing Fuck
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Play Chaoxing course videos at 10x speed.
// @description:zh-cn 十倍速播放超星学系统视频
// @author       You
// @match        https://mooc1.chaoxing.com/mycourse/studentstudy?*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=chaoxing.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/452551/Chaoxing%20Fuck.user.js
// @updateURL https://update.greasyfork.org/scripts/452551/Chaoxing%20Fuck.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function block(eventName, window) {
        window.addEventListener(eventName, (event) => {
            event.stopImmediatePropagation();
        }, true);
    }

    block('mouseout', window);
    setTimeout(() => {
        const title = document.querySelector('.prev_title');
        title.innerHTML += " fucked";
        const framedWindow = document.querySelector('iframe').contentWindow.document.querySelector('iframe').contentWindow;
        const framedDoc = framedWindow.document;
        block('ratechange', framedWindow);
        const videoEle = framedDoc.querySelector('#video_html5_api');
        const playBtn = framedDoc.querySelector('.vjs-big-play-button');
        playBtn.addEventListener('click', () => {
            setTimeout(() => {
                videoEle.playbackRate = 10;
                console.log('Fucked');
            }, 1000);
        });
    }, 1500);
})();