// ==UserScript==
// @name         汇贤学堂自动挂时间
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  汇贤学堂自动挂时间，每10分钟刷新一次网页
// @author       You
// @match        https://appbtyesec08522.pc.xiaoe-tech.com/live_pc/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=xiaoe-tech.com
// @grant        none
// @license  MIT
// @downloadURL https://update.greasyfork.org/scripts/443357/%E6%B1%87%E8%B4%A4%E5%AD%A6%E5%A0%82%E8%87%AA%E5%8A%A8%E6%8C%82%E6%97%B6%E9%97%B4.user.js
// @updateURL https://update.greasyfork.org/scripts/443357/%E6%B1%87%E8%B4%A4%E5%AD%A6%E5%A0%82%E8%87%AA%E5%8A%A8%E6%8C%82%E6%97%B6%E9%97%B4.meta.js
// ==/UserScript==

(async function() {
    function sleep (time) {
        //console.log("sleep");
        return new Promise((resolve) => setTimeout(resolve, time));

    }
    'use strict';
    var n = 0,j=0;
    setInterval(function () {
        var video = document.getElementById("vid1_html5_api")
        if (video.paused) {
            if (video.currentTime >= video.duration) {
                var next = document.querySelector(".next_button___YGZWZ");
                next.click();
                n++
                console.log('点击了'+n+'次下一节')

            } else {
                var btn = document.querySelector(".ant-btn-primary");
                if (btn) {
                    btn.click();
                    j++
                    console.log('点击了'+j+'次确定')

                } else {
                    video.play();
                    console.log('开始了')

                }
            }

        }
    }, 5000)
    await sleep(600000);
    location.reload();
    // Your code here...
})();