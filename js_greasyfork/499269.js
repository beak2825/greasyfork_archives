// ==UserScript==
// @name         Rajan's Youtubing Youtubes
// @namespace    http://tampermonkey.net/
// @version      2024-06-30
// @description  cause he don't like YT recs
// @author       Cha
// @match        https://www.youtube.com/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/499269/Rajan%27s%20Youtubing%20Youtubes.user.js
// @updateURL https://update.greasyfork.org/scripts/499269/Rajan%27s%20Youtubing%20Youtubes.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    window.location.href = "https://www.youtube.com/feed/subscriptions";
})();