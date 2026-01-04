// ==UserScript==
// @name    Refresh Halt
// @description Stops QuillBot from loading the page almost immediately after opening the page.
// @version 1.1.1
// @license MIT
// @icon https://i.ibb.co/nmdhdKB/Quill-Bot-Stopper.png" alt="Quill-Bot-Stopper
// @include *://*quillbot.com/*
// @run-at document-start
// @namespace https://greasyfork.org/users/884210
// @downloadURL https://update.greasyfork.org/scripts/441103/Refresh%20Halt.user.js
// @updateURL https://update.greasyfork.org/scripts/441103/Refresh%20Halt.meta.js
// ==/UserScript==

(function() {
  window.setTimeout(function () {
      window.stop();
  }, 1000);
})();