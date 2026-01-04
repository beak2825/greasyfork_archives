// ==UserScript==
// @name         知能行脚本
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  还在更新中，致力于更丝滑
// @author       Lucy
// @match        https://app.bestzixue.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/500808/%E7%9F%A5%E8%83%BD%E8%A1%8C%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/500808/%E7%9F%A5%E8%83%BD%E8%A1%8C%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';
    document.body.addEventListener("keydown",(event)=>{
        var continueButton = document.getElementById("continueButton");
        var YuanQiManManButton = document.querySelector('#root > div > div > div > div > div:nth-child(2) > div > div > div._1GH8uYjRPopnGvvZ8xKt-g > button');
        //休息一下
        var restButton = document.querySelector('#root > div > div > div > div > div:nth-child(2) > div > div > div._1GH8uYjRPopnGvvZ8xKt-g > div > div.col-lg-2.col-md-2.col-sm-2.col-2 > button');
        var submitAnswerButton = document.getElementById("checkAnswerButton");//提交答案
        var tryAgainButton = document.getElementById("tryAgainButton");
        //首页的切换专题（有图标）按钮
        var switchButton = document.querySelector('#bottomButton > div > div > button.MuiButtonBase-root.MuiButton-root.MuiButton-outlined.jss95.jss112.jss102.jss113.MuiButtonGroup-grouped.MuiButtonGroup-groupedHorizontal.MuiButtonGroup-groupedOutlined.MuiButtonGroup-groupedOutlinedHorizontal.MuiButtonGroup-groupedOutlined');
        //专题的具体按钮
        var topicButton = document.querySelector('#simple-menu > div.MuiPaper-root.MuiMenu-paper.MuiPopover-paper.MuiPaper-elevation8.MuiPaper-rounded > ul > li:nth-child(15)');
        var transButton = document.getElementsByClassName("btn-danger");//切换专题时出现的“切换”按钮
        var cancelButton = document.querySelectorAll('button.btn.btn-light'); //取消
        //下一个突破口or继续写题
        var nextButton = document.querySelector('#bottomButton > div > div > button.MuiButtonBase-root.MuiButton-root.MuiButton-outlined.jss95.jss111.jss97.jss113.MuiButtonGroup-grouped.MuiButtonGroup-groupedHorizontal.MuiButtonGroup-groupedOutlined.MuiButtonGroup-groupedOutlinedHorizontal.MuiButtonGroup-groupedOutlined');
        var next2Button = document.querySelector('#bottomButton > div > div > button.MuiButtonBase-root.MuiButton-root.MuiButton-outlined.jss88.jss104.jss90.jss106.MuiButtonGroup-grouped.MuiButtonGroup-groupedHorizontal.MuiButtonGroup-groupedOutlined.MuiButtonGroup-groupedOutlinedHorizontal.MuiButtonGroup-groupedOutlined');
        var nextJinRuCeShiButton = document.querySelector('#bottomButton > div > div > button.MuiButtonBase-root.MuiButton-root.MuiButton-outlined.jss95.undefined.jss97.jss113.MuiButtonGroup-grouped.MuiButtonGroup-groupedHorizontal.MuiButtonGroup-groupedOutlined.MuiButtonGroup-groupedOutlinedHorizontal.MuiButtonGroup-groupedOutlined');
        var nextJIXUButton = document.querySelector('#root > div > div > div > div > div:nth-child(2) > div > div > div._1GH8uYjRPopnGvvZ8xKt-g > div > div.col > div:nth-child(2) > button');
        //答题界面时的退出
        var backButton = document.querySelector('#root > div > div > div > div > div:nth-child(2) > div > div:nth-child(1) > div._3WnwfRdkMe1S4rkAtDjhhh > div > div:nth-child(4) > div > button');
        //关闭（有×符号的按钮）
        //var closeButton = document.querySelector('#classic-modal-slide-title > button');
        if (event.keyCode == 13) { // enter
            if (tryAgainButton) {
                console.log("tryAgain");
                tryAgainButton.click();
            }
            else if (submitAnswerButton) {
                console.log("submit");
                submitAnswerButton.click();
            }
            else if (continueButton) {
                console.log("continue");
                continueButton.click();
            }
            else if (nextJIXUButton) {
                nextJIXUButton.click();
            }
            else if (nextButton) {
                nextButton.click();
            }
            else if (next2Button) {
                next2Button.click();
            }
            else if (nextJinRuCeShiButton) {
                nextJinRuCeShiButton.click();
            }
            else if (YuanQiManManButton) {
                YuanQiManManButton.click();
            }

        } else if (event.keyCode == 37) { // ←

            if (restButton) {
                restButton.click();
            }
        } else if (event.keyCode == 39) { // →
            if (switchButton) {
                switchButton.click();
            }

        } else if (event.keyCode == 32) { // 空格
            if (transButton) {
                for(let i = 0; i < transButton.length; i++) {
                    transButton[i].click();
                }
            }
            else if (topicButton) {
                topicButton.click();
            }
            else if (backButton) {
                backButton.click(); // 执行按钮点击操作
            }

        } else if (event.keyCode == 75) { // k
            if (cancelButton) {
                cancelButton.forEach(button => {
                    if (button.textContent.trim() === '取消') {
                        button.click();
                    }
                });
            }

        }
    });

})();
