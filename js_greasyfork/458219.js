// ==UserScript==
// @name         Unsticky Twitter Header
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  unsticks the twitter header
// @author       Shampooh
// @run-at       document-idle
// @match        https://twitter.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=twitter.com
// @grant        GM_addStyle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/458219/Unsticky%20Twitter%20Header.user.js
// @updateURL https://update.greasyfork.org/scripts/458219/Unsticky%20Twitter%20Header.meta.js
// ==/UserScript==
 
GM_addStyle ( `
    .r-gtdqiz {
    position: initial !important;
    }
 
    .r-5zmot {
    background-color: rgba(0, 0, 0, 1);
    }
 
    .r-1e5uvyk{
    backdrop-filter: none;
` );