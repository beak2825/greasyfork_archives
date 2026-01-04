// ==UserScript==
// @name         铁人先锋考试助手
// @namespace    http://tampermonkey.net/
// @version      0.0.2
// @description  铁人先锋助手！
// @author       NoBB
// @match        https://m.dj.cnpc.com.cn/sydj-mobile/webcontent/template/business/onlineAnswer/*
// @license      MIT
// @icon         https://www.google.com/s2/favicons?sz=64&domain=cnpc.com.cn
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/502171/%E9%93%81%E4%BA%BA%E5%85%88%E9%94%8B%E8%80%83%E8%AF%95%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/502171/%E9%93%81%E4%BA%BA%E5%85%88%E9%94%8B%E8%80%83%E8%AF%95%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function () {
    'use strict';
    let questions = null;
    let latestUpdateTime = null;

    function HookXHR() {
        // 拦截响应
        var originalSend = XMLHttpRequest.prototype.send;
        XMLHttpRequest.prototype.send = function() {
            // 全部请求相关信息
            var self = this;

            this._onreadystatechange = this.onreadystatechange;
            // 监听readystatechange事件
            this.onreadystatechange = function() {
                // 当readyState变为4时获取响应
                if (self.readyState === 4) {
                    // self 里面就是请求的全部信息
                    // JSON.parse(self.response);可以获取到返回的数据
                    if (self.responseURL.endsWith("joinTest")) {
                        questions = JSON.parse(self.response).data.question;
                    }
                }
                if (self._onreadystatechange) {
                    self._onreadystatechange.apply(self, arguments);
                }
            };
            // 调用原始的send方法
            originalSend.apply(this, arguments);
        };
    }

    document.addEventListener("DOMContentLoaded", function(event) {
        // 创建一个 MutationObserver 实例，观察 body 元素的子节点变化
        let observer = new MutationObserver(() => {
            const now = new Date().getTime();
            if (latestUpdateTime) {
                const timeSpend = now - latestUpdateTime;
                if (timeSpend < 1000) return;
            }
            if (questions) {
                const questionBox = document.querySelector(".questioninfo");
                const questionDOMs = questionBox.querySelectorAll("li:not([style*='display: none'])");
                if (questionDOMs.length === 0) return;
                const questionDOM = questionDOMs[0];
                if (questionDOM.querySelector("div > div").innerHTML.includes("@正确答案")) return;
                const questionNum = parseInt(questionDOM.querySelector(".questionNum").innerText) - 1;
                const currentQuestion = questions[questionNum];
                const correctAnswer = currentQuestion.quesOption.filter(answ => answ.isTrue === "1");
                questionDOM.querySelector("div > div").innerHTML += `<div style="color: red;">@正确答案：${correctAnswer.map(answ => answ.optionNum + "." + answ.optionContent).join(",")}</div>`;

                correctAnswer.forEach(answ => {
                    const answerDOM = document.getElementsByName(answ.id)[0];
                    if (answerDOM) {
                        answerDOM.click();
                    }
                });
            }
            latestUpdateTime = now;
        });
        let targetNode = document.body;
        // 配置观察器的选项
        let config = { childList: true, subtree: true };
        // 启动观察器并传入回调函数和配置选项
        observer.observe(targetNode, config);
    });
    HookXHR();
})();