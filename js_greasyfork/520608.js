// ==UserScript==
// @name         Unlock Content on onthivstep.vn
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Unlock course content on onthivstep.vn
// @author       You
// @match        https://onthivstep.vn/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/520608/Unlock%20Content%20on%20onthivstepvn.user.js
// @updateURL https://update.greasyfork.org/scripts/520608/Unlock%20Content%20on%20onthivstepvn.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 1. Set cookies to simulate VIP access
    const setVIPCookies = () => {
        document.cookie = "user_status=VIP; path=/; SameSite=Lax; secure";
        document.cookie = "vip_package=VIP 30; path=/; SameSite=Lax; secure";
        console.log("[VIP SIMULATION] VIP cookies have been set.");
    };

    // 2. Intercept fetch requests to mock VIP API responses
    const originalFetch = window.fetch;
    window.fetch = async (...args) => {
        const url = args[0];

        console.log(`[Fetch Intercept] URL: ${url}`);

        // Mock user status API response
        if (url.includes('/api/user_status')) {
            const mockResponse = {
                user_status: "VIP",
                vip_package: "VIP 30",
                access: true,
                unlocked_content: true
            };
            return new Response(JSON.stringify(mockResponse), {
                status: 200,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        // Mock locked content API response
        if (url.includes('/api/locked_content')) {
            const mockContentResponse = {
                access: "granted",
                content: "This is unlocked course content for VIP users."
            };
            return new Response(JSON.stringify(mockContentResponse), {
                status: 200,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        // Default behavior for other fetch calls
        return originalFetch(...args);
    };

    // 3. Remove popups and unlock UI elements
    const unlockUI = () => {
        // Remove any popups requiring code
        const popup = document.querySelector('.MuiButtonBase-root');
        if (popup) {
            popup.style.display = 'none';
            console.log("[UI Update] Removed popup requiring code.");
        }

        // Unlock any restricted content
        const lockedElements = document.querySelectorAll('.locked-content'); // Adjust the class name as per your analysis
        lockedElements.forEach(el => {
            el.classList.remove('locked-content');
            el.textContent = "Unlocked content is now visible.";
            console.log("[UI Update] Unlocked content section.");
        });
    };

    // 4. Observe and dynamically update the page
    const observer = new MutationObserver(() => {
        unlockUI();
    });

    observer.observe(document.body, { childList: true, subtree: true });

    // 5. Initialize the script
    setVIPCookies();
    unlockUI();

    console.log("[Script Active] Unlock script is running.");
})();
