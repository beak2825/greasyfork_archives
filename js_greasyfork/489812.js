// ==UserScript==
// @name         百度贴吧自动签到
// @namespace    http://tampermonkey.net/
// @version      2024-05-19.1
// @description  打开脚本刷新一下
// @author       贴吧id o.p._p qq:2489564719
// @match        https://tieba.baidu.com/*
// @match        https://mooc1.chaoxing.com/mooc-ans/mycourse/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=greasyfork.org
// @grant        none
// @license      All Rights Reserved
// @downloadURL https://update.greasyfork.org/scripts/489812/%E7%99%BE%E5%BA%A6%E8%B4%B4%E5%90%A7%E8%87%AA%E5%8A%A8%E7%AD%BE%E5%88%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/489812/%E7%99%BE%E5%BA%A6%E8%B4%B4%E5%90%A7%E8%87%AA%E5%8A%A8%E7%AD%BE%E5%88%B0.meta.js
// ==/UserScript==

"use strict"
let a,url="https://tieba.baidu.com",index=0;const concernList=new Set;function post1(){for(let e=1;e<a+1;e++)console.log("开始执行"),$.post(`${url}/f/like/mylike?&pn=${e}`).then(e=>{const t=document.createElement("iframe");document.body.insertBefore(t,document.querySelector("#com_userbar"));const o=new MutationObserver(()=>{const e=t.contentDocument.querySelectorAll(".forum_table tr:not(.forum_table tr:nth-child(1))");if(e[0]){for(let t of e)concernList.add(t.querySelector("a[title]").title);for(let e of concernList)setTimeout(()=>{$.get("https://tieba.baidu.com/dc/common/tbs",function(t){$.post(`${url}/sign/add`,{kw:`${e}`,ie:" utf-8",tbs:`${JSON.parse(t).tbs}`})})},1500*index++);t.remove(),o.disconnect()}});o.observe(t.contentDocument,{childList:!0,subtree:!0}),t.contentWindow.document.write(e)})}$.post(`${url}/f/like/mylike?v=${(new Date).getTime()}`,{v:`${(new Date).getTime()}`}).then(e=>{const t=document.createElement("iframe");document.body.insertBefore(t,document.querySelector("#com_userbar"));const o=new MutationObserver(()=>{t.contentDocument.querySelectorAll(".forum_table tr:not(.forum_table tr:nth-child(1))")[0]&&(a=+t.contentDocument.querySelector("#j_pagebar > div > a:nth-child(4)").getAttribute("href").slice(t.contentDocument.querySelector("#j_pagebar > div > a:nth-child(4)").getAttribute("href").lastIndexOf("=")+1)+1,t.remove(),o.disconnect())});o.observe(t.contentDocument,{childList:!0,subtree:!0}),t.contentWindow.document.write(e),setTimeout(function(){post1()},3e3)}),setTimeout(()=>{$(".top-sec").html("myQQ2489564719有问题反馈  签到列表:"+Array.from(concernList))},8e3);