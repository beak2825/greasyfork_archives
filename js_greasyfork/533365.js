// ==UserScript==
// @name         Reveal and Blur Spoiler Images
// @namespace   Violentmonkey Scripts
// @match       https://8chan.moe/*/res/*.html*
// @match       https://8chan.se/*/res/*.html*
// @grant       none
// @version     0.0.2
// @author      DS
// @license MIT
// @description  Replace spoiler.png with actual image and add a blur effect
// @downloadURL https://update.greasyfork.org/scripts/533365/Reveal%20and%20Blur%20Spoiler%20Images.user.js
// @updateURL https://update.greasyfork.org/scripts/533365/Reveal%20and%20Blur%20Spoiler%20Images.meta.js
// ==/UserScript==


(function() {
    'use strict';

    function revealSpoilers() {
        const spoilerLinks = document.querySelectorAll('a.imgLink');

        spoilerLinks.forEach(link => {
            const img = link.querySelector('img');
            if (img && ! img.src.includes('/.media/t_')) {
                let href = link.getAttribute('href');

                if (href) {
                    // Extract filename without extension
                    const match = href.match(/\/\.media\/([^\/]+)\.[a-zA-Z0-9]+$/);
                    if (match) {
                        const transformedSrc = `/\.media/t_${match[1]}`;
                        img.src = transformedSrc;

                        // Apply blur style
                        img.style.filter = 'blur(5px)';
                        img.style.transition = 'filter 0.3s ease';

                        // Optional: unblur on hover
                        img.addEventListener('mouseover', () => {
                            img.style.filter = 'none';
                        });

                        img.addEventListener('mouseout', () => {
                            img.style.filter = 'blur(5px)';
                        });
                    }
                }
            }
        });
    }

    revealSpoilers();

    const observer = new MutationObserver(revealSpoilers);
    observer.observe(document.body, { childList: true, subtree: true });
})();