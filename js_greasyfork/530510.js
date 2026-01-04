// ==UserScript==
// @name         Blur Profile Images
// @description  Blurs profile images on Nitter profiles.
// @match        https://nitter.net/*
// @match        https://nitter.privacyredirect.com/*
// @match        https://xcancel.com/*
// @match        https://nitter.space/*
// @match        https://nitter.tiekoetter.com/*
// @version 0.0.1.20250904154230
// @namespace https://greasyfork.org/users/1435046
// @downloadURL https://update.greasyfork.org/scripts/530510/Blur%20Profile%20Images.user.js
// @updateURL https://update.greasyfork.org/scripts/530510/Blur%20Profile%20Images.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function blurProfileImages() {
        document.querySelectorAll('.profile-card-avatar img').forEach(img => {
            img.style.filter = 'blur(100px)';
        });
    }

    // Run once on page load
    blurProfileImages();

    // Observe for dynamically loaded content
    const observer = new MutationObserver(blurProfileImages);
    observer.observe(document.body, { childList: true, subtree: true });
})();
