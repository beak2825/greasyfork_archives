// ==UserScript==
// @name         ChaoxingAnswerToggler
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  隐藏或显示学习通作业选择题答案，复习专用。
// @author       Cassius0924
// @match        https://mooc1.chaoxing.com/mooc-ans/mooc2/work/*
// @match        https://mooc1.chaoxing.com/*
// @match        https://mooc1.chaoxing.com/mycourse/studentstudy/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=chaoxing.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/481315/ChaoxingAnswerToggler.user.js
// @updateURL https://update.greasyfork.org/scripts/481315/ChaoxingAnswerToggler.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function toggleAnswer(answerDiv) {
        if (answerDiv.style.visibility === 'hidden' || answerDiv.style.visibility === '') {
            answerDiv.style.visibility = 'visible';
        } else {
            answerDiv.style.visibility = 'hidden';
        }
    }

    function hideAllAnswers(answerDivs) {
        answerDivs.forEach(function(answerDiv) {
            answerDiv.style.visibility = 'hidden';
        });
    }

    function showAllAnswers(answerDivs) {
        answerDivs.forEach(function(answerDiv) {
            answerDiv.style.visibility = 'visible';
        });
    }

    function createElement(tag, className, style, content) {
        const element = document.createElement(tag);
        className && (element.className = className);
        style && (element.style = style);
        content && (element.innerHTML = content);
        return element;
    }

    function applyToggler(QContainerClassName, AContainerClassName, TContainerClassName, Style) {
        var questionContainers = document.querySelectorAll(QContainerClassName);

        questionContainers.forEach(function(questionContainer) {
            var answerDiv = questionContainer.querySelector(AContainerClassName);
            answerDiv.classList.add('ha_mark_answer');
            answerDiv.style.width = 'auto';
            answerDiv.style.visibility = 'visible';
            var showAnswerButton = createElement('button', 'ha_toggle_answer_button');
            showAnswerButton.classList.add('ha_button');
            showAnswerButton.textContent = '显示答案';
            showAnswerButton.addEventListener('click', (event) => {
                toggleAnswer(answerDiv)
            });

            questionContainer.appendChild(showAnswerButton);
        });

        const topicNumberContainer = document.querySelector(TContainerClassName);
        if (topicNumberContainer) {
            var haControlDiv = createElement('div', 'ha_control_div');
            haControlDiv.classList.add('topicNumber_checkbox');
            topicNumberContainer.appendChild(haControlDiv);

            var haShowAllButton = createElement('button', 'ha_show_all_answer');
            haShowAllButton.classList.add('ha_button');
            haShowAllButton.textContent = '显示所有答案';
            haShowAllButton.addEventListener('click', ()=>{
                var answerDivs = document.querySelectorAll(AContainerClassName);
                showAllAnswers(answerDivs);
            });
            haControlDiv.appendChild(haShowAllButton);

            var haHiddenAllButton = createElement('button', 'ha_hidden_all_answer');
            haHiddenAllButton.classList.add('ha_button');
            haHiddenAllButton.textContent = '隐藏所有答案';
            haHiddenAllButton.addEventListener('click', ()=> {
                var answerDivs = document.querySelectorAll(AContainerClassName);
                hideAllAnswers(answerDivs);
            });
            haControlDiv.appendChild(haHiddenAllButton);

            document.querySelector(TContainerClassName).appendChild(createElement('style', 'ha-global-style', '', Style));
        }
    }

    const QContainerClassNames = [
        {
            QC: ".questionLi",
            AC: ".mark_answer",
            TC: "#topicNumberScroll",
            Style: '.ha_hidden_all_answer{margin-top: -20px; width: 90px; height: 32px} .ha_show_all_answer{margin-top: -10px; margin-right: 50px;width: 90px; height: 32px} .ha_toggle_answer_button {margin-top: -43px;margin-left: 24px;width: 70px;height: 32px;line-height: 32px;} .ha_button {box-shadow: -4px -4px 10px -8px rgba(255, 255, 255, 1), 4px 4px 10px -8px rgba(0, 0, 0, .3); background: linear-gradient(135deg, rgba(230, 230, 230, 1) 0%, rgba(246, 246, 246, 1) 100%);cursor: pointer;border: 1px solid #e5e5e5;border-radius: 5px;text-align: center;} .ha_mark_answer{margin-left: 100px;}'
        },
        {
            QC: ".newTiMu",
            AC: ".newAnswerBx",
            TC: ".ceyan_name",
            Style: '.ha_hidden_all_answer{margin-top: -20px; width: 90px; height: 32px} .ha_show_all_answer{margin-top: 13px; margin-right: 50px;width: 90px; height: 32px} .ha_toggle_answer_button {margin-top: -130px;margin-left: 24px;width: 70px;height: 32px;line-height: 32px;} .ha_button {box-shadow: -4px -4px 10px -8px rgba(255, 255, 255, 1), 4px 4px 10px -8px rgba(0, 0, 0, .3); background: linear-gradient(135deg, rgba(230, 230, 230, 1) 0%, rgba(246, 246, 246, 1) 100%);cursor: pointer;border: 1px solid #e5e5e5;border-radius: 5px;text-align: center;} .ha_mark_answer{margin-left: 100px;}'
        },
    ];

    QContainerClassNames.forEach((map) => {
        console.log("APL");
        applyToggler(map["QC"], map["AC"], map["TC"], map["Style"]);
    });

})();
