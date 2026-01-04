// ==UserScript==
// @name         会计凭证-抓题
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        http://www.yunsx.com/Question/DianDa_PracticalTrainingQuestionView?*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/403018/%E4%BC%9A%E8%AE%A1%E5%87%AD%E8%AF%81-%E6%8A%93%E9%A2%98.user.js
// @updateURL https://update.greasyfork.org/scripts/403018/%E4%BC%9A%E8%AE%A1%E5%87%AD%E8%AF%81-%E6%8A%93%E9%A2%98.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 下载答案
    function textToFile(fileName, text) {
        if (!fileName || !text) {
            return;
        }
        var URL = window.URL || window.webkitURL || window;
        var textStream = new window.Blob([text]);
        var a = document.createElement('a');
        a.style.display = 'none';
        a.href = URL.createObjectURL(textStream);
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    }

    // 清空答案
    var clearAnswer = function () {
        window.localStorage.setItem('answerList', '');
    }

    // 写入答案
    var writeAnswer = function (answer) {
        var answerList = window.localStorage.getItem('answerList') || '[]';
        answerList = JSON.parse(answerList);
        answerList.push(answer);
        window.localStorage.setItem('answerList', JSON.stringify(answerList));
    }

    // 输出答案
    var printAnswer = function () {
        textToFile('答案.txt', window.localStorage.getItem('answerList'));
    }

    console.log('正在准备抓题，等待页面渲染中......');
    setTimeout(() => {
        clearAnswer();
        console.log('页面渲染完成，开始抓题......');
        var answerLen = document.querySelector('.topic').querySelectorAll('li').length;
        console.log('本次目标抓题量：' + answerLen);
        var temp = 0;

        // 抓题主要逻辑
        var runCopyQues = function () {
            var title = document.querySelector('iframe').contentDocument.querySelector('#spTitle').innerText;
            openAnswer();
            setTimeout(() => {
                var iframes = document.querySelectorAll('iframe');
                var ansIframe = iframes[iframes.length-1];
                var dom = ansIframe.contentDocument;
                let answers = {};
                if (dom.querySelector('.date_panel')) {
                    // 记账凭证题型
                    var ans1 = dom.querySelector('.date_panel').querySelectorAll('input');
                    var ans2 = dom.querySelector('table').querySelectorAll('input');
                    var ans3 = dom.querySelector('.list-inline').querySelectorAll('input');
                    var ans4 = dom.querySelector('.right_zhang').querySelectorAll('input');
                    answers = {
                        ans1: [],
                        ans2: [],
                        ans3: [],
                        ans4: [],
                        title
                    };
                    for(var i=0, len=ans1.length; i<len; i++) {
                        answers.ans1.push(ans1[i].value);
                    }
                    for(var i=0, len=ans2.length; i<len; i++) {
                        answers.ans2.push(ans2[i].value)
                    }
                    for(var i=0, len=ans3.length; i<len; i++) {
                        answers.ans3.push(ans3[i].value)
                    }
                    for(var i=0, len=ans4.length; i<len; i++) {
                        answers.ans4.push(ans4[i].value)
                    }
                } else {
                    var inputs = dom.querySelectorAll('input');
                    var selects = dom.querySelectorAll('select');
                    // var labels = dom.querySelectorAll('label');
                    answers = {
                        inputs: [],
                        selects: [],
                        title
                        // labels: []
                    };
                    for(var i=0, len=inputs.length; i<len; i++) {
                        answers.inputs.push(inputs[i].value);
                    }
                    for(var i=0, len=selects.length; i<len; i++) {
                        answers.selects.push(selects[i].value);
                    }
                    // for(var i=0, len=labels.length; i<len; i++) {
                    // 	answers.labels.push(labels[i].innerText);
                    // }
                }
                console.log('抓取第 ' + (temp + 1) + ' 题');
                writeAnswer(answers);
                temp++;
                document.querySelector('.layui-layer-close').click();
                UpDown('Down');
                setTimeout(() => {
                    if (temp < answerLen) {
                        runCopyQues();
                    } else {
                        printAnswer();
                    }
                }, 1000);
            }, 3000);
        }

        runCopyQues();

    }, 3000);
})();