// ==UserScript==
// @name         Hide Moviesmod Banner Ad Section
// @namespace    http://tampermonkey.net/
// @version      2025-06-01
// @description  Hide banner-section on movie sites
// @author       You
// @match        https://topmovies.tips/*
// @match        https://moviesmod.email/*
// @icon         https://moviesmod.email/wp-content/uploads/2022/10/moviesmod.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/537955/Hide%20Moviesmod%20Banner%20Ad%20Section.user.js
// @updateURL https://update.greasyfork.org/scripts/537955/Hide%20Moviesmod%20Banner%20Ad%20Section.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to hide the banner-section if it exists
    function hideBanner() {
        const banner = document.getElementById('banner-section');
        if (banner) {
            banner.style.display = 'none';
        }
    }

    // Run once DOM is ready
    document.addEventListener("DOMContentLoaded", hideBanner);

    // In case it's dynamically loaded later
    const observer = new MutationObserver(hideBanner);
    observer.observe(document.body, { childList: true, subtree: true });
})();
