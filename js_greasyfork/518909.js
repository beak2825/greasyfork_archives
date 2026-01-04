// ==UserScript==
// @name         济南市继续医学教育学习平台自动答题提交
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  非全自动，需要手动点开答题界面，暂不支持考试
// @author       Manre
// @match        *://sdjn.91huayi.com/cme/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/518909/%E6%B5%8E%E5%8D%97%E5%B8%82%E7%BB%A7%E7%BB%AD%E5%8C%BB%E5%AD%A6%E6%95%99%E8%82%B2%E5%AD%A6%E4%B9%A0%E5%B9%B3%E5%8F%B0%E8%87%AA%E5%8A%A8%E7%AD%94%E9%A2%98%E6%8F%90%E4%BA%A4.user.js
// @updateURL https://update.greasyfork.org/scripts/518909/%E6%B5%8E%E5%8D%97%E5%B8%82%E7%BB%A7%E7%BB%AD%E5%8C%BB%E5%AD%A6%E6%95%99%E8%82%B2%E5%AD%A6%E4%B9%A0%E5%B9%B3%E5%8F%B0%E8%87%AA%E5%8A%A8%E7%AD%94%E9%A2%98%E6%8F%90%E4%BA%A4.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let answerElements = document.querySelectorAll('input[id^="gvQuestion_result_"]');

    answerElements.forEach((answerElement, index) => {
        let correctAnswerValue = answerElement.value;

        let optionTable = document.querySelector(`#gvQuestion_rbl_${index}`);
        if (!optionTable) {
            console.warn(`未找到第 ${index + 1} 题的选项表单`);
            return;
        }

        let options = optionTable.querySelectorAll('input[type="radio"]');
        if (!options || options.length === 0) {
            console.warn(`第 ${index + 1} 题没有选项`);
            return;
        }

        options.forEach(option => {
            if (option.value === correctAnswerValue) {
                option.click();
                console.log(`第 ${index + 1} 题已选择正确答案: ${option.nextSibling.textContent.trim()}`);
            }
        });
    });

    let submitButton = document.querySelector('.btn_mm');
    if (submitButton) {
        submitButton.click();
        console.log('已自动提交答案');
    } else {
        console.warn('未找到提交按钮');
    }
})();