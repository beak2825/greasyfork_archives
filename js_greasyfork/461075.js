// ==UserScript==
// @name         工单系统 - 添加网页图标及标签
// @namespace    http://tampermonkey.net/
// @version      1.97
// @description  创意系统标签优化
// @description:zh-CN 创意系统标签优化
// @author       You
// @match        *://wetecloud.adwetec.com/*
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQAQMAAAAlPW0iAAAABlBMVEX/AAD///9BHTQRAAAAFUlEQVQI12OAAPs/IMTYgIZQZMEAAMT7B/PZHPCFAAAAAElFTkSuQmCC
// @grant        none
// @copyright  2023, Nchyn
// @downloadURL https://update.greasyfork.org/scripts/461075/%E5%B7%A5%E5%8D%95%E7%B3%BB%E7%BB%9F%20-%20%E6%B7%BB%E5%8A%A0%E7%BD%91%E9%A1%B5%E5%9B%BE%E6%A0%87%E5%8F%8A%E6%A0%87%E7%AD%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/461075/%E5%B7%A5%E5%8D%95%E7%B3%BB%E7%BB%9F%20-%20%E6%B7%BB%E5%8A%A0%E7%BD%91%E9%A1%B5%E5%9B%BE%E6%A0%87%E5%8F%8A%E6%A0%87%E7%AD%BE.meta.js
// ==/UserScript==

(function () {
    'use strict';
    // 添加网站图标
    var doc = document;
    var link = doc.createElement("link");
    link.setAttribute("rel", "icon");
    link.setAttribute("href", "data:image/webp;base64,UklGRkIAAABXRUJQVlA4TDYAAAAvD8ADEA8Q8x/zHwylkWw1Xz6JogAUnWBzrgKfmv6DpI6I/ofk2Q17X56y4xERXY2FiIWIfwU=");
    link.setAttribute("type", "image/png");
    var heads = doc.getElementsByTagName("head");
    heads[0].appendChild(link);

    // 协作者工单标题添加及进度条修改
    setInterval(function () {

        // 修改页面标题
        if (document.querySelectorAll(".ivu-breadcrumb a")[1] != undefined) {
            if (document.querySelectorAll(".ivu-breadcrumb a")[2] != undefined) {
                document.getElementsByTagName("title")[0].innerText = document.querySelector("#view-bg > div > div.ivu-row-flex.ivu-row-flex-center > div > div:nth-child(1) > div.ivu-row-flex > div.ivu-col.ivu-col-span-18 > h2").innerHTML;
            } else {
                document.getElementsByTagName("title")[0].innerText = document.querySelectorAll(".ivu-breadcrumb a")[1].innerHTML;
            }
        }
        // 获取所有具有类名 "ivu-progress-inner-text" 的元素
        const elements = document.querySelectorAll('.ivu-progress-inner-text');

        // 筛选出内容为 "100%" 的元素
        const filteredElements = Array.from(elements).filter(element => element.textContent === '100%');

        // 将筛选出的元素的内容修改为 "完成"
        filteredElements.forEach(element => {
            element.textContent = '完成';
            element.style.color = 'white';
            element.parentElement.style.backgroundColor = 'green';
        });

        const dateRegex = /^\d{4}-\d{2}-\d{2}(?: \d{2}:\d{2}:\d{2})?$/; // 假设日期格式可以是yyyy-mm-dd或yyyy-mm-dd hh:mm:ss

        const tableRows = document.querySelectorAll('.ivu-table-row'); // 对具有.ivu-table-row类的表格行元素进行筛选，并将它们存储在tableRows变量中
        const t12Tds = []; //创建了一个空数组t12Tds，用于存储第12列（第12个<td>元素）的内容。
        const t13Tds = []; //创建了一个空数组t13Tds，用于存储第13列（第13个<td>元素）的内容。

        // 获取当前日期
var currentDate = new Date();

// 计算上周的日期范围
var lastWeekRange = getPreviousWeekRange();

// 获取所有符合选择器的第 12 列元素
var column12Elements = document.querySelectorAll('td:nth-child(12):not(.ivu-table-hidden)');

// 遍历第 12 列元素，比较日期并标红或标蓝
column12Elements.forEach(function (element) {
    var contentDate = element.textContent.trim().split(' ')[0];

    if (contentDate === formatDate(currentDate)) {
        // 今天的内容标红
        element.style.color = 'red';
    } else if (dateIsInLastWeek(contentDate)) {
        // 上周的内容标蓝
        element.style.color = 'blue';
    }
});

// 获取所有符合选择器的第 13 列元素
var column13Elements = document.querySelectorAll('td:nth-child(13):not(.ivu-table-hidden)');

// 遍历第 13 列元素，比较日期并标红
column13Elements.forEach(function (element) {
    var contentDate = element.textContent.trim().split(' ')[0];

    if (contentDate === formatDate(currentDate)) {
        // 今天的内容标红
        element.style.color = 'red';
    }
});

// 获取上周的日期范围
function getPreviousWeekRange() {
    var currentDay = currentDate.getDay();
    var lastWeekEndDate = new Date(currentDate);
    lastWeekEndDate.setDate(currentDate.getDate() - currentDay);

    var lastWeekStartDate = new Date(lastWeekEndDate);
    lastWeekStartDate.setDate(lastWeekEndDate.getDate() - 6);

    var formattedLastWeekStartDate = formatDate(lastWeekStartDate);
    var formattedLastWeekEndDate = formatDate(lastWeekEndDate);

    return {
        startDate: formattedLastWeekStartDate,
        endDate: formattedLastWeekEndDate
    };
}

// 检查日期是否在上周范围内
function dateIsInLastWeek(date) {
    return date >= lastWeekRange.startDate && date <= lastWeekRange.endDate;
}

// 格式化日期为 'yyyy-mm-dd'
function formatDate(date) {
    var year = date.getFullYear();
    var month = ('0' + (date.getMonth() + 1)).slice(-2);
    var day = ('0' + date.getDate()).slice(-2);
    return year + '-' + month + '-' + day;
}


    }, 3000);
})();