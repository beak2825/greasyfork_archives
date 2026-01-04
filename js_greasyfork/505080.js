// ==UserScript==
// @name         OLED Pure Black Background
// @namespace    (link unavailable)
// @version      1.5
// @description  Change websites' background to pure black for OLED screens
// @author       Patrick Gomes
// @match        *://*/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/505080/OLED%20Pure%20Black%20Background.user.js
// @updateURL https://update.greasyfork.org/scripts/505080/OLED%20Pure%20Black%20Background.meta.js
// ==/UserScript==

(function() {
  'use strict';

  const css = `
    html, body {
      background-color: #000000 !important;
    }
    * {
      background-color: rgba(0, 0, 0, 0.5) !important;
      color: #8cffb5 !important;
      border-color: #444444 !important;
    }
    a {
      color: #ff66ff !important;
    }
    img {
      filter: brightness(0.8) contrast(1.2); /* Adjust brightness and contrast of images */
    }
    /* Exclude YouTube videos from brightness and contrast adjustments */
    video, .html5-video-container video {
      filter: none !important; /* Remove any filter applied to videos */
    }
  `;

  const style = document.createElement('style');
  style.type = 'text/css';
  style.appendChild(document.createTextNode(css));
  document.head.appendChild(style);

  const observer = new MutationObserver(function() {
    document.documentElement.style.backgroundColor = '#000000';
    document.body.style.backgroundColor = '#000000';
  });
  observer.observe(document, { childList: true, subtree: true });

})();
