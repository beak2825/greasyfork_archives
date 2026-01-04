// ==UserScript==
// @name         Hide "celebration" after each guess
// @namespace    http://tampermonkey.net/
// @version      2025-06-12
// @description  hiding avatar and guess celebration from result screen
// @author       You

// @match        https://www.geoguessr.com/*
// @run-at       document-start
// @icon         https://www.google.com/s2/favicons?sz=64&domain=geoguessr.com
// @grant        GM_addStyle
// @license MIT 
// @downloadURL https://update.greasyfork.org/scripts/539227/Hide%20%22celebration%22%20after%20each%20guess.user.js
// @updateURL https://update.greasyfork.org/scripts/539227/Hide%20%22celebration%22%20after%20each%20guess.meta.js
// ==/UserScript==




GM_addStyle(`
[class*="result-avatar_avatarContainer__mkrS0"] {display: none !important}
[class*="result-avatar_celebrateCopy__GDkmN"] {display: none !important}
`);
