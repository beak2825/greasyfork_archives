// ==UserScript==
// @name         OutlookSidebarADB
// @version      240823.a
// @description  hide outlook sidebar ads
// @match        https://outlook.live.com/*
// @icon         https://outlook.live.com/mail/favicon.ico
// @grant        none
// @run-at       document-body
// @namespace https://greasyfork.org/users/296362
// @downloadURL https://update.greasyfork.org/scripts/487570/OutlookSidebarADB.user.js
// @updateURL https://update.greasyfork.org/scripts/487570/OutlookSidebarADB.meta.js
// ==/UserScript==

(function() {
  'use strict';

  // Define selectors more precisely and target specific elements
  var targets = [
      '#MainModule > div > div > div[class*=css-] + div',
      '#MailList > div > div > div > div > div > div > div > div:first-child',
  ];

  // Create the style element and apply CSS rules
  var style = document.createElement('style');
  style.textContent = targets.map(selector => `${selector} { display: none !important; }`).join('\n');
  document.body.appendChild(style);

})();
