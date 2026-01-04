// ==UserScript==
// @name         表单自动填充脚本
// @namespace    http://tampermonkey-auto-fill-input-fields
// @version      1.1
// @description  开发测试使用，自动对当前页面没有禁用的按钮进行数据填充
// @match        http://*/*
// @match        https://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/464877/%E8%A1%A8%E5%8D%95%E8%87%AA%E5%8A%A8%E5%A1%AB%E5%85%85%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/464877/%E8%A1%A8%E5%8D%95%E8%87%AA%E5%8A%A8%E5%A1%AB%E5%85%85%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let isAutoFillEnabled = false;

    function autoFillInputs() {
        const inputFields = document.querySelectorAll('input[type="text"]:not([readonly]):not([disabled]), input[type="email"]:not([readonly]):not([disabled]), input[type="password"]:not([readonly]):not([disabled]), textarea:not([readonly]):not([disabled]), select:not([readonly]):not([disabled]), input[type="radio"]:not([readonly]):not([disabled]), input[type="checkbox"]:not([readonly]):not([disabled]), input[type="number"]:not([readonly]):not([disabled]), input[type="date"]:not([readonly]):not([disabled])');
        inputFields.forEach(field => {
            if(field.type === 'text') {
                field.value = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
            } else if(field.type === 'email') {
                field.value = Math.random().toString(36).substring(2, 15) + '@' + Math.random().toString(36).substring(2, 15) + '.com';
            } else if(field.type === 'password') {
                field.value = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
            } else if(field.tagName === 'TEXTAREA') {
                field.value = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
            } else if(field.tagName === 'SELECT') {
                const options = field.querySelectorAll('option');
                const randomIndex = Math.floor(Math.random() * options.length);
                options[randomIndex].selected = true;
            } else if(field.type === 'radio' || field.type === 'checkbox') {
                field.checked = Math.random() < 0.5;
            } else if(field.type === 'number') {
                field.value = Math.floor(Math.random() * 100);
            } else if(field.type === 'date') {
                field.value = new Date().toISOString().slice(0, 10);
            }
        });
    }

    function toggleAutoFill() {
        isAutoFillEnabled = !isAutoFillEnabled;
        if (isAutoFillEnabled) {
            autoFillInputs();
        } else {
            const inputFields = document.querySelectorAll('input[type="text"]:not([readonly]):not([disabled]), input[type="email"]:not([readonly]):not([disabled]), input[type="password"]:not([readonly]):not([disabled]), textarea:not([readonly]):not([disabled]), select:not([readonly]):not([disabled]), input[type="radio"]:not([readonly]):not([disabled]), input[type="checkbox"]:not([readonly]):not([disabled]), input[type="number"]:not([readonly]):not([disabled]), input[type="date"]:not([readonly]):not([disabled])');
            inputFields.forEach(field => {
                field.value = '';
                if(field.tagName === 'SELECT') {
                    const options = field.querySelectorAll('option');
                    options.forEach(option => {
                        option.selected = false;
                    });
                } else if(field.type === 'radio' || field.type === 'checkbox') {
                    field.checked = false;
                }
            });
        }
    }

    const toggleButton = document.createElement('button');
    toggleButton.textContent = '自动填充';
    toggleButton.style.position = 'fixed';
    toggleButton.style.top = '20px';
    toggleButton.style.right = '20px';
    toggleButton.style.zIndex = '9999';
    toggleButton.addEventListener('click', toggleAutoFill);

    const body = document.querySelector('body');
    body.appendChild(toggleButton);

    //setInterval(() => {
    //    if (isAutoFillEnabled) {
    //        autoFillInputs();
    //    }
    //}, 1000);
})();
