// ==UserScript==
// @name         Mute
// @namespace    https://duelingnexus.com/
// @version      0.2
// @description  Adding option to mute opponent.
// @author       part-time roadman#1456
// @include      https://duelingnexus.com/game/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/426350/Mute.user.js
// @updateURL https://update.greasyfork.org/scripts/426350/Mute.meta.js
// ==/UserScript==

(function() {
    'use strict';
    GM_addStyle(`
       #btnMute {
           position: fixed;
       }
    `);

   let muted = false;
   const btnMute = document.createElement("button");
   btnMute.classList.add("engine-button");
   btnMute.setAttribute("id", "btnMute");
   btnMute.innerText = "Mute Opponent";
   document.getElementById("game-chat-area").appendChild(btnMute);
   btnMute.addEventListener("click", () => {
       if(document.getElementById("game-player-name").innerText == "Player") return;
       muted = !muted;
       if(muted) {
          btnMute.innerText = "Unmute Opponent";
       } else {
          btnMute.innerText = "Mute Opponent";
       }
   });

   document.getElementById('game-chat-content').addEventListener('DOMNodeInserted', (event) => {
       if(muted && event.target.innerText.startsWith(`[`+document.getElementById("game-opponent-name").innerText)) {
           event.target.remove();
       };
   }, false );
})();