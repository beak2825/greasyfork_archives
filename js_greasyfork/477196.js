// ==UserScript==
// @license MIT
// @name         靜音小助手🔈
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  幫你靜音成人小電影，當一個有禮貌的大人
// @author       You
// @match        https://*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=xvideos.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/477196/%E9%9D%9C%E9%9F%B3%E5%B0%8F%E5%8A%A9%E6%89%8B%F0%9F%94%88.user.js
// @updateURL https://update.greasyfork.org/scripts/477196/%E9%9D%9C%E9%9F%B3%E5%B0%8F%E5%8A%A9%E6%89%8B%F0%9F%94%88.meta.js
// ==/UserScript==

// 定義 JSON 資料，包含網址開頭
var jsonUrls = [
  "https://www.xvideos.com/",
  "https://example.com/json2",
  // 添加更多的網址開頭
];

// 取得當前網址
var currentUrl = window.location.href;

// 檢查當前網址是否以 JSON 中的某些開頭開始
var isJsonUrl = jsonUrls.some(function(jsonUrl) {
  return currentUrl.startsWith(jsonUrl);
});

// 如果當前網址符合 JSON 的某些開頭，執行程式碼
if (isJsonUrl) {
  // 在這裡放置你想要執行的程式碼
  console.log("當前網址符合 JSON 開頭");
  Mute();
} else {
  console.log("當前網址不符合 JSON 開頭");
}

function Mute(){
// 取得網頁上所有的 <video> 元素
var videoElements = document.getElementsByTagName('video');

// 迭代所有的 <video> 元素並將其靜音
for (var i = 0; i < videoElements.length; i++) {
  videoElements[i].muted = true;
}
}