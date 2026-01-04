// ==UserScript==
// @name            Change player.twitch.tv Title
// @description     Changes tabs title on load with channels username on player.twitch.tv pages.
// @version         1.3
// @author          yungsamd17
// @namespace       https://github.com/yungsamd17/UserScripts
// @license         MIT License
// @icon            https://raw.githubusercontent.com/yungsamd17/UserScripts/main/scripts/icons/Change-Player-Twitch-Title.png
// @match           https://player.twitch.tv/*
// @grant           none
// @run-at          document-end
// @downloadURL https://update.greasyfork.org/scripts/472022/Change%20playertwitchtv%20Title.user.js
// @updateURL https://update.greasyfork.org/scripts/472022/Change%20playertwitchtv%20Title.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Temp title update.
    
    // Check if the URL matches
    if (window.location.href.startsWith("https://player.twitch.tv/?channel=")) {
      // Extract the username
      const urlParams = new URLSearchParams(window.location.search);
      const username = urlParams.get("channel");
    
      // Update title
      document.title = `${username} - Twitch Player`;
    }
    
    window.onload = function() {
      
      // Final title update with case-sensitive channel username
    
      // Find the element and update the title
      function updatePlayerTitle() {
        const element = document.querySelector('[data-test-selector="stream-info-card-component__title-link"]');
    
        if (element) {
          // Extract the username
          const username = element.textContent.trim();
    
          // Update title
          document.title = `${username} - Twitch Player`;
        }
      }
    
      updatePlayerTitle();
      console.log("%cChange player.twitch.tv Title:", "color: #9147ff", "Title Updated.");
}})();