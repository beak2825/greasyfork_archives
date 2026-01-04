// ==UserScript==
// @name         remove spotify web ad
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       DannyWu
// @match        https://open.spotify.com/album/1aNkIWX1Uz0mSUK3OAFygO
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/390418/remove%20spotify%20web%20ad.user.js
// @updateURL https://update.greasyfork.org/scripts/390418/remove%20spotify%20web%20ad.meta.js
// ==/UserScript==

(function() {
    'use strict';
    document.querySelector(".Root__ads-container").remove();
    // Your code here...
})();