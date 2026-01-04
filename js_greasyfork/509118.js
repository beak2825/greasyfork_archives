// ==UserScript==
// @name        boring ahh podcast
// @namespace   Violentmonkey Scripts
// @match       https://www.destiny.gg/bigscreen
// @grant       none
// @version     1.0
// @author      skm
// @license     MIT
// @description boring ahh podcast!
// @downloadURL https://update.greasyfork.org/scripts/509118/boring%20ahh%20podcast.user.js
// @updateURL https://update.greasyfork.org/scripts/509118/boring%20ahh%20podcast.meta.js
// ==/UserScript==

(function() {
  'use strict';
  const iframe = document.createElement('iframe');
  iframe.src = 'https://www.youtube.com/embed/BnIPVBx-EB8?autoplay=1&mute=1';
  iframe.width = '560';
  iframe.height = '315';
  iframe.style.border = 'none';
  iframe.style.marginTop = '20px';
  const contentContainer = document.querySelector('#bigscreen-container') || document.body;
  contentContainer.appendChild(iframe);
})();
