// ==UserScript==
// @author       Dragon
// @name         视频加速 + 数据拦截自动答题
// @license      MIT
// @namespace    https://example.com
// @version      1.0
// @description  强制网页视频4倍速 + 自动答题
// @match        https://zykj.jijiaox.com/*
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/532405/%E8%A7%86%E9%A2%91%E5%8A%A0%E9%80%9F%20%2B%20%E6%95%B0%E6%8D%AE%E6%8B%A6%E6%88%AA%E8%87%AA%E5%8A%A8%E7%AD%94%E9%A2%98.user.js
// @updateURL https://update.greasyfork.org/scripts/532405/%E8%A7%86%E9%A2%91%E5%8A%A0%E9%80%9F%20%2B%20%E6%95%B0%E6%8D%AE%E6%8B%A6%E6%88%AA%E8%87%AA%E5%8A%A8%E7%AD%94%E9%A2%98.meta.js
// ==/UserScript==

(function () {
    'use strict';

    /*** 视频 5 倍速 ***/
    function setVideoSpeed() {
        document.querySelectorAll('video').forEach(video => {
            video.playbackRate = 4;
        });
    }

    new MutationObserver(setVideoSpeed).observe(document, { childList: true, subtree: true });
    window.addEventListener('load', setVideoSpeed);

    /*** 数据拦截与自动答题 ***/
    const originalFetch = window.fetch;
    window.fetch = async (...args) => {
        let response = await originalFetch(...args);
        let clone = response.clone();
        clone.json().then(async data => {
            if (args[0].includes("praxise")) {
                console.log("拦截到数据包:", data);
                await processQuestions(data);
            }
        });
        return response;
    };

    const originalOpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function (method, url) {
        this.addEventListener("readystatechange", async function () {
            if (this.readyState === 4 && this.status === 200 && url.includes("praxise")) {
                try {
                    let responseData = JSON.parse(this.responseText);
                    console.log("拦截到数据包:", responseData);
                    await processQuestions(responseData);
                } catch (error) {
                    console.error("解析数据包错误:", error);
                }
            }
        });
        return originalOpen.apply(this, arguments);
    };

    async function processQuestions(jsonData) {
        if (jsonData.code !== 0) {
            console.error("数据无效");
            return;
        }
        let questions = jsonData.data;
        console.log("等待 2 秒加载网页...");
        await new Promise(resolve => setTimeout(resolve, 2000));
        for (let index = 0; index < questions.length; index++) {
            let praxise = questions[index].praxise;
            let title = praxise.title.trim();
            let answer = praxise.answer;

            if (typeof answer === 'string') {
                try {
                    answer = JSON.parse(answer);
                } catch (e) {
                    answer = [answer];
                }
            }
            if (!Array.isArray(answer)) {
                answer = [answer];
            }

            console.log(`第 ${index + 1} 题: ${title}，答案: ${JSON.stringify(answer)}`);
            await selectOptionsInQuestion(index + 1, answer.map(String));
        }
    }

    function createEvent(type) {
        return new MouseEvent(type, { bubbles: true, cancelable: true, view: window });
    }

    function triggerCheckboxEvents(input, label) {
        return new Promise(resolve => {
            if (label) {
                label.dispatchEvent(createEvent('mousedown'));
                label.dispatchEvent(createEvent('mouseup'));
                label.dispatchEvent(createEvent('click'));
            }
            setTimeout(() => { resolve(); }, 100);
        });
    }

    function triggerRadioEvents(input, label) {
        return new Promise(resolve => {
            if (label) {
                label.dispatchEvent(createEvent('mousedown'));
                label.dispatchEvent(createEvent('mouseup'));
                label.dispatchEvent(createEvent('click'));
            }
            setTimeout(() => { resolve(); }, 100);
        });
    }

    async function selectOptionsInQuestion(requestedQuestionIndex, values) {
        const questionContainers = document.querySelectorAll('.mt_2');
        let actualQuestionIndex = 0;
        for (const container of questionContainers) {
            const isQuestion = container.querySelector('.el-radio-group') || container.querySelector('.el-checkbox-group');
            if (isQuestion) {
                actualQuestionIndex++;
                if (actualQuestionIndex === requestedQuestionIndex) {
                    for (const value of values) {
                        let input = container.querySelector(`.el-checkbox__original[value="${value}"]`);
                        let label = input ? input.closest('label.el-checkbox') : null;
                        let triggerFunction = triggerCheckboxEvents;

                        if (!input) {
                            input = container.querySelector(`.el-radio__original[value="${value}"]`);
                            label = input ? input.closest('label.el-radio') : null;
                            triggerFunction = triggerRadioEvents;
                        }

                        if (input) {
                            if (input.type === 'checkbox' && !input.checked) {
                                await triggerFunction(input, label);
                            } else if (input.type === 'radio' && !input.checked) {
                                await triggerFunction(input, label);
                            } else {
                                console.log(`题目 ${actualQuestionIndex} 中 value 为 ${value} 的选项已经被选中`);
                            }
                        } else {
                            console.log(`题目 ${actualQuestionIndex} 中未找到 value 为 ${value} 的元素`);
                        }
                    }
                    return;
                }
            }
        }
        console.log(`未找到第 ${requestedQuestionIndex} 个题目`);
    }
})();

