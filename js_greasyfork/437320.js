// ==UserScript==
// @name         yande.re 历史最大页数记录
// @namespace    http://tampermonkey.net/
// @version      0.1.4
// @description  按日期记录主页最大页数，用于查看下次收图时的页数增长
// @author       rowink
// @match        https://yande.re/post
// @exclude      https://yande.re/post?page=*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_listValues
// @downloadURL https://update.greasyfork.org/scripts/437320/yandere%20%E5%8E%86%E5%8F%B2%E6%9C%80%E5%A4%A7%E9%A1%B5%E6%95%B0%E8%AE%B0%E5%BD%95.user.js
// @updateURL https://update.greasyfork.org/scripts/437320/yandere%20%E5%8E%86%E5%8F%B2%E6%9C%80%E5%A4%A7%E9%A1%B5%E6%95%B0%E8%AE%B0%E5%BD%95.meta.js
// ==/UserScript==
// @note         0.1.4 修复页数删除错误
// @note         0.1.2 修复跳转链接错误
// @note         0.1.1 修复意外的@grant丢失错误
// @note         0.1.0 转移作者
// @note         0.9 修复日期错误排序的问题
// @note         0.8 修复错误删除了前一天记录的问题
// @note         0.7 规范化部分代码
// @note         0.6 启用严格模式
// @note         0.5 修改正确页数的正向跳转
// @note         0.4 增加历史页数差值的正向跳转
// @note         0.3 代码优化
// @note         0.2 优化显示布局，增加当前页数与历史页数的差值显示
// @note         0.1 页数记录

(function () {
    "use strict";
    // 设置最大记录数
    const MAX_RECORDS = 5;

    // 获取当前页面的最大页数
    const pagination = document.getElementById("paginator").getElementsByClassName("pagination")[0];
    const lastPage = parseInt(pagination.getElementsByTagName("a")[5].textContent);

    // 获取当前日期并格式化（YYYY-MM-DD）
    const date = new Date();
    const fullDate = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")}`;

    // 记录当前最大页数
    GM_setValue(fullDate, lastPage.toString());

    // 创建显示面板
    const panel = document.createElement("div");
    panel.setAttribute("id", "panel");
    const paginator = document.getElementById("paginator");
    paginator.appendChild(panel);

    /**
     * 显示历史记录
     * @param {string} date 日期
     * @param {string} page 页数
     */
    const showRecord = (date, page) => {
        const currentPage = parseInt(lastPage);
        const historyPage = parseInt(page);
        const difference = currentPage - historyPage;

        const recordDiv = document.createElement("div");
        //recordDiv.style.border = "1px white solid";
        recordDiv.style.color = "#ee8887";
        recordDiv.style.textAlign = "left";
        recordDiv.style.margin = "5px 0";
        recordDiv.style.padding = "5px";

        const recordLink = document.createElement("a");
        recordLink.style.textDecoration = "none";
        recordLink.style.color = "inherit";
        recordLink.style.display = "flex";
        recordLink.style.justifyContent = "space-between";

        if (difference !== 0) {
            recordLink.setAttribute("href", `https://yande.re/post?page=${currentPage - historyPage + 1}`);
        }

        const dateSpan = document.createElement("span");
        dateSpan.innerText = `日期: ${date}`;

        const pageSpan = document.createElement("span");
        pageSpan.innerText = `页数: ♡${page}`;

        const diffSpan = document.createElement("span");
        diffSpan.innerText = `差值: +${difference}`;

        recordLink.appendChild(dateSpan);
        recordLink.appendChild(pageSpan);
        recordLink.appendChild(diffSpan);
        recordDiv.appendChild(recordLink);
        panel.appendChild(recordDiv);
    };

    // 获取所有记录并按日期降序排序
    const allRecords = GM_listValues();
    allRecords.sort((a, b) => new Date(a) - new Date(b)); // 降序排序

    // 删除最早的记录（如果超过最大记录数）
    if (allRecords.length > MAX_RECORDS) {
        GM_deleteValue(allRecords.shift()); // 删除最早的记录
    }

    // 显示所有记录
    for (const recordDate of allRecords) {
        const recordPage = GM_getValue(recordDate);
        if (recordPage) {
            showRecord(recordDate, recordPage);
        }
    }
})();