// ==UserScript==
// @name         立臻一键答题
// @namespace    http://tampermonkey.net/
// @version      2024-11-20
// @description  解决你的烦恼
// @author       gu5ang
// @match        https://m.luxshare-ict.com/elearning/examine.html?pid=13739
// @match        https://m.luxshare-ict.com/elearning/examine.html?pid=15264
// @downloadURL https://update.greasyfork.org/scripts/518176/%E7%AB%8B%E8%87%BB%E4%B8%80%E9%94%AE%E7%AD%94%E9%A2%98.user.js
// @updateURL https://update.greasyfork.org/scripts/518176/%E7%AB%8B%E8%87%BB%E4%B8%80%E9%94%AE%E7%AD%94%E9%A2%98.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 定义问题ID和对应答案的对象
    let answersMap = {
        '13739': {
            singleChoice: {
                '403257': "D",
                '403258': "C",
            },
            multipleChoice: {
                '366124': ["A", "B"],
                '403259': ["A", "B", "C", "D"],
            },
            trueFalse: {
                '366129': "A",
                '403260': "A",
                '403261': "A",
                '674701': "A",
                '674702': "A",
                '674703': "A",
                '674705': "B",
                '674706': "A",
                '674707': "A",
                '674708': "A",
                '674709': "A",
            }
        },
        '15264': {
            singleChoice: {
                '402136': "D",
                '402137': "B",
                '402138': "C",
            },
            multipleChoice: {
                '402139': ["A", "B", "C", "D"],
            },
            trueFalse: {
                '402140': "A",
                '402141': "A",
                '402142': "A",
                '402143': "A",
                '402144': "A",
            }
        },
    };

    const currentUrl = window.location.href;
    const pid = currentUrl.substring(currentUrl.lastIndexOf('=') + 1);

    if (pid in answersMap) {
        const answers = answersMap[pid];

        const button = document.createElement("button");
        button.innerText = "点击我一键答题";
        document.body.appendChild(button);

        button.style.position = "fixed";
        button.style.top = "10%";
        button.style.left = "50%";
        button.style.transform = "translate(-50%, -50%)";
        button.style.zIndex = "9999";
        button.style.backgroundColor = "red";

        button.addEventListener("click", function () {
            button.style.display = "none";

            function answerQuestions(type, questionNumber) {
                let counter = 0;
                for (const questionId in answers[type]) {
                    const answer = answers[type][questionId];
                    if (type === 'multipleChoice') {
                        answer.forEach((ans) => {
                            document.querySelector(`input[name="question[${questionNumber}].ItemModel[${counter}].MyAnswer"][value="${ans}"]`).click();
                        });
                    } else {
                        document.querySelector(`input[name="question[${questionNumber}].ItemModel[${counter}].MyAnswer"][value="${answer}"]`).click();
                    }
                    counter++;
                }
            }

            answerQuestions('singleChoice', 0);
            answerQuestions('multipleChoice', 1);
            answerQuestions('trueFalse', 2);
        });
    }
})();
