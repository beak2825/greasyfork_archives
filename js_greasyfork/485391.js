// ==UserScript==
// @name         快点众包界面优化
// @namespace    kdzb.cc
// @version      1.15
// @description  配合Windows高对比度主题暗夜一起使用，主要为了不晃眼睛，最适用于利用前进和后退刷题的小伙伴们
// @author       Jiyao
// @match        https://kdzb.cc/*
// @icon         https://kdzb.cc/logo.png
// @license      AGPL-3.0
// @grant        GM_addStyle
// @grant        GM_addElement
// @run-at       document-body
// @downloadURL https://update.greasyfork.org/scripts/485391/%E5%BF%AB%E7%82%B9%E4%BC%97%E5%8C%85%E7%95%8C%E9%9D%A2%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/485391/%E5%BF%AB%E7%82%B9%E4%BC%97%E5%8C%85%E7%95%8C%E9%9D%A2%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==

(function() {
    'use strict';
    //顶部变黑
    //var top1 = document.getElementsByClassName('el-header');

    //top1[0].innerHTML = top1[0].innerHTML.replace('background-color: rgb(255, 255, 255)','background-color: rgb(0, 0, 0)');

    //GM_addElement(document.getElementsByTagName('div')[16],'style',{textContent:'div{height:100%;padding:12px;background-color:rgb(0,0,0);};'})

    GM_addStyle('.tab-box .tab{color: #ffc200 !important;}.login-container,.right{background: black !important;}.style {background-color: rgb(0 0 0);}')

    // 去除watermar,黑色背景
    GM_addStyle('.watermark{visibility: hidden !important;}.el-scrollbar__wrap{background: black;}.el-card__body {background-color: black;}.el-table--enable-row-hover .el-table__body tr:hover>td.el-table__cell {background-color: #606060;}.el-table tr {background-color: #000000;}.el-table__body-wrapper tr td.el-table-fixed-column--left {background-color: #000000;}.el-table--striped .el-table__body tr.el-table__row--striped td.el-table__cell {background-color: #272727 !important;}.el-table td.el-table__cell div {FONT-WEIGHT: 600;font-size: 16px;color: #FFC200;}');
    //今日收入
    GM_addStyle('.income-card{background: black !important;border-style: dashed;border-color:#ffc200;}');
    //等级展示
    GM_addStyle('.level-info{background: black !important;border-style: dashed;border-color:#ffc200;}.page .level-info .title{color:#ffc200 !important;}.page .level-info .content .item .num{color:#ffc200 !important;}.page .level-info .content .item .name{color:#ffc200 !important;}');
    //今日排名
    GM_addStyle('.ranking{background: black !important;}.personal .ranking .rank-num{color:#ffc200 !important;}.personal .ranking .name{color:#ffc200 !important;}');
    //个人概况
    GM_addStyle('.personal .withdraw-box .money-box .money,.page .user-info .income-card .header .money-box .money{color:#ffc200 !important;}.personal .withdraw-box{background-color: #000000 !important;border-style: dashed;border-color:#ffc200;}.personal .num-box .time-item{background-color: #000000 !important;}.personal .num-box .num-item{border-style: dashed;}.personal{background-color: #000000 !important;}.personal .earnings{color:#ffc200 !important;}.personal .title{color:#ffc200 !important;}.personal .num-box .num-item{background-color: #000000 !important;}.personal .num-box .item .name{color:#ffc200 !important;}.personal .num-box .item .num{color:#ffc200 !important;}');
    //订单统计和排名
    GM_addStyle('.rank-list .rank-foot .num{color:#ffc200 !important;}.rank-list .rank-body .item .count,.el-menu-item,el-sub-menu,.el-sub-menu__title{color:#ffc200 !important;}.rank-list .rank-body .item .name .val{color:#ffc200 !important;}.rank-list .rank-body .item .rank .num{color:#ffc200 !important;}.home-page .tab-section .tab-box{background: #000000 !important;color:#ffc200 !important;}.title{color:#ffc200 !important;}.analysis .title{color:#ffc200 !important;}.rank-list .rank-head{background: #000000 !important;color:#ffc200 !important;}.rank-list .rank-foot{background: #000000 !important;color:#ffc200 !important;}.home-page .bottom .section-statistics{background-color: #000000 !important;}.analysis .num-box .item{background: #000000 !important;}.analysis .num-box .item .name{color:#ffc200 !important;}.analysis .num-box .item .num{color:#ffc200 !important;}');
    // 任务概况
    GM_addStyle('.page,.h-container .el-row.is-align-middle{background-color: #000000 !important;}.h-table-container{background-color: #000000 !important;border-style: dashed;border-color:#ffc200;}.el-table{--el-table-header-bg-color: #000000 !important;--el-table-header-text-color: #ffc200 !important;}');
    //首页左栏
    GM_addStyle('.aside[data-v-523c7ac2] .el-menu--vertical>.el-menu-item.is-active{background: #3f3f43 !important;}.aside,.el-container.is-vertical,.el-menu{background: black !important;}');

    GM_addStyle('.el-badge__content--danger { background-color: #ffffff !important;}.send-order-tip{background-color: #000000 !important;}.goods-camp{background: black !important;}.el-badge__content{color: #000000 !important;}');

    GM_addStyle('.el-badge__content.is-fixed{font-size: xx-large !important;}.item .weight-changed{border: 5px solid #3b00ff !important;}');
 })();