// ==UserScript==
// @name         poe_site_hide_profile_link
// @namespace    http://tampermonkey.net/
// @version      2025-02-08
// @description  hide profile link on poe site
// @author       knightli
// @match        https://www.pathofexile.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=pathofexile.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/526282/poe_site_hide_profile_link.user.js
// @updateURL https://update.greasyfork.org/scripts/526282/poe_site_hide_profile_link.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var profile_link = document.getElementsByClassName("profile-link");
    if (profile_link && profile_link[0])
    {
        profile_link[0].style.opacity = 0.02;
    }
    // Your code here...
})();