// ==UserScript==
// @name         西南财经大学自动教师评价
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  每位教师随机设置一个评价维度为B，其余为A
// @author       You
// @match        http://xk.swufe.edu.cn/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/497786/%E8%A5%BF%E5%8D%97%E8%B4%A2%E7%BB%8F%E5%A4%A7%E5%AD%A6%E8%87%AA%E5%8A%A8%E6%95%99%E5%B8%88%E8%AF%84%E4%BB%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/497786/%E8%A5%BF%E5%8D%97%E8%B4%A2%E7%BB%8F%E5%A4%A7%E5%AD%A6%E8%87%AA%E5%8A%A8%E6%95%99%E5%B8%88%E8%AF%84%E4%BB%B7.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log('脚本已加载，开始执行...');

    const setSelects = () => {
        console.log('执行setSelects函数...');
        const tbody = document.querySelector('#DataGrid1 > tbody'); // 选取ID为DataGrid1的元素的直接子tbody
        if (!tbody) {
            console.log('没有找到指定的tbody元素');
            return;
        }

        console.log('找到指定的tbody元素');
        const trs = Array.from(tbody.querySelectorAll(':scope > tr')).slice(1, 9);
        // 确定每位教师的位置的评价
       const teacherCounts = trs[0] ? trs[0].querySelectorAll('select').length : 0;
        for (let teacherIndex = 0; teacherIndex < teacherCounts; teacherIndex++) {
            // 为每位教师随机选择一个评价维度为B
            const randomPosition = Math.floor(Math.random() * trs.length);
            trs.forEach((tr, trIndex) => {
                const selects = tr.querySelectorAll('td select');
                if (selects.length > teacherIndex) {
                    selects[teacherIndex].value = trIndex === randomPosition ? 'B' : 'A';
                    console.log("更新完成");

                }
            });
        }
        setTimeout(clickSaveButton, 500); // 调用点击保存按钮的函数
    };

    // 定义点击保存按钮的函数
    const clickSaveButton = () => {
        const saveButton = document.querySelector('#Button1');
        if (saveButton) {
            saveButton.click(); // 模拟用户点击保存按钮
            console.log('点击保存按钮');
            setTimeout(setSelects, 3000);
        } else {
            console.log('未找到保存按钮');
        }
    };

    window.addEventListener('load', () => setTimeout(setSelects, 1000));

})();
