// ==UserScript==
// @name        Jenkins Pending Action Notifier
// @description Show desktop notification if user action is required
// @version     1.2
// @author      Stan L
// @license     MIT
// @match       https://jenkins.devops.namecheap.net/*
// @grant       GM_notification
// @namespace https://greasyfork.org/users/206789
// @downloadURL https://update.greasyfork.org/scripts/487196/Jenkins%20Pending%20Action%20Notifier.user.js
// @updateURL https://update.greasyfork.org/scripts/487196/Jenkins%20Pending%20Action%20Notifier.meta.js
// ==/UserScript==

(() => {
  function showNotification(title, text, timeout) {
    Notification.requestPermission().then(function(result) {
        if (result === "granted") {
            GM_notification({ title, text, timeout, onclick: window.focus });
        }
    });
  }
  setInterval(() => {
      const isPendingInput = document.querySelector('.PAUSED_PENDING_INPUT');
      if (isPendingInput) showNotification('Jenkins', 'Your action is required!', 10_000);
  }, 10_000);
})();
