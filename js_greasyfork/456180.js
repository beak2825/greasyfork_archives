// ==UserScript==
// @name         zhelper v4 跳转按钮
// @description		在zhelper v4的下载页面添加一个按钮 点击就下载 这是chatgpt写的哈哈哈
// @namespace   http://tampermonkey.net/
// @match       https://download.v4.zhelper.net/en/download/*
// @match   https://node2.v4.zhelper.net/download/*
// @match   https://download.v4.zhelper.net/download/*
// @author			chatgpt
// @grant       none
// @version			1.0
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/456180/zhelper%20v4%20%E8%B7%B3%E8%BD%AC%E6%8C%89%E9%92%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/456180/zhelper%20v4%20%E8%B7%B3%E8%BD%AC%E6%8C%89%E9%92%AE.meta.js
// ==/UserScript==

// 使用正则表达式获取 /download/ 后面的文本
var endoftheurl = window.location.pathname.match(/download\/(.*)/)[1];

// 创建一个按钮
var btn = document.createElement("button");
btn.innerHTML = "Click me";
btn.style.color = "red";

// 给按钮添加点击事件
btn.addEventListener("click", function() {
  window.location.href = "https://test2.zlib.download/download/" + endoftheurl;
});

// 将按钮添加到页面中
document.body.appendChild(btn);

// 将按钮添加到页面中间
btn.style.position = "absolute";
btn.style.left = "50%";
btn.style.top = "50%";
