// ==UserScript==
// @name         自动点击继续学习
// @namespace    http://tampermonkey.net/
// @version      0.9
// @description  当出现继续学习提示时，自动点击确定按钮
// @author       You
// @match        https://cws.edu-edu.com/*
// @grant        none
// @license      MTI
// @downloadURL https://update.greasyfork.org/scripts/532602/%E8%87%AA%E5%8A%A8%E7%82%B9%E5%87%BB%E7%BB%A7%E7%BB%AD%E5%AD%A6%E4%B9%A0.user.js
// @updateURL https://update.greasyfork.org/scripts/532602/%E8%87%AA%E5%8A%A8%E7%82%B9%E5%87%BB%E7%BB%A7%E7%BB%AD%E5%AD%A6%E4%B9%A0.meta.js
// ==/UserScript==

(function (){
    // 定义一个函数来检查并点击确定按钮
    function checkAndClick() {
        // 找到通知按钮
        const confirmDialog = document.querySelector('div.h5-alert-modal.v-transfer-dom')
        const warpDiv = confirmDialog.querySelector('div.ivu-modal-wrap')
        // 显示确定面板后，关闭
        if (!warpDiv.classList.contains('ivu-modal-hidden')) {
            // 查找确定按钮
            const confirmButton = confirmDialog.querySelector('button.btn.ivu-btn.ivu-btn-primary');
            if (confirmButton) {
                confirmButton.click();
            }
        }
    }

    // 检查算数验证
    function checkQuestion() {
        // 弹出面板开始答题
        const modal = document.querySelector('div.ivu-modal-wrap');
        if (modal.classList.contains('ivu-modal-hidden')) {
            return;
        }

        const question = document.querySelector('div.ivu-modal-header-inner');
        // 判断是否有答题
        const questionTitle = question.innerText;
        if (questionTitle == '学习过程确认') {
            const questionInfo = document.querySelector('div.questionBox');
            if (questionInfo) {
                // 获取题目 7 - 3 = ?
                const questText = questionInfo.innerText;
                // 计算答案
                const result = calc(questText);
                if (result == null) {
                    return;
                }

                // 获取确定按钮
                const btn = questionInfo.parentElement.querySelector('button.ivu-btn');

                // 获取答案选项
                const questBox = document.querySelector('div.ivu-radio-group');
                if (questBox) {
                    const checks = questBox.children;
                    for (let i = 0; i < checks.length; i++){
                        const checkText = checks[i].innerText;
                        const checkNum = parseInt(checkText, 10);
                        // 碰到正确答案
                        if (result == checkNum) {
                            checks[i].click();
                            btn.click();
                        }
                    }
                }
            }
        }
    }

    // 计算字符串的算式
    function calc(mathStr) {
        let result = null;
        const match = mathStr.match(/^(\d+)\s*([+\-*/])\s*(\d+)/);
        if (match) {
            const num1 = parseInt(match[1], 10);
            const op = match[2];
            const num2 = parseInt(match[3], 10);

            switch (op) {
                case '+':
                    result = num1 + num2;
                    break;
                case '-':
                    result = num1 - num2;
                    break;
                case '*':
                    result = num1 * num2;
                    break;
                case '/':
                    result = num1 / num2;
                    break;
            }
        }
        return parseInt(result, 10);
    }

    // 播放下一个视频
    function playNext() {
        // 获取播放列表
        const playlist = document.querySelectorAll('div.video-box-left div.ivu-tree ul.ivu-tree-children');
        for (let i = 0; i < playlist.length; i++) {
            // 获取视频的播放进度
            let v = playlist[i].querySelector('span.videoRatio').innerText;
            if (v != '/ 已学100%') {
                let l = playlist[i].querySelector('span.render-content__video');
                l.click();
                return;
            }
        }
        console.log('视频播放完了');
    }

    function playVideo() {
        // 当视频放完后，自动进行下一个
        const video = document.querySelector('div#J_prismPlayer video');
        if (video) {
            if (video.paused && !video.ended) {
                console.log('播放视频');
                video.play();
                video.muted = true;
            }

            if (video.paused && video.ended) {
                console.log('播放下一个视频');
                playNext();
            }
        }


    }

    console.log('开始监控网页');
    // 每隔一段时间检查一次
    const intervalId = setInterval(checkAndClick, 1000);
    const intervalId2 = setInterval(checkQuestion, 1000);
    const intervalId3 = setInterval(playVideo, 5000);

})();


