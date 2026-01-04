// ==UserScript==
// @name         12306 显示价格（按钮版）
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  在12306车票查询结果页面的“查询”按钮旁，添加一个“一键操作”按钮，点击后会触发每行车次的倒数第二个单元格的点击事件。
// @author       Nelson_XU
// @license GPL-3.0-or-later
// @match        https://*.12306.cn/otn/leftTicket/init*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/540861/12306%20%E6%98%BE%E7%A4%BA%E4%BB%B7%E6%A0%BC%EF%BC%88%E6%8C%89%E9%92%AE%E7%89%88%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/540861/12306%20%E6%98%BE%E7%A4%BA%E4%BB%B7%E6%A0%BC%EF%BC%88%E6%8C%89%E9%92%AE%E7%89%88%EF%BC%89.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 1. 等待页面加载完成后再执行，确保“查询”按钮存在
    window.addEventListener('load', function() {
        // 2. 创建我们的功能按钮
        let actionButton = document.createElement('a');
        actionButton.href = "javascript:void(0);";
        actionButton.id = "customActionBtn";
        actionButton.className = "btn btn-primary"; // 借用12306自己的按钮样式
        actionButton.innerHTML = "一键操作"; // 按钮文字可以根据功能自定义
        actionButton.onclick = executeRowAction; // 绑定点击事件

        // 3. 找到“查询”按钮，并把我们的按钮插到它后面
        let queryButton = document.getElementById('query_ticket');
        if (queryButton) {
            queryButton.after(actionButton);
        }

        // 4. 使用 @grant 的 GM_addStyle 功能给按钮添加一点样式
        GM_addStyle("#customActionBtn { margin-left: 10px; }");
    });


    // 5. 这是核心的点击逻辑，封装在一个函数里
    function executeRowAction() {
        // --- 修改点：更新了日志信息以反映新规则 ---
        console.log("【油猴脚本】开始操作，规则：点击每个 <tr> 内的倒数第二个 <td>。");

        var allRows = document.querySelectorAll('#queryLeftTable tr');
        var clickedCount = 0;

        if (allRows.length === 0) {
            alert("未找到任何车次信息，请先执行查询！");
            return;
        }

        console.log("【油猴脚本】成功找到 " + allRows.length + " 行，开始处理...");

        allRows.forEach(function(row, index) {
            // ==================== 核心修改区域开始 ====================

            // 1. 获取当前行(row)中所有的单元格(td)
            const allTdsInRow = row.querySelectorAll('td');

            // 2. 检查这一行是否有至少2个单元格，以防出错
            if (allTdsInRow.length >= 2) {
                // 3. 定位到倒数第二个单元格 (索引是 allTdsInRow.length - 2)
                const targetTd = allTdsInRow[allTdsInRow.length - 2];

                // 4. 直接点击这个单元格，无需任何检查
                targetTd.click();
                clickedCount++;
            }

            // ==================== 核心修改区域结束 ====================
        });

        console.log("--------------------------------------------------");
        console.log("【油猴脚本】操作完成！总共检查了 " + allRows.length + " 行，点击了 " + clickedCount + " 次。");
    }

})();