// ==UserScript==
// @name         No Blur
// @description  Removes youtube blur video background
// @version      0.1.1
// @author       0vC4
// @namespace    https://greasyfork.org/users/670183
// @match        *://*.youtube.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @license      MIT
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/455456/No%20Blur.user.js
// @updateURL https://update.greasyfork.org/scripts/455456/No%20Blur.meta.js
// ==/UserScript==

GM_addStyle
(`#cinematics {
    display: none !important;
}
#shorts-cinematic-container {
    display: none !important;
}`);