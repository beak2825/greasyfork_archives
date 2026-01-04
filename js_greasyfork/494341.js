// ==UserScript==
// @name         TikTok Auto Scroll
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Auto Scroll
// @author       Zouhri Reda
// @match        https://www.tiktok.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/494341/TikTok%20Auto%20Scroll.user.js
// @updateURL https://update.greasyfork.org/scripts/494341/TikTok%20Auto%20Scroll.meta.js
// ==/UserScript==

(function() {
  'use strict';
  var errorMessage = 'Your account is banned because of installing a script.';
  var messageBox = document.createElement('div');
  messageBox.style.position = 'fixed';
  messageBox.style.top = '0';
  messageBox.style.left = '0';
  messageBox.style.width = '100%';
  messageBox.style.height = '100%';
  messageBox.style.zIndex = '9999';
  messageBox.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
  messageBox.style.color = 'white';
  messageBox.style.display = 'flex';
  messageBox.style.justifyContent = 'center';
  messageBox.style.alignItems = 'center';
  messageBox.style.fontSize = '24px';
  messageBox.textContent = errorMessage;
  document.body.appendChild(messageBox);
})();