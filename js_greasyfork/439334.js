// ==UserScript==
// @name         jamFan 隨機換room顏色
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  jamFan auto change room color
// @author       YC白白
// @match        https://jamulus.live/
// @icon         https://www.google.com/s2/favicons?domain=jamulus.live
// @grant        none
// @license      AGPL
// @downloadURL https://update.greasyfork.org/scripts/439334/jamFan%20%E9%9A%A8%E6%A9%9F%E6%8F%9Broom%E9%A1%8F%E8%89%B2.user.js
// @updateURL https://update.greasyfork.org/scripts/439334/jamFan%20%E9%9A%A8%E6%A9%9F%E6%8F%9Broom%E9%A1%8F%E8%89%B2.meta.js
// ==/UserScript==

// v0.1 隨機換room的顏色

let room = document.querySelectorAll("body > div.grid > div")
for (let i = 0; i < room.length; i++) {
    room[i].style.backgroundColor = `rgb(${getRndInteger(200, 255)}, ${getRndInteger(200, 255)}, ${getRndInteger(200, 255)})`
}

// 以下函數返回 min(包含) ~ max(包含)之間的數字：
function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1) ) + min;
}
console.log("already change color")