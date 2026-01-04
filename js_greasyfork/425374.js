// ==UserScript==
// @name         高校邦脚本
// @namespace    https://github.com/yuanYue-byte
// @version      0.5
// @description  高校邦刷课脚本
// @author       yuanYue
// @match        *://*.class.gaoxiaobang.com/class/*
// @run-at       document-idle
// @license      MIT
// @icon         https://imooc.gaoxiaobang.com/image/imooc/imooc-logo.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/425374/%E9%AB%98%E6%A0%A1%E9%82%A6%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/425374/%E9%AB%98%E6%A0%A1%E9%82%A6%E8%84%9A%E6%9C%AC.meta.js
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
                //如不需要自动回答请注释或删除(注释)第 25 26 行代码
                var answer = document.getElementsByClassName("reply-content")[0].innerText;
                a.document.getElementsByTagName("p")[0].innerText = answer;
                setTimeout(function () { document.getElementsByClassName("gxb-btn-pri gxb-btn-nav post-submit")[0].click(); }, 3000);//延迟3秒后自动提交
                setTimeout(function () { next.click(); }, 5000);//延迟5秒后自动点击下一章节
            }
        } catch (error) { console.log(error + "此页面为视频页面无需提交答案"); }
        document.getElementsByTagName('video')[0].play();
        var videoPercent = document.getElementsByClassName("video-percent")[0].innerText;
        if (videoPercent == 100) {
            next.click()
        }
    }, 1000)


})();