// ==UserScript==
// @name         芝士架构题干固定脚本
// @namespace    https://www.cheko.cc/
// @version      2025-03-04
// @description  祝大家一战功成～
// @author       在细雨中呼喊
// @match        https://www.cheko.cc/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/528756/%E8%8A%9D%E5%A3%AB%E6%9E%B6%E6%9E%84%E9%A2%98%E5%B9%B2%E5%9B%BA%E5%AE%9A%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/528756/%E8%8A%9D%E5%A3%AB%E6%9E%B6%E6%9E%84%E9%A2%98%E5%B9%B2%E5%9B%BA%E5%AE%9A%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const STORAGE_KEY = "fixedQuestionMode"; // 存储用户模式的键名
    let toggleButton; // 按钮元素

    function createToggleButton() {
        toggleButton = document.createElement("button");
        toggleButton.style.position = "fixed";
        toggleButton.style.top = "10px";
        toggleButton.style.right = "10px";
        toggleButton.style.zIndex = "2000";
        toggleButton.style.padding = "8px 12px";
        toggleButton.style.background = "#007bff";
        toggleButton.style.color = "white";
        toggleButton.style.border = "none";
        toggleButton.style.borderRadius = "5px";
        toggleButton.style.cursor = "pointer";
        toggleButton.style.fontSize = "14px";
        toggleButton.style.boxShadow = "2px 2px 5px rgba(0, 0, 0, 0.2)";
        toggleButton.addEventListener("click", toggleQuestionMode);
        document.body.appendChild(toggleButton);
    }

    function updateButtonText(fixed) {
        if (toggleButton) {
            toggleButton.innerText = fixed ? "恢复默认" : "固定题干";
        }
    }

    function fixQuestionHeader(fixed) {
        let questionHeader = document.querySelector('.leading-10'); // 题干选择器
        if (questionHeader) {
            if (fixed) {
                questionHeader.style.position = 'fixed';
                questionHeader.style.top = '0';
                questionHeader.style.left = '0';
                questionHeader.style.width = '300px'; // 固定在左侧
                questionHeader.style.height = '100vh';
                questionHeader.style.overflowY = 'auto';
                questionHeader.style.background = 'white';
                questionHeader.style.zIndex = '1000';
                questionHeader.style.padding = '10px';
                questionHeader.style.boxShadow = '2px 0 8px rgba(0, 0, 0, 0.1)';
            } else {
                questionHeader.style.position = '';
                questionHeader.style.top = '';
                questionHeader.style.left = '';
                questionHeader.style.width = '';
                questionHeader.style.height = '';
                questionHeader.style.overflowY = '';
                questionHeader.style.background = '';
                questionHeader.style.zIndex = '';
                questionHeader.style.padding = '';
                questionHeader.style.boxShadow = '';
            }
        }
        updateButtonText(fixed); // 切换按钮文本
    }

    function toggleQuestionMode() {
        let currentMode = localStorage.getItem(STORAGE_KEY) === "true"; // 读取当前模式
        let newMode = !currentMode; // 反转模式
        localStorage.setItem(STORAGE_KEY, newMode); // 存储新模式
        fixQuestionHeader(newMode); // 应用新模式
    }

    // 初始化
    window.onload = function() {
        createToggleButton();
        let fixed = localStorage.getItem(STORAGE_KEY) === "true"; // 获取存储的模式
        fixQuestionHeader(fixed); // 应用模式
    };

})();
