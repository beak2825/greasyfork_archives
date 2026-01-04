// ==UserScript==

// @name         BiliBili 自动宽屏
// @author       Shikieiki
// @version      1.0.0
// @description  B站视频打开后自动宽屏

// @match               *://www.bilibili.com/video/*
// @match               *://www.bilibili.com/bangumi/play/*
// @match               *://www.bilibili.com/blackboard/*
// @match               *://www.bilibili.com/watchlater/*
// @match               *://www.bilibili.com/list/*
// @match               *://player.bilibili.com/*

// @namespace https://greasyfork.org/users/133375
// @downloadURL https://update.greasyfork.org/scripts/520890/BiliBili%20%E8%87%AA%E5%8A%A8%E5%AE%BD%E5%B1%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/520890/BiliBili%20%E8%87%AA%E5%8A%A8%E5%AE%BD%E5%B1%8F.meta.js
// ==/UserScript==

'use strict';

function autoClickWidescreenButton() {
  const widescreenButton = document.querySelector('[role="button"][aria-label="宽屏"]');
  if (widescreenButton) {
    widescreenButton.click();
  }
}

function waitForWidescreenButton() {
  const observer = new MutationObserver((mutationsList, observer) => {
    const widescreenButton = document.querySelector('[role="button"][aria-label="宽屏"]');
    if (widescreenButton) {
      widescreenButton.click();
      observer.disconnect(); // Stop observing once the button is clicked
    }
  });

  observer.observe(document.body, { childList: true, subtree: true }); // Observe changes in the DOM
}

waitForWidescreenButton();