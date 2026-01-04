// ==UserScript==
// @name 新华三大讲堂 | 页面多开 | 秒过视频
// @namespace 1xx
// @version 1.0
// @description 屏蔽鼠标移出弹窗(计算机正能量技术交流群:753776270)
// @author Q
// @match *://learning.h3c.com/volbeacon/study/activity/*
// @include *://learning.h3c.com/volbeacon/study/activity/*
// @grant none
// @license End-User License Agreement
// @downloadURL https://update.greasyfork.org/scripts/519238/%E6%96%B0%E5%8D%8E%E4%B8%89%E5%A4%A7%E8%AE%B2%E5%A0%82%20%7C%20%E9%A1%B5%E9%9D%A2%E5%A4%9A%E5%BC%80%20%7C%20%E7%A7%92%E8%BF%87%E8%A7%86%E9%A2%91.user.js
// @updateURL https://update.greasyfork.org/scripts/519238/%E6%96%B0%E5%8D%8E%E4%B8%89%E5%A4%A7%E8%AE%B2%E5%A0%82%20%7C%20%E9%A1%B5%E9%9D%A2%E5%A4%9A%E5%BC%80%20%7C%20%E7%A7%92%E8%BF%87%E8%A7%86%E9%A2%91.meta.js
// ==/UserScript==

window.onload = (function() {
    alert("插件使用说明：\n点击秒过后，刷新页面即可完成学习，未生效多试几次，交流群：753776270")
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
        clearInterval(vChange);
        pausePrompt();
        console.log("定时器和提示已停止");
    }

    createVideoSkipButton();
    stopIntervals();
})();
