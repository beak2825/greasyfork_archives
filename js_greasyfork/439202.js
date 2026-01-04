// ==UserScript==
// @name         9vs1破解上鎖影片
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  9vs1破解上鎖影片，解鎖觀看所有影片
// @author       YC白白
// @match        https://www.9vs1.com/*
// @match        https://9vs1.com/*
// @icon         https://www.google.com/s2/favicons?domain=9vs1.com
// @grant        none
// @license      AGPL
// @downloadURL https://update.greasyfork.org/scripts/439202/9vs1%E7%A0%B4%E8%A7%A3%E4%B8%8A%E9%8E%96%E5%BD%B1%E7%89%87.user.js
// @updateURL https://update.greasyfork.org/scripts/439202/9vs1%E7%A0%B4%E8%A7%A3%E4%B8%8A%E9%8E%96%E5%BD%B1%E7%89%87.meta.js
// ==/UserScript==

// v0.2 新增匹配網域

// https://www.9vs1.com/
// 破解此網頁，解鎖觀看所有影片

// 把class裡的locked屬性全部去掉
let aaa = document.getElementsByClassName("locked")
console.log(aaa.length)
for (let i = 0; i < aaa.length; i+=0) {
    aaa[i].classList.remove("locked")
}

// 預覽的icon 鎖頭 => 攝影機
aaa = document.querySelectorAll("div.preview > i")
console.log(aaa.length)
for (let i = 0; i < aaa.length; i++) {
    aaa[i].classList.add("icon-preview")
    aaa[i].classList.remove("icon-lock")
}

// 1.1前面的icon & 點開預覽裡的1.1前的icon 鎖頭 => 擁影機
aaa = document.getElementsByClassName("icon-lock")
console.log(aaa.length)
for (let i = 0; i < aaa.length; i+=0) {
    aaa[i].classList.add("icon-video")
    aaa[i].classList.remove("icon-lock")
}