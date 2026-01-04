// ==UserScript==
// @name         青书学堂自动学习
// @namespace    http://tampermonkey.net/
// @version      2024-04-08
// @description  青书学堂自动学习，仅供学习使用
// @author       L
// @match        https://degree.qingshuxuetang.com/cdlg/Student/Course/CourseShow*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/495135/%E9%9D%92%E4%B9%A6%E5%AD%A6%E5%A0%82%E8%87%AA%E5%8A%A8%E5%AD%A6%E4%B9%A0.user.js
// @updateURL https://update.greasyfork.org/scripts/495135/%E9%9D%92%E4%B9%A6%E5%AD%A6%E5%A0%82%E8%87%AA%E5%8A%A8%E5%AD%A6%E4%B9%A0.meta.js
// ==/UserScript==

(function () {
    'use strict';
    const url = window.location.href;
    const nodeId = url.match(/nodeId=:?([^&#]+)/)[1];

    play();

    function play(){
        const video = document.querySelector('#vjs_video_3_html5_api');
        if(video==null){
            window.setTimeout(play, 1 * 1000);
            return;
        }
        try{
            video.playbackRate = 2.0;
            video.muted = true;
            video.play();
            video.addEventListener('ended', function () {
                console.log('video ended');
                window.setTimeout(function () {
                    goNext();
                }, 5 * 1000);
            });
        }catch(err){
            window.setTimeout(play, 1 * 1000);
        }
    }
    function goNext() {
        var liElements = Array.from(document.querySelectorAll('#lessonList li'));

        const items = liElements.map(function (li) {
            return li.querySelector('a').id;
        }).filter(function (id) {
            return id.trim() !== '';
        }).map(function (id) {
            return id.replace('courseware-', '')
        });
        const currentIndex = items.findIndex(function (id) { return id == nodeId; });
        if (items.length <= currentIndex + 1) return;
        const nextItem = items[currentIndex + 1];
        const nextUrl = url.replace(nodeId, nextItem);
        window.location.href = nextUrl;
    }
})();