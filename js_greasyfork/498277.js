// ==UserScript==
// @name         华东理工大学 [ECUST] 自动评教
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  监听键盘输入，输入数字，自动给所有项打分。输入“-”打10分
// @author       gpt-4o
// @match        https://inquiry.ecust.edu.cn/jsxsd/xspj/*
// @grant        none
// @license      Unlicense
// @downloadURL https://update.greasyfork.org/scripts/498277/%E5%8D%8E%E4%B8%9C%E7%90%86%E5%B7%A5%E5%A4%A7%E5%AD%A6%20%5BECUST%5D%20%E8%87%AA%E5%8A%A8%E8%AF%84%E6%95%99.user.js
// @updateURL https://update.greasyfork.org/scripts/498277/%E5%8D%8E%E4%B8%9C%E7%90%86%E5%B7%A5%E5%A4%A7%E5%AD%A6%20%5BECUST%5D%20%E8%87%AA%E5%8A%A8%E8%AF%84%E6%95%99.meta.js
// ==/UserScript==
 
(function() {
    'use strict';
 
    let intervalId;
    let score;
 
    // 定义一个函数，用于点击下一个符合条件的 <input> 元素
    function clickNextInput() {
        // 获取所有的 <input> 元素
        let inputs = document.querySelectorAll('input[type="radio"]');
        let index = 0;
 
        // 创建一个符合条件的 <input> 元素数组
        let inputsToClick = Array.from(inputs).filter(function(input) {
            let nextSiblingText = input.nextSibling && input.nextSibling.nodeType === Node.TEXT_NODE ? input.nextSibling.nodeValue.trim() : '';
            return nextSiblingText === score;
        });
 
        // 内部点击函数
        function clickInput() {
            if (index < inputsToClick.length) {
                inputsToClick[index].click();
                index++;
            } else {
                // 如果所有符合条件的元素都已被点击，清除定时器
                clearInterval(intervalId);
                intervalId = null; // 重置 intervalId 以便下次可以重新启动
            }
        }
 
        // 使用 setInterval 每秒调用一次 clickInput 函数
        intervalId = setInterval(clickInput, 50);
    }
 
    // 键盘事件监听器
    document.addEventListener('keydown', function(event) {
        if (event.key >= '0' && event.key <= '9') {
            score = event.key;
        } else if (event.key === '-') {
            score = '10';
        } else {
            return;
        }
 
        // 如果 intervalId 已存在，先清除它
        if (intervalId) {
            clearInterval(intervalId);
            intervalId = null;
        }
 
        clickNextInput();
    });
})();
