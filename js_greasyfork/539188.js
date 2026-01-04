// ==UserScript==
// @name         福建师范大学教务处评价助手
// @name:en      Fujian Normal University Course Evaluation Helper
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  在福建师范大学教务处学生课程评价页面添加“优秀”和“一般”按钮，一键完成评价填写。
// @description:en Automates course evaluation on Fujian Normal University's portal with "Excellent" and "Average" buttons.
// @author       Gemini
// @match        *://jwczlpj.fjnu.edu.cn/mobDdXkAction?action=xspj*
// @grant        none
// @run-at       document-idle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/539188/%E7%A6%8F%E5%BB%BA%E5%B8%88%E8%8C%83%E5%A4%A7%E5%AD%A6%E6%95%99%E5%8A%A1%E5%A4%84%E8%AF%84%E4%BB%B7%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/539188/%E7%A6%8F%E5%BB%BA%E5%B8%88%E8%8C%83%E5%A4%A7%E5%AD%A6%E6%95%99%E5%8A%A1%E5%A4%84%E8%AF%84%E4%BB%B7%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- 配置信息 ---
    const excellentText = "老师教得很好，课程内容详实生动，收获很大，感谢老师的辛勤付出！";
    const averageText = "很好很好很好很好很好";
    const excellentScore = 100;
    const averageScore = 89;

    /**
     * 核心函数：根据传入的参数填充整个评价表单
     * @param {number} score - 评分题需要填写的分数 (0-100)
     * @param {string} comment - “整体表现及建议”文本框需要填写的内容
     */
    function fillForm(score, comment) {
        // 1. 处理【师德师风】问卷题
        // 逻辑：找到 name="mxb_98" 且 value 值以 "|A" 结尾的单选框并选中它
        const radioA = document.querySelector('input[name="mxb_98"][value$="|A"]');
        if (radioA) {
            radioA.checked = true;
        }

        // 2. 处理所有【评分】题
        // 逻辑：找到所有 type="number" 且 name 以 "mx_fs_" 开头的输入框
        const scoreInputs = document.querySelectorAll('input[type="number"][name^="mx_fs_"]');
        scoreInputs.forEach(input => {
            input.value = score;
            // 触发 input 事件，确保页面能监听到值的变化，从而正确计算总分
            input.dispatchEvent(new Event('input', { bubbles: true }));
        });

        // 3. 填写【课堂整体表现及建议】
        // 逻辑：通过 ID 找到文本域
        const commentBox = document.getElementById('pjJy');
        if (commentBox) {
            commentBox.value = comment;
        }

        // 4. 手动调用页面自带的总分计算函数
        // 这是最可靠的更新总分的方式
        if (typeof window.f_hzpf === 'function') {
            window.f_hzpf();
        }
    }

    /**
     * 创建并添加操作按钮到页面右下角
     */
    function createButtons() {
        const container = document.createElement('div');
        container.style.position = 'fixed';
        container.style.bottom = '80px'; // 距离底部80px，避免遮挡页脚
        container.style.right = '20px';  // 距离右侧20px
        container.style.zIndex = '9999'; // 置于顶层，避免被其他元素遮挡
        container.style.display = 'flex';
        container.style.flexDirection = 'column'; // 按钮垂直排列
        container.style.gap = '10px'; // 按钮之间的间距

        // 创建“优秀”按钮
        const btnExcellent = document.createElement('button');
        btnExcellent.textContent = '优秀';
        btnExcellent.className = 'mui-btn mui-btn-primary'; // 借用页面自带的样式
        btnExcellent.onclick = () => fillForm(excellentScore, excellentText);

        // 创建“一般”按钮
        const btnAverage = document.createElement('button');
        btnAverage.textContent = '一般';
        btnAverage.className = 'mui-btn'; // 借用页面自带的样式
        btnAverage.style.backgroundColor = '#f0ad4e'; // 设置一个醒目的橙色背景
        btnAverage.style.color = 'white';
        btnAverage.onclick = () => fillForm(averageScore, averageText);

        container.appendChild(btnExcellent);
        container.appendChild(btnAverage);

        document.body.appendChild(container);
    }

    // 执行脚本，创建按钮
    createButtons();

})();