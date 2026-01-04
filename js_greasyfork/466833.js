// ==UserScript==
// @license MIT
// @name        剪贴板杀手(去除剪贴板小尾巴)
// @namespace   Violentmonkey Scripts
// @match       https://www.bilibili.com/read/*
// @grant       none
// @version     1.0
// @author      -
// @description 2023/5/22 14:44:28
// @downloadURL https://update.greasyfork.org/scripts/466833/%E5%89%AA%E8%B4%B4%E6%9D%BF%E6%9D%80%E6%89%8B%28%E5%8E%BB%E9%99%A4%E5%89%AA%E8%B4%B4%E6%9D%BF%E5%B0%8F%E5%B0%BE%E5%B7%B4%29.user.js
// @updateURL https://update.greasyfork.org/scripts/466833/%E5%89%AA%E8%B4%B4%E6%9D%BF%E6%9D%80%E6%89%8B%28%E5%8E%BB%E9%99%A4%E5%89%AA%E8%B4%B4%E6%9D%BF%E5%B0%8F%E5%B0%BE%E5%B7%B4%29.meta.js
// ==/UserScript==
(()=>{
    let p = [ ...document.querySelector("#app").querySelectorAll("p"),...document.querySelector("#app").querySelectorAll("h1") ]
    p.forEach((item)=>{
        item.oncopy = (e)=>{ e.cancelBubble = true }
    })
})()
