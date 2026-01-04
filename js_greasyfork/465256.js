// ==UserScript==
// @license MIT
// @name         F2 Tắt âm thanh
// @namespace    Minh Hiển
// @version      0.1
// @description  Như name
// @author       Hiển
// @match        https://www.youtube.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/465256/F2%20T%E1%BA%AFt%20%C3%A2m%20thanh.user.js
// @updateURL https://update.greasyfork.org/scripts/465256/F2%20T%E1%BA%AFt%20%C3%A2m%20thanh.meta.js
// ==/UserScript==

(function() {
    'use strict';
// Lấy video element
// Định nghĩa hàm tắt/bật âm thanh
function toggleMute() {
  const videoElement = document.querySelector('video');
  if (!videoElement) return;

  const isMuted = videoElement.muted;
  videoElement.muted = !isMuted;

  const message = isMuted ? 'Đã bật âm thanh' : 'Đã tắt âm thanh';
  const notification = document.createElement('div');
  notification.textContent = message;
  notification.style.position = 'fixed';
  notification.style.bottom = '10px';
  notification.style.right = '800px';
  notification.style.padding = '10px';
  notification.style.background = '#f44336';
  notification.style.color = 'white';
   notification.style.boxShadow = "2px 2px 5px rgba(0, 0, 0, 0.2)";
    notification.style.borderRadius = "5%";

  document.body.appendChild(notification);

  setTimeout(() => {
    notification.remove();
  }, 1000);
}

// Bắt sự kiện nhấn phím F2
document.addEventListener('keydown', (event) => {
  if (event.key === 'F2') {
    toggleMute();
  }
});


    // Your code here...
})();