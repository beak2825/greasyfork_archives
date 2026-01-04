// ==UserScript==
// @name         X Cleanup & More Tab to Settings
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  Removes unwanted tabs and turns "More" into "Settings"
// @match        https://twitter.com/*
// @match        https://x.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/529172/X%20Cleanup%20%20More%20Tab%20to%20Settings.user.js
// @updateURL https://update.greasyfork.org/scripts/529172/X%20Cleanup%20%20More%20Tab%20to%20Settings.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function hideElements() {
        const selectors = [
            'a[aria-label="Bookmarks"]',
            'a[aria-label="Messages"]',
            'a[aria-label="Communities"]',
            'a[aria-label="Premium"]',
            'a[aria-label="Verified Orgs"]',
            '[aria-label*="Who to follow"]',
            '[aria-label*="Subscribe"]',
            '[data-testid="UserSuggestionList"]',
            '[data-testid="WhoToFollow"]',
            '[data-testid="SubscriptionPromotion"]'
        ];
        selectors.forEach(selector => {
            document.querySelectorAll(selector).forEach(el => el.style.display = 'none');
        });
    }

    function replaceMoreWithSettings() {
        const moreButton = document.querySelector('[data-testid="AppTabBar_More_Menu"]');
        if (moreButton) {
            const settingsLink = document.createElement("a");
            settingsLink.href = "https://twitter.com/settings";
            settingsLink.setAttribute("aria-label", "Settings");
            settingsLink.className = moreButton.className; // Keep the same styling

            settingsLink.innerHTML = `
                <div class="css-175oi2r r-sdzlij r-dnmrzs r-1awozwy r-18u37iz r-1777fci r-xyw6el r-o7ynqc r-6416eg">
                    <div class="css-175oi2r">
                        <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true" class="r-4qtqp9 r-yyyyoo r-dnmrzs r-bnwqim r-lrvibr">
                            <g>
                                <path d="M12 15.5C10.07 15.5 8.5 13.93 8.5 12C8.5 10.07 10.07 8.5 12 8.5C13.93 8.5 15.5 10.07 15.5 12C15.5 13.93 13.93 15.5 12 15.5ZM19.43 12C19.43 11.5 19.36 11 19.26 10.5L21.54 8.65C21.78 8.45 21.85 8.12 21.69 7.86L19.69 4.81C19.54 4.55 19.25 4.45 18.96 4.55L16.26 5.5C15.69 5.1 15.08 4.76 14.43 4.5L14 1.75C14 1.44 13.76 1.25 13.45 1.25H10.55C10.24 1.25 10 1.44 10 1.75L9.57 4.5C8.92 4.76 8.31 5.1 7.74 5.5L5.04 4.55C4.75 4.45 4.46 4.55 4.31 4.81L2.31 7.86C2.15 8.12 2.22 8.45 2.46 8.65L4.74 10.5C4.64 11 4.57 11.5 4.57 12C4.57 12.5 4.64 13 4.74 13.5L2.46 15.35C2.22 15.55 2.15 15.88 2.31 16.14L4.31 19.19C4.46 19.45 4.75 19.55 5.04 19.45L7.74 18.5C8.31 18.9 8.92 19.24 9.57 19.5L10 22.25C10 22.56 10.24 22.75 10.55 22.75H13.45C13.76 22.75 14 22.56 14 22.25L14.43 19.5C15.08 19.24 15.69 18.9 16.26 18.5L18.96 19.45C19.25 19.55 19.54 19.45 19.69 19.19L21.69 16.14C21.85 15.88 21.78 15.55 21.54 15.35L19.26 13.5C19.36 13 19.43 12.5 19.43 12Z" fill="white"/>
                            </g>
                        </svg>
                    </div>
                    <div dir="ltr" class="css-146c3p1 r-dnmrzs r-1udh08x r-1udbk01 r-3s2u2q r-bcqeeo r-1ttztb7 r-qvutc0 r-1qd0xha r-adyw6z r-135wba7 r-16dba41 r-dlybji r-nazi8o" style="color: rgb(255, 255, 255);">
                        <span class="css-1jxf684 r-bcqeeo r-1ttztb7 r-qvutc0 r-poiln3">Settings</span>
                    </div>
                </div>
            `;

            moreButton.replaceWith(settingsLink);
            console.log("More tab replaced with Settings!");
        }
    }

    function updateUI() {
        hideElements();
        replaceMoreWithSettings();
    }

    updateUI();
    setInterval(updateUI, 1000);
})();





