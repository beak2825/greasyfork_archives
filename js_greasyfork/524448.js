// ==UserScript==
// @name         Bypass class.forasm.com redirect
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Immediately redirect to the target URL on class.forasm.com links
// @author       wisp
// @license      MIT
// @runat        document-start
// @match        *://class.forasm.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/524448/Bypass%20classforasmcom%20redirect.user.js
// @updateURL https://update.greasyfork.org/scripts/524448/Bypass%20classforasmcom%20redirect.meta.js
// ==/UserScript==

(function () {
    'use strict';

    /**
     * Extract the encrypted parameter `o` from the URL hash.
     * @returns {string|null} The encrypted `o` value or null if not found.
     */
    function getEncryptedParam() {
        const hash = window.location.hash;
        const match = hash.match(/[?&]o=([^&]+)/);
        return match ? decodeURIComponent(match[1]) : null;
    }

    /**
     * Decrypt the encrypted parameter using the page's decryption logic.
     * @param {string} encrypted - The encrypted `o` parameter.
     * @param {string} key - The decryption key.
     * @returns {string|null} The decrypted URL or null if decryption fails.
     */
    function decryptUrl(encrypted, key) {
        try {
            return window.aesCrypto.decrypt(encrypted, key);
        } catch (error) {
            console.error('Error during decryption:', error);
            return null;
        }
    }

    /**
     * Extract and immediately redirect to the decrypted URL.
     */
    function extractAndRedirect() {
        const encryptedParam = getEncryptedParam();
        if (!encryptedParam) {
            console.error('Encrypted parameter "o" not found in the URL hash.');
            return;
        }

        console.log('Encrypted parameter found:', encryptedParam);

        // Use the hardcoded decryption key "root"
        const finalUrl = decryptUrl(encryptedParam, 'root');
        if (finalUrl) {
            console.log('Redirecting to final URL:', finalUrl);
            window.location.href = finalUrl; // Immediately redirect
        } else {
            console.error('Failed to decrypt the final URL.');
        }
    }

    // Execute immediately after script injection
    if (window.aesCrypto && typeof window.aesCrypto.decrypt === 'function') {
        extractAndRedirect();
    } else {
        console.error('aesCrypto.decrypt not available.');
    }
})();
