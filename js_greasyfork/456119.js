// ==UserScript==
// @name       ChatGPT Enter Fix
// @namespace    http://tampermonkey.net/
// @description  This Chrome extension addresses the issue where ChatGPT sends text even when the Enter key is pressed during Japanese conversion.
// @version      1.1
// @author       d-engine
// @match      https://chat.openai.com/chat
// @downloadURL https://update.greasyfork.org/scripts/456119/ChatGPT%20Enter%20Fix.user.js
// @updateURL https://update.greasyfork.org/scripts/456119/ChatGPT%20Enter%20Fix.meta.js
// ==/UserScript==
 
(function() {
  const textarea = document.querySelector('textarea[data-id="root"]');
  textarea?.addEventListener(
    "keydown",
    (event) => {
      if (event.key === "Enter" && event.isComposing) {
        event.stopPropagation();
      }
    },
    { capture: true }
  );
})();