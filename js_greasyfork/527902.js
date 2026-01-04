// ==UserScript==
// @name 新华三大讲堂 | 秒过 | 屏蔽弹窗
// @version 0.0.1
// @description 屏蔽鼠标移出弹窗
// @author Clackz、皮皮仔&拯救世界的狗子(原)
// @match *://learning.h3c.com/volbeacon/study/activity/*
// @include *://learning.h3c.com/volbeacon/study/activity/*
// @grant none
// @license MIT
// @namespace https://greasyfork.org/users/411879
// @downloadURL https://update.greasyfork.org/scripts/527902/%E6%96%B0%E5%8D%8E%E4%B8%89%E5%A4%A7%E8%AE%B2%E5%A0%82%20%7C%20%E7%A7%92%E8%BF%87%20%7C%20%E5%B1%8F%E8%94%BD%E5%BC%B9%E7%AA%97.user.js
// @updateURL https://update.greasyfork.org/scripts/527902/%E6%96%B0%E5%8D%8E%E4%B8%89%E5%A4%A7%E8%AE%B2%E5%A0%82%20%7C%20%E7%A7%92%E8%BF%87%20%7C%20%E5%B1%8F%E8%94%BD%E5%BC%B9%E7%AA%97.meta.js
// ==/UserScript==

window.onload = (function() {
    function createVideoSkipButton() {
        var buttonDiv = document.createElement("div");
        buttonDiv.className = "video-skip-button";
        buttonDiv.style.position = "absolute";
        buttonDiv.style.top = "2%";
        buttonDiv.style.left = "85%";
        buttonDiv.style.backgroundColor = "lightblue";
        buttonDiv.style.padding = "10px";

        var skipButton = document.createElement("button");
        skipButton.innerText = "视频秒过 | 慎用";
        buttonDiv.appendChild(skipButton);
        document.body.appendChild(buttonDiv);

        skipButton.addEventListener("click", function() {
            var videoLengthElement = document.getElementById("videoLength");
            if (videoLengthElement) {
                videoLengthElement.value = 9000;
                console.log("视频长度已设置为9000秒");
            } else {
                console.error("未找到视频长度元素");
            }
        });
    }

    function stopIntervals() {
        clearInterval(vLooper);
        clearInterval(tCourse);
        console.log("定时器已停止");
    }

    function preventPauseOnBlur() {
        var originalHasFocus = document.hasFocus;
        document.hasFocus = function() {
            return true;
        };
        console.log("已屏蔽鼠标移出弹窗");
    }

    createVideoSkipButton();
    stopIntervals();
    preventPauseOnBlur();
})();