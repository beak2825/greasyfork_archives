// ==UserScript==
// @name         BJTU 北京交通大学 一键评教为“非常满意”并填写主观意见
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  自动填写评教为“非常满意”并填写主观意见
// @match        https://aa.bjtu.edu.cn/teaching_assessment/stu*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/537626/BJTU%20%E5%8C%97%E4%BA%AC%E4%BA%A4%E9%80%9A%E5%A4%A7%E5%AD%A6%20%E4%B8%80%E9%94%AE%E8%AF%84%E6%95%99%E4%B8%BA%E2%80%9C%E9%9D%9E%E5%B8%B8%E6%BB%A1%E6%84%8F%E2%80%9D%E5%B9%B6%E5%A1%AB%E5%86%99%E4%B8%BB%E8%A7%82%E6%84%8F%E8%A7%81.user.js
// @updateURL https://update.greasyfork.org/scripts/537626/BJTU%20%E5%8C%97%E4%BA%AC%E4%BA%A4%E9%80%9A%E5%A4%A7%E5%AD%A6%20%E4%B8%80%E9%94%AE%E8%AF%84%E6%95%99%E4%B8%BA%E2%80%9C%E9%9D%9E%E5%B8%B8%E6%BB%A1%E6%84%8F%E2%80%9D%E5%B9%B6%E5%A1%AB%E5%86%99%E4%B8%BB%E8%A7%82%E6%84%8F%E8%A7%81.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 主观意见列表
    const comments = [
    '老师讲解清晰，重点突出，对学生很有耐心。',
    '课程安排合理，内容充实，受益良多。',
    '课堂氛围活跃，老师教学认真，效果显著。',
    '讲授内容贴合实际，提升了我的理解与应用能力。',
    '教学严谨，课件内容详实，帮助很大。',
    '老师风趣幽默，激发了我对课程的兴趣。',
    '知识点讲解透彻，解答问题耐心细致。',
    '课程内容系统完整，对今后学习有重要帮助。',
    '通过本课程提升了自学能力和思考能力。',
    '老师关注学生反馈，善于调整教学方法。'
    ];


    // 插入按钮
    function insertButton() {
        const returnBtn = document.querySelector('.widget-title a[href*="history.go"]');
        if (!returnBtn) return;

        const btn = document.createElement('a');
        btn.innerText = '一键非常满意';
        btn.href = 'javascript:void(0)';
        btn.className = 'btn btn-success btn-sm';
        btn.style.marginLeft = '10px';

        btn.onclick = () => {
            autoSelect();
            // 滚动到页面最底部
            window.scrollTo({
                top: document.body.scrollHeight,
                behavior: 'smooth'
            });
        };

        returnBtn.after(btn);
    }

    // 自动选择“非常符合”/“优秀”
    function autoSelect() {
        // 单选题
        const radios = document.querySelectorAll('input[type=radio]');
        radios.forEach(radio => {
            const label = radio.parentElement.innerText.trim();
            if (label === '非常符合' || label === '优秀') {
                radio.checked = true;
            }
        });

        // 主观题
        const commentBox = document.querySelector('#id_comment-0-comment_result');
        if (commentBox) {
            const randomComment = comments[Math.floor(Math.random() * comments.length)];
            commentBox.value = randomComment;
        }
    }

    // 页面加载完成后插入按钮
    window.addEventListener('load', () => {
        setTimeout(insertButton, 500); // 确保页面元素加载完成
    });
})();
