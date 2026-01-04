// ==UserScript==
// @name         考试答案页
// @namespace    https://greasyfork.org/zh-CN/users/883114-lys-qs
// @version      0.1
// @description  获取答案内容!
// @author       LYS
// @match        https://m.mynj.cn:11188/zxpx/auc/examination/subexam*
// @run-at       document-end
// @icon         none
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/468058/%E8%80%83%E8%AF%95%E7%AD%94%E6%A1%88%E9%A1%B5.user.js
// @updateURL https://update.greasyfork.org/scripts/468058/%E8%80%83%E8%AF%95%E7%AD%94%E6%A1%88%E9%A1%B5.meta.js
// ==/UserScript==

(function () {
    'use strict';
    // 创建button元素
    const button1 = document.createElement('button');
    const button2 = document.createElement('button');

    // 设置button的样式
    button1.style.position = 'fixed';
    button1.style.top = '0';
    button1.style.left = '0';
    button1.style.zIndex = '99999';
    button1.innerText = '保存/更新答案';
    button1.style.backgroundColor = 'red';
    button1.style.color = 'white';
    button2.style.position = 'fixed';
    button2.style.top = '0';
    button2.style.right = '0';
    button2.style.zIndex = '99999';
    button2.innerText = '再考一次';
    button2.style.backgroundColor = 'blue';
    button2.style.color = 'white';

    // 执行button1的功能
    button1.addEventListener('click', () => {
        const examSubjectTextPanels = document.getElementsByClassName('exam-subject-text-panel');

        let data = [];

        // 从localStorage中读取数据
        const storedData = localStorage.getItem('exam-data');
        if (storedData) {
            data = JSON.parse(storedData);
        }

        // 遍历每一组内容，提取出问题和答案
        for (let i = 0; i < examSubjectTextPanels.length; i++) {
            const titleElems = examSubjectTextPanels[i].querySelectorAll('.exam-subject-text-que-title');
            const answerElems = examSubjectTextPanels[i].querySelectorAll('.exam-subject-text-queanswar');

            const questions = [];
            for (let j = 0; j < titleElems.length; j++) {
                const question = titleElems[j].textContent.trim();
                let answer = '';
                for (let k = 0; k < answerElems.length; k++) {
                    if (answerElems[k].parentNode === titleElems[j].parentNode.nextElementSibling && answerElems[k].textContent.includes('正确答案')) {
                        answer = answerElems[k].textContent.match(/正确答案：(.+)/)[1].trim();
                        break;
                    }
                }
                questions.push({
                    question,
                    answer
                });
            }

            // 检查问题是否已经存在，如不存在，则将问题和答案添加到数组中
            const isQuestionsExist = data.some(item => JSON.stringify(item.questions) === JSON.stringify(questions));
            if (!isQuestionsExist) {
                data.push({
                    questions
                });
            }
        }

        // 将数据存储到localStorage中
        localStorage.setItem('exam-data', JSON.stringify(data));
        console.log(data);
        alert("答案已更新/保存！")
    });


    // 执行button2的功能
    button2.addEventListener('click', () => {

        // 获取当前页面的 URL
        var currentUrl = window.location.href;

        // 要替换的字符串
        var originalString = "exid=";

        // 要替换成的字符串
        var newString = "https://m.mynj.cn:11188/zxpx/auc/courseExam?exid=";

        // 查找要替换的字符串
        var index = currentUrl.indexOf(originalString);

        // 如果找到了要替换的字符串
        if (index >= 0) {
            // 将要替换的字符串和后面的部分提取出来
            var urlSuffix = currentUrl.substring(index + originalString.length);

            // 拼接新的 URL
            var newUrl = newString + urlSuffix;

            // 跳转到新的 URL
            window.location.href = newUrl;
        }


    })

    // 将button添加到body元素中
    document.body.appendChild(button1);
    document.body.appendChild(button2);
    // Your code here...
})();