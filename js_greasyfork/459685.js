// ==UserScript==
// @name               正保会计网校（原中华会计网校）继续教育自动答题2024修复版
// @version            2024.04.23.002
// @description        正保会计网校（原中华会计网校）继续教育自动答题
// @author             Herohub
// @match              https://jxjy.chinaacc.com/courseware/*
// @grant              none
// @license            MIT
// @namespace https://github.com/LazyBug1E0CF
// @downloadURL https://update.greasyfork.org/scripts/459685/%E6%AD%A3%E4%BF%9D%E4%BC%9A%E8%AE%A1%E7%BD%91%E6%A0%A1%EF%BC%88%E5%8E%9F%E4%B8%AD%E5%8D%8E%E4%BC%9A%E8%AE%A1%E7%BD%91%E6%A0%A1%EF%BC%89%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2%E8%87%AA%E5%8A%A8%E7%AD%94%E9%A2%982024%E4%BF%AE%E5%A4%8D%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/459685/%E6%AD%A3%E4%BF%9D%E4%BC%9A%E8%AE%A1%E7%BD%91%E6%A0%A1%EF%BC%88%E5%8E%9F%E4%B8%AD%E5%8D%8E%E4%BC%9A%E8%AE%A1%E7%BD%91%E6%A0%A1%EF%BC%89%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2%E8%87%AA%E5%8A%A8%E7%AD%94%E9%A2%982024%E4%BF%AE%E5%A4%8D%E7%89%88.meta.js
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

            let answerTipDiv = document.querySelector("#PointQuestionAnswer0");
            while(answerTipDiv.innerHTML === "") {
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
        let answerText = document.querySelector("#PointQuestionAnswer0").innerText;
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
            document.querySelector("input[name='useranswer0'][value='" + answerValue + "']").checked = true;
        }
    };

    // 延迟5秒关闭答题弹窗
    let closeBtn = document.querySelector("a#closePointId");
    setTimeout(function() {
        closeBtn.click();
    }, 5000);

    // 设置一个变量来存储关闭按钮的引用
    let closeBtnX;

    // 定时检查关闭按钮是否存在
    setInterval(function() {
    // 尝试获取关闭按钮的DOM元素
    closeBtnX = document.querySelector("a#closePointId");
    // 如果找到了关闭按钮
    if (closeBtnX) {
    // 设置10秒后自动点击关闭按钮
        setTimeout(function() {
            if (closeBtnX && closeBtnX.click) {
                closeBtnX.click();
            }
        }, 10000); // 10秒（10000毫秒）后执行点击操作

      // 清除定时器，避免重复设置
        clearInterval(this);
    }
    }, 1000); // 每秒检查一次

    // 清空答案提示
    let clearAnswerDiv = function() {
        document.querySelector("#PointQuestionAnswer").innerHTML = "";
    };
})();
