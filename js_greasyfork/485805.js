// ==UserScript==
// @name         留园每日金币收支总和
// @namespace    http://www.6park.com/
// @version      0.1
// @description  显示留园个人金币的每日总收支
// @author       lyabc@6park
// @license      MIT
// @match        https://home.6park.com/index.php?app=gift&act=giftlog
// @icon         https://www.google.com/s2/favicons?sz=64&domain=6park.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/485805/%E7%95%99%E5%9B%AD%E6%AF%8F%E6%97%A5%E9%87%91%E5%B8%81%E6%94%B6%E6%94%AF%E6%80%BB%E5%92%8C.user.js
// @updateURL https://update.greasyfork.org/scripts/485805/%E7%95%99%E5%9B%AD%E6%AF%8F%E6%97%A5%E9%87%91%E5%B8%81%E6%94%B6%E6%94%AF%E6%80%BB%E5%92%8C.meta.js
// ==/UserScript==
(function() {
    'use strict';
    function calculateAccountSummary() {
        var records = document.querySelectorAll("body > div.mian > div.right_content > div.account_log > ul > li");
        var summaryByDate = {};

        records.forEach(function(record) {
            var dateElement = record.querySelector('.log_dateline');
            var recordDate = dateElement.textContent.trim();
            var balanceElement = record.querySelectorAll('span')[1];
            var expenseElement = record.querySelectorAll('span')[2];
            var recordExpense = parseFloat(expenseElement.textContent.trim());

            summaryByDate[recordDate] = summaryByDate[recordDate] || { totalIncome: 0, totalExpense: 0, accountBalanceChange: 0 };
            summaryByDate[recordDate].totalIncome += (recordExpense > 0) ? recordExpense : 0;
            summaryByDate[recordDate].totalExpense += (recordExpense < 0) ? -recordExpense : 0;
            summaryByDate[recordDate].accountBalanceChange += recordExpense;
        });

        return summaryByDate;
    }
    var accountLogDiv = document.querySelector('.account_log');

    if (accountLogDiv) {
        var newDiv = document.createElement('div');
        newDiv.style.width = getComputedStyle(accountLogDiv).width;
        newDiv.style.height = 'auto'; // Auto height to accommodate content
        newDiv.style.backgroundColor = 'lightgray';
        newDiv.style.marginTop = '10px';

        // 将新 div 插入到原始 div 的下方
        accountLogDiv.parentNode.insertBefore(newDiv, accountLogDiv.nextSibling);

        // 调用 calculateAccountSummary 获取统计信息
        var summary = calculateAccountSummary();

        // 在新插入的 div 中显示统计信息
        for (var date in summary) {
            var summaryText = "日期：" + date + "<br>" +
                "总收入：" + summary[date].totalIncome.toFixed(2) + "<br>" +
                "总支出：" + summary[date].totalExpense.toFixed(2) + "<br>" +
                "账号余额变化：" + summary[date].accountBalanceChange.toFixed(2) + "<br>-----<br>";

            // 创建一个新的 p 元素，用于显示每天的统计信息
            var summaryElement = document.createElement('p');
            summaryElement.innerHTML = summaryText;

            // 将 p 元素添加到新插入的 div 中
            newDiv.appendChild(summaryElement);

        }
    }
})();
