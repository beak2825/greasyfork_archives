// ==UserScript==
// @name         百度教育自动查看答案和去广告（不挂科）
// @name:en         Baidu EasyLearn Script
// @namespace    http://tampermonkey.net/
// @version      0.9
// @description  百度题库去掉答案遮罩，答案立现！不用再点击烦人的弹窗查看答案了！自动隐藏部分广告！
// @description:en  Clicks on elements after the page is fully loaded on Baidu EasyLearn.
// @author       NellPoi
// @match        https://easylearn.baidu.com/edu-page/tiangong/bgkdetail*
// @match        https://easylearn.baidu.com/edu-page/tiangong/questiondetail*
// @run-at       document-end
// @grant        none
// @license        MIT 
// @downloadURL https://update.greasyfork.org/scripts/488754/%E7%99%BE%E5%BA%A6%E6%95%99%E8%82%B2%E8%87%AA%E5%8A%A8%E6%9F%A5%E7%9C%8B%E7%AD%94%E6%A1%88%E5%92%8C%E5%8E%BB%E5%B9%BF%E5%91%8A%EF%BC%88%E4%B8%8D%E6%8C%82%E7%A7%91%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/488754/%E7%99%BE%E5%BA%A6%E6%95%99%E8%82%B2%E8%87%AA%E5%8A%A8%E6%9F%A5%E7%9C%8B%E7%AD%94%E6%A1%88%E5%92%8C%E5%8E%BB%E5%B9%BF%E5%91%8A%EF%BC%88%E4%B8%8D%E6%8C%82%E7%A7%91%EF%BC%89.meta.js
// ==/UserScript==

(function () {
    'use strict';
    var url = window.location.href;// 获取当前页面的URL（禁止修改）
    var delay = 1000;// 延迟时间（毫秒）
    const LOGGER = "Baidu EasyLearn Script => "// 日志前缀
    const LOGGER_ENABLER = true// 是否启用日志

    // 打印日志
    function log(msg) {
        if (LOGGER_ENABLER) {
            console.log(LOGGER + msg);
        }
    }

    // 隐藏元素
    function hideElementsByClass(className) {
        const elements = document.getElementsByClassName(className);
        for (let i = 0; i < elements.length; i++) {
            setTimeout(() => {
                log("hiding " + className)
                elements[i].style.display = "none";
            }, delay);
        }
    }

    // 删除元素
    function removeElementsByClass(className) {
        const elements = document.getElementsByClassName(className);
        for (let i = 0; i < elements.length; i++) {
            setTimeout(() => {
                log("removing " + className)
                elements[i].remove();
            }, delay);
        }
    }

    // 单击元素
    function clickElement(selector) {
        const element = document.querySelector(selector);
        if (element) {
            setTimeout(() => {
                log("clicking " + selector)
                element.click();
            }, delay);
            element.click();
        } else {
            log("element not found " + selector)
        }
    }

    // 等待元素出现
    function waitForElement(selector, callback) {
        const element = document.querySelector(selector);
        if (element) {
            log("element found " + selector)
            callback();
        } else {
            log("trying to find " + selector + ",but not found, retrying in " + delay + "ms")
            setTimeout(() => {
                waitForElement(selector, callback);
            }, delay);
        }
    }

    // 处理选项卡项的单击，例如结果一 结果二 结果三 结果四 结果五，点击后自动查看答案
    function handleTabItemClick() {
        log("tab active")
        setTimeout(() => {
            waitForElement('.answer-hide', function () {
                clickElement('.answer-hide');
                waitForElement('.dan-btn', function () {
                    clickElement('.dan-btn');
                });
            });
        }, 1500);// 如果你发现在同一个问答页面切换不同答案时候偶尔不能自动点击查看答案，请适当增加延迟。（默认1000=1秒，以此类推）
    }

    // 等待页面加载完成
    window.addEventListener('load', function () {

        // 不挂科
        // 判断URL是以哪个字符串开始的
        if (url.startsWith("https://easylearn.baidu.com/edu-page/tiangong/bgkdetail")) {
            log("bgkdetail active")
            // 如果URL以"https://easylearn.baidu.com/edu-page/tiangong/bgkdetail"开始，执行相应的代码逻辑
            // 等待.answer-hide元素出现
            waitForElement('.answer-hide', function () {
                // 单击.answer-hide元素
                clickElement('.answer-hide');

                // 等待dan-btn元素出现
                waitForElement('.dan-btn', function () {
                    // 单击dan-btn元素
                    clickElement('.dan-btn');
                });
            });

            // 等待.tab元素出现，给tab元素添加单击事件监听器，也就是结果一 结果二 结果三 结果四 结果五
            let tab// 定义tab变量，不急着赋值
            waitForElement('.tab', function () {
                tab = document.querySelector('.tab');// 由waitForElement先找，找到了再通过回调用赋值
                // 为tab元素的每个子元素添加单击事件监听器
                tab.addEventListener('click', function () {
                    handleTabItemClick();
                });
            });

            // 等待question-anwser元素出现
            waitForElement('.question-anwser', function () {
                // 创建新的div元素
                var btn = document.createElement('div');
                btn.style.height = "45px";
                btn.style.background = "#f7d147";
                btn.style.borderRadius = "9px";
                btn.style.fontFamily = "PingFangSC-Semibold";
                btn.style.fontSize = "16px";
                btn.style.color = "#3d1d06";
                btn.style.fontWeight = "600";
                btn.style.display = "flex";
                btn.style.alignItems = "center";
                btn.style.justifyContent = "center";
                btn.style.marginLeft = "28px";
                btn.style.marginRight = "28px";
                btn.style.cursor = "pointer";
                btn.textContent = '复制答案';

                // 添加点击事件监听器
                btn.addEventListener('click', function () {
                    var text = document.querySelector('.question-anwser').textContent;
                    var textarea = document.createElement('textarea');
                    textarea.textContent = text;
                    document.body.appendChild(textarea);
                    textarea.select();
                    document.execCommand('copy');
                    document.body.removeChild(textarea);
                    log('answer copied to clipboard :: ' + text);
                    alert('答案已复制到剪贴板');
                });

                // 将新元素添加到question-anwser元素后面
                var questionAnwser = document.querySelector('.question-anwser');
                questionAnwser.parentNode.insertBefore(btn, questionAnwser.nextSibling);
            });
            // 隐藏广告
            setTimeout(() => {
                hideElementsByClass('main-bottom');
                hideElementsByClass('bottom-wrap');
                hideElementsByClass('banner');
                hideElementsByClass('vip-card-warp');
            }, delay);
            // 百度题库
        } else if (url.startsWith("https://easylearn.baidu.com/edu-page/tiangong/questiondetail")) {
            log("questiondetail active")
            // 如果URL以"https://easylearn.baidu.com/edu-page/tiangong/questiondetail"开始，执行相应的代码逻辑
            // 等待.answer-hide元素出现

            waitForElement('.more-text', function () {
                // 单击.answer-hide元素
                clickElement('.more-text');

                // 等待dan-btn元素出现
                waitForElement('.exercise-btn-4', function () {
                    // 单击dan-btn元素
                    clickElement('.exercise-btn-4');


                });
            });
            // 等待toogle-btn元素出现（题目展开文字按钮）
            waitForElement('.toogle-btn', function () {
                // 单击toogle-btn元素
                clickElement('.toogle-btn');
            });

            // 等待expand-btn元素出现（答案解析展开文字按钮）
            waitForElement('.expand-btn', function () {
                // 单击expand-btn元素
                clickElement('.expand-btn');
            });
            // 隐藏广告
            setInterval(() => {
                hideElementsByClass('vip-banner-cont');// 牛皮癣广告
            }, delay);
            setTimeout(() => {
                hideElementsByClass('business-el-line');
                hideElementsByClass('vip-card-warp');
                hideElementsByClass('kaixue-dialog-mask');
            }, delay);

        }

    });
})();
