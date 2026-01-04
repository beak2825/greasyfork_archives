// ==UserScript==
// @name         Discord Background Changer
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Change Discord Web background to a custom image
// @author       チャト
// @match        https://discord.com/*
// @grant        
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/544705/Discord%20Background%20Changer.user.js
// @updateURL https://update.greasyfork.org/scripts/544705/Discord%20Background%20Changer.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const bgImageURL = 'https://i.imgur.com/ewaD2sH.jpeg'; // ← 好きな画像のURLに変更

  const style = document.createElement('style');
  style.innerHTML = `
    body {
      background-image: url('${bgImageURL}') !important;
      background-size: cover !important;
      background-position: center center !important;
    }

    .theme-dark, .theme-light {
      background-color: transparent !important;
      background-image: none !important;
    }

    .container-1eFtFS, .appMount-3lHmkl {
      background-color: rgba(0, 0, 0, 0.6) !important;
    }
  `;
  document.head.appendChild(style);
})();
