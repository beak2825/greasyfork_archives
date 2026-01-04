// ==UserScript==
// @name         Gemini Chat
// @namespace    https://example.com/
// @version      1.0
// @description  Open Gemini Chat in a new tab.
// @author       Your Name
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/487437/Gemini%20Chat.user.js
// @updateURL https://update.greasyfork.org/scripts/487437/Gemini%20Chat.meta.js
// ==/UserScript==

(function() {
  'use strict';

  // Add a button to the toolbar.
  var button = 
  document.createElement("div");
  button.innerHTML = "🤖";
  button.setAttribute(
    "style",
    "font-size:5vw !important;width:10vw !important;height:10vw !important;line-height:10vw !important;text-align:center !important;background-color:rgba(250,250,250,0.7) !important;box-shadow:0px 0px 3px rgba(0,0,0,0.5) !important;position:fixed !important;bottom:65vh !important;left:6vw !important;z-index:99999 !important;border-radius:100% !important;transition: all 0.5s ease-in-out;"
  );
 
  button.id = 'gemini-chat-button';
  button.textContent = '💀';
  button.addEventListener('click', function() {
    window.open('https://gemini-chat.pro/#/chat', '_blank');
  });
  document.body.appendChild(button);
})();
