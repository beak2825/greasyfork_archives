// ==UserScript==
// @name         UOOC Answer Tester
// @namespace    http://tampermonkey.net/
// @version      0.2.2
// @description  【使用前先看介绍/有问题可反馈】UOOC 答案测试器 (UOOC Answer Tester)：此脚本是通过试错得到 UOOC 测试题的单选题答案，请按照指示进行操作，请注意，此脚本并不能直接得到单选题的正确答案。此方法可行的原因是，小测成功提交的正确率需要在 70% 以上，利用这一点，在单选题较多时可以较大概率保证在试错的时候不会误提交。也就是说，在单选题题量很少的时候，并不适合使用该方法进行试错找答案。
// @author       cc
// @match        http://www.uooc.net.cn/home/learn/index*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/419427/UOOC%20Answer%20Tester.user.js
// @updateURL https://update.greasyfork.org/scripts/419427/UOOC%20Answer%20Tester.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function setOption (option) {
        let questions = frames[0].document.querySelector('.queItems');
        if (typeof option === 'string') {
            for (let i = 1; i < questions.children.length; i++) {
                let options = questions.children[i].querySelectorAll('input');
                options[option.charCodeAt() - 'A'.charCodeAt()].click();
            }
        } else {
            for (let i = 1; i < questions.children.length; i++) {
                let options = questions.children[i].querySelectorAll('input');
                options[option[i - 1].charCodeAt() - 'A'.charCodeAt()].click();
            }
        }
    };
    function getOption () {
        let questions = frames[0].document.querySelector('.queItems');
        let right = [];
        for (let i = 1; i < questions.children.length; i++) {
            let score = questions.children[i].querySelector('.scores span').innerHTML;
            let pattern = /\d+\.?\d*/g;
            score = parseFloat(pattern.exec(score)[0]);
            right.push(Boolean(score > 0));
        }
        return right;
    };
    function findOption (rights) {
        let questionCount = rights[0].length;
        let optionCount = rights.length;
        let answer = [];
        for (let i = 0; i < questionCount; i++) {
            for (let j = 0; j < optionCount; j++) {
                if (rights[j][i]) {
                    answer[i] = String.fromCharCode('A'.charCodeAt() + j);
                    break;
                }
            }
        }
        return answer;
    };
    function hint () {
        if ($('.basic span.icon-dingdanguanli')[0]) {
            let op = `
            
                此脚本是通过试错得到 UOOC 测试题的单选题答案，请按照指示进行操作，请注意，此脚本并不能直接得到单选题的正确答案。
                
                此方法可行的原因是，小测成功提交的正确率需要在 70% 以上，利用这一点，在单选题较多时可以较大概率保证在试错的时候不会误提交。

                也就是说，在单选题题量很少的时候，并不适合使用该方法进行试错找答案。

                复制下述代码并回车执行
                AnswerTester.setOption('A');

                请手动提交该答卷，提交成功后复制下述代码并回车执行
                let r1 = AnswerTester.getOption();
                AnswerTester.setOption('B');

                请再次手动提交该答卷，提交成功后复制下述代码并回车执行
                let r2 = AnswerTester.getOption();
                AnswerTester.setOption('C');

                请再次手动提交该答卷，提交成功后复制下述代码并回车执行
                let r3 = AnswerTester.getOption();
                AnswerTester.setOption('D');

                请再次手动提交该答卷，提交成功后复制下述代码并回车执行
                let r4 = AnswerTester.getOption();
                let r = [r1, r2, r3, r4];
                let answer = AnswerTester.findOption(r);
                AnswerTester.setOption(answer);

                此时单选题的正确答案已经通过试错得到😄

            `;
            console.warn(op.replace(/ {2,}/g, ''));
        };
    };
    window.AnswerTester = {
        setOption: setOption,
        getOption: getOption,
        findOption: findOption,
    };
    $(document).ready(hint);
    window.onhashchange = function (event) {
        hint();
    };
})();