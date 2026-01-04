// ==UserScript==
// @name         更好的智学网
// @namespace    http://tampermonkey.net/
// @version      0.6
// @description  Better zhixue
// @author       ObcbO
// @license      MIT
// @match        *://*.zhixue.com/*
// @icon         https://static.zhixue.com/zhixue.ico
// @run-at       document-body
// @grant        GM.getValue
// @grant        GM.setValue
// @grant        GM_addValueChangeListener
// @grant        GM_removeValueChangeListener
// @grant        GM_addElement
// @grant        GM_addStyle
// @grant        GM.registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/480258/%E6%9B%B4%E5%A5%BD%E7%9A%84%E6%99%BA%E5%AD%A6%E7%BD%91.user.js
// @updateURL https://update.greasyfork.org/scripts/480258/%E6%9B%B4%E5%A5%BD%E7%9A%84%E6%99%BA%E5%AD%A6%E7%BD%91.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function getSubjectList() {
    return JSON.parse(sessionStorage.getItem("subjectList"))
    }
    function getSubjectCode() {
    return sessionStorage.getItem("zxbReportDetailCurrentSubjectCode")
    }
    function getExamID() {// 考试ID
    return sessionStorage.getItem("zxbReportExamId");
    }
    var token = localStorage.getItem("xToken")

    GM_addStyle(`
    /* ADs */
    .hot {
    display: none!important;
    }
    `)
    var pathname = window.location.pathname;
    if (pathname == "/activitystudy/web-report/index.html") {
    // 考试报告
    GM_addStyle(`
    /* 成绩报告首页 历次学情*/
    .report-detail-entry {
    display: inline-block;
    margin: 10px 10px;
    }

    /* 考试报告详情 */
    .exam-container {
    margin: 0px 0px -25px 0px;
    }
    .report {
    margin: 0 auto;
    width: 100%
    }
    .report-header {
    position: sticky;
    top: 0;
    z-index: 10;
    }
    .report-content {
    display: inline-flex;
    overflow: hidden;
    }
    .report-content .hierarchy {
    margin-right: 10px;
    min-width: fit-content;
    height: fit-content;
    }
    .report-content .hierarchy .single .subject {
    width: 80px;
    }
    .report-content .hierarchy .single .sub-item {
    display: contents;
    }
    .subject_analysis {
    min-width: fit-content;
    }
    .subject_analysis_legend_div {
    width: 80%;
    }

    /* 手机模式 */
    @media only screen and (max-width: 734px) {
    /* div { width:100vw; height:100vh; font-size:10vw; background:#ccc; } */
    .report-content {
    display: contents;
    }
    .report-content .hierarchy {
    margin-right: auto;
    }
    .report-content .hierarchy .single .sub-item {
    display: inline-table!important;
    }
    `)
    }
})();