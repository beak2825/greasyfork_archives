// ==UserScript==
// @name         Open Slack in Browser, not App
// @namespace    SlackINBrowser
// @version      3
// @description  Automatically open links in browser instead of app.
// @author       hacker09
// @match        https://*.slack.com/ssb/redirect
// @icon         https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR-jZviTc8TfzP5qMACAzl_IutS4ajjAL_uhw&usqp=CAU
// @run-at       document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/435705/Open%20Slack%20in%20Browser%2C%20not%20App.user.js
// @updateURL https://update.greasyfork.org/scripts/435705/Open%20Slack%20in%20Browser%2C%20not%20App.meta.js
// ==/UserScript==

(function() {
  'use strict';
  window.onload = function() {
    document.querySelector("a.c-link:nth-child(3)").click();
  };
})();