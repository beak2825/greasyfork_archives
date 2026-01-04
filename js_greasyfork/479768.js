// ==UserScript==
// @name         高等继续教育网自动刷题，支持【单选题、多选题、简答题、填空题、在线考试】
// @description  已停更，永久免费，不保证百分百可用
// @namespace    http://tampermonkey.net/
// @version      0.1.4
// @description  
// @author       nightjarjar
// @match        https://kc.jxjypt.cn/paper/start*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/479768/%E9%AB%98%E7%AD%89%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2%E7%BD%91%E8%87%AA%E5%8A%A8%E5%88%B7%E9%A2%98%EF%BC%8C%E6%94%AF%E6%8C%81%E3%80%90%E5%8D%95%E9%80%89%E9%A2%98%E3%80%81%E5%A4%9A%E9%80%89%E9%A2%98%E3%80%81%E7%AE%80%E7%AD%94%E9%A2%98%E3%80%81%E5%A1%AB%E7%A9%BA%E9%A2%98%E3%80%81%E5%9C%A8%E7%BA%BF%E8%80%83%E8%AF%95%E3%80%91.user.js
// @updateURL https://update.greasyfork.org/scripts/479768/%E9%AB%98%E7%AD%89%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2%E7%BD%91%E8%87%AA%E5%8A%A8%E5%88%B7%E9%A2%98%EF%BC%8C%E6%94%AF%E6%8C%81%E3%80%90%E5%8D%95%E9%80%89%E9%A2%98%E3%80%81%E5%A4%9A%E9%80%89%E9%A2%98%E3%80%81%E7%AE%80%E7%AD%94%E9%A2%98%E3%80%81%E5%A1%AB%E7%A9%BA%E9%A2%98%E3%80%81%E5%9C%A8%E7%BA%BF%E8%80%83%E8%AF%95%E3%80%91.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 获取所有的问题项（li元素）
    let questionItems = document.querySelectorAll('li[id^="question_li_"]');

    // 遍历每个问题项
    questionItems.forEach(function (item) {

        // 获取“展开解析”的链接元素
        let expandLink = item.querySelector('.zkjx');

        // 模拟点击“展开解析”
        if (expandLink) {
            expandLink.click();

            // 等待异步请求完成，然后获取参考答案并填充到textarea中
            setTimeout(function () {
                fillReferenceAnswer(item);
            }, 1000); // 可根据实际情况调整等待时间
        } else {
            // 获取隐藏域的值
            let pqidValue = item.querySelector('input[name^="pqid"]').value;
            console.debug('pqid value:', pqidValue);

            let captchaIdValue = document.querySelector('#captchaId').value;
            console.log(captchaIdValue);

            $.ajax({
                url: "question/resolve/txt",
                data: {uid: captchaIdValue, pqid: pqidValue},
                success: function (data) {
                    if (data.type === "success") {
                        fillReferenceAnswer(item, data.content);
                    }
                }
            });
        }

    });

    // 填充参考答案到textarea的函数
    function fillReferenceAnswer(item, referenceAnswerText) {
        // 获取当前问题项的答案文本
        let answerText;
        if(referenceAnswerText != null){
            answerText = referenceAnswerText;
        }else{
            answerText = item.querySelector('.solution').textContent.trim();
        }


        // 寻找“参考答案：”后的内容
        let startIndex = answerText.indexOf('释疑：');
        let endIndex = answerText.indexOf('解析：');
        let referenceAnswer = answerText.substring(startIndex + 5, endIndex).trim();

        // 如果 referenceAnswer 的长度大于 1，则认为是多选题，逐个模拟点击对应的 dd 标签
        if (referenceAnswer.length > 1) {
            simulateClickOnMultipleDD(item, referenceAnswer);
        } else {
            // 模拟点击与参考答案相匹配的 dd 标签
            simulateClickOnCorrectDD(item, referenceAnswer);
        }

        // 获取当前问题项的 textarea 元素
        let textarea = item.querySelector('textarea');

        // 将截取的文本填充到 textarea 中
        if (textarea && referenceAnswer) {
            textarea.value = referenceAnswer;

            // 手动触发输入事件（change）
            let changeEvent = new Event('change', {bubbles: true});
            textarea.dispatchEvent(changeEvent);

            // 手动触发失去焦点事件（blur）
            textarea.blur();
        }
    }

    // 模拟点击与参考答案相匹配的 dd 标签
    function simulateClickOnCorrectDD(item, referenceAnswer) {
        // 获取当前问题项的所有 dd 标签
        let ddList = item.querySelectorAll('.sub-answer dd');

        // 遍历 dd 标签
        ddList.forEach(function (dd) {
            // 获取当前 dd 标签的 data-value 属性值
            let ddValue = dd.getAttribute('data-value');

            // 如果当前 dd 标签的值与参考答案匹配，则模拟点击事件
            if (ddValue === referenceAnswer) {
                dd.click();
            }
        });
    }

    // 多选题情况下，逐个模拟点击对应的 dd 标签
    function simulateClickOnMultipleDD(item, referenceAnswer) {
        // 获取当前问题项的所有 dd 标签
        let ddList = item.querySelectorAll('.sub-answer dd');

        // 遍历 referenceAnswer 中的每个字符，逐个模拟点击对应的 dd 标签
        for (let i = 0; i < referenceAnswer.length; i++) {
            let currentChar = referenceAnswer[i];

            // 找到对应的 dd 标签并模拟点击
            let correspondingDD = findDDByValue(ddList, currentChar);
            if (correspondingDD) {
                correspondingDD.click();
            }
        }
    }

    // 根据 data-value 的值找到对应的 dd 标签
    function findDDByValue(ddList, value) {
        for (let i = 0; i < ddList.length; i++) {
            let ddValue = ddList[i].getAttribute('data-value');
            if (ddValue === value) {
                return ddList[i];
            }
        }
        return null;
    }
})();
