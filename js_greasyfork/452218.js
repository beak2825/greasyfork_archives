// ==UserScript==
// @name         菁优网解除复制和右键限制工具
// @version      0.2
// @namespace    https://codezhangborui.eu.org
// @description  【2022/9/29 更新版】解除菁优网复制和右键限制
// @author       CodeZhangBorui
// @match        http://www.jyeoo.com/*/ques/detail/*
// @match        https://www.jyeoo.com/*/ques/detail/*
// @match        http://www.jyeoo.com/*/report/detail/*
// @match        https://www.jyeoo.com/*/report/detail/*
// @icon         https://www.jyeoo.com/favicon.ico
// @grant        GM_registerMenuCommand
// @grant        GM_notification
// @homepage     https://github.io/CodeZhangBorui/Jyeoo-Print-Processer
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/452218/%E8%8F%81%E4%BC%98%E7%BD%91%E8%A7%A3%E9%99%A4%E5%A4%8D%E5%88%B6%E5%92%8C%E5%8F%B3%E9%94%AE%E9%99%90%E5%88%B6%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/452218/%E8%8F%81%E4%BC%98%E7%BD%91%E8%A7%A3%E9%99%A4%E5%A4%8D%E5%88%B6%E5%92%8C%E5%8F%B3%E9%94%AE%E9%99%90%E5%88%B6%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var username = document.getElementsByClassName('user')[0].innerText;
    console.log("%c菁优网解除复制和右键限制工具 %cBy CodeZhangBorui Version 0.2\n%c菁优网用户 %s，欢迎您使用本脚本", 'font-size: large; font-family: "微软雅黑"', 'font-size: large; font-family: "Consolas"', 'font-size: large; font-family: "微软雅黑"', username);

    document.body.oncopy = function() {
        console.log("菁优网解除复制和右键限制工具提示：复制成功！");
    }
    document.body.oncontextmenu = function() {
        console.log("菁优网解除复制和右键限制工具提示：打开右键菜单成功！");
    }
    console.log("✅ 程序已就绪！");
})();