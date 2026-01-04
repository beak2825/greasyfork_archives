// ==UserScript==
// @name         FPS顯示
// @namespace    https://your-unique-namespace.com/
// @version      2023-12-24
// @description  be made by jay13345
// @author       You
// @match        *://*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=mit.edu
// @grant        none
// @license      MIT
// @version
// @downloadURL https://update.greasyfork.org/scripts/483380/FPS%E9%A1%AF%E7%A4%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/483380/FPS%E9%A1%AF%E7%A4%BA.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 創建一個 <div> 元素，用於顯示 FPS
const fpsDiv = document.createElement('div');
fpsDiv.style.position = 'fixed';
fpsDiv.style.left = '0';
fpsDiv.style.top = '0';
fpsDiv.style.backgroundColor = 'black';
fpsDiv.style.color = 'white';
fpsDiv.style.padding = '5px';
fpsDiv.style.zIndex = '9999';

// 計算 FPS
let frameCount = 0;
let fps = 0;
let lastTime = performance.now();
function updateFPS() {
  const now = performance.now();
  frameCount++;
  if (now - lastTime >= 1000) {
    fps = frameCount;
    frameCount = 0;
    lastTime = now;
  }
  fpsDiv.textContent = `FPS: ${fps}`;
  requestAnimationFrame(updateFPS);
}

// 將 <div> 元素加入到網頁中
document.body.appendChild(fpsDiv);

// 開始計算 FPS
requestAnimationFrame(updateFPS);
})();
