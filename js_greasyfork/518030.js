// ==UserScript==
// @name         学习通自动评教脚本（中国电子科技职业大学 重庆分校版）
// @namespace    http://your-namespace.com
// @version      1.2.3
// @description  在学习通评教页面进行评教操作（需要自己点评价，尽量在火狐上使用，作者能力有限，不喜勿喷）
// @author       不想读书的瓜
// @match        https://newes.chaoxing.com/pj/*
// @grant        none
// @license      版权所有 (C) 2024年 不想读书的瓜 保留所有权利。
// @downloadURL https://update.greasyfork.org/scripts/518030/%E5%AD%A6%E4%B9%A0%E9%80%9A%E8%87%AA%E5%8A%A8%E8%AF%84%E6%95%99%E8%84%9A%E6%9C%AC%EF%BC%88%E4%B8%AD%E5%9B%BD%E7%94%B5%E5%AD%90%E7%A7%91%E6%8A%80%E8%81%8C%E4%B8%9A%E5%A4%A7%E5%AD%A6%20%E9%87%8D%E5%BA%86%E5%88%86%E6%A0%A1%E7%89%88%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/518030/%E5%AD%A6%E4%B9%A0%E9%80%9A%E8%87%AA%E5%8A%A8%E8%AF%84%E6%95%99%E8%84%9A%E6%9C%AC%EF%BC%88%E4%B8%AD%E5%9B%BD%E7%94%B5%E5%AD%90%E7%A7%91%E6%8A%80%E8%81%8C%E4%B8%9A%E5%A4%A7%E5%AD%A6%20%E9%87%8D%E5%BA%86%E5%88%86%E6%A0%A1%E7%89%88%EF%BC%89.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 等待元素加载完成的函数（优化版）
    function waitForElement(selector, callback) {
        const observer = new MutationObserver((mutationsList, observer) => {
            const element = document.querySelector(selector);
            if (element) {
                observer.disconnect();
                callback(element);
            }
        });

        observer.observe(document.documentElement, {
            childList: true,
            subtree: true
        });
    }

    // 自动评教主函数
    function autoEvaluate() {
        // 先等待通过类名和类型定位到的输入框元素加载完成，获取其id值
        waitForElement('input[type="text"].blueInp.dafen', function (inputElement) {
            const idValue = inputElement.id;
            // 自动评教配置对象
            const evaluationConfig = {
                teachingAttitudeScore: 20,
                teachingContentScore: 20,
                teachingMethodScore: 20,
                interactionScore: 20,
                afterClassScore: 20,
                //comment: idValue,
                comment: "老师教学认真负责，整体效果不错。",

                // 精确的基于id的元素选择器，正确嵌入idValue实际值
                teachingAttitudeSelector: 'input[id="' + idValue + '"]',
                teachingContentSelector: 'input[id="' + (parseInt(idValue) + 1).toString() + '"]',
                teachingMethodSelector: 'input[id="' + (parseInt(idValue) + 2).toString() + '"]',
                interactionSelector: 'input[id="' + (parseInt(idValue) + 3).toString() + '"]',
                afterClassSelector: 'input[id="' + (parseInt(idValue) + 4).toString() + '"]',
                commentSelector: 'textarea[id="' + (parseInt(idValue) + 5).toString() + '"]',
                submitButtonSelector: 'button#submitButton'
            };

            // 给教学态度评分
            waitForElement(evaluationConfig.teachingAttitudeSelector, function (element) {
                if (element.tagName === 'INPUT' && element.type === 'text') {
                    element.value = evaluationConfig.teachingAttitudeScore;
                }
            });

            // 给教学内容评分
            waitForElement(evaluationConfig.teachingContentSelector, function (element) {
                if (element.tagName === 'INPUT' && element.type === 'text') {
                    element.value = evaluationConfig.teachingContentScore;
                }
            });

            // 给教学方法评分
            waitForElement(evaluationConfig.teachingMethodSelector, function (element) {
                if (element.tagName === 'INPUT' && element.type === 'text') {
                    element.value = evaluationConfig.teachingMethodScore;
                }
            });

            // 给课堂互动评分
            waitForElement(evaluationConfig.interactionSelector, function (element) {
                if (element.tagName === 'INPUT' && element.type === 'text') {
                    element.value = evaluationConfig.interactionScore;
                }
            });

            // 给课后交流评分
            waitForElement(evaluationConfig.afterClassSelector, function (element) {
                if (element.tagName === 'INPUT' && element.type === 'text') {
                    element.value = evaluationConfig.afterClassScore;
                }
            });

            // 填写评价内容
            waitForElement(evaluationConfig.commentSelector, function (element) {
                if (element.tagName === 'TEXTAREA') {
                    element.value = evaluationConfig.comment;
                }
            });

            // 等待并获取提交按钮元素
            waitForElement('a[onclick="save(2);"]', function (submitButton) {
                if (submitButton.tagName === 'A') {
                    submitButton.click();

                    // 提交完成后，等待并获取 "确定" 按钮元素
                    waitForElement('.layui-layer-btn0', function (confirmButton) {
                        if (confirmButton.tagName === 'A') {
                            confirmButton.click();


                        }
                    });
                }
            });
        });
    }

    // 调用自动评教函数
    autoEvaluate();

})();
