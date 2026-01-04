// ==UserScript==
// @name         力扣（Leetcode-cn）清理大师
// @namespace    https://github.com/NicerWang
// @version      0.2.2
// @description  本脚本旨在消除力扣刷题界面的无用信息，并仿照OJ对力扣进行改动。
// @author       NicerWang
// @match        https://leetcode.cn/problems/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=leetcode-cn.com
// @downloadURL https://update.greasyfork.org/scripts/443419/%E5%8A%9B%E6%89%A3%EF%BC%88Leetcode-cn%EF%BC%89%E6%B8%85%E7%90%86%E5%A4%A7%E5%B8%88.user.js
// @updateURL https://update.greasyfork.org/scripts/443419/%E5%8A%9B%E6%89%A3%EF%BC%88Leetcode-cn%EF%BC%89%E6%B8%85%E7%90%86%E5%A4%A7%E5%B8%88.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var style = document.createElement("style");
    style.type = "text/css";
    var blockCssText = "div[data-key='submissions-content']>div>div>div>div>div:nth-child(n+3)," // 删除提交错误时的错误用例显示[OJ默认设置]
                     + "div[data-key='runcode-result-content']>div>div>div:nth-child(4)," // 删除执行代码时的正确代码运行结果[OJ默认设置]
                     + "div[data-key='runcode-result-content']>div>div>div:nth-child(3)>label," // 删除比较按钮[OJ默认设置]
                     + "div[data-key='comments']," // 关闭评论区
                     + "div[data-key='description-content']>div>div:nth-child(n+3):nth-child(-n+8)," // 删除相关企业、总提交次数、贡献者等无用信息
                     + "nav>ul>li:nth-child(2),nav>ul>li:nth-child(4),nav>ul>li:nth-child(6),nav>ul>li:nth-child(7),nav>ul>li:nth-child(8)," // 删除顶栏的学习、讨论、求职、商店
                     + "nav>div>*:nth-child(-n+5)," // 删除顶栏的下载APP、会员、我是面试官、通知等按钮
                     + "div[data-key='debugger']," // 关闭调试器
                     + "div.bottom-right," // 删除笔记功能
                     + "div#question-detail-main-tabs>div:nth-child(2)>div>div:nth-child(1)>div>*:nth-child(3)," // 删除点赞按钮
                     + "div#question-detail-main-tabs>div:nth-child(2)>div>div:nth-child(1)>div>*:nth-child(5)," // 删除分享按钮
                     + "div#question-detail-main-tabs>div:nth-child(2)>div>div:nth-child(1)>div>*:nth-child(7)," // 删除接受动态按钮
                     + "div#question-detail-main-tabs>div:nth-child(2)>div>div:nth-child(1)>div>*:nth-child(8)," // 删除反馈按钮
                     + "div#lc-home>div>div:nth-child(2)>div:first-child>div:first-child>div:last-child>div:first-child>div:last-child>div:first-child>div," // 删除贡献按钮
                     + "#lang-select + button" // 删除智能模式按钮

    // 重命名：题解 => 🧨我要放弃
    var giveUp = "div[data-key='solution']>a>div>span>div>div {display:none} div[data-key='solution']>a>div>span>div:after{content:'🧨我要放弃'}";
    var text = document.createTextNode(blockCssText + "{display:none;}" + giveUp);
    style.appendChild(text);
    var head = document.getElementsByTagName("head")[0];
    head.appendChild(style);
})();