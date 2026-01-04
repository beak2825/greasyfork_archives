
// ==UserScript==
// @name         博思刷课
// @namespace    http://tampermonkey.net/
// @version      0.1.03
// @description  该脚本可完成博思视频刷课。只针对课程内容没有题目的可自动刷课，打开博思平台启动脚本即可食用
// @icon         http://learn.iflysse.com/web/favicon.ico
// @author       chenyi
// @match        *://*/*
// @grant        none
// @require      https://cdn.bootcdn.net/ajax/libs/jquery/3.6.4/jquery.js
// @downloadURL https://update.greasyfork.org/scripts/470707/%E5%8D%9A%E6%80%9D%E5%88%B7%E8%AF%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/470707/%E5%8D%9A%E6%80%9D%E5%88%B7%E8%AF%BE.meta.js
// ==/UserScript==

(function () {
    $().ready(function () {
        console.log("博思脚本已启用")
        setInterval(function () {
            let cancelDiv = document.querySelectorAll(".el-dialog__wrapper")
            let cancelDivIndex = 0;
            for (let index = 0; index < cancelDiv.length; index++) {
                let hasspan = null
                hasspan = cancelDiv[index].querySelector(".dialog-footer button span")
                if (hasspan != null) {
                    let spanValue = hasspan.innerHTML;
                    if (spanValue == "取 消") {
                        cancelDivIndex = index;
                    }
                }
            }
            if (cancelDiv[cancelDivIndex].style.display === "block") {
                let cancelButton = cancelDiv[cancelDivIndex].querySelector(".el-dialog__wrapper .dialog-footer button")
                cancelButton.click();
                console.log("出现倒数30秒，并且点击了")
            }
            let elements = document.getElementsByTagName("video");
            let myDiv = document.querySelector(".btn-left");
            let butAll = myDiv.querySelectorAll("button");
            if (butAll.length == 2) {
                let nextButton = document.querySelector('.el-footer .btn-left button:nth-child(2)');
                if (elements && elements.length > 0) {
                    let video = document.querySelector('.prism-player video');
                    let totalTime = video.duration
                    let currentTime = video.currentTime
                    if (currentTime >= totalTime - 1) {
                        nextButton.click();
                    }
                } else {
                    setTimeout(function () {
                        nextButton.click();
                    }, 3000)
                }
            }
        }, 3000)
    })
})();