// ==UserScript==
// @name         Yiban Resolve
// @namespace    https://github.com/MukjepScarlet/tampermonkey-scripts/blob/main/
// @run-at       document-end
// @version      0.2
// @description  Bypass!
// @author       konohaScarlet_
// @icon         https://www.yiban.cn/favicon.ico
// @grant        none
// @match        *://exam.yooc.me/group/*/exam/*
// @original-license GPL License
// @downloadURL https://update.greasyfork.org/scripts/461991/Yiban%20Resolve.user.js
// @updateURL https://update.greasyfork.org/scripts/461991/Yiban%20Resolve.meta.js
// ==/UserScript==

(async function() {
    'use strict';

    const decode = {
        "ulWbkFGQj92b51lIwIyW": "A",
        "ulWbkFGQj92b51lIxIyW": "B",
        "ulWbkFGQj92b51lIyIyW": "C",
        "ulWbkFGQj92b51lIzIyW": "D",
        "ulWbkFGQj92b51lI0IyW": "E",
        "==gbp1GZhB0Yv9WedJSMiwiIwIyW": ["A", "B"],
        "==gbp1GZhB0Yv9WedJiMiwiIwIyW": ["A", "C"],
        "==gbp1GZhB0Yv9WedJyMiwiIwIyW": ["A", "D"],
        "==gbp1GZhB0Yv9WedJiMiwiIxIyW": ["B", "C"],
        "==gbp1GZhB0Yv9WedJyMiwiIxIyW": ["B", "D"],
        "==gbp1GZhB0Yv9WedJyMiwiIyIyW": ["C", "D"],
        "=4WatRWYAN2bvlXXiIjIsISMiwiIwIyW": ["A", "B", "C"],
        "=4WatRWYAN2bvlXXiMjIsISMiwiIwIyW": ["A", "B", "D"],
        "=4WatRWYAN2bvlXXiQjIsISMiwiIwIyW": ["A", "B", "E"],
        "=4WatRWYAN2bvlXXiMjIsIiMiwiIwIyW": ["A", "C", "D"],
        "=4WatRWYAN2bvlXXiQjIsIiMiwiIwIyW": ["A", "C", "E"],
        "=4WatRWYAN2bvlXXiMjIsIiMiwiIxIyW": ["B", "C", "D"],
        "ulWbkFGQj92b51lIzICLiIjIsISMiwiIwIyW": ["A", "B", "C", "D"],
        "ulWbkFGQj92b51lI0ICLiIjIsISMiwiIwIyW": ["A", "B", "C", "E"],
        "ulWbkFGQj92b51lI0ICLiMjIsIiMiwiIwIyW": ["A", "C", "D", "E"],
        "==gbp1GZhB0Yv9WedJCNiwiIzICLiIjIsISMiwiIwIyW": ["A", "B", "C", "D", "E"]
    };

    async function request(url, options) {
        const response = await fetch(url, options);
        const resJson = await response.json();
        return resJson;
    }

    const examId = window.location.href.match(/exam\/([0-9]+)?/)[1];
    const userId = document.cookie.match(/user_id=([0-9]+)?/)[1];
    const examuserId = (await request(`https://exambackend.yooc.me/api/exam/setting/get?examId=${examId}&userId=${userId}`)).data.examuserId;

    const data = (await request(`https://exambackend.yooc.me/api/exam/paper/get?examuserId=${examuserId}`)).data

    const answers = data.flatMap(sec => sec.subjects).map(subj => subj.answer = decode[subj.answer]);

    const m = document.getElementsByClassName("jsx-3643416060").item(0).parentElement;

    let ansTag = document.createElement("div");
    ansTag.setAttribute("id", "answer");
    m.appendChild(ansTag);

    // 题号变化随时更新

    const questionNumTag = document.getElementsByClassName("jsx-3527395752").item(3);

    questionNumTag.addEventListener("DOMSubtreeModified", e => {
        const newValue = e.target.data; // 改变后（现在）的题号
        const currentAnswer = answers[newValue - 1];
        ansTag.innerHTML = `第${newValue}题答案：` + (typeof currentAnswer == "string" ? currentAnswer : (currentAnswer?.join("，") ?? "选项不在库中，请反馈"));
    });
})();
