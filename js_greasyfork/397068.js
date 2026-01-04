// ==UserScript==
// @icon         https://mall.hipac.cn/ico/favicon.ico
// @name         hipac jira链接跳转助手
// @namespace    http://www.hipac.cn/
// @version      0.1
// @description  支持 jira 表格字段跳转
// @author       午休
// @match        *://jira.yangtuojia.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/397068/hipac%20jira%E9%93%BE%E6%8E%A5%E8%B7%B3%E8%BD%AC%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/397068/hipac%20jira%E9%93%BE%E6%8E%A5%E8%B7%B3%E8%BD%AC%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';
    if(typeof $ === 'undefined'){
        return;
    }
    // 绑定跳转事件
    // Your code here...
    $('body').on('click','.drill_through_table tr td:nth-child(2)',function(){
       window.open(`//jira.yangtuojia.com/browse/${$(this).html()}`);
    })
    // 添加样式
    let style = document.createElement("style");
    style.type = "text/css";
    let text = document.createTextNode(`
    .drill_through_table tr td:nth-child(2){
        color: #0052cc;
        cursor: pointer;
    }
    .drill_through_table tr td:nth-child(2):hover {
        color: #0065ff;
        text-decoration: underline;
    }
    `);
    style.appendChild(text);
    let head = document.getElementsByTagName("head")[0];
    head.appendChild(style);
})();
