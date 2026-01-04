// ==UserScript==
// @name         BusinessInsider Unlimited
// @namespace    https://greasyfork.org/
// @version      0.40
// @description  Delete BusinessInsider's "You've reached your 5 article limit" modal.
// @author       xamilaf781
// @license      MIT
// @match        https://www.businessinsider.com/*
// @downloadURL https://update.greasyfork.org/scripts/441918/BusinessInsider%20Unlimited.user.js
// @updateURL https://update.greasyfork.org/scripts/441918/BusinessInsider%20Unlimited.meta.js
// ==/UserScript==

setTimeout(function() {
  document.body.className = document.body.className.replace("tp-modal-open","");
  document.body.className = document.body.className.replace("js-dialog-open","");
  document.getElementsByClassName("tp-modal")[0].remove();
  document.getElementsByClassName("tp-backdrop")[0].remove();
  var elements = document.getElementsByClassName("in-post-sticky");
  while (elements.length > 0) elements[0].remove();
}, 2000);

