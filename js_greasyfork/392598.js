// ==UserScript==
// @name         中华会计网校继续教育自动答题
// @namespace    https://github.com/LazyBug1E0CF
// @version      0.1.2
// @description  中华会计网校继续教育学习自动答题
// @author       Lazybug
// @match        http://jxjyelearning.chinaacc.com/courseware/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/392598/%E4%B8%AD%E5%8D%8E%E4%BC%9A%E8%AE%A1%E7%BD%91%E6%A0%A1%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2%E8%87%AA%E5%8A%A8%E7%AD%94%E9%A2%98.user.js
// @updateURL https://update.greasyfork.org/scripts/392598/%E4%B8%AD%E5%8D%8E%E4%BC%9A%E8%AE%A1%E7%BD%91%E6%A0%A1%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2%E8%87%AA%E5%8A%A8%E7%AD%94%E9%A2%98.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let answerRegex = /(?<=正确答案：)[\w对错]+(?=。)/;

    let answerDict = {
        "对": "Y",
        "错": "N",
        "A": "A",
        "B": "B",
        "C": "C",
        "D": "D",
        "E": "E",
        "F": "F"
    };

    setInterval(() => {
        if (isTesting()) {
            // 先直接提交答案，以便得到正确答案
            doAnswer();

            let answerTipDiv = document.querySelector("#PointQuestionAnswer");
            while(answerTipDiv.innerHtml === "") {
                console.log("等待正确答案中。。。");
            }
            let correctAnswer = getCorrectAnswer();
            fillRightAnswer(correctAnswer);
            clearAnswerDiv();
            doAnswer();
        }
    }, 1000);

    // 答题弹窗
    let testDiv = document.querySelector("div#videoPoint");

    // 检查是否在进行答题
    let isTesting = function() {
        return "none" != testDiv.style.display;
    };

    // 提交答案
    let doAnswer = function() {
        // 答题按钮
        let answerBtn = document.querySelector("input[name='btn']");
        answerBtn.click();
    };

    // 取得正确答案
    let getCorrectAnswer = function() {
        let answerText = document.querySelector("#PointQuestionAnswer").innerText;
        let match = answerText.match(answerRegex);
        if (match) {
            return match[0];
        }
    };

    // 选择正确答案
    let fillRightAnswer = function(answerString) {
        let answers = answerString.split("");
        for (let answer of answers) {
            let answerValue = answerDict[answer.toUpperCase()];
            document.querySelector("input[name='useranswer'][value='" + answerValue + "']").checked = true;
        }
    };

    // 清空答案提示
    let clearAnswerDiv = function() {
        document.querySelector("#PointQuestionAnswer").innerHTML = "";
    };
})();