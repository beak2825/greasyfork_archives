// ==UserScript==
// @name         FuckBilibiliSearchWord
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  消灭B站评论区的关键词搜索
// @author       丩卩夂忄
// @match        *://*.bilibili.com/
// @match        *://*.bilibili.com/*
// @icon         https://www.bilibili.com/favicon.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/447767/FuckBilibiliSearchWord.user.js
// @updateURL https://update.greasyfork.org/scripts/447767/FuckBilibiliSearchWord.meta.js
// ==/UserScript==

let style=document.createElement("style")
style.innerHTML=".jump-img,.icon.search-word{display:none!important}"
document.head.appendChild(style)
document.addEventListener("DOMNodeInserted",()=>{
    document.querySelectorAll(".comment-jump-url,.jump-link.search-word").forEach(dom=>{
        dom.outerHTML=dom.innerHTML
    })
})