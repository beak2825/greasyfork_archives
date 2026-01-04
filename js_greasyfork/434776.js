// ==UserScript==
// @name         东南大学实验室安全常识考试辅助
// @namespace    http://tampermonkey.net/
// @version      0.1.3
// @description  东南大学实验室安全培训及考核系统——东南大学实验室安全常识考试辅助。在考试界面，按键盘上F12即可看到答案.目前已知问题:题目:ABC干粉灭火器适用于：会错误返回A,B,D而不是A,B,C
// @author       Aleph-0
// @license      GPL-3.0-only
// @match        *://safe.seu.edu.cn/LabSafetyExamSchoolSSO/*
// @require      https://greasyfork.org/scripts/434773-seu-examsafety-question-bank/code/SEU%20examsafety%20Question%20Bank.js?version=984164
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/434776/%E4%B8%9C%E5%8D%97%E5%A4%A7%E5%AD%A6%E5%AE%9E%E9%AA%8C%E5%AE%A4%E5%AE%89%E5%85%A8%E5%B8%B8%E8%AF%86%E8%80%83%E8%AF%95%E8%BE%85%E5%8A%A9.user.js
// @updateURL https://update.greasyfork.org/scripts/434776/%E4%B8%9C%E5%8D%97%E5%A4%A7%E5%AD%A6%E5%AE%9E%E9%AA%8C%E5%AE%A4%E5%AE%89%E5%85%A8%E5%B8%B8%E8%AF%86%E8%80%83%E8%AF%95%E8%BE%85%E5%8A%A9.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var questions = document.getElementsByClassName("styleTitle");
    var _question, question, index, answer;
    var notfounds = new Array(), dislocations = new Array();
    var notfound = 0, dislocation = 0;
    for (let i = 0, __qlength__ = questions.length; i < __qlength__; ++i) {
        var choice_length=document.getElementsByName("question"+i.toString()).length
        _question = questions[i].children[0].textContent.split("\u002e");
        index = _question.shift();
        question = _question.join("\u002e").replace(/\s/g, "");
        console.log(question)
        answer = findAnswer(question);
        console.log(answer)
    }
})();