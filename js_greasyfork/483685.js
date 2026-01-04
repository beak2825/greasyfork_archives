// ==UserScript==
// @name         AutoRemark
// @namespace    https://github.com/Pologue/AutoRemarkScript
// @version      0.0.1
// @description  a script can auto remark for you
// @author       Pologue
// @match        https://ugsqs.whu.edu.cn/*
// @icon         none
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/483685/AutoRemark.user.js
// @updateURL https://update.greasyfork.org/scripts/483685/AutoRemark.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
    console.log("AutoRemark start!");
    main();

    async function main() {
        await sleep(1000);
        // setTimeout(function () {
        if (window.location.href.indexOf("https://ugsqs.whu.edu.cn/studentpj") != -1 ||
            window.location.href.indexOf("https://ugsqs.whu.edu.cn/new/student/index.jsp") != -1) {
            // 主页
            let data = $("#task-list").children().data('data');
            let overtime = "timeNO"; // 是否超时
            let contextPath = "";
            let backUrl = contextPath + '/new/student/rank/evaluate2.jsp?hdfaid=' + data.ID + '&overtime=' + overtime + '&sfkdcpj=' + data.SFKDCPJ + '&sfqxzdf=' + data.SFQXZDF + '&zbtx=' + data.ZBTX + '&kkxy=' + data.ORGCODE + '&roid=' + data.ROID;
            window.location.href = backUrl; // 跳转到评教页
            console.log("AutoRemark: 跳转到评教页");
        }

        // 课程列表页
        let totalPage = $("table.table.table-bordered.table-striped").dataTable().fnPagingInfo().iTotalPages; // 总页数
        console.log("AutoRemark: 总页数: " + totalPage);
        for (let i = 0; i < totalPage; i++) {
            await sleep(1000);
            let pagination = $(".dataTables_paginate.paging_bootstrap.pagination").children().children(); // 分页栏
            pagination.eq(i + 1).click(); // 点击下一页
            console.log("AutoRemark: 点击第" + (i + 1) + "页");
            remarkInOnePage();
        }
        // }, 500);
    }

    async function remarkInOnePage() {
        console.log("AutoRemark: remarkInOnePage");
        await sleep(1000);
        // setTimeout(function () {
        // 获取待评教课程的列表
        let courseList = $("#pjkc").children(); // 课程列表数组
        let remarkFunctList = [];
        for (let i = 0; i < courseList.length; i++) {
            let course = courseList[i];
            // let courseName = $(course).find("td").eq(0).text();
            // let teacherName = $(course).find("td").eq(1).text();
            let remarkFunct = $(course).find("td").eq(-1).children().attr("onclick"); // evaluate1(...)
            let courseStatus = $(course).find("td").eq(-2).children().text();
            if (courseStatus == "未评价") {
                remarkFunctList.push(remarkFunct);
            }
        }

        for (let i = 0; i < remarkFunctList.length; i++) {
            let remarkFunct = remarkFunctList[i];
            eval(remarkFunct); // 弹出评教dialog
            remarkInDlg();
        }
        // }, 1000);
    }

    function remarkInDlg() {
        console.log("AutoRemark: remarkInDlg");
        // setTimeout(function () {
        let unFullSegment = Math.floor(Math.random() * 5) + 1; // 1-5
        // 单选题列表，li元素
        let remarkSegment1 = $("#pjnr").children().eq(0).children().children().eq(1).children(); // 整体满意度
        let remarkSegment2 = $("#pjnr").children().eq(1).children().children().eq(1).children(); // 教师教学行为
        let remarkSegment3 = $("#pjnr").children().eq(2).children().children().eq(1).children(); // 教学实施过程
        let remarkSegment4 = $("#pjnr").children().eq(3).children().children().eq(1).children(); // 学生学习行为
        let remarkSegment5 = $("#pjnr").children().eq(4).children().children().eq(1).children(); // 学生学习收获
        // 开放型问题
        let remarkSegment6 = $("#pjnr").children().eq(-1).children().children().eq(1).children(); // 文字评价

        remarkSegment(remarkSegment1, unFullSegment, 1);
        remarkSegment(remarkSegment2, unFullSegment, 2);
        remarkSegment(remarkSegment3, unFullSegment, 3);
        remarkSegment(remarkSegment4, unFullSegment, 4);
        remarkSegment(remarkSegment5, unFullSegment, 5);
        remarkText(remarkSegment6, "暂无");

        // setTimeout(function () {
        $("#pjsubmit").click();
        // }, 5000);
        // }, 2000);
    }

    function remarkSegment(segment, unFullSegment, num) {
        console.log("AutoRemark: remarkSegment" + num);
        // setTimeout(function () {
        let n = segment.length;
        if (unFullSegment == num) {
            let unFullRemark = Math.floor(Math.random() * n); // 0 ~ n-1
            for (let i = 0; i < n; i++) {
                let element = segment.eq(i);
                if (i == unFullRemark) {
                    scoreAt(element, 4);
                }
                else {
                    scoreAt(element, 5);
                }
            }
        }
        else {
            for (let i = 0; i < n; i++) {
                let element = segment.eq(i);
                scoreAt(element, 5);
            }
        }
        // }, 2000);
    }

    // score 1-5
    function scoreAt(element, score) {
        console.log("AutoRemark: scoreAt");
        let scoreBtn = element.children().eq(-1).children().children().eq(5 - score).children().children().children();
        scoreBtn.get(0).click();
    }

    function remarkText(element, text) {
        console.log("AutoRemark: remarkText");
        let textArea = element.children().eq(-1).children().children();
        textArea.val(text);
    }
})();