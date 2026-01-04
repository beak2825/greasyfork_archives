// ==UserScript==
// @name         鑫AI学习辅助3.1
// @namespace    http://tampermonkey.net/
// @version      3.2
// @description  鑫AI专注办公应用（仅限内部测试）
// @author       鑫AI
// @match        *://*.yxlearnng.com/*
// @icon         https://img2.imgtp.com/2024/05/13/Qr015adk.png
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/494875/%E9%91%ABAI%E5%AD%A6%E4%B9%A0%E8%BE%85%E5%8A%A931.user.js
// @updateURL https://update.greasyfork.org/scripts/494875/%E9%91%ABAI%E5%AD%A6%E4%B9%A0%E8%BE%85%E5%8A%A931.meta.js
// ==/UserScript==

var study_css = ".shi_study_btn{outline:0;border:0;position:fixed;top:0px;left:0px;border-radius:5px;cursor:pointer;color:#d90609;font-weight:bold;text-align:center;box-shadow:0 0 5px #666777}";
GM_addStyle(study_css);

var startButton = document.createElement("div");
startButton.setAttribute("id", "startButton");
startButton.innerText = "鑫AI:点击开始自动学习";
startButton.className = "shi_study_btn";
$("body").append(startButton);

let my_n = 0;
let myTimer;

(function() {
    'use strict';

    startButton.addEventListener('click', function() {
        if (my_n === 0) {
            my_n = 1;
            startButton.innerText = "鑫AI:自动学习中";
            myTimer = setInterval(lean, 3000);
        } else if (my_n === 1) {
            my_n = 0;
            startButton.innerText = "鑫AI:点击开始自动学习";
            if (myTimer) {
                clearInterval(myTimer);
            }
        }
    });

    function lean() {
        // 保留自动播放和跳过视频的逻辑
        let playerH5 = document.querySelector("#ccJumpOver");
        if (playerH5) {
            console.log("跳过");
            playerH5.click();
        } else {
            let a = document.querySelector(".pv-video");
            if (a && a.paused) {
                a.volume = 0;
                console.log("继续播放");
                a.play();
            }
            let b = document.querySelector("video[webkit-playsinline]");
            if (b && b.paused) {
                b.volume = 0;
                console.log("继续播放");
                b.play();
            }
            let dangqian = document.querySelector(".videoLi.active");
            if (dangqian) {
                let dianji = document.querySelector("#replaybtn");
                if (dianji && dianji.style.display === "block") {
                    console.log("点击播放");
                    dianji.click();
                }
            }
        }
    }
})();