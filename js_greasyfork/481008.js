// ==UserScript==
// @name         郑州轻工业大学在线学习平台自动选择正确答案
// @version      1.0
// @description  需要先提交一次(平台作业默认能提交两次) 获取到正确答案后会自动选择正确答案 需手动再次提交
// @author       xiaoding
// @license      MIT
// @match        https://zzuli.hnscen.cn/classroom/myClassroom/*
// @require      https://apps.bdimg.com/libs/jquery/2.1.4/jquery.min.js
// @grant        none


// @namespace https://greasyfork.org/users/1225149
// @downloadURL https://update.greasyfork.org/scripts/481008/%E9%83%91%E5%B7%9E%E8%BD%BB%E5%B7%A5%E4%B8%9A%E5%A4%A7%E5%AD%A6%E5%9C%A8%E7%BA%BF%E5%AD%A6%E4%B9%A0%E5%B9%B3%E5%8F%B0%E8%87%AA%E5%8A%A8%E9%80%89%E6%8B%A9%E6%AD%A3%E7%A1%AE%E7%AD%94%E6%A1%88.user.js
// @updateURL https://update.greasyfork.org/scripts/481008/%E9%83%91%E5%B7%9E%E8%BD%BB%E5%B7%A5%E4%B8%9A%E5%A4%A7%E5%AD%A6%E5%9C%A8%E7%BA%BF%E5%AD%A6%E4%B9%A0%E5%B9%B3%E5%8F%B0%E8%87%AA%E5%8A%A8%E9%80%89%E6%8B%A9%E6%AD%A3%E7%A1%AE%E7%AD%94%E6%A1%88.meta.js
// ==/UserScript==

var scriptExecuted = false;
// 在主页面中添加事件监听器
(function () {
    'use strict';

    // 定义脚本函数
    function runScript() {
        var scriptExecuted = false;

        // 检查脚本是否已执行
        if (scriptExecuted) {
            return;
        }

        // 获取提交次数
        var submissionCount = parseInt($("div[data-v-2d1d61ff] span[data-v-2d1d61ff].ml_2").next().text());

        // 如果提交次数不为1，则不执行代码
        if (submissionCount !== 1) {
            return;
        }

        // 设置脚本已执行标志
        scriptExecuted = true;

        setTimeout(function () {
            var singleChoiceQuestions = $("div[data-v-2d1d61ff].mt_2:has(.el-radio-group)"); // 根据题型选择相应的题目容器
            singleChoiceQuestions.each(function () {
                var questionType = $(this).find(".titleType").text(); // 获取题目类型
                if (questionType.includes("单选")) { // 判断题目类型是否为单选题
                    var question = $(this).find(".titleType").text(); // 获取题目
                    var options = $(this).find(".el-radio__label").map(function () { // 获取选项
                        return $(this).text().trim();
                    }).get();
                    var answer = $(this).find(".mr_2").next().text().trim(); // 获取答案
                    console.log("题目：" + question);
                    console.log("选项：" + options);
                    console.log("答案：" + answer);
                    // 模拟点击答案
                    var answerIndex =-1;
                    switch (answer) {
                        case "A":
                            answerIndex = 0;
                            break;
                        case "B":
                            answerIndex = 1;
                            break;
                        case "C":
                            answerIndex = 2;
                            break;
                        case "D":
                            answerIndex = 3;
                            break;
                        case "E":
                            answerIndex = 4;
                            break;
                        case "F":
                            answerIndex = 5;
                            break;
                        default:
                            answerIndex = -1;
                    }
                    if (answerIndex !== -1) {
                        var answerElement = $(this).find(".el-radio").eq(answerIndex);
                        answerElement.click();
                    }
                }
            });

            var multiChoiceQuestions = $("div[data-v-2d1d61ff].mt_2:has(.el-checkbox-group)"); // 根据题型选择相应的题目容器
            multiChoiceQuestions.each(function () {
                var questionType = $(this).find(".titleType").text(); // 获取题目类型
                if (questionType.includes("多选")) { // 判断题目类型是否为多选题
                    var question = $(this).find(".titleType").text(); // 获取题目
                    var options = $(this).find(".el-checkbox__label").map(function () { // 获取选项
                        return $(this).text().trim();
                    }).get();
                    var answer = $(this).find(".mr_2").next().text().trim(); // 获取答案
                    console.log("题目：" + question);
                    console.log("选项：" + options);
                    console.log("答案：" + answer);
                    // 模拟点击答案
                    var answerIndexes = [];
                    for (var i = 0; i < answer.length; i++) {
                        switch (answer[i]) {
                            case "A":
                                answerIndexes.push(0);
                                break;
                            case "B":
                                answerIndexes.push(1);
                                break;
                            case "C":
                                answerIndexes.push(2);
                                break;
                            case "D":
                                answerIndexes.push(3);
                                break;
                            case "E":
                                answerIndexes.push(4);
                                break;
                            case "F":
                                answerIndexes.push(5);
                                break;
                        }
                    }
                    var answerElements = $(this).find(".el-checkbox");
                    if (answerIndexes.length > 0) {
                        answerIndexes.forEach(function (index) {
                            setTimeout(function () {
                                answerElements.eq(index).click();
                            }, 1500); // 添加1秒的等待时间
                        });
                    }
                }
            });
            // 判断题
            var trueFalseQuestions = $("div[data-v-2d1d61ff].mt_2:has(.el-radio-group)"); // 根据题型选择相应的题目容器
            trueFalseQuestions.each(function () {
                var questionType = $(this).find(".titleType").text(); // 获取题目类型
                if (questionType.includes("判断")) { // 判断题目类型是否为判断题
                    var question = $(this).find(".titleType").text(); // 获取题目
                    var answer = $(this).find(".mr_2").next().text().trim(); // 获取答案
                    console.log("题目：" + question);
                    console.log("答案：" + answer);

                    // 模拟点击答案
                    var answerElement = $(this).find(".el-radio").eq(answer === "正确" ? 0 : 1);
                    answerElement.click();
                }
            });
        }, 2000); // 3秒的延迟
    }

    // 在主页面中添加事件监听器
    runScript();

    // 创建MutationObserver实例，用于监视子页面的DOM变化
    var observer = new MutationObserver(function (mutationsList, observer) {
        // 判断是否是子页面加载完成的变化
        if (mutationsList.some(function (mutation) {
            return mutation.type === 'childList' && mutation.addedNodes.length > 0;
        })) {
            // 调用脚本的函数
            runScript();
        }
    });

    // 启动MutationObserver
    observer.observe(document.body, { childList: true, subtree: true });
})();