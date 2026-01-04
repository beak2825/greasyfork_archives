// ==UserScript==
// @name         快捷跳转BiliGPT
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  在视频标题下方添加快捷跳转BiliGPT的链接
// @author       You
// @match        https://www.bilibili.com/video/*
// @icon         data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🐣</text></svg>
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/461214/%E5%BF%AB%E6%8D%B7%E8%B7%B3%E8%BD%ACBiliGPT.user.js
// @updateURL https://update.greasyfork.org/scripts/461214/%E5%BF%AB%E6%8D%B7%E8%B7%B3%E8%BD%ACBiliGPT.meta.js
// ==/UserScript==

var gpt = document.createElement("a");
var url = document.location.href;
var newUrl = url.split("/?")[0].replace("bilibili.com", "bilibili.jimmylv.cn");
gpt.innerText = "🐣BiliGPT";
gpt.href = newUrl;
gpt.setAttribute("target", "_blank");
var dataRow = document.querySelector(".video-info-detail-list");
window.setTimeout(() => {
    dataRow.appendChild(gpt);
}, 3000);
