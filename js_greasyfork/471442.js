// ==UserScript==
// @name         初音色去广告
// @namespace    http://tampermonkey.net/
// @version      0.1
// @license      MIT
// @description  初音色
// @author       阿九
// @match       https://www.mikuclub.win/*
// @icon         https://cdn.mikuclub.fun/favicon.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/471442/%E5%88%9D%E9%9F%B3%E8%89%B2%E5%8E%BB%E5%B9%BF%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/471442/%E5%88%9D%E9%9F%B3%E8%89%B2%E5%8E%BB%E5%B9%BF%E5%91%8A.meta.js
// ==/UserScript==

let popBanner=document.getElementsByClassName("pop-banner")
for (const item of popBanner) {
    item.innerHTML=''
}
let adsbygoogleNoablate=document.getElementsByClassName("adsbygoogle-noablate")
for (const item of adsbygoogleNoablate) {
    item.innerHTML=''
    item.style.display='none'
}