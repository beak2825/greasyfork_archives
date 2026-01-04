// ==UserScript==
// @name         E问获取题目答案
// @namespace    http://plus.bcsite.cn:7676
// @version      1
// @description  E问答题平台自动获取题目答案
// @match        http://ewen.digiwin.com.cn:9999/exam/getexam/*
// @grant        GM_xmlhttpRequest
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/462003/E%E9%97%AE%E8%8E%B7%E5%8F%96%E9%A2%98%E7%9B%AE%E7%AD%94%E6%A1%88.user.js
// @updateURL https://update.greasyfork.org/scripts/462003/E%E9%97%AE%E8%8E%B7%E5%8F%96%E9%A2%98%E7%9B%AE%E7%AD%94%E6%A1%88.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const questionTitle = document.querySelector('.question-title').innerText;
    const questionCount = document.querySelector('.question_count').innerText;
    const currentQuestion = document.querySelector('.question_active').innerText;

    const myDiv = document.createElement("div");
    myDiv.classList.add('my-div');
    // 设置元素的样式
    myDiv.style.position = "fixed";
    myDiv.style.top = "10px";
    myDiv.style.right = "10px";
    myDiv.style.width = "270px";
    myDiv.style.height = "600px";
    myDiv.style.background = "white";
    myDiv.style.border = "1px solid black";
    myDiv.style.padding = "10px";
    myDiv.style.zIndex = "9999";
    myDiv.style.overflow = "auto";
    document.body.appendChild(myDiv);

    const questionsList = unsafeWindow.questions;

    async function getTiInfo(element) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: "GET",
                url: `http://plus.bcsite.cn:7676/gettiinfo?id=${element.id}`,
                onload: function (response) {
                    if (response.response == "error") {
                        resolve("未找到答案");
                    } else {
                        const answer = eval(JSON.parse(response.response).right_option);
                        resolve(answer);
                    }
                }
            });
        })
    }

    async function fn() {
        const promiseList = [];
        for (let i = 0; i < questionsList.length; i++) {
            const element = questionsList[i];
            const promise = getTiInfo(element).then(answer => {
                const error = `<span style="color:red">未找到答案</span>`;
                const answerHtml = answer === "未找到答案" ?
                    error :
                    answer.length === 0 ?
                    error :
                    answer.map(item => `-${item}<br>`).join('');
                const questionHtml = `<span style="color:green">·${i + 1}、${element.question}</span><br>${answerHtml}<br><br>`;
                return questionHtml;
            });
            promiseList.push(promise);
        }
        const questionsHtml = await Promise.all(promiseList);
        myDiv.innerHTML = questionsHtml.join('');
        myDiv.innerHTML += `<span style="color:blue">共计：${questionsList.length}题</span><br>`;
    }

    fn();
})();