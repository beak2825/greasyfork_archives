// ==UserScript==
// @name         click_yyy
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  hhh
// @author       You
// @match        https://bgi.zhixueyun.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=zhixueyun.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/450195/click_yyy.user.js
// @updateURL https://update.greasyfork.org/scripts/450195/click_yyy.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log("yourui")
    //每5秒执行一次，若按钮状态为可用，进行点击
    var timer=setInterval(function() {
        console.log("try click")
        var path = `#content > div.app-content > div.content.drizzle-content > div > div.top.new-course-top > div > div.player-wrapper.new-play-wrapper.play-area-padding.player-section-video > div > div.player-content.relative.new-play-content.new-play-content-warp > div.page-alert > div > div > div`
        var data = document.querySelector(path)
        if (data != null && data.id != null) {
            console.log(data.id)
            document.getElementById(data.id).click();
        }
    }, 5000);

    var timer2=setInterval(function() {
        console.log("try begin")
        document.querySelector("button.vjs-big-play-button").click()
    }, 5000);

    setTimeout(function() {
        var section = document.querySelector("#content > div.app-content > div.content.drizzle-content > div > div > div > div > div.page-main-wrapper.container > div.subject-detail-main.page-main > section:nth-child(1) > div > section")
        var list = section.getElementsByClassName("item current-hover")
        var i = 0;
        function loop() {
            console.log(i, list.length)
            if (i < list.length) {
                var element = list[i];
                var id = element.id;
                var title = element.querySelector('.inline-block.name-des.default-skin.text-overflow').title;
                var state = element.querySelector('.small.inline-block').textContent;

                if (state == "开始学习" || state == "继续学习") {
                    document.getElementById(id).click();
                    console.log(id, title, state);

                    i++; // Move to the next element
                    setTimeout(loop, 30 * 60 * 1000); // Wait for 10 minutes before the next click
                } else {
                    i++; // Move to the next element
                    loop(); // Immediate next click if state is not "开始学习" or "继续学习"
                }
            }
        }
        setTimeout(loop, 5000); // Initial delay before the first click
    }, 5000);
})();