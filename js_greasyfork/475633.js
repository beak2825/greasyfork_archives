// ==UserScript==
// @name         xzExam
// @namespace    http://tampermonkey.net/
// @version      0.6
// @description  这个是一个答题器
// @author       You
// @license MIT
// @match        https://e11.edu-edu.com/exam/student/exam2/doview/*
// @match        https://e12.edu-edu.com/exam/student/exam2/doview/*
// @match        https://e0.edu-edu.com/exam/student/exam2/doview/*
// @match        https://e1.edu-edu.com/exam/student/exam2/doview/*
// @match        https://e2.edu-edu.com/exam/student/exam2/doview/*
// @match        https://e3.edu-edu.com/exam/student/exam2/doview/*
// @match        https://e4.edu-edu.com/exam/student/exam2/doview/*
// @match        https://e5.edu-edu.com/exam/student/exam2/doview/*
// @match        https://e6.edu-edu.com/exam/student/exam2/doview/*
// @match        https://e7.edu-edu.com/exam/student/exam2/doview/*
// @match        https://e8.edu-edu.com/exam/student/exam2/doview/*
// @match        https://e9.edu-edu.com/exam/student/exam2/doview/*
// @match        https://e10.edu-edu.com/exam/student/exam2/doview/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=wistron.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/475633/xzExam.user.js
// @updateURL https://update.greasyfork.org/scripts/475633/xzExam.meta.js
// ==/UserScript==

(function() {
    'use strict';
    setTimeout(()=>{
        var iframe=document.getElementsByTagName('iframe')[0];
        console.log(window.__ExamIns)
        window.__ExamIns.allowSeeAnswer = true;
        document.getElementsByTagName('iframe')[0].src=document.getElementsByTagName('iframe')[0].src
        setTimeout(()=>{
            let dom = document.getElementsByTagName('iframe')[0].contentWindow.document.getElementsByClassName('ui-question ui-question-independency')
            window.list = []
            for(let i=0;i<dom.length;i++){
                let answer = []

                let answer_dom = dom[i].getElementsByClassName('ui-correct-answer')
                for(let y = 0;y<answer_dom.length;y++){
                    answer.push(answer_dom[y].getAttribute('code'));
                }

                window.list.push({id:dom[i].id,answer:answer});
            }
            // 创建临时元素
            var tempElement = document.createElement("textarea");
            var value = `
        const a = async(ls)=>{ls.getElementsByTagName('span')[0].click()}
        let dom = document.getElementsByTagName('iframe')[0].contentWindow.document.getElementsByClassName('ui-question ui-question-independency');
${JSON.stringify(window.list)}.forEach(async(e,index)=>{
    let lis = dom[index].getElementsByTagName('li')
    for(let i=0;i<lis.length;i++){
        if(e.answer.includes(lis[i].getAttribute('code'))){
            await a(lis[i])
        }
    }
})
        `
            // 设置元素的值
            tempElement.value = value.toString();

            // 将元素添加到文档中
            document.body.appendChild(tempElement);

            // 选中文本
            tempElement.select();

            // 复制文本
            //document.execCommand("copy");
            //setTimeout(()=>{
            //document.execCommand("copy");
            //},1000)

            // 删除元素
            //document.body.removeChild(tempElement);
            console.log('复制完毕')
        },3000)
    },3000)

    // Your code here...
})();