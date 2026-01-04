// ==UserScript==
// @name         50 plus quiz Helper
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Helper for different 50 plus quizzes
// @author       You
// @match        https://www.50plus.de/spiele/quiz/quiz-*.html
// @icon         https://www.google.com/s2/favicons?sz=64&domain=50plus.de
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/492015/50%20plus%20quiz%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/492015/50%20plus%20quiz%20Helper.meta.js
// ==/UserScript==

(function() {

    let check = setInterval(() => {
        let control_box = document.querySelector("#quiz > div.questionbox > div.control");
        if (control_box !== null && control_box !== undefined) {
            clearInterval(check);
            let question_box = document.querySelector("#quiz > div.questionbox");
            let btn = document.createElement("button");
            btn.textContent = "Solve";
            btn.onclick = () => {

                let indx = +question_box.dataset.answer;
                let correct_answer = question_box.dataset.cache.substring(indx, indx+1);
                console.log(correct_answer);
                document.querySelector(`#quiz > div.questionbox > div.answers > span:nth-child(${correct_answer})`).click();

            }

            control_box.appendChild(btn);
        }
    }, 100);
})();