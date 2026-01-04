// ==UserScript==
// @name         东农urp教务系统自动评教脚本
// @namespace    https://greasyfork.org/zh-CN/users/792995-a-bcd
// @version      1.1
// @description  东北农业大学教务系统一键评教脚本
// @license      MIT
// @author       abcd
// @match        https://zhjwxs.neau.edu.cn/student/teachingEvaluation/newEvaluation/evaluation/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/521265/%E4%B8%9C%E5%86%9Curp%E6%95%99%E5%8A%A1%E7%B3%BB%E7%BB%9F%E8%87%AA%E5%8A%A8%E8%AF%84%E6%95%99%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/521265/%E4%B8%9C%E5%86%9Curp%E6%95%99%E5%8A%A1%E7%B3%BB%E7%BB%9F%E8%87%AA%E5%8A%A8%E8%AF%84%E6%95%99%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';

    setTimeout(function() {
        const autoButton = document.createElement('button');
        autoButton.textContent = '一键五星评教';
        autoButton.style.cssText = 'padding: 10px 20px; background-color: #4CAF50; color: white; border: none; cursor: pointer; font-size: 16px; margin: 10px; border-radius: 5px;';

        const form = document.getElementById('saveEvaluation');
        if (form) {
            form.parentNode.insertBefore(autoButton, form);
        }

        autoButton.addEventListener('click', fillEvaluation);
    }, 500);//延迟几秒添加按钮

    function fillEvaluation() {
        // 填写五星评分
        document.querySelectorAll('.radio-bj').forEach(group => {
            const stars = group.querySelectorAll('.ace-icon.glyphicon-star');
            if(stars.length === 5) {
                stars[4].click();
            }
        });

        // 填写文本框
        document.querySelectorAll('textarea.form-control.value_element').forEach(textarea => {
            textarea.value = '无';
            textarea.dispatchEvent(new Event('change', { bubbles: true }));
        });

    }
})();