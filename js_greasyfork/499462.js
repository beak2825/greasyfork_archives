// ==UserScript==
// @name         publink-remove-dingtalk-boss-image
// @namespace    http://tampermonkey.net/
// @version      0.7
// @description  remove dingtalk boss image
// @author       huangbc
// @include      *://*
// @license      MIT
// @icon         https://www.google.com/s2/favicons?sz=64&domain=shb.ltd
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/499462/publink-remove-dingtalk-boss-image.user.js
// @updateURL https://update.greasyfork.org/scripts/499462/publink-remove-dingtalk-boss-image.meta.js
// ==/UserScript==

(function() {
    'use strict';



function remove() {
  // 目标 URL
  const targetUrl = "https://static.dingtalk.com/media/lQLPM39yCOc2R_vNAyDNAyCwguEkon_NBHAHtCYDWdVoAA_800_800.png";

  // 获取所有 img 元素
  const images = document.querySelectorAll('img');

  // 遍历所有 img 元素
  images.forEach((img) => {
    // 检查 img 的 src 属性是否包含目标 URL
    if (img.src.includes(targetUrl)) {
      // 删除该 img 元素
      img.parentNode.remove();
    }
  });
  
}

// 从 0 秒开始，每隔 100ms 执行一次 remove 函数
let times = [0]

for (let i = 0; i < 1000; i++) {
  times.push(i * 100);
}

times.forEach((time) => {
  setTimeout(remove, time);
})

setInterval(remove, 2000);

remove();


})();