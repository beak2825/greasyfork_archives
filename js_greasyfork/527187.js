// ==UserScript==
// @name         CSU GPA Conversion
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  计算中南大学总学分、加权平均分和GPA
// @author       LMMIKE
// @match        *://csujwc.its.csu.edu.cn/jsxsd/kscj/cjcx_list
// @license MIT  Apache 2.0
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/527187/CSU%20GPA%20Conversion.user.js
// @updateURL https://update.greasyfork.org/scripts/527187/CSU%20GPA%20Conversion.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 等级成绩转换为百分制
    function convertLevelToScore(score) {
        if (typeof score === 'string') {
            switch(score.trim()) {
                case '优': return 95;
                case '良': return 85;
                case '中': return 75;
                case '及格': return 65;
                case '不及格': return 0;
                default: {
                    const num = parseFloat(score);
                    return isNaN(num) ? 0 : num;
                }
            }
        }
        return 0;
    }

    // 百分制转GPA (4.0制)
    function convertToGPA(score) {
        if (score >= 90) return 4.0;
        if (score >= 85) return 3.7;
        if (score >= 82) return 3.3;
        if (score >= 78) return 3.0;
        if (score >= 75) return 2.7;
        if (score >= 72) return 2.3;
        if (score >= 68) return 2.0;
        if (score >= 64) return 1.5;
        if (score >= 60) return 1.0;
        return 0.0;
    }

    // 创建悬浮窗
    function createFloatingWindow() {
        const floatDiv = document.createElement('div');
        floatDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: white;
            border: 1px solid #ccc;
            padding: 15px;
            border-radius: 5px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            z-index: 9999;
            min-width: 200px;
        `;
        return floatDiv;
    }

    // 计算成绩
    function calculateGrades() {
        let totalCredit = 0;
        let weightedScore = 0;
        let weightedGPA = 0;

        // 获取成绩表格
        const table = document.getElementById('dataList');
        if (!table) return null;

        // 遍历所有成绩行
        const rows = table.getElementsByTagName('tr');
        for (let i = 1; i < rows.length; i += 2) { // 跳过标题行和详情行
            const row = rows[i];
            const cells = row.getElementsByTagName('td');

            if (cells.length >= 7) {
                // 获取成绩和学分
                const scoreText = cells[5].textContent.trim();
                const creditText = cells[6].textContent.trim();

                const score = convertLevelToScore(scoreText);
                const credit = parseFloat(creditText);

                if (!isNaN(credit) && !isNaN(score)) {
                    totalCredit += credit;
                    weightedScore += score * credit;
                    weightedGPA += convertToGPA(score) * credit;
                }
            }
        }

        return {
            totalCredit: totalCredit,
            averageScore: weightedScore / totalCredit,
            GPA: weightedGPA / totalCredit
        };
    }

    // 主函数
    function main() {
        const results = calculateGrades();
        if (!results) return;

        const floatDiv = createFloatingWindow();
        floatDiv.innerHTML = `
            <h3 style="margin:0 0 10px 0;color:#333;">成绩统计</h3>
            <div style="line-height:1.5;">
                <p style="margin:5px 0;">总学分：${results.totalCredit.toFixed(2)}</p>
                <p style="margin:5px 0;">加权平均分：${results.averageScore.toFixed(2)}</p>
                <p style="margin:5px 0;">GPA：${results.GPA.toFixed(2)}</p>
            </div>
        `;

        document.body.appendChild(floatDiv);

        // 添加拖动功能
        let isDragging = false;
        let currentX;
        let currentY;
        let initialX;
        let initialY;
        let xOffset = 0;
        let yOffset = 0;

        floatDiv.addEventListener('mousedown', dragStart);
        document.addEventListener('mousemove', drag);
        document.addEventListener('mouseup', dragEnd);

        function dragStart(e) {
            initialX = e.clientX - xOffset;
            initialY = e.clientY - yOffset;
            if (e.target === floatDiv) {
                isDragging = true;
            }
        }

        function drag(e) {
            if (isDragging) {
                e.preventDefault();
                currentX = e.clientX - initialX;
                currentY = e.clientY - initialY;
                xOffset = currentX;
                yOffset = currentY;
                floatDiv.style.transform = `translate(${currentX}px, ${currentY}px)`;
            }
        }

        function dragEnd() {
            initialX = currentX;
            initialY = currentY;
            isDragging = false;
        }
    }

    // 页面加载完成后执行
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', main);
    } else {
        main();
    }
})();