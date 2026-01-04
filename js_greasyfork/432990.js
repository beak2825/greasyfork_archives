// ==UserScript==
// @name         大学生网络党校学习助手
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  大学生网络党校视频每隔20分钟暂停一次太可恶了，严重影响大学生学习上进的积极性，此脚本可以免除20分钟的限制，帮助学员更好畅游知识的海洋。如果发现系统无法登录，请先关闭脚本后再登录。
// @author       TCH
// @match        *://study.enaea.edu.cn/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/432990/%E5%A4%A7%E5%AD%A6%E7%94%9F%E7%BD%91%E7%BB%9C%E5%85%9A%E6%A0%A1%E5%AD%A6%E4%B9%A0%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/432990/%E5%A4%A7%E5%AD%A6%E7%94%9F%E7%BD%91%E7%BB%9C%E5%85%9A%E6%A0%A1%E5%AD%A6%E4%B9%A0%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function()
{
    'use strict';
    console.log('It\'s runing Now');
    setInterval(function()
    {
        if(document.getElementsByClassName("dialog-box").length!=0)
        {
            console.log("检测到20分钟限制，去除限制");
            document.getElementsByClassName("dialog-button-container")[0].children[0].click();
        }
        console.log("检测中");
    },3000);
})();
