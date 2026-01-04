// ==UserScript==
// @name         【自用】卡多多后台优化重排版
// @namespace    https://www.liuzhixi.cn/
// @version      1.0.3
// @description  卡多多产品列表在小屏幕下隐藏部分页不重要的列，后台隐藏渠道经理手机号
// @author       小沫
// @match        *://*.dandanhou.net/*
// @icon         https://ka.dandanhou.net/agent/favicon.ico
// @grant        GM_addStyle
// @license      GPL License
// @downloadURL https://update.greasyfork.org/scripts/536672/%E3%80%90%E8%87%AA%E7%94%A8%E3%80%91%E5%8D%A1%E5%A4%9A%E5%A4%9A%E5%90%8E%E5%8F%B0%E4%BC%98%E5%8C%96%E9%87%8D%E6%8E%92%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/536672/%E3%80%90%E8%87%AA%E7%94%A8%E3%80%91%E5%8D%A1%E5%A4%9A%E5%A4%9A%E5%90%8E%E5%8F%B0%E4%BC%98%E5%8C%96%E9%87%8D%E6%8E%92%E7%89%88.meta.js
// ==/UserScript==
function addStyle() {
    let host = window.location.host;
    let pathname = window.location.pathname;
    let kdd_agent_index =`
    .container-fluid .card-body:nth-child(1){
        height:100px !important;
    }
    .card-body .pull-left p:last-child, .container-fluid > div:nth-child(2) {
        display: none !important;
    }
    .lyear-layout-content > .container-fluid{
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
    }
    .container-fluid > div{
        float:none
    }
    .container-fluid > div:nth-child(1){
        width: 33.33%;
        order: 0;
    }
    .container-fluid > div:nth-child(4){
        width: 33.33%;
        order: 1;
    }
    .container-fluid > div:nth-child(5){
        width: 33.33%;
        order: 2;
    }
    .container-fluid > div:nth-child(6){
        width: 33.33%;
        order: 3;
    }
    .container-fluid > div:nth-child(7){
        width: 33.33%;
        order: 4;
    }
    .container-fluid > div:nth-child(8){
        width: 33.33%;
        order: 5;
    }
     
    .container-fluid > div:nth-child(3){
        width: 100%;
        order: 6;
    }

    .container-fluid > div:nth-child(9){
        width: 33.33%;
        order: 7;
    }
    .container-fluid > div:nth-child(11){
        width: 33.33%;
        order: 8;
    }
    .container-fluid > div:nth-child(12){
        width: 33.33%;
        order: 9;
    }
    .container-fluid > div:nth-child(10){
        width: 33.33%;
        order: 10;
        margin-top: -330px;
    }
    .container-fluid > div:nth-child(9) .card-body, .container-fluid > div:nth-child(10) .card-body{
        padding: 0 24px;
    }
    .container-fluid > div:nth-child(9) .card-body canvas, .container-fluid > div:nth-child(10) .card-body canvas{
        height: 250px !important;
    }
    `;
    let kdd_agent_list =`
    .lyear-layout-sidebar-close #my-table th:nth-child(4),
    .lyear-layout-sidebar-close #my-table td:nth-child(4), .lyear-layout-sidebar-close #my-table th:nth-child(7), .lyear-layout-sidebar-close #my-table td:nth-child(7),
    .lyear-layout-sidebar-close #my-table th:nth-child(8), .lyear-layout-sidebar-close #my-table td:nth-child(8), .lyear-layout-sidebar-close #my-table th:nth-child(9),
    .lyear-layout-sidebar-close #my-table td:nth-child(9), .lyear-layout-sidebar-close #my-table th:nth-child(11), .lyear-layout-sidebar-close #my-table td:nth-child(11){
        display: none !important;
    }
    .lyear-layout-sidebar-close #my-table th:nth-child(2), .lyear-layout-sidebar-close #my-table td:nth-child(2){
        max-width:300px!important;
    }
    .lyear-layout-sidebar-close #my-table th:nth-child(2) p, .lyear-layout-sidebar-close #my-table td:nth-child(2) p{
        white-space: normal !important;
    }
    `;

    if(pathname.indexOf("/agent/index")>-1){
        GM_addStyle(kdd_agent_index);
    }
    if(pathname.indexOf("/agent/list")>-1){
        GM_addStyle(kdd_agent_list);
    }

}
(function () {
    'use strict';
     addStyle();

})();