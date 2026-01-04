// ==UserScript==
// @name         OpenStreetMap 時計
// @namespace    https://tampermonkey.net/user/YOUR_USER_ID
// @version      1.2
// @description  OpenStreetMap 
// @author       YOUR_NAME
// @match        https://www.openstreetmap.org/edit#map=*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/495383/OpenStreetMap%20%E6%99%82%E8%A8%88.user.js
// @updateURL https://update.greasyfork.org/scripts/495383/OpenStreetMap%20%E6%99%82%E8%A8%88.meta.js
// ==/UserScript==

(function() {
  'use strict';

  // 時計要素を作成
  const clockElement = document.createElement('div');
  clockElement.id = 'osm-clock';
  clockElement.style.position = 'absolute';
  clockElement.style.left = '48%';
  clockElement.style.bottom = '16';
  clockElement.style.transform = 'translate(-50%, 50%)';
  clockElement.style.fontSize = '18px';
  clockElement.style.fontFamily = 'sans-serif';
  clockElement.style.color = '#fff'; // 白に変更

  // 時計を更新する関数
  function updateClock() {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    // 秒数を非表示にする
    clockElement.textContent = `${hours}:${minutes}`;
  }

  // ページが読み込まれたときに時計を更新
  updateClock();

  // 1秒ごとに時計を更新
  setInterval(updateClock, 1000);

  // 時計要素をページに追加
  document.body.appendChild(clockElement);

  // マウスドラッグで時計を移動できるようにする
  let mouseDownX = 0;
  let mouseDownY = 0;
  let clockX = clockElement.offsetLeft;
  let clockY = clockElement.offsetTop;

  clockElement.addEventListener('mousedown', function(event) {
    mouseDownX = event.clientX;
    mouseDownY = event.clientY;
  });

  clockElement.addEventListener('mousemove', function(event) {
    if (mouseDown) {
      const deltaX = event.clientX - mouseDownX;
      const deltaY = event.clientY - mouseDownY;
      clockX += deltaX;
      clockY += deltaY;
      clockElement.style.left = `${clockX}px`;
      clockElement.style.top = `${clockY}px`;
    }
  });

  document.addEventListener('mouseup', function() {
    mouseDown = false;
  });
})();
