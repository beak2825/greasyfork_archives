// ==UserScript==
// @name         新华三大讲堂 | 页面多开 | 秒过视频
// @namespace    https://www.yuque.com/h3cie/h3c
// @version      0.2
// @description  屏蔽鼠标移出弹窗(华三华为网络技术交流群:950175630)
// @author       拯救世界的狗子
// @match        *://learning.h3c.com/volbeacon/study/activity/*
// @include      *://learning.h3c.com/volbeacon/study/activity/*
// @grant        none
// @license      End-User License Agreement
// @downloadURL https://update.greasyfork.org/scripts/470544/%E6%96%B0%E5%8D%8E%E4%B8%89%E5%A4%A7%E8%AE%B2%E5%A0%82%20%7C%20%E9%A1%B5%E9%9D%A2%E5%A4%9A%E5%BC%80%20%7C%20%E7%A7%92%E8%BF%87%E8%A7%86%E9%A2%91.user.js
// @updateURL https://update.greasyfork.org/scripts/470544/%E6%96%B0%E5%8D%8E%E4%B8%89%E5%A4%A7%E8%AE%B2%E5%A0%82%20%7C%20%E9%A1%B5%E9%9D%A2%E5%A4%9A%E5%BC%80%20%7C%20%E7%A7%92%E8%BF%87%E8%A7%86%E9%A2%91.meta.js
// ==/UserScript==
window.onload = (function(){
    function ShiPinMiaoGuo(value){
        // 创建div元素
            var ShiPinMiaoGuoDiv = document.createElement("div");
        // 设置div的样式
            ShiPinMiaoGuoDiv.className = "ShiPinMiaoGuo";
            ShiPinMiaoGuoDiv.style.position = "absolute";
            ShiPinMiaoGuoDiv.style.top = "10%";
            ShiPinMiaoGuoDiv.style.left = "85%";
            ShiPinMiaoGuoDiv.style.backgroundColor = "lightblue";
            ShiPinMiaoGuoDiv.style.padding = "10px";
        // 创建按钮
            var ShiPinMiaoGuoButton = document.createElement("button");
            ShiPinMiaoGuoButton.innerText = "视频秒过 | 慎用";
        // 将按钮添加到div中
            ShiPinMiaoGuoDiv.appendChild(ShiPinMiaoGuoButton);
        // 将div添加到页面中
            document.body.appendChild(ShiPinMiaoGuoDiv);
            ShiPinMiaoGuoButton.addEventListener("click", function() {
                // 在按钮被点击时执行的逻辑代码
                console.log("按钮被点击了");
                $("#videoLength").val(9000);
            });
        };
        ShiPinMiaoGuo();
        function stopInterval() {
            isClearInterval = fasle;
            clearInterval(vLooper);
            clearInterval(vChange);
            pausePrompt();
            }
        stopPlayer=null;
})(5000);

