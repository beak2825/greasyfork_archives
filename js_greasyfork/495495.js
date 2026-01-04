// ==UserScript==
// @name         抖音免登录以及查看评论
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  关闭抖音登录面板及相关视频卡片登录引导
// @author       wj
// @match        https://www.douyin.com/*
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/495495/%E6%8A%96%E9%9F%B3%E5%85%8D%E7%99%BB%E5%BD%95%E4%BB%A5%E5%8F%8A%E6%9F%A5%E7%9C%8B%E8%AF%84%E8%AE%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/495495/%E6%8A%96%E9%9F%B3%E5%85%8D%E7%99%BB%E5%BD%95%E4%BB%A5%E5%8F%8A%E6%9F%A5%E7%9C%8B%E8%AF%84%E8%AE%BA.meta.js
// ==/UserScript==

(function () {
  "use strict";

  // Function to check for the login panel and close it
  function checkAndCloseLoginPanel() {
    // Find divs with id containing 'login-full-panel-'
    var loginPanelDivs = document.querySelectorAll(
      'div[id*="login-full-panel-"]'
    );
    if (loginPanelDivs.length > 0) {
      // Find the div with class 'dy-account-close'
      var closeButton = document.querySelector("div.dy-account-close");
      if (closeButton) {
        // Click the close button
        closeButton.click();
        console.log("登录面板已关闭");
      }
    }
  }

  // Function to check for the related video card login guide and close it
  function checkAndCloseRelatedVideoCardLoginGuide() {
    // Find the div with id 'related-video-card-login-guide'
    var relatedVideoCardLoginGuide = document.getElementById(
      "related-video-card-login-guide"
    );
    if (relatedVideoCardLoginGuide) {
      // Find the close button within the related video card login guide footer
      var closeButton = relatedVideoCardLoginGuide.querySelector(
        "div.related-video-card-login-guide__footer div.related-video-card-login-guide__footer-close"
      );
      if (closeButton) {
        // Click the close button
        closeButton.click();
        console.log("相关视频卡片登录引导已关闭");
      }
    }
  }

  // Check and close login panels on DOM content loaded
  document.addEventListener("DOMContentLoaded", function () {
    checkAndCloseLoginPanel();
    checkAndCloseRelatedVideoCardLoginGuide();
  });

  // Additionally, observe the DOM for changes and check again if necessary
  var observer = new MutationObserver(function (mutations) {
    mutations.forEach(function (mutation) {
      checkAndCloseLoginPanel();
      checkAndCloseRelatedVideoCardLoginGuide();
    });
  });

  // Configure the observer to watch for changes in the body subtree
  observer.observe(document.body, { childList: true, subtree: true });
})();
