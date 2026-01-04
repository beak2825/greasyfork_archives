// ==UserScript==
// @name         quizii页面审核——显示答案
// @namespace    http://tampermonkey.net/
// @version      0.3.0
// @description  页面审核时，显示答案
// @author       JinJunwei
// @match        http://*/MintelRev/servlet/MiddlemathServlet?Pid=part7-ex2&*
// @match        http://*/MintelRev/servlet/MiddlemathServlet?Pid=part2&*
// @match        http://*/MintelRev/servlet/MiddlemathServlet?Pid=part5&*
// @match        http://*/MintelRev/servlet/MiddlemathServlet?Pid=part6&*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/391433/quizii%E9%A1%B5%E9%9D%A2%E5%AE%A1%E6%A0%B8%E2%80%94%E2%80%94%E6%98%BE%E7%A4%BA%E7%AD%94%E6%A1%88.user.js
// @updateURL https://update.greasyfork.org/scripts/391433/quizii%E9%A1%B5%E9%9D%A2%E5%AE%A1%E6%A0%B8%E2%80%94%E2%80%94%E6%98%BE%E7%A4%BA%E7%AD%94%E6%A1%88.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 显示 基础练习和课中讨论的答案、解析
    if(displayAnswer("#choiceAnswer")){
        // 选中答案
        let answerIndex = document.querySelector("#choiceAnswer").innerText;
        document.querySelector("#radio"+answerIndex).checked=true;
        document.querySelector("div.chap_t_q.left").children[Number(answerIndex)].style.border="thin solid green";
        document.querySelector("div.chap_t_q.left").children[Number(answerIndex)].style.borderRadius="100px";
        // ，延迟提交答案
        if(!location.search.endsWith("&initFlg=init")){
            setTimeout(()=>{
                document.querySelector("#unitcontent div.answerBtn").click(); // 提交答案
            },1000);
        }
    }
    displayAnswerAll("#unitcontent div.chap_t_q.left > div > p")

    // 显示查漏补缺答案
    displayAnswer("#showanswer1")
    displayAnswer("#showanswer2")

    function displayAnswer(selector){
        const el = document.querySelector(selector);
        if(!el){
            return false;
        }
        el.style.display="block"
        return true;
    }
    function displayAnswerAll(selector){
        document.querySelectorAll(selector).forEach( el=>{
            el.style.display="block";
        });
    }
})();