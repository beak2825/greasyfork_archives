// ==UserScript==
// @name         AtCoder-Submission-RadioButton
// @namespace    https://github.com/penicillin0/
// @version      0.1.2
// @description  AtCoderで提出時ラジオボタンを生成します
// @author       penicillin0
// @license      MIT
// @homepage     https://github.com/penicillin0/AtCoder-Submission-RadioButton#readme
// @match        https://atcoder.jp/contests/*/submit*
// @supportURL   https://twitter.com/penicillin0at
// @downloadURL https://update.greasyfork.org/scripts/390828/AtCoder-Submission-RadioButton.user.js
// @updateURL https://update.greasyfork.org/scripts/390828/AtCoder-Submission-RadioButton.meta.js
// ==/UserScript==

(function () {
    'use strict';
    // 問題名を配列に
    const problem_names_Elements = document.getElementById('select-task').children;

    //問題ごとにループ
    for (var i = 0; i < problem_names_Elements.length; i++) {
        const problem_name = problem_names_Elements[i].innerHTML

        // ボタンの作成
        const button_txt = `<input type="radio" value="ボタン2" name="quiz" onclick="clickBtn(${i});" />${problem_name}<br>`
        // ボタンの挿入位置
        const button_place = document.querySelector('div.col-sm-12 span.error');
        // ボタンの挿入
        button_place.insertAdjacentHTML('beforebegin', button_txt);
    };

    // scriptの作成
    const script_elem = document.createElement("script");
    // scriptの中身
    script_elem.innerText = `function clickBtn(index) {
        document.getElementById('select-task').selectedIndex = index;
    };`
    // buttonの下の挿入
    const button_place = document.querySelector('div.col-sm-12 span.error');
    button_place.appendChild(script_elem);
})();