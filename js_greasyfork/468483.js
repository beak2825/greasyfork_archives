// ==UserScript==
// @name         学习通快速看题
// @namespace    https://trudbot.cn/
// @version      0.21
// @description  方便快速地在学习通中回顾已批改、有参考答案的作业
// @author       trudbot
// @match        *://*.chaoxing.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=chaoxing.com
// @grant        none
// @license      GPL-2.0-only
// @downloadURL https://update.greasyfork.org/scripts/468483/%E5%AD%A6%E4%B9%A0%E9%80%9A%E5%BF%AB%E9%80%9F%E7%9C%8B%E9%A2%98.user.js
// @updateURL https://update.greasyfork.org/scripts/468483/%E5%AD%A6%E4%B9%A0%E9%80%9A%E5%BF%AB%E9%80%9F%E7%9C%8B%E9%A2%98.meta.js
// ==/UserScript==


(function () {
    //确保是已结束的作业
    if(document.getElementsByClassName('analysisCard ') === undefined) return;

    //格式不符
    let qSets = document.getElementsByClassName('mark_item');
    if (qSets === undefined) return;

    let types = ['单选题', '多选题', '判断题', '论述题', '简答题'];
    let ops = ['A', 'B', 'C', 'D'];
    let boolV = ['对', '错'];

    function getExits(s, arr) {
        return arr.filter(v => s.includes(v));
    }
    for (let qSet of qSets) {
        let qs = qSet.getElementsByClassName('questionLi');

        let type = getExits(qSet.getElementsByClassName('type_tit')[0].innerText, types)[0];

        for (let q of qs) {

            let answerContainer = q.getElementsByClassName('mark_answer')[0];
            let answer = answerContainer.querySelectorAll("span.colorGreen")[0];

            if (type === '单选题' || type === '多选题' || type === '判断题') {
                answerContainer.style.display = 'none';
                let option = q.getElementsByClassName('mark_letter')[0].getElementsByTagName('li');
                if (type === '单选题' || type === '多选题') {
                    let correct = getExits(answer.innerText, ops);
                    for (let op of correct) {
                        let id = op.charCodeAt(0) - 65;
                        let correctOption = option[id];
                        // correctOption.setAttribute('class', 'colorGreen');
                        correctOption.style.backgroundColor = '#00B86E';
                    }
                } else if (type == '判断题') {
                    let op = getExits(answer.innerText, boolV)[0];
                    let id = (op == '对' ? 0 : 1);
                    option[id].style.backgroundColor = '#00B86E';
                }
            } else {
                let myAnswer = answerContainer.getElementsByClassName('mark_fill')[0];
                myAnswer.style.display = 'none';
            }
        }
    }
})();