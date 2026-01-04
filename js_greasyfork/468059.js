// ==UserScript==
// @name         考试页面
// @namespace    https://greasyfork.org/zh-CN/users/883114-lys-qs
// @version      0.1
// @description  一键答题!
// @author       LYS
// @match        https://m.mynj.cn:11188/zxpx/auc/courseExam*
// @run-at       document-end
// @icon         none
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/468059/%E8%80%83%E8%AF%95%E9%A1%B5%E9%9D%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/468059/%E8%80%83%E8%AF%95%E9%A1%B5%E9%9D%A2.meta.js
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
    button1.innerText = '初次答题';
    button1.style.backgroundColor = 'red';
    button1.style.color = 'white';
    button2.style.position = 'fixed';
    button2.style.top = '0';
    button2.style.right = '0';
    button2.style.zIndex = '99999';
    button2.innerText = '搜索答题';
    button2.style.backgroundColor = 'blue';
    button2.style.color = 'white';

    // 执行button1的功能
    button1.addEventListener('click', () => {
        $(':radio[value=A]').click();
        $(':radio[value=1]').click();
        $(':checkbox[value=A]').click();
        $(':checkbox[value=C]').click();
        $(':checkbox[value=E]').click();
    });

    button2.addEventListener('click', () => {
        button1.click()
        // 从 localStorage 中读取数据
        const storedData = localStorage.getItem('exam-data');
        const data = JSON.parse(storedData)

        function checkString(str) {
            if (str === '正确') {
                return "1";
            } else if (str === '错误') {
                return "0";
            } else {
                // 提取所有“、”之前的字母
                const matches = str.match(/[A-Za-z]+(?=、)/g);
                if (matches) {
                    return matches;
                } else {
                    return null;
                }
            }
        }


        // 获取所有class="exam-subject-text-que-title"的元素
        $('.exam-subject-text-que-title').each(function (index, element) {
            const rawQuestion = this.textContent.trim();
            const question = rawQuestion.substring(3);
            // 在所有 localStorage 中的问题中查找当前问题对应的答案
            let answer = '';
            for (let i = 0; i < data.length; i++) {
                if (data[i].questions[0].question.includes(question)) {
                    var answers = data[i].questions[0].answer;
                    answers = checkString(answers)
                    answers = Array.from(answers)
                    console.log(answers);
                    $(this).parent().nextAll().find('input').prop('checked', false);
                    answers.forEach(item => {
                        console.log(item);

                        $(this).parent().nextAll().find('input[value="' + item + '"]').prop('checked', true);
                    });
                    break;
                }
            }

        });
        $('#exam_sub').click()
    });


    // 将button添加到body元素中
    document.body.appendChild(button1);
    document.body.appendChild(button2);

})();