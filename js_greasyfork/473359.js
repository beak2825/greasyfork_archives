// ==UserScript==
// @name         Export Questions and Answers
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Export questions and answers from the specified website
// @author       You
// @match        https://bgi.zhixueyun.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/473359/Export%20Questions%20and%20Answers.user.js
// @updateURL https://update.greasyfork.org/scripts/473359/Export%20Questions%20and%20Answers.meta.js
// ==/UserScript==

(function() {
    'use strict';

    if (window.location.hash.includes('score-detail')) {
        function exportQuestionsAndAnswers() {
            let items = document.querySelectorAll('div.score-question-item');
            let output = '';

            items.forEach((item, index) => {
                let questionNumber = index + 1;
                let questionText = item.querySelector('.stem-content-main').innerText;
                output += questionNumber +"、" + questionText + '\n';

                let options = item.querySelectorAll('.answer-options');
                options.forEach((option) => {
                    let optionLabel = option.parentElement.querySelector('.option-num').innerText.trim();
                    output += optionLabel + ' ' + option.innerText + '\n';
                });

                let answer = item.querySelector('.answer-value').innerText;
                output += '标准答案: ' + answer + '\n';
                output += '-----------------------------\n';
            });

            let blob = new Blob([output], { type: 'text/plain' });
            let url = URL.createObjectURL(blob);

            let a = document.createElement('a');
            a.style.display = 'none';
            a.href = url;
            a.download = 'questions.txt';
            document.body.appendChild(a);
            a.click();

            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
        }

        // 添加按钮
        let button = document.createElement('button');
        button.innerText = '导出题目和答案';
        button.style.position = 'fixed';
        button.style.top = '10px';
        button.style.right = '10px';
        button.style.zIndex = 9999;
        button.onclick = exportQuestionsAndAnswers;
        document.body.appendChild(button);
    }

})();

