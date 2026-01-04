// ==UserScript==
// @name         Arc Fluxus Bypasser
// @namespace    fluxus bypass
// @version      2.3
// @description  Faster Fluxus Bypass with automatic clipboard copying
// @author       Arc
// @match        https://flux.li/android/external/start.php?HWID=*
// @icon         https://flux.li/favicon.ico
// @grant        none
// @license      MIT
// @homepageURL  https://discord.gg/FzzyZdVY
// @downloadURL https://update.greasyfork.org/scripts/509520/Arc%20Fluxus%20Bypasser.user.js
// @updateURL https://update.greasyfork.org/scripts/509520/Arc%20Fluxus%20Bypasser.meta.js
// ==/UserScript==

(async function() {
    'use strict';

    const apiUrl = `https://fluxus-bypass-orcin.vercel.app/api/fluxus?link=${encodeURIComponent(window.location.href)}`;

    try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
            const errorDetails = await response.text();
            throw new Error(`Network error: ${response.status} ${response.statusText}\nDetails: ${errorDetails}`);
        }

        const { key } = await response.json();
        if (!key) throw new Error('Key not found in the response');

        await navigator.clipboard.writeText(key);
        showBanner(`Your key has been successfully copied to clipboard: ${key}`);

    } catch (error) {
        console.error('Error:', error.message);
        showBanner(`An error occurred: ${error.message}`, true);
    }

    function showBanner(message, isError = false) {
        const banner = document.createElement('div');
        banner.style.position = 'fixed';
        banner.style.top = '10px';
        banner.style.left = '50%';
        banner.style.transform = 'translateX(-50%)';
        banner.style.backgroundColor = isError ? '#ff4d4d' : '#4caf50';
        banner.style.color = '#fff';
        banner.style.padding = '10px 20px';
        banner.style.borderRadius = '5px';
        banner.style.zIndex = '9999';
        banner.style.fontSize = '16px';
        banner.style.boxShadow = '0 2px 10px rgba(0,0,0,0.2)';
        banner.textContent = message;

        document.body.appendChild(banner);

        setTimeout(() => {
            banner.style.transition = 'opacity 0.5s';
            banner.style.opacity = '0';
            setTimeout(() => banner.remove(), 500);
        }, 3000);
    }
})();