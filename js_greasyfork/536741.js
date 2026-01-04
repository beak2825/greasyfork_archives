// ==UserScript==
// @name         YouTube Default Logo (Remove Premium Text, Always)
// @version      1.5.0
// @description  Always shows the default YouTube logo, removes "Premium" text and yoodle, and keeps it that way
// @author       T3 Chat
// @match        https://www.youtube.com/*
// @icon         https://www.google.com/s2/favicons?domain=youtube.com
// @namespace https://greasyfork.org/users/1412746
// @downloadURL https://update.greasyfork.org/scripts/536741/YouTube%20Default%20Logo%20%28Remove%20Premium%20Text%2C%20Always%29.user.js
// @updateURL https://update.greasyfork.org/scripts/536741/YouTube%20Default%20Logo%20%28Remove%20Premium%20Text%2C%20Always%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Hide yoodle with CSS
    const style = document.createElement('style');
    style.textContent = `
        ytd-yoodle-renderer {
            display: none !important;
        }
    `;
    document.head.appendChild(style);

    // Remove "Premium" text node or element from logo area
    function removePremiumText() {
        const logoRenderer = document.querySelector('ytd-topbar-logo-renderer');
        if (!logoRenderer) return;

        // Remove is-red-logo attribute to avoid premium logo
        logoRenderer.removeAttribute('is-red-logo');
        logoRenderer.querySelectorAll('ytd-logo[is-red-logo]').forEach(el => {
            el.removeAttribute('is-red-logo');
        });

        // Find the <a id="logo"> link
        const logoLink = logoRenderer.querySelector('a#logo');
        if (!logoLink) return;

        // Remove any element or text node that contains "Premium"
        Array.from(logoLink.childNodes).forEach(node => {
            // Remove text nodes with "Premium"
            if (
                node.nodeType === Node.TEXT_NODE &&
                node.textContent.trim().toLowerCase().startsWith('premium')
            ) {
                node.textContent = '';
            }
            // Remove elements with "Premium" text
            if (
                node.nodeType === Node.ELEMENT_NODE &&
                node.textContent.trim().toLowerCase().startsWith('premium')
            ) {
                node.style.display = 'none';
            }
        });
    }

    // Observe the logo area for any changes
    function observeLogo() {
        const logoRenderer = document.querySelector('ytd-topbar-logo-renderer');
        if (!logoRenderer) return;
        const logoObserver = new MutationObserver(removePremiumText);
        logoObserver.observe(logoRenderer, { childList: true, subtree: true });
        // Initial fix
        removePremiumText();
    }

    // Observe the body for the logo renderer to appear
    const bodyObserver = new MutationObserver(() => {
        if (document.querySelector('ytd-topbar-logo-renderer')) {
            observeLogo();
        }
    });
    bodyObserver.observe(document.body, { childList: true, subtree: true });

    // Initial run (in case logo is already present)
    observeLogo();
})();
