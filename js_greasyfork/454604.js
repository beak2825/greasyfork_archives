// ==UserScript==
// @name         Twitter Notification Verified Tab Remover
// @namespace    aletheiaatheos-twitter-verified-tab-remover
// @author       AletheiaAtheos
// @version      0.1.3
// @description  Remove Verified Tab on Twitter Notification Page
// @match        *://twitter.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=twitter.com
// @license      The Unlicense
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/454604/Twitter%20Notification%20Verified%20Tab%20Remover.user.js
// @updateURL https://update.greasyfork.org/scripts/454604/Twitter%20Notification%20Verified%20Tab%20Remover.meta.js
// ==/UserScript==

(function () {
  'use strict';
    
  (function () {
    const config = {
      attributes: true,
      childList: true,
      subtree: true,
    };
      
    const observer = new MutationObserver(function () {
        var elements = document.querySelectorAll("a[href*='notifications/verified']");

        elements.forEach(element => {
            element.parentNode.parentNode.removeChild(element.parentNode);
            console.log("Twitter Notification Verified Tab Removed");
        });
    });
      
    observer.observe(document.body, config);
  })();
})();