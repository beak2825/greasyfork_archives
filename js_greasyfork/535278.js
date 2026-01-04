// ==UserScript==
// @name         学企来每日练习答题助手
// @namespace    http://tampermonkey.net/
// @version      0.1.0
// @description  直接显示题目正确选项
// @author       Anonymous
// @match        https://learn.cscec83.cn/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=cscec83.cn
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/535278/%E5%AD%A6%E4%BC%81%E6%9D%A5%E6%AF%8F%E6%97%A5%E7%BB%83%E4%B9%A0%E7%AD%94%E9%A2%98%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/535278/%E5%AD%A6%E4%BC%81%E6%9D%A5%E6%AF%8F%E6%97%A5%E7%BB%83%E4%B9%A0%E7%AD%94%E9%A2%98%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function () {
    'use strict';
    var optionId_list = [];
    var originalSend = XMLHttpRequest.prototype.send;
    XMLHttpRequest.prototype.send = function () {
        var self = this;
        // 监听readystatechange事件，当readyState变为4时获取响应
        this.onreadystatechange = function () {
            if (self.readyState === 4) {
                if (self.responseURL.indexOf("/practice/paper/selectPracticeByClassId?practiceType=1") > -1 || self.responseURL.indexOf("/practice/paper/selectPracticeByClassId?practiceType=2") > -1) {
                    // 在获取到响应后执行你的操作
                    //console.log('拦截到响应：', self.response);
                    var json = JSON.parse(self.response);
                    var testPaperTopics = json.data.testPaperTopics
                    //console.log(testPaperTopics);
                    optionId_list = [];
                    for (var prop in testPaperTopics) {
                        if (testPaperTopics.hasOwnProperty(prop)) {
                            var user = testPaperTopics[prop];
                            var data = user.optionId;
                            optionId_list = optionId_list.concat(data);
                        }
                    }
                    //console.log(optionId_list);
                }
            }
        };
        // 调用原始的send方法
        originalSend.apply(this, arguments);
    };
    // 选择你想要观察变动的节点或其父容器
    const targetNode = document.body;
    // 创建一个MutationObserver实例并配置回调函数
    const observer = new MutationObserver((mutationsList, observer) => {
        mutationsList.forEach(mutation => {
            // 当子节点列表或属性发生变化时
            if (mutation.type === 'childList' || mutation.type === 'attributes') {
                // 在这里编写你的脚本逻辑，处理DOM树的变化
                //console.log('Page content changed');
                setTimeout(function () {
                    // 在这里写你需要延迟执行的代码
                    // 获取value标签
                    var serial = document.querySelector('.flex>.flex_l>.size-16');
                    if (serial) {
                        var serialNum = serial.textContent.split('、')[0];
                        var chooseID = optionId_list[serialNum - 1].split(',');
                        for (var i = 0; i < chooseID.length; i++) {
                            var optionValue = document.querySelector('input[type][value="' + chooseID[i] + '"]')
                            if (optionValue) {
                                //console.log(optionId_list[0]);
                                //console.log(optionValue);
                                // 获取目标radio元素的父节点
                                var grandparent = optionValue.parentNode.parentNode;
                                var parentElement = optionValue.parentNode;
                                var nextSiblingOfParent = parentElement.nextElementSibling;
                                if (nextSiblingOfParent) {
                                    //console.log(nextSiblingOfParent);
                                    nextSiblingOfParent.style.color = 'red';
                                    nextSiblingOfParent.style.fontWeight = 'bold';
                                    //parentElement.classList.add('is-checked');
                                    //grandparent.classList.add('is-checked');
                                    //grandparent.setAttribute('aria-checked', 'true');
                                }
                            }
                        }
                    }
                }, 1000);
            }
        });
    });
    // 开始观察目标节点
    observer.observe(targetNode, { attributes: true, childList: true, subtree: true });
})();