// ==UserScript==
// @name         MIUIROM Pseudo-Link Fixer
// @namespace    http://tampermonkey.net/
// @version      2025-06-23
// @description  Replaces pseudo-link spans with real clickable links on miuirom.org while preserving formatting.
// @author       Starmania
// @match        https://miuirom.org/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=miuirom.org
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/540556/MIUIROM%20Pseudo-Link%20Fixer.user.js
// @updateURL https://update.greasyfork.org/scripts/540556/MIUIROM%20Pseudo-Link%20Fixer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function decodeBase64(str) {
        try {
            return atob(str);
        } catch (e) {
            console.error('Base64 decode failed:', e);
            return '#';
        }
    }

    function replacePseudoLinks() {
        document.querySelectorAll('span.pseudo-link.js-link[data-href]').forEach(span => {
            // Avoid re-processing
            if (span.querySelector('a')) return;

            const href = decodeBase64(span.getAttribute('data-href'));
            const target = span.getAttribute('data-target') || '_self';
            const rel = span.getAttribute('rel') || '';

            const link = document.createElement('a');
            link.href = href;
            link.target = target;
            link.rel = rel;
            link.textContent = span.textContent;

            // Clear and insert link into the span
            span.textContent = '';
            span.appendChild(link);
        });
    }

    replacePseudoLinks();
})();