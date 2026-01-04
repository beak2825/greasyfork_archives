// ==UserScript==
// @name         kbin Language filter
// @namespace    http://tampermonkey.net/
// @version      0.1.1
// @description  Filters posts based on language indicated in badge
// @author       Artillect
// @match        https://kbin.social/*
// @match        https://fedia.io/*
// @match        https://kilioa.org/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=kbin.social
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/468754/kbin%20Language%20filter.user.js
// @updateURL https://update.greasyfork.org/scripts/468754/kbin%20Language%20filter.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let whitelist = ['en', 'OC'];

    // Your code here...
    // Get all posts
    var posts = document.getElementsByClassName("entry section");

    // Loop through posts
    for (var i = 0; i < posts.length; i++) {
        // Get badge
        var badge = posts[i].getElementsByClassName("badge")[0];
        // Check if badge exists
        if (badge) {
            // Check if badge is in whitelist
            if (!whitelist.includes(badge.innerText)) {
                // Remove post
                posts[i].remove();
            }
        }
    }

})();