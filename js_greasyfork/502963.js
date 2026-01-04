// ==UserScript==
// @name        fix width on telegram web app
// @namespace   Violentmonkey Scripts
// @match       https://web.telegram.org/k/*
// @grant       none
// @version     0.1
// @author      Siarhei Siniak
// @license Unlicense
// @description 08/8/2024, 8:44:59 PM

// @inject-into document
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/502963/fix%20width%20on%20telegram%20web%20app.user.js
// @updateURL https://update.greasyfork.org/scripts/502963/fix%20width%20on%20telegram%20web%20app.meta.js
// ==/UserScript==

setTimeout(() => {
  let $$ = (s) => [document.querySelector(s)];
  $$('#page-chats')[0].setAttribute('style', 'max-width: unset !important;');

}, 3000)