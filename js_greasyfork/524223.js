// ==UserScript==
// @name         【住院医师规范化培训系统】 - 随机时间与患者编号填充
// @namespace    https://yspx.ahswmu.cn
// @version      0.3
// @description  自动为 txtOperateTime 输入框填充随机时间（2024-09-01 到 2025-02-28），并为 txtPatientNumber 输入框填充符合要求的10位数字
// @author       菜！
// @match        https://yspx.ahswmu.cn:32047/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/524223/%E3%80%90%E4%BD%8F%E9%99%A2%E5%8C%BB%E5%B8%88%E8%A7%84%E8%8C%83%E5%8C%96%E5%9F%B9%E8%AE%AD%E7%B3%BB%E7%BB%9F%E3%80%91%20-%20%E9%9A%8F%E6%9C%BA%E6%97%B6%E9%97%B4%E4%B8%8E%E6%82%A3%E8%80%85%E7%BC%96%E5%8F%B7%E5%A1%AB%E5%85%85.user.js
// @updateURL https://update.greasyfork.org/scripts/524223/%E3%80%90%E4%BD%8F%E9%99%A2%E5%8C%BB%E5%B8%88%E8%A7%84%E8%8C%83%E5%8C%96%E5%9F%B9%E8%AE%AD%E7%B3%BB%E7%BB%9F%E3%80%91%20-%20%E9%9A%8F%E6%9C%BA%E6%97%B6%E9%97%B4%E4%B8%8E%E6%82%A3%E8%80%85%E7%BC%96%E5%8F%B7%E5%A1%AB%E5%85%85.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 使用 MutationObserver 监听 DOM 变化，确保输入框加载完成
    const observer = new MutationObserver(() => {
        const txtOperateTime = document.getElementById('txtOperateTime');
        const txtPatientNumber = document.getElementById('txtPatientNumber');

        if (txtOperateTime && !txtOperateTime.value) {
            const randomDate = getRandomDate('2024-09-01', '2025-02-28');
            txtOperateTime.value = randomDate;
        }

        if (txtPatientNumber && !txtPatientNumber.value) {
            const randomPatientNumber = getRandomPatientNumber();
            txtPatientNumber.value = randomPatientNumber;
        }

        if (txtOperateTime && txtPatientNumber) {
            observer.disconnect(); // 停止监听
        }
    });

    // 开始监听 DOM 变化
    observer.observe(document.body, { childList: true, subtree: true });

    // 生成随机日期的函数
    function getRandomDate(startDate, endDate) {
        const start = new Date(startDate);
        const end = new Date(endDate);

        // 防止 2025 年 2 月 30 日的错误
        if (end.getMonth() === 1 && end.getDate() === 30) {
            end.setDate(28);
        }

        const randomTime = start.getTime() + Math.random() * (end.getTime() - start.getTime());
        const randomDate = new Date(randomTime);

        // 格式化日期为 YYYY-MM-DD
        const year = randomDate.getFullYear();
        const month = String(randomDate.getMonth() + 1).padStart(2, '0');
        const day = String(randomDate.getDate()).padStart(2, '0');

        return `${year}-${month}-${day}`;
    }

    // 生成符合要求的10位数字的函数
    function getRandomPatientNumber() {
        const leadingZeros = getLeadingZeros();
        const remainingDigits = Array.from({ length: 10 - leadingZeros }, () => Math.floor(Math.random() * 10)).join('');
        return '0'.repeat(leadingZeros) + remainingDigits;
    }

    // 生成开头0的位数（3到5位，3位和4位概率偏高，5位概率较低）
    function getLeadingZeros() {
        const probabilities = [0.5, 0.4, 0.1]; // 3位0的概率为0.5，4位0的概率为0.4，5位0的概率为0.1
        const random = Math.random();
        let cumulativeProbability = 0;

        for (let i = 0; i < probabilities.length; i++) {
            cumulativeProbability += probabilities[i];
            if (random < cumulativeProbability) {
                return 3 + i;
            }
        }

        return 3; // 默认返回5位0
    }
})();