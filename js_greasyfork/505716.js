// ==UserScript==
// @name        defaut_question
// @namespace   Violentmonkey Scripts
// @match       https://*.elearn.hrd.gov.tw/learn/questionnaire/exam_start.php*
// @grant       none
// @version     1.1
// @author          TungKengTse
// @copyright       TungKengTse
// @license         MIT
// @description 問卷預設值
// @downloadURL https://update.greasyfork.org/scripts/505716/defaut_question.user.js
// @updateURL https://update.greasyfork.org/scripts/505716/defaut_question.meta.js
// ==/UserScript==


setTimeout(function() {
    let checkbox = document.querySelector('#homeworkDisplayPanel > table > tbody > tr:nth-child(1) > td:nth-child(3) > ol > li:nth-child(3) > span > input[type=checkbox][value="3"]');
    console.log(checkbox);
    if (checkbox && !checkbox.checked) {
        checkbox.checked = true;
        checkbox.dispatchEvent(new Event('change', { bubbles: true }));
    }

    let radio1 = document.querySelector('#homeworkDisplayPanel > table > tbody > tr:nth-child(2) > td:nth-child(3) > ol > li:nth-child(1) > span > input[type=radio][value="1"]');
    if (radio1 && !radio1.checked) {
        radio1.checked = true;
        radio1.dispatchEvent(new Event('change', { bubbles: true }));
    }

    let radio2 = document.querySelector('#homeworkDisplayPanel > table > tbody > tr:nth-child(3) > td:nth-child(3) > ol > li:nth-child(1) > span > input[type=radio][value="1"]');
    if (radio2 && !radio2.checked) {
        radio2.checked = true;
        radio2.dispatchEvent(new Event('change', { bubbles: true }));
    }

    let radio3 = document.querySelector('#homeworkDisplayPanel > table > tbody > tr:nth-child(4) > td:nth-child(3) > ol > li:nth-child(1) > span > input[type=radio][value="1"]');
    if (radio3 && !radio3.checked) {
        radio3.checked = true;
        radio3.dispatchEvent(new Event('change', { bubbles: true }));
    }
}, 1000);