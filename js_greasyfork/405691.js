// ==UserScript==
// @name         虎牙TV领取宝箱
// @namespace    https://1silencer.github.io/
// @version      1.5.0
// @description  虎牙TV自动领取宝箱
// @author       Silencer
// @match        *://www.huya.com/*
// @match        *://*.huya.com/*
// @icon         https://www.huya.com/favicon.ico
// @downloadURL https://update.greasyfork.org/scripts/405691/%E8%99%8E%E7%89%99TV%E9%A2%86%E5%8F%96%E5%AE%9D%E7%AE%B1.user.js
// @updateURL https://update.greasyfork.org/scripts/405691/%E8%99%8E%E7%89%99TV%E9%A2%86%E5%8F%96%E5%AE%9D%E7%AE%B1.meta.js
// ==/UserScript==

// 定时检测一次(单位秒),可调整,过快会影响浏览器性能
const time = 10;
Notification.requestPermission()

setInterval(() => {
  for (const i of document.querySelectorAll('.player-box-stat3')) {
    if (i.style.visibility === "visible") {
      i.click()
      //new Notification(`虎牙TV`, { body: `领取`, icon: 'https://www.huya.com/favicon.ico' })
    }
    document.querySelector("#player-box").style.display = "none"
  }
}, time * 1e3)