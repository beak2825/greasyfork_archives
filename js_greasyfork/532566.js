// ==UserScript==
// @name         高校邦刷课
// @namespace    https://github.com/Free-LZJ/free-scripts
// @version      2.3
// @description  厦理工高校邦刷课脚本
// @author       LZJ
// @match        *://*.class.gaoxiaobang.com/class/*
// @run-at       document-idle
// @license      MIT
// @icon         https://www.xmut.vip/image/tx.png
// @grant        none    
// @downloadURL https://update.greasyfork.org/scripts/532566/%E9%AB%98%E6%A0%A1%E9%82%A6%E5%88%B7%E8%AF%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/532566/%E9%AB%98%E6%A0%A1%E9%82%A6%E5%88%B7%E8%AF%BE.meta.js
// ==/UserScript==

(function () {
    'use strict';
    setInterval(function () {
        const next = document.getElementsByClassName("chapter-next gxb-cur-point")[0];
        try {
            // 跳过小测
            if (document.getElementsByClassName("quiz-item")[0]) {
                next.click();
            }
            // 跳过课件
            if (document.getElementsByClassName("gxb-courseware-view-content")[0]) {
                next.click();
            }
            // 讨论
            if (document.getElementsByClassName("gxb-icon-teacher")[0]) {
                const a = document.getElementById("ueditor_0").contentWindow;
                a.document.getElementsByTagName("p")[0].innerText = document.getElementsByClassName("reply-content")[0].innerText;
                setTimeout(function () {
                    document.getElementsByClassName("gxb-btn-pri gxb-btn-nav post-submit")[0].click();
                }, 3000);
                setTimeout(function () {
                    next.click();
                }, 5000);
            }
        } catch (error) {
            console.log(error + "可直接跳过");
        }
        // 视频
        document.getElementsByTagName('video')[0].play();
        // playbackRate 控制播放速率会被检查到
        // 可以配合插件 --> HTML5 Video speed controller, 开启2倍数不会被检查到
        //document.querySelector('video').playbackRate = 1.0;
        var videoPercent = document.getElementsByClassName("video-percent")[0].innerText;
        if (videoPercent === 100) {
            next.click()
        }
    }, 1000)


})();
