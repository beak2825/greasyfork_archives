// ==UserScript==
// @name         新版萌娘百科显示版本历史入口
// @description  (已过期)使用萌娘百科新皮肤时，在未登录的情况下，显示页面历史记录入口
// @author       Tinhone
// @namespace    开放入口有益无害，关闭入口有害无益，我作为一名游客对此改动十分愤怒
// @license      GPL-3.0
// @version      1.1
// @icon         https://zh.moegirl.org.cn/favicon.ico
// @grant        none
// @compatible   firefox V70+
// @compatible   edge V70+
// @compatible   chrome V70+
// @match        *://zh.moegirl.org.cn/*
// @exclude      *://zh.moegirl.org.cn/
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/444890/%E6%96%B0%E7%89%88%E8%90%8C%E5%A8%98%E7%99%BE%E7%A7%91%E6%98%BE%E7%A4%BA%E7%89%88%E6%9C%AC%E5%8E%86%E5%8F%B2%E5%85%A5%E5%8F%A3.user.js
// @updateURL https://update.greasyfork.org/scripts/444890/%E6%96%B0%E7%89%88%E8%90%8C%E5%A8%98%E7%99%BE%E7%A7%91%E6%98%BE%E7%A4%BA%E7%89%88%E6%9C%AC%E5%8E%86%E5%8F%B2%E5%85%A5%E5%8F%A3.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const selector1 = "div div div main div div article div div div.left-block div#p-namespaces ul.namespaces-links-list" //按顺序一路下来的选择器
    const selector2 = "div div div main div div article div div div.left-block div#p-namespaces ul.namespaces-links-list li a" //按顺序一路下来的选择器
        if (document.querySelector(selector1)) {
            var i=document.querySelector(selector1)
            const qwq=document.createElement("li")
            var qwqwq=document.querySelector(selector2).getAttribute("href")
            qwqwq=qwqwq.slice(1) //删除字符串首个字符
            qwq.innerHTML=`<a href="https://zh.moegirl.org.cn/index.php?title=${qwqwq}&action=history" class="" title="关于内容页面的历史记录" data-v-6496e6ea="">历史</a>`
            i.appendChild(qwq)
        }
})()