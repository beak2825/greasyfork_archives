// ==UserScript==
// @name         百度在线答题自动选择器
// @namespace    http://tampermonkey.net/
// @version      2025-06-15
// @description  自动从题目中提取答案文本并选择匹配选项
// @author       tony
// @match        https://www.baidu.com/s?*question_store_id=*
// @icon         https://www.baidu.com/favicon.ico
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/538975/%E7%99%BE%E5%BA%A6%E5%9C%A8%E7%BA%BF%E7%AD%94%E9%A2%98%E8%87%AA%E5%8A%A8%E9%80%89%E6%8B%A9%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/538975/%E7%99%BE%E5%BA%A6%E5%9C%A8%E7%BA%BF%E7%AD%94%E9%A2%98%E8%87%AA%E5%8A%A8%E9%80%89%E6%8B%A9%E5%99%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 主执行函数
    function autoSelectAnswer() {
        // 搜索区
        const questionElement = document.querySelector('p.marklang-paragraph');
        if ( !questionElement ) {
            console.log('未找到题目元素');
            return;
        }

        let answerText = questionElement.textContent.trim().split('答案:');
        if ( answerText.length < 2 ) {
        	console.log('未找到题目答案');
        	return;
        }
        answerText = answerText[1].trim();
        console.log('提取的答案文本:', answerText);

        let questionText = questionElement.textContent.trim().split('\n')[0].split('题目:')
        if ( questionText.length < 2 ) {
        	console.log('搜索区未找到题干');
        	return;
        }
        questionText = questionText[1].trim().replace(/<[^>]+>/g, '');
        console.log('搜索区提取的题干内容:', questionText);

        // 答题区
        const continueButton = document.querySelector('button[class^="continueButton_"]');
        if ( continueButton ) {
        	continueButton.click();
        	return;
        }

        let questionBody = document.querySelector('div[class^="questionContent_"]');
        if ( !questionBody ) {
        	console.log('答题区未找到题干');
        	return;
        }
        questionBody = questionBody.querySelector('div[class^="questionContent_"]');
        if ( !questionBody ) {
            console.log('答题区未找到题目标题');
            return;
        }
        if ( !questionBody.textContent.trim().startsWith(questionText) ) {
            console.log('答题区和搜索区标题不一致，请手工完成该题');
            return;
        }

        // 查找所有选项
        const options = document.querySelectorAll('div[class^="optionItem_"]');
        if (options.length === 0) {
            console.log('未找到选项元素');
            return;
        }

        // 遍历选项寻找匹配项
        let foundMatch = false;
        options.forEach(option => {
            // if (option.textContent.trim().includes(answerText)) {
            if ( option.textContent.trim() === answerText ) {
                option.click();
                console.log('已选择匹配选项:', option.textContent.trim());
                foundMatch = true;
            }
        });

        if (!foundMatch) {
            console.log('未找到包含答案文本的选项');
        }
    }

    // 延迟执行以确保DOM加载完成
    setInterval(autoSelectAnswer, 2000);
    // setTimeout(autoSelectAnswer, 2000);
})();