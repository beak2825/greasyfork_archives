// ==UserScript==
// @name         YouTube Static Logo (No Animated Holiday GIF)
// @namespace    https://greasyfork.org/en/users/yourprofile
// @version      1.1
// @description  Keeps the YouTube home logo static instead of animated holiday GIFs, but still clickable
// @match        https://m.youtube.com/*
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/546342/YouTube%20Static%20Logo%20%28No%20Animated%20Holiday%20GIF%29.user.js
// @updateURL https://update.greasyfork.org/scripts/546342/YouTube%20Static%20Logo%20%28No%20Animated%20Holiday%20GIF%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const replaceLogo = () => {
        const logo = document.querySelector('a[href="/"] img');
        if (logo && (logo.src.includes("gif") || logo.src.includes("animated"))) {
            // Replace with the standard static YouTube logo
            logo.src = "https://www.youtube.com/s/desktop/fe6f0cf2/img/favicon_144x144.png";
            logo.removeAttribute("srcset");
        }
    };

    const observer = new MutationObserver(replaceLogo);
    observer.observe(document.body, { childList: true, subtree: true });

    replaceLogo();
})();