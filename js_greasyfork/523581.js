// ==UserScript==
// @name        Send message on <C-Enter>
// @namespace   Violentmonkey Scripts
// @license MIT
// @match       https://web.whatsapp.com/*
// @grant       none
// @version     1.0
// @author      tippfehlr
// @icon        https://www.google.com/s2/favicons?sz=64&domain=whatsapp.com
// @description well, fix WhatsApp i guess.
// @downloadURL https://update.greasyfork.org/scripts/523581/Send%20message%20on%20%3CC-Enter%3E.user.js
// @updateURL https://update.greasyfork.org/scripts/523581/Send%20message%20on%20%3CC-Enter%3E.meta.js
// ==/UserScript==

onkeydown = function(e){
  if(e.ctrlKey && e.key == 'Enter'){
    e.preventDefault();
    e.stopPropagation();
    document.querySelector('[data-icon="send"]').click()
  }
}