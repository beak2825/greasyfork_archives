// ==UserScript==
// @name         Sakura.fm Enter to Send
// @version      1.0
// @description  Lets you do enter to send instead of it going to the next line.
// @author       Kir
// @match        https://www.sakura.fm/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=sakura.fm
// @grant        none
// @namespace https://greasyfork.org/users/1499259
// @downloadURL https://update.greasyfork.org/scripts/543910/Sakurafm%20Enter%20to%20Send.user.js
// @updateURL https://update.greasyfork.org/scripts/543910/Sakurafm%20Enter%20to%20Send.meta.js
// ==/UserScript==
(function() {
  'use strict';
  document.addEventListener('keydown', function(e) {
    const ta = document.querySelector('textarea');
    if (!ta) return;
    if (e.key === 'Enter') {
      if (e.shiftKey) {
        // let Shift+Enter insert newline naturally
        return;
      }
      // Enter alone: prevent newline, trigger send
      e.preventDefault();
      const sendBtn = document.querySelector('button[type=submit], button.send');
      if (sendBtn) sendBtn.click();
    }
  });
})();
