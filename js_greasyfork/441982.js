// ==UserScript==
// @name         Forbes Unlimited
// @namespace    https://greasyfork.org/
// @version      0.50
// @description  Delete Forbes' "We see you're using an ad blocker." modal.
// @author       xamilaf781
// @license      MIT
// @match        https://www.forbes.com/*
// @downloadURL https://update.greasyfork.org/scripts/441982/Forbes%20Unlimited.user.js
// @updateURL https://update.greasyfork.org/scripts/441982/Forbes%20Unlimited.meta.js
// ==/UserScript==

setTimeout(function() {
  document.body.className = document.body.className.replace("adblock-on tp-modal-open","");
  document.getElementsByClassName("tp-modal")[0].remove();
  document.getElementsByClassName("tp-backdrop")[0].remove();
}, 2000);
