// ==UserScript==
// @name         黑马刷课
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  黑马校企课程,不想学了
// @author       BlackSheep
// @match        http://stu.ityxb.com/preview/detail/*
// @icon         data:image/png;base64,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
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/427618/%E9%BB%91%E9%A9%AC%E5%88%B7%E8%AF%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/427618/%E9%BB%91%E9%A9%AC%E5%88%B7%E8%AF%BE.meta.js
// ==/UserScript==

(function () {
    'use strict';




    var index = 0;

    function Check() {
        var Course = $('.point-text');        // * 获取课程列表
        var Course_rate = $('.point-progress-box');    // * 获取 视频进度

        while (Course_rate[index].innerText == "100%") {
            console.log(Course[index].innerText)
            Course[index].style.color = "#ff79c6"
            index++;
        }
        Course[index].click();
        if ($("video").get(0).paused == true) {
            // *视频是否被暂停
            $("video").get(0).play();
            $("video").prop('muted', true); // 静音
            // $('video').get(0).playbackRate = 16 //16倍速 不建议开启,可自行修改倍速
        }

    }

    $(function () {
        setTimeout(function () {
            setInterval(Check, 3000);

        }, 1000);
    });


})();