// ==UserScript==
// @name         Instagram Reel in New Tab (Workaround)
// @namespace    http://tampermonkey.net/
// @version      2.3
// @description  Script that opens your liked instagram reels in new tab insted of existing one.
// @author       gimpostin,ygrek
// @match        https://www.instagram.com/your_activity/interactions/likes/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/542585/Instagram%20Reel%20in%20New%20Tab%20%28Workaround%29.user.js
// @updateURL https://update.greasyfork.org/scripts/542585/Instagram%20Reel%20in%20New%20Tab%20%28Workaround%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    document.addEventListener('click', function(e) {
        const img = e.target.closest('img[data-bloks-name="bk.components.Image"]');
        if (img) {
            e.stopPropagation();
            e.preventDefault();

            const currentUrl = window.location.href;

            img.parentElement.click();

            setTimeout(() => {
                if (window.location.href !== currentUrl) {
                    const postUrl = window.location.href;
                    window.open(postUrl, '_blank');
                    window.history.back();
                }
            }, 500);
        }
    }, true);
})();
