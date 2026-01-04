// ==UserScript==
// @name         Bypass Link Redirects
// @namespace    https://github.com/sinazadeh/userscripts
// @version      1.2.3
// @description  Automatically bypasses intermediate confirmation, warning, and interstitial pages on supported websites, taking you directly to the destination link.
// @author       TheSina
// @match        *://forums.socialmediagirls.com/goto/link-confirmation*
// @match        *://*.stremio.com/warning*
// @match        *://*.imagebam.com/image/*
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/540638/Bypass%20Link%20Redirects.user.js
// @updateURL https://update.greasyfork.org/scripts/540638/Bypass%20Link%20Redirects.meta.js
// ==/UserScript==

(function () {
    const hostname = window.location.hostname;

    // Bypass SocialMediaGirls confirmation
    if (hostname.includes('socialmediagirls.com')) {
        const urlParam = new URLSearchParams(window.location.search).get('url');
        if (urlParam) {
            try {
                const decodedUrl = atob(urlParam);
                window.location.replace(decodedUrl);
            } catch (e) {
                console.error('Failed to decode SocialMediaGirls URL:', e);
            }
        }
    }

    // Bypass Stremio warning
    if (
        hostname.includes('stremio.com') &&
        window.location.pathname === '/warning'
    ) {
        const hash = window.location.hash;
        if (hash.startsWith('#https')) {
            try {
                const targetUrl = decodeURIComponent(hash.substring(1));
                window.location.replace(targetUrl);
            } catch (e) {
                console.error('Failed to decode Stremio URL:', e);
            }
        }
    }

    // Bypass ImageBam "Continue to your image" interstitial
    if (
        hostname.includes('imagebam.com') &&
        window.location.pathname.startsWith('/image/')
    ) {
        // Wait for the page to render
        document.addEventListener('DOMContentLoaded', () => {
            // 1) If there's a form on the page, submit it
            const form = document.querySelector('form');
            if (form) {
                form.submit();
                return;
            }
            // 2) Otherwise look for any link or button that says "Continue to your image"
            const btn = Array.from(document.querySelectorAll('a, button')).find(
                el => /continue to your image/i.test(el.textContent || ''),
            );
            if (btn) {
                btn.click();
            }
        });
    }
})();
