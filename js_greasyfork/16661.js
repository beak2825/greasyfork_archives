// ==UserScript==
// @name         MXW Alerter
// @namespace    https://greasyfork.org/en/users/28185-bit
// @version      0.3
// @description  Most Exclusive Website (.com) turn notifier
// @author       Bit
// @match        http://mostexclusivewebsite.com/*
// @include      http://mostexclusivewebsite.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/16661/MXW%20Alerter.user.js
// @updateURL https://update.greasyfork.org/scripts/16661/MXW%20Alerter.meta.js
// ==/UserScript==
setTimeout(function() {
  setInterval(function() {
    if (document.body.style.backgroundColor !== "rgb(238, 238, 238)") {
      document.title = "** YOUR TURN **";
      document.body.onclick = function(event) {
        document.body.onclick = null;
        document.title = "Most Exclusive Website";
      }
    }
  }, 500);
}, 1500);