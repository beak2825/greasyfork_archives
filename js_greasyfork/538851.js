// ==UserScript==
// @name         Twitch Title Shortener
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @description  Automatically shortens long Twitch stream titles with hover preview
// @author       RM
// @match        https://www.twitch.tv/*
// @grant        none
// @license      MIT
// @supportURL   https://github.com/ODRise/STwitchT/issues
// @homepageURL  https://github.com/ODRise/STwitchT
// @downloadURL https://update.greasyfork.org/scripts/538851/Twitch%20Title%20Shortener.user.js
// @updateURL https://update.greasyfork.org/scripts/538851/Twitch%20Title%20Shortener.meta.js
// ==/UserScript==

(function() {
  'use strict';

  const style = document.createElement('style');
  style.textContent = `
    [data-a-target="stream-title"] {
      max-width: 400px !important;
      white-space: nowrap !important;
      overflow: hidden !important;
      text-overflow: ellipsis !important;
      display: inline-block !important;
    }

    [data-a-target="stream-title"]:hover {
      overflow: visible !important;
      white-space: normal !important;
      max-width: none !important;
      position: relative !important;
      z-index: 9999 !important;
      background: #18181b !important;
      padding: 5px !important;
      border-radius: 4px !important;
      box-shadow: 0 4px 12px rgba(0,0,0,0.5) !important;
    }
  `;
  document.head.appendChild(style);
})();
