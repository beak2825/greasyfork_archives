// ==UserScript==
// @namespace yunyuyuan
// @name nc pdf header hide
// @description nextcloud pdf header hide
// @match *://*.yunyuyuan.net/*
// @version 0.0.1.1
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/470609/nc%20pdf%20header%20hide.user.js
// @updateURL https://update.greasyfork.org/scripts/470609/nc%20pdf%20header%20hide.meta.js
// ==/UserScript==

(function () {
  'use strict';
  let hided = false;
  document.addEventListener('keydown', (e) => {
    const container = document.querySelector('div[data-handler="pdf"]');
    if (container && e.key === '1'){
      const modalHeader = container.querySelector('.modal-header');
      const modalContainer = container.querySelector('.modal-container');
      const iframe = container.querySelector('iframe');
      if (!hided) {
        modalHeader.style.opacity = "0";
        modalHeader.style.zIndex = "0";
        modalContainer.style.top = "0";
        modalContainer.style.bottom = "0";
        iframe.style.height = '100%';
        hided = true;
      } else {
        hided = false;
        modalHeader.style.opacity = "1";
        modalHeader.style.zIndex = "10001";
        modalContainer.style.top = "var(--header-height)";
        modalContainer.style.bottom = "var(--header-height)";
        iframe.style.height = 'calc(100vh - var(--header-height))';
      }
    }
  })
})()