// ==UserScript==
// @name        NO CAPS IN CHAT
// @namespace   Violentmonkey Scripts
// @match       https://stake.*/fr*
// @grant       none
// @version     1.0
// @author      ConnorMcLeod
// @description 01/08/2024 22:29:51
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/502388/NO%20CAPS%20IN%20CHAT.user.js
// @updateURL https://update.greasyfork.org/scripts/502388/NO%20CAPS%20IN%20CHAT.meta.js
// ==/UserScript==

let lastTextArea = null;

setInterval(function() {
  let textarea = document.querySelector("#right-sidebar > div > div.footer.svelte-1g9csv6 > div.chat-input.svelte-15zhun5 > div > textarea");
  if (textarea && textarea !== lastTextArea) {
    textarea.onkeyup = null;
    lastTextArea = textarea;
    textarea.onkeyup = (() => {
      textarea.value = textarea.value.toLowerCase();
    });
  }
}, 200);
