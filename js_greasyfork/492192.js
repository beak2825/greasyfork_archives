// ==UserScript==
// @name         再教育公开课视频自动答题和进度完成后自动播放下一个
// @namespace    http://tampermonkey.net/
// @version      v1.0.9
// @description  本脚本仅供学习和交流使用，不得用于任何违反法律法规或侵犯他人权益的行为。用户在使用本脚本时应自行承担责任，并遵守当地法律法规。若因使用本脚本导致任何违法违规行为，与本作者无关。
// @author       You
// @match        https://ggfw.hrss.gd.gov.cn/zxpx/auc/play/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=gd.gov.cn
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/492192/%E5%86%8D%E6%95%99%E8%82%B2%E5%85%AC%E5%BC%80%E8%AF%BE%E8%A7%86%E9%A2%91%E8%87%AA%E5%8A%A8%E7%AD%94%E9%A2%98%E5%92%8C%E8%BF%9B%E5%BA%A6%E5%AE%8C%E6%88%90%E5%90%8E%E8%87%AA%E5%8A%A8%E6%92%AD%E6%94%BE%E4%B8%8B%E4%B8%80%E4%B8%AA.user.js
// @updateURL https://update.greasyfork.org/scripts/492192/%E5%86%8D%E6%95%99%E8%82%B2%E5%85%AC%E5%BC%80%E8%AF%BE%E8%A7%86%E9%A2%91%E8%87%AA%E5%8A%A8%E7%AD%94%E9%A2%98%E5%92%8C%E8%BF%9B%E5%BA%A6%E5%AE%8C%E6%88%90%E5%90%8E%E8%87%AA%E5%8A%A8%E6%92%AD%E6%94%BE%E4%B8%8B%E4%B8%80%E4%B8%AA.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...


    // 是否在处理事务中，true 则跳过一个定时区间
    let isHandling = false

    // 目前选择的单选框值
    let curRadioValue = '1'

    // 定时器
    let interval

    // 是否本视频已经答题成功
    let answeredSuccessfully = false

    function checkVideoStatus() {
        // 检查视频是否已经开始播放
        var video = document.querySelector("video");
        if (video && video.paused) {
            //静音
            p.tag.muted = true;
            if (p.paused()) {
                p.play()
            }
            console.log("视频已开始播放。");
        }
    }

    function checkVideoTimeAndUpdate() {
        const learnPercentEle = document.getElementsByClassName('learnpercent')
        if(learnPercentEle[0].innerText.includes('已完成')) {
            console.log('本小结视频已经学习完成')
            // 查找所有<span class="content-unstart">未开始</span>标签
            var unstartTags = document.getElementsByClassName("content-unstart");

            // 如果存在未开始标签，点击第一个标签，并打印出过程
            if (unstartTags.length > 0) {
                var firstUnstartTag = unstartTags[0];

                isHandling = true

                firstUnstartTag.click();
                console.log("已点击第一个未开始标签。");
                // 给个延迟时间，让新的视频加载
                setTimeout(() => {
                    // 开始新视频直接重新加载，避免有干扰
                    clearInterval(interval);
                    document.location.reload()
                }, 6000)

            } else {
                console.log("未找到未开始标签。可能学习已经全部完成，清除定时器");
                clearInterval(interval);
            }
        } else {
            console.log("正在学习的内容尚未达到100。");
        }
    }

    // 定义函数以点击单选按钮和确认按钮
    function clickRadioButton(value) {
        var radioButton = document.querySelector('input[type="radio"][name="panduan"][value="' + value + '"]');
        if (radioButton) {
            radioButton.click();
            console.log("已点击单选按钮，值为：" + value);
        } else {
            console.error("找不到指定的单选按钮。");
        }
    }

    function clickConfirmButton() {
        var confirmButton = document.querySelector('.reply-sub'); // 这里是主弹窗的确认按钮
        if (confirmButton) {
            confirmButton.click();
            console.log("已点击主弹窗确认按钮。");
        } else {
            console.error("找不到主弹窗确认按钮。");
        }
    }

    function clickConfirmButtonInPopup() {
        var confirmButtonInPopup = document.querySelector('.l-btn-text'); // 这里是二层弹窗的确认按钮
        if (confirmButtonInPopup) {
            confirmButtonInPopup.click();
            console.log("已点击二层弹窗确认按钮。");
        } else {
            console.error("找不到二层弹窗的确认按钮。");
        }
    }

    // 定义一个方法来获取指定类名元素的文本内容
    function getSecondPopupText() {
        // 获取包含答案错误信息的元素
        var messageElement = document.querySelector('.messager-body.panel-body.panel-body-noborder.window-body');

        // 如果找到了包含答案错误信息的元素
        if (messageElement) {
            // 获取答案文本内容
            var errorMessage = messageElement.innerText.trim();
            console.log("二级弹窗信息为：", errorMessage);
            return errorMessage
        } else {
            console.error("找不到包含答案错误信息的元素。");
            return null
        }
    }



    // 定义一个函数以检测弹窗是否出现，如果出现则点击单选按钮和确认按钮
    function checkPopupStatusAndClick() {
        // 二层弹窗，在答题正确、错误之后出现
        var anotherPopup = document.querySelector('.panel.window.messager-window'); // 另一个弹窗
        if (anotherPopup) {
            console.warn('二层弹窗出现')
            isHandling = true
            const message = getSecondPopupText()

            if(message.includes('检测到您当前网络不稳定，现学习计时已停止')) {
                console.log('被检测啦，收皮啦')
                clearInterval(interval);
                return
            }

            if (message.includes('答案正确')) {
                // 每个视频应该只会有一条问题，答案正确的话就设置答题完成，之后定时器就不会再检测弹窗
                console.log("已经答题成功。");
                answeredSuccessfully = true

                setTimeout(() => {
                    // 答题成功后隔几秒上答题上传到服务器，之后刷新页面，让dom里的弹窗恢复，方便有第二个问题的出现无法检测
                    document.location.reload()
                }, 6000)
            } else {
                // 如果弹窗文本不包含答案正确，则设置单选按钮值为另一个按钮
                curRadioValue = curRadioValue === '1' ? '0' : '1'
                console.log('重新设置单选框的值')
            }

            // 点击确认按钮
            clickConfirmButtonInPopup();
            // 设置延迟，让网站接口检验答案
            setTimeout(() => isHandling = false, 5000)
            return;
        }

        // 答题的弹窗
        var mainPopup = document.querySelector('.panel.window'); // 主弹窗
        if (mainPopup) {
            isHandling = true
            console.warn('答题的弹窗出现')
            // 如果主弹窗出现，则选择一个单选按钮并点击确认按钮
            clickRadioButton(curRadioValue); // 假设第一个单选按钮的值是1
            clickConfirmButton();
            // 设置延迟，让网站接口检验答案
            setTimeout(() => isHandling = false, 5000)
        }
    }

    // 每隔一段时间检测是否有弹窗出现
    interval = setInterval(function () {
        if (isHandling) {
            console.log('正在处理事务，跳过这次定时任务')
            return
        }
        if(!answeredSuccessfully) {
            console.log("正在检测是否有弹窗出现...");
            checkPopupStatusAndClick();
        }
        checkVideoTimeAndUpdate();
        checkVideoStatus();
    }, 5000); // 每5秒检测一次

})();