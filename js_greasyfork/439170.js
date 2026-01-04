// ==UserScript==
// @name         去除B站视频表情弹幕
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  干掉B站表情弹幕
// @author       冰乐
// @match        *://*.bilibili.com/video/*
// @icon         https://www.google.com/s2/favicons?domain=bilibili.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/439170/%E5%8E%BB%E9%99%A4B%E7%AB%99%E8%A7%86%E9%A2%91%E8%A1%A8%E6%83%85%E5%BC%B9%E5%B9%95.user.js
// @updateURL https://update.greasyfork.org/scripts/439170/%E5%8E%BB%E9%99%A4B%E7%AB%99%E8%A7%86%E9%A2%91%E8%A1%A8%E6%83%85%E5%BC%B9%E5%B9%95.meta.js
// ==/UserScript==

(function() {
  window.onload = () => {
    const style = ".b-danmaku img {display:none;}"
    const element = document.createElement('style')
    element.innerText = style
    document.body.appendChild(element)
  }
})();