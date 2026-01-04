// ==UserScript==
// @name         二维码转链接
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  检测网页上的二维码并尝试转换为链接
// @author       jiemo
// @match        *://tv.kanpian.club/*/*
// @grant        none
// @require      https://cdn.jsdelivr.net/npm/jsqr@1.4.0/dist/jsQR.min.js
// @license MIT
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/534457/%E4%BA%8C%E7%BB%B4%E7%A0%81%E8%BD%AC%E9%93%BE%E6%8E%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/534457/%E4%BA%8C%E7%BB%B4%E7%A0%81%E8%BD%AC%E9%93%BE%E6%8E%A5.meta.js
// ==/UserScript==


(function() {
  'use strict';
  let codeData = null;
  let listenerAdded = false;

  // 循环执行脚本
  setInterval(() => {
    // 检测canvas元素
    const canvas = document.querySelector('#qrcode canvas');

    if (canvas) {
      try {
        // 获取canvas的图像数据
        const ctx = canvas.getContext('2d');
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

        // 使用jsQR解码二维码
        const code = jsQR(imageData.data, imageData.width, imageData.height);

        if (code && code.data !== codeData) {
          codeData = code.data;
          console.log('二维码链接：', codeData);

          // 为document添加点击事件监听器，使用capture模式
          if (!listenerAdded) {
            document.addEventListener('click', (event) => {
              const rect = canvas.getBoundingClientRect();
              if (event.clientX >= rect.left && event.clientX <= rect.right && event.clientY >= rect.top && event.clientY <= rect.bottom) {
                window.open(codeData, '_blank');
              }
            }, true); // 使用capture模式
            listenerAdded = true;
          }
        } else if (!code) {
          console.log('未能解码二维码');
          codeData = null;
        }
      } catch (err) {
        console.log('解码二维码失败：', err);
      }
    } else {
      console.log('未找到二维码canvas元素');
      codeData = null;
      listenerAdded = false;
    }
  }, 1000); // 每秒执行一次
})();


