// ==UserScript==
// @name         隐藏馒头站的无评论项
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  隐藏M-team的无评论项
// @author       manTron
// @license      MIT
// @match        https://kp.m-team.cc/browse/adult/*
// @match        https://kp.m-team.cc/*
// @match        https://zp.m-team.io/browse/adult/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/499640/%E9%9A%90%E8%97%8F%E9%A6%92%E5%A4%B4%E7%AB%99%E7%9A%84%E6%97%A0%E8%AF%84%E8%AE%BA%E9%A1%B9.user.js
// @updateURL https://update.greasyfork.org/scripts/499640/%E9%9A%90%E8%97%8F%E9%A6%92%E5%A4%B4%E7%AB%99%E7%9A%84%E6%97%A0%E8%AF%84%E8%AE%BA%E9%A1%B9.meta.js
// ==/UserScript==

(function () {
    'use strict';

    /**
     * 根据评论数量对表格行进行降序排序
     */
    function sortRowsByCommentsDescending() {
        // 选择所有相关的表格行
        const rows = Array.from(document.querySelectorAll('table > tbody > tr'));

        // 过滤出包含评论数量的行（排除表头或其他不相关的行）
        const dataRows = rows.filter(row => {
            // 假设评论数量在第四个<td>中，并且包含纯数字
            const tds = row.querySelectorAll('td');
            if (tds.length < 4) return false;
            const commentCell = tds[3];
            const commentCount = parseInt(commentCell.textContent.trim(), 10);
            const timeCell = tds[4];
            const time = Date.parse(timeCell.querySelector('[title]').title);
            // return !isNaN(commentCount);
            return !isNaN(commentCount) && !isNaN(time);
        });

        // 如果没有找到数据行，则无需继续
        if (dataRows.length === 0) return;

        // 对数据行根据评论数量进行降序排序
        dataRows.sort((a, b) => {
            const aTds = a.querySelectorAll('td');
            const bTds = b.querySelectorAll('td');
            const aCount = aTds.length >= 4 ? parseInt(aTds[3].textContent.trim(), 10) : 0;
            const bCount = bTds.length >= 4 ? parseInt(bTds[3].textContent.trim(), 10) : 0;
            const aTime = aTds.length >= 5 ? Date.parse(aTds[4].querySelector('span').title) : 0;
            const bTime = bTds.length >= 5 ? Date.parse(bTds[4].querySelector('span').title) : 0;
            const count = bCount - aCount;
            const timee = bTime - aTime;
            console.log(`${count}, ${timee}`);
            // return bCount - aCount; // 降序
            // 按or排序
            return count || timee; // 按评论数量降序排序，如果评论数量相同则按时间排序
        });

        // 获取包含数据行的父表格
        const parentTable = dataRows[0].closest('table');
        if (!parentTable) return;

        const tbody = parentTable.querySelector('tbody');
        if (!tbody) return;

        // 清空现有的表格主体
        tbody.innerHTML = "";

        // 将排序后的行重新添加到表格中
        dataRows.forEach(row => {
            tbody.appendChild(row);
        });
    }

    /**
     * 添加排序按钮到页面
     */
    function addSortButton() {
        // 检查按钮是否已经存在，避免重复添加
        if (document.getElementById("sortByCommentsButton")) return;

        // 创建按钮元素
        const button = document.createElement("button");
        button.id = "sortByCommentsButton";
        button.textContent = "按评论数降序排序";
        button.style.position = "fixed";
        button.style.top = "20px";
        button.style.right = "20px";
        button.style.zIndex = 1000;
        button.style.padding = "10px 15px";
        button.style.backgroundColor = "#89c9e6";
        button.style.border = "none";
        button.style.borderRadius = "5px";
        button.style.cursor = "pointer";
        button.style.boxShadow = "0 2px 6px rgba(0,0,0,0.3)";
        button.style.fontSize = "14px";
        button.style.color = "#ffffff";

        // 添加点击事件监听器
        button.addEventListener("click", () => {
            sortRowsByCommentsDescending();
            // 提供用户反馈
            button.textContent = "已排序";
            setTimeout(() => {
                button.textContent = "按评论数降序排序";
            }, 2000);
        });

        // 添加按钮到页面
        document.body.appendChild(button);
    }

    // 等待页面完全加载后添加按钮
    window.addEventListener('load', () => {
        addSortButton();
    });
})();
