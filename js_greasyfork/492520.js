// ==UserScript==
// @name         雲科 Tronclass 進階網頁操作
// @namespace    http://tampermonkey.net/
// @version      0.0.4
// @description  Tronclass 更多進階操作
// @author       BeenYan
// @match        https://eclass.yuntech.edu.tw/course/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=edu.tw
// @grant        none
// @license      MIT
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/492520/%E9%9B%B2%E7%A7%91%20Tronclass%20%E9%80%B2%E9%9A%8E%E7%B6%B2%E9%A0%81%E6%93%8D%E4%BD%9C.user.js
// @updateURL https://update.greasyfork.org/scripts/492520/%E9%9B%B2%E7%A7%91%20Tronclass%20%E9%80%B2%E9%9A%8E%E7%B6%B2%E9%A0%81%E6%93%8D%E4%BD%9C.meta.js
// ==/UserScript==

const delay = async (ms = 100) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

const openNewTab = (event) => {
  // 按下中鍵
  if (event.button !== 1) return;

  let target = event.target;
  while (true) {
    if (target.id.startsWith('learning-activity-')) {
      break
    }

    target = target.parentNode;
    if (target === document) return;
  }
  const id = target.id.match(/\d+/)[0];
  const url = new URL(`learning-activity#/${id}`, window.location.href);
  window.open(url);
};

(() => {
  'use strict';

  window.addEventListener("mousedown", openNewTab);
  const originalAddEventListener = window.addEventListener;
  window.addEventListener = function(type, listener, options) {
    if (type === 'blur') return;
    originalAddEventListener.call(this, type, listener, options);
  };
})();
