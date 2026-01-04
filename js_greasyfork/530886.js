// ==UserScript==
// @name         Nitro Type NEW Leaderboards Overlay
// @namespace    https://ntleaderboard.netlify.app/
// @version      4.6
// @description  View NT leaderboards natively on Nitro Type
// @author       nincaleb // adapted from Ginfino's Code
// @match        https://www.nitrotype.com/*
// @match        https://www.nitrotype.com/race/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/530886/Nitro%20Type%20NEW%20Leaderboards%20Overlay.user.js
// @updateURL https://update.greasyfork.org/scripts/530886/Nitro%20Type%20NEW%20Leaderboards%20Overlay.meta.js
// ==/UserScript==

(function () {
    'use strict';

    function embedLeaderboards(event) {
        if (event) event.preventDefault();

        if (!document.getElementById('leaderboardsIframe')) {
            const iframe = document.createElement('iframe');
            iframe.id = 'leaderboardsIframe';
            iframe.src = 'https://ntleaderboard.netlify.app/';
            iframe.style.position = 'fixed';
            iframe.style.top = '0';
            iframe.style.left = '0';
            iframe.style.width = '100%';
            iframe.style.height = '100%';
            iframe.style.border = 'none';
            iframe.style.zIndex = '9999';

            const closeButtonContainer = document.createElement('div');
            closeButtonContainer.style.position = 'fixed';
            closeButtonContainer.style.top = '0';
            closeButtonContainer.style.right = '0';
            closeButtonContainer.style.width = '70px';
            closeButtonContainer.style.height = '70px';
            closeButtonContainer.style.zIndex = '10001';
            closeButtonContainer.style.pointerEvents = 'auto';

            const closeButton = document.createElement('img');
            closeButton.src = 'https://res.cloudinary.com/dxgejwplx/image/upload/v1740041586/Red_X_ltzgdy.png';
            closeButton.alt = 'Close Leaderboards';
            closeButton.style.position = 'absolute';
            closeButton.style.top = '10px';
            closeButton.style.right = '10px';
            closeButton.style.width = '50px';
            closeButton.style.height = '50px';
            closeButton.style.cursor = 'pointer';

            closeButton.onclick = function () {
                document.body.removeChild(iframe);
                document.body.removeChild(closeButtonContainer);
            };

            closeButtonContainer.appendChild(closeButton);
            document.body.appendChild(iframe);
            document.body.appendChild(closeButtonContainer);
        }
    }

    function insertLeaderboardButton() {
        const navList = document.querySelector('.nav-list');
        if (navList && !document.querySelector('.nt-custom-tab-leaderboards')) {
            const li = document.createElement('li');
            li.className = 'nav-list-item nt-custom-tab-leaderboards';
            li.innerHTML = `
                <a href="#"
                   class="nav-link"
                   id="leaderboardsLink_unique">
                    Leaderboards
                </a>
            `;

            // Find the "Achievements" and "News" buttons
            const achievementsButton = Array.from(navList.children).find((child) =>
                child.textContent.trim().includes('Achievements')
            );
            const newsButton = Array.from(navList.children).find((child) =>
                child.textContent.trim().includes('News')
            );

            // Insert the new button between "Achievements" and "News" if both exist
            if (achievementsButton && newsButton) {
                navList.insertBefore(li, newsButton);
            } else {
                // Fallback: insert at the end if buttons not found
                navList.appendChild(li);
            }

            document
                .getElementById('leaderboardsLink_unique')
                .addEventListener('click', embedLeaderboards);
        }
    }

    function observeNavList() {
        const observer = new MutationObserver((mutations, obs) => {
            const navList = document.querySelector('.nav-list');
            if (navList) {
                insertLeaderboardButton();
                if (document.querySelector('.nt-custom-tab-leaderboards')) {
                    obs.disconnect();
                }
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true,
        });
    }

    // Try to insert the button immediately
    insertLeaderboardButton();

    // If immediate insertion fails, set up the observer
    if (!document.querySelector('.nt-custom-tab-leaderboards')) {
        observeNavList();
    }
})();
