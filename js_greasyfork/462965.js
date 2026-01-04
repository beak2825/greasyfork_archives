// ==UserScript==
// @name         ipd_work_stats
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  IPD工作量计算
// @author       jackyu
// @match        https://ipd.asiainfo-sec.com:8443/issues*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=asiainfo-sec.com
// @grant        GM_registerMenuCommand
// @license      GPLv3
// @downloadURL https://update.greasyfork.org/scripts/462965/ipd_work_stats.user.js
// @updateURL https://update.greasyfork.org/scripts/462965/ipd_work_stats.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // 实际工作量所在列
    var realWorkCols = ["任务实际工作量（小时）", "设计实际工作量(小时)", "开发实际工作量(小时)", "缺陷修复实际工作量（小时）", "会议时长（小时）"];
    // 计划工作量所在列
    var planWorkCols = ["开发标准工作量(小时)", "设计标准工作量(小时)", "任务标准工作量（小时）", "缺陷修复实际工作量（小时）", "会议时长（小时）"];
    // 计算工作量
    function calculateTableData() {
        var realWorkColNums = []; // 实际工作量所在列序号
        var planWorkColNums = []; // 计划工作量所在列序号
        var realWorkHours = 0; // 实际工作量
        var planWorkHours = 0; // 计划工作量

        // 遍历表头列，找到工作量所在列的序号
        var thead = document.querySelector("#issuetable thead"); // 表头
        var thTr = thead.children[0];
        var colCount = thTr.childElementCount;
        for (var i = 0; i < thTr.childElementCount; i++) {
            var thSpan = thTr.children[i].querySelector("span"); // 表头列文字
            if (!thSpan) {
                continue;
            }
            var thText = thSpan.innerText;
            if (realWorkCols.indexOf(thText) > -1) {
                realWorkColNums.push(i);
            }
            if (planWorkCols.indexOf(thText) > -1) {
                planWorkColNums.push(i);
            }
        }
        var tbody = document.querySelector("#issuetable tbody"); // 表体
        var trArr = tbody.children; // 表格的所有子节点

        // 遍历表体行，工作量累加
        for (var j = 0; j < tbody.childElementCount; j++) {
            if (trArr[j].id == "ipd_work_stats_tr") {
                // 忽略统计行
                continue;
            }
            var tdArr = trArr[j].children; // 获取本行的单元格列表

            for (var rIndex in realWorkColNums) {
                realWorkHours += parseInt(tdArr[realWorkColNums[rIndex]].innerText || "0"); // 获取实际工作量列数据累计
            }

            for (var pIndex in planWorkColNums) {
                planWorkHours += parseInt(tdArr[planWorkColNums[pIndex]].innerText || "0");
            }
        }

        // 表格增加一行统计数据
        var statsTr = tbody.querySelector("#ipd_work_stats_tr");
        if (!statsTr) {
            statsTr = document.createElement("tr");
            statsTr.id = "ipd_work_stats_tr";
            statsTr.class = "issuerow";
            tbody.appendChild(statsTr);
        }
        var user_title = document.querySelector("#search-header-view > div > h1").innerText.replace("任务_", "");
            statsTr.innerHTML = `<td colspan="2">工作量统计</td><td colspan="${colCount - 2}"><span>${user_title}</span> 实际: ${realWorkHours/8.0}天 计划: ${planWorkHours/8.0}天</td>`;
        //alert(document.querySelector("#search-header-view > div > h1").innerText + " 实际: " + (realWorkHours/8.0) + " 计划: " + (planWorkHours/8.0));
    }

    // 添加菜单项
    GM_registerMenuCommand("计算工作量", function(){
        calculateTableData();
    });
})();