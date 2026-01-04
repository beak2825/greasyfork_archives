// ==UserScript==
// @name         Google voice Upgrade
// @namespace    com.Ethan.googleVoice
// @description  More space
// @author       Ethan
// @license      MIT
// @match        https://voice.google.com/*
// @version      1.0.0
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/502717/Google%20voice%20Upgrade.user.js
// @updateURL https://update.greasyfork.org/scripts/502717/Google%20voice%20Upgrade.meta.js
// ==/UserScript==

(function() {
  'use strict';
  document.querySelector('div.gvCallSidebar-root.gvCallSidebar-messagesTab').style.display = 'none';
})();
