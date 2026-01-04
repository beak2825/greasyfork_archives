// ==UserScript==
// @name         Eyny Auto login
// @description  自動填入登入資訊，並點擊「登入」按鈕。
// @version      1
// @grant        none
// @match    http://*.eyny.com/member.php?mod=logging&action=login*
// @license MIT
// @namespace https://greasyfork.org/users/212711
// @downloadURL https://update.greasyfork.org/scripts/470069/Eyny%20Auto%20login.user.js
// @updateURL https://update.greasyfork.org/scripts/470069/Eyny%20Auto%20login.meta.js
// ==/UserScript==

// 使用者設定
var USER_NAME = 'username123'; // 改成你的帳號
var PASSWORD = '********'; // 改成你的密碼
var QUESTIONS = ['安全提問(未設置請忽略)', '母親的名字', '爺爺的名字', '父親出生的城市', '你其中一位老師的名字', '你個人計算機的型號', '你最喜歡的餐館名稱', '駕駛執照最後四位數字'];
var QUESTION_INDEX = 1; // 改成你選擇的安全提問順位。 ※注意這是從0開始的索引，所以1表示"母親的名字"。
var ANSWER = 'tnks'; // 改成你安全提問的答案

window.addEventListener('load', function() {
    var usernameInput = document.querySelector('input[name=username]');
    var passwordInput = document.querySelector('input[name=password]');
    var questionSelect = document.querySelector('select[name=questionid]');
    var answerInput = document.querySelector('input[name=answer]');
    var loginButton = document.querySelector('button[type=submit][name=loginsubmit]');

    if (usernameInput && passwordInput && questionSelect && answerInput && loginButton) {
        usernameInput.value = USER_NAME;
        passwordInput.value = PASSWORD;

        for (var i = 0; i < questionSelect.options.length; i++) {
            if (questionSelect.options[i].text === QUESTIONS[QUESTION_INDEX]) {
                questionSelect.selectedIndex = i;
                break;
            }
        }
        answerInput.value = ANSWER;
        loginButton.click(); // 自動點擊登入按鈕
    }
}, false);

