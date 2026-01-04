// ==UserScript==
// @name         百度教育自动展示答案｜粘贴自动搜索｜自动关闭页面
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  在百度易学天工页面自动处理粘贴和点击操作
// @author       Gwen0x4c3
// @match        https://easylearn.baidu.com/edu-page/tiangong/bgkdetail*
// @match        https://easylearn.baidu.com/edu-page/tiangong/bgklist*
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/541095/%E7%99%BE%E5%BA%A6%E6%95%99%E8%82%B2%E8%87%AA%E5%8A%A8%E5%B1%95%E7%A4%BA%E7%AD%94%E6%A1%88%EF%BD%9C%E7%B2%98%E8%B4%B4%E8%87%AA%E5%8A%A8%E6%90%9C%E7%B4%A2%EF%BD%9C%E8%87%AA%E5%8A%A8%E5%85%B3%E9%97%AD%E9%A1%B5%E9%9D%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/541095/%E7%99%BE%E5%BA%A6%E6%95%99%E8%82%B2%E8%87%AA%E5%8A%A8%E5%B1%95%E7%A4%BA%E7%AD%94%E6%A1%88%EF%BD%9C%E7%B2%98%E8%B4%B4%E8%87%AA%E5%8A%A8%E6%90%9C%E7%B4%A2%EF%BD%9C%E8%87%AA%E5%8A%A8%E5%85%B3%E9%97%AD%E9%A1%B5%E9%9D%A2.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const currentUrl = window.location.href;

    // 如果是详情页面，监听粘贴事件
    if (currentUrl.includes('https://easylearn.baidu.com/edu-page/tiangong/bgkdetail?')) {
        console.log('在详情页面，开始监听粘贴事件...');

        GM_addStyle(
          `.question-recom {
                display: none !important;
                visibility: hidden !important;
                height: 0 !important;
                overflow: hidden !important;
            }`
        );

        document.addEventListener('keydown', function(event) {
            // 检测 Cmd+V (Mac) 或 Ctrl+V (Windows/Linux)
            if ((event.metaKey || event.ctrlKey) && event.key === 'v') {
                console.log('检测到粘贴快捷键');

                setTimeout(function() {
                    if (navigator.clipboard && navigator.clipboard.readText) {
                        navigator.clipboard.readText().then(function(clipboardText) {
                            if (clipboardText.trim()) {
                                console.log('剪贴板内容:', clipboardText);
                                // 跳转到搜索页面
                                const searchUrl = `https://easylearn.baidu.com/edu-page/tiangong/bgklist?query=${encodeURIComponent(clipboardText)}`;
                                console.log('跳转到:', searchUrl);
                                window.location.href = searchUrl;
                            }
                        }).catch(function(err) {
                            console.error('读取剪贴板失败:', err);
                            alert('无法读取剪贴板内容，请确保浏览器允许访问剪贴板');
                        });
                    } else {
                        console.warn('浏览器不支持剪贴板API');
                        const userInput = prompt('请输入要搜索的内容：');
                        if (userInput && userInput.trim()) {
                            const searchUrl = `https://easylearn.baidu.com/edu-page/tiangong/bgklist?query=${encodeURIComponent(userInput)}`;
                            window.location.href = searchUrl;
                        }
                    }
                }, 100);
            }
        });

        // 自动显示题目答案
        const originalOpen = XMLHttpRequest.prototype.open;
        XMLHttpRequest.prototype.open = function(method, url) {
            if (url.includes('/bgk/shitiinfo')) {
                console.log("shitiinfo 拦截修改");
                this.addEventListener('readystatechange', function() {
                    if (this.readyState == 4) {
                        const res = JSON.parse(this.responseText);
                        res.data.limit = '0';
                        Object.defineProperty(this, 'responseText', {writable: true});
                        this.responseText = JSON.stringify(res);
                    }
                })
            }
            originalOpen.apply(this, arguments);
        }
    }

    // 如果是列表页面，等待元素加载并点击
    if (currentUrl.includes('https://easylearn.baidu.com/edu-page/tiangong/bgklist?')) {
        console.log('在列表页面，等待.bgk-question-list加载...');

        function waitForElement(selector, callback, timeout = 10000) {
            const startTime = Date.now();

            function checkElement() {
                const element = document.querySelector(selector);
                if (element) {
                    console.log('找到元素:', selector);
                    callback(element);
                } else if (Date.now() - startTime < timeout) {
                    setTimeout(checkElement, 500);
                } else {
                    console.error('等待元素超时:', selector);
                }
            }

            checkElement();
        }

        // 等待.bgk-question-list加载
        waitForElement('.bgk-question-list', function(questionList) {
            console.log('bgk-question-list已加载');

            // 在questionList中查找第一个.question-stem
            waitForElement('.bgk-question-list .question-stem', function(firstQuestionStem) {
                console.log('找到第一个question-stem，准备点击');

                setTimeout(function() {
                    firstQuestionStem.click();
                    console.log('已点击第一个question-stem');

                    // 延迟一点时间后关闭窗口
                    setTimeout(function() {
                        console.log('关闭窗口');
                        window.close();
                    }, 1000);
                }, 500);
            });
        });
    }
})();