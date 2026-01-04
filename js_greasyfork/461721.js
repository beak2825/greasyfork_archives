// ==UserScript==
// @name         ChatGPT Auto Next
// @namespace    ChatGPTAgree
// @version      8
// @description  Automatically clicks on the "Stay logged out" button on ChatGPT.
// @author       hacker09
// @match        https://chatgpt.com/*
// @icon         https://chatgpt.com/favicon-32x32.png
// @require      https://update.greasyfork.org/scripts/519092/arrivejs%20%28Latest%29.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/461721/ChatGPT%20Auto%20Next.user.js
// @updateURL https://update.greasyfork.org/scripts/461721/ChatGPT%20Auto%20Next.meta.js
// ==/UserScript==
//https://greasyfork.org/en/scripts/461721/versions/new
document.arrive('.text-token-text-secondary.underline', (function(el) { //Create a new arrive function
  el.click(); //Click on the "Stay logged out" btn
})); //Finishes the async function