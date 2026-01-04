// ==UserScript==
// @name         厦理工高校邦
// @namespace    https://www.xmut.vip
// @version      1.21
// @description  厦理工高校邦刷课脚本
// @author       YY
// @match        *://*.class.gaoxiaobang.com/class/*
// @run-at       document-idle
// @license      MIT
// @icon         https://www.xmut.vip/image/tx.png
// @grant        none    
// @downloadURL https://update.greasyfork.org/scripts/451805/%E5%8E%A6%E7%90%86%E5%B7%A5%E9%AB%98%E6%A0%A1%E9%82%A6.user.js
// @updateURL https://update.greasyfork.org/scripts/451805/%E5%8E%A6%E7%90%86%E5%B7%A5%E9%AB%98%E6%A0%A1%E9%82%A6.meta.js
// ==/UserScript==

(function () {
    'use strict';
    setInterval(function () {
        var next = document.getElementsByClassName("chapter-next gxb-cur-point")[0];
        try {
            if (document.getElementsByClassName("quiz-item")[0]) {
                next.click();
            }
            if (document.getElementsByClassName("gxb-icon-teacher")[0]) {
                var a = document.getElementById("ueditor_0").contentWindow;
                var answer = document.getElementsByClassName("reply-content")[0].innerText;
                a.document.getElementsByTagName("p")[0].innerText = answer;
                setTimeout(function () { document.getElementsByClassName("gxb-btn-pri gxb-btn-nav post-submit")[0].click(); }, 3000);
                setTimeout(function () { next.click(); }, 5000);
            }
        } catch (error) { console.log(error + "可直接跳过"); }
        document.getElementsByTagName('video')[0].play();
        document.querySelector('video').playbackRate = 1.0;//此处填倍数，默认一倍
        var videoPercent = document.getElementsByClassName("video-percent")[0].innerText;
        if (videoPercent == 100) {
            next.click()
        }
    }, 1000)


})();