// ==UserScript==
// @name         虎牙TV领取宝箱
// @namespace    https://1silencer.github.io/
// @version      1.3.1
// @description  虎牙TV自动领取宝箱,带桌面提示(请先设置允许通知)
// @author       Silencer
// @match        *://www.huya.com/*
// @match        *://*huya.com/*
// @icon         https://www.huya.com/favicon.ico
// @downloadURL https://update.greasyfork.org/scripts/388731/%E8%99%8E%E7%89%99TV%E9%A2%86%E5%8F%96%E5%AE%9D%E7%AE%B1.user.js
// @updateURL https://update.greasyfork.org/scripts/388731/%E8%99%8E%E7%89%99TV%E9%A2%86%E5%8F%96%E5%AE%9D%E7%AE%B1.meta.js
// ==/UserScript==

// 定时检测一次(单位:秒),可调整,过快会影响浏览器性能
const time = 2;
Notification.requestPermission()

setInterval(() => {
  document.querySelectorAll('.player-box-stat3')
    .forEach((item, index) => {
      if (item.style.visibility == "visible") {
        item.click()
        new Notification('虎牙TV', {
          body: `领取了第${index + 1}个宝箱`,
          icon: 'https://www.huya.com/favicon.ico'
        })
      }
      document.querySelector("#player-box").style.display = "none";
    })
}, time * 1000)
