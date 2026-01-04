// ==UserScript==
// @name         万华学习题库搜索
// @namespace    http://server.jcdev.cc:52126/
// @license      MIT
// @version      0.1.2
// @description  使用档案里的题库，对正在答卷的试题进行匹配，对于匹配到的试题给出正确答案
// @author       LFTEC
// @match        https://learning.whchem.com:6443/*
// @match        https://learning.whchem.com:4443/*
// @icon         https://learning.whchem.com:6443/favicon.ico
// @connect server.jcdev.cc
// @grant GM_xmlhttpRequest
// @grant GM_log
// @grant GM_addElement
// @grant unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/446291/%E4%B8%87%E5%8D%8E%E5%AD%A6%E4%B9%A0%E9%A2%98%E5%BA%93%E6%90%9C%E7%B4%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/446291/%E4%B8%87%E5%8D%8E%E5%AD%A6%E4%B9%A0%E9%A2%98%E5%BA%93%E6%90%9C%E7%B4%A2.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function sleep(time) {
        return new Promise(resolve => {
            setTimeout(() => {
                resolve(time);
            }, Math.floor(time * 1000))
        })
    }

    function checkElements(){
        return new Promise((resolve, reject) => {
            let interval = setInterval(() => {
                var element = document.getElementsByClassName('answerQuestion')[0];
                if(element != undefined) {

                    let title = document.getElementById("TimerHolder");
                    if(title == undefined) { return; }

                    sleep(1).then(() => checkElements())
                        .then((element) => appendAnswerLink(element));
                    clearInterval(interval);
                    resolve(element);
                } else {
                    return;
                }

            }, 500);
        });

    }

    function appendAnswerLink(element) {
        GM_log("检测到正在答题，插入获取答案按钮");

        let timerNode = document.getElementById('TimerHolder');
        let answerButton = document.getElementById('get_answer');
        if(!answerButton) {
            answerButton = document.createElement('a');
            answerButton.id = 'get_answer';
            answerButton.style = 'margin-left: 3em;';
            answerButton.innerText = '获取答案';
            answerButton.addEventListener('click', () => reportAnswer(element).then());
            timerNode.appendChild(answerButton);
            GM_log("获取答案按钮正确插入");
        }
    }

    function reportAnswer(element){
        return new Promise(resolve => {
            GM_log("获取答案中...");
            var elements = element.getElementsByClassName('swiper-slide');

            elements.forEach(question => {
                let questionItem = question.children[0];
                if(questionItem.id.substring(0,12) !== 'questionItem') {return;}
                let id = questionItem.id.substring(12);
                getAnswer(id).then((data) => fillAnswer(questionItem, data));
            });
        });
    }

    function getAnswer(tmid) {
        return new Promise(resolve => {
            GM_xmlhttpRequest({
                method: "GET",
                url: "http://server.jcdev.cc:52126/get?id=" + tmid,
                responseType: "json",
                onload: function(data) {
                    resolve(data.responseText);
                }
            });
        });

    }

    function fillAnswer(question, data){
        let id = question.id.substring(12);
        let trs = question.getElementsByClassName('question-select-item');
        if(trs.length === 0) {return;}
        let mapping = getAnswerMapping(trs);
        let answer = {};

        if (data == 'null') {
            GM_log("题库中不存在该题目");
            answer = {color: '#FF0000', text: '题库中不存在该题目'};
        }
        else if(data == undefined) {
            GM_log("获取题目时发生网络错误");
            answer = {color: '#FF0000', text: '获取题目时发生网络错误'};
        }
        else {
            let answers = JSON.parse(data)["Answers"].split(';');
            let newAnswers = [];
            answers.forEach(answer => {
                newAnswers.push(mapping[answer]);
            });
            newAnswers.sort();

            GM_log(newAnswers.join(';') + "/" + JSON.parse(data)["Answers"] + "/" + id);
            answer = {color: '#018AF4', text: "正确答案：" + newAnswers.join(';')};
        }
        

        let answerDiv = question.getElementsByClassName("question-item-right-answer")[0];
        InsertAnswerUIElement(answerDiv, answer);

    }

    function InsertAnswerUIElement(controller, answer) {
        let subController = controller.children;
        for(let i = subController.length - 1; i >= 0; i--) {
            controller.removeChild(subController[i]);
        }

        let p = document.createElement('p');
        p.style.color = answer.color;
        p.innerText = answer.text;
        controller.appendChild(p);
    }

    function getAnswerMapping(answers) {
        let mapping = {};
        answers.forEach(answer => {
            let ori = answer.getAttribute('rel_label');
            let map = answer.getElementsByClassName('question-select-item-label')[0].innerText;
            mapping[ori] = map;
        });

        return mapping;
    }

    sleep(1).then(() => checkElements())
        .then((element) => appendAnswerLink(element));
})();