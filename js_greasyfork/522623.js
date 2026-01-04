// ==UserScript==
// @name         Facebook PageTitle updater
// @version      2.0
// @description  Extract name, location, and username from Facebook profile pages and update the title
// @match        https://www.facebook.com/*
// @grant        none
// @namespace    https://greasyfork.org/users/1409709
// @downloadURL https://update.greasyfork.org/scripts/522623/Facebook%20PageTitle%20updater.user.js
// @updateURL https://update.greasyfork.org/scripts/522623/Facebook%20PageTitle%20updater.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let currentProfileID = '';
    let titleObserver = null;

    function extractInfo() {
        const nameElement = document.querySelector('h1');
        let name = nameElement ? nameElement.textContent.trim() : '';

        const livesInElement = Array.from(document.querySelectorAll('div[role="main"] span[dir="auto"]')).find(el => el.textContent.includes('Lives in'));
        let livesIn = livesInElement ? livesInElement.querySelector('a span').textContent.trim() : '';

        const fromElement = Array.from(document.querySelectorAll('div[role="main"] span[dir="auto"]')).find(el => el.textContent.includes('From'));
        let from = fromElement ? fromElement.querySelector('a span').textContent.trim() : '';

        const url = window.location.href;
        const profileIDMatch = url.match(/facebook\.com\/(?:profile\.php\?id=|([^/?&]+))/);
        let profileID = '';
        if (profileIDMatch && profileIDMatch[1]) {
            profileID = profileIDMatch[1];
        } else if (profileIDMatch && profileIDMatch[0]) {
            profileID = profileIDMatch[0];
        }

        if (profileID && (name || livesIn || from)) {
            const profileInfo = { name, livesIn, from, profileID };
            localStorage.setItem(`profileInfo_${profileID}`, JSON.stringify(profileInfo));
            currentProfileID = profileID;
            updateTitle(profileInfo);
        } else {
            const storedProfileInfo = localStorage.getItem(`profileInfo_${profileID}`);
            if (storedProfileInfo) {
                updateTitle(JSON.parse(storedProfileInfo));
            }
        }
    }

    function updateTitle(profileInfo) {
        let newTitle = '';
        if (profileInfo.name) newTitle += `${profileInfo.name}`;
        if (profileInfo.livesIn) newTitle += ` - ${profileInfo.livesIn}`;
        if (profileInfo.from) newTitle += ` (From ${profileInfo.from})`;

        const titleElement = document.querySelector('title');
        if (titleElement && titleElement.textContent !== newTitle) {
            if (titleObserver) {
                titleObserver.disconnect();
            } else {
                titleObserver = new MutationObserver((mutations) => {
                    for (const mutation of mutations) {
                        if (mutation.type === 'childList') {
                            titleObserver.disconnect();
                            titleElement.textContent = newTitle;
                            titleObserver.observe(titleElement, { childList: true });
                        }
                    }
                });
            }
            titleObserver.observe(titleElement, { childList: true });
            titleElement.textContent = newTitle;
        }
    }

    function monitorURLChanges() {
        let lastURL = window.location.href;

        setInterval(() => {
            const currentURL = window.location.href;
            if (currentURL !== lastURL) {
                lastURL = currentURL;
                const profileIDMatch = currentURL.match(/facebook\.com\/(?:profile\.php\?id=|([^/?&]+))/);
                let newProfileID = '';
                if (profileIDMatch && profileIDMatch[1]) {
                    newProfileID = profileIDMatch[1];
                } else if (profileIDMatch && profileIDMatch[0]) {
                    newProfileID = profileIDMatch[0];
                }

                if (currentProfileID !== newProfileID) {
                    currentProfileID = newProfileID;
                    extractInfo();
                } else {
                    const storedProfileInfo = localStorage.getItem(`profileInfo_${newProfileID}`);
                    if (storedProfileInfo) {
                        updateTitle(JSON.parse(storedProfileInfo));
                    }
                }
            }
        }, 1000);
    }

    window.addEventListener('load', () => {
        extractInfo();
        monitorURLChanges();
    });
})();