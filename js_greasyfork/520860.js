// ==UserScript==
// @name         Twitter/X Copy Link Modifier
// @namespace    http://violentmonkey.github.io
// @version      1.3
// @description  Modify Twitter share links to use fixupx.com instead of x.com
// @match        https://twitter.com/*
// @match        https://x.com/*
// @grant        GM.setClipboard
// @grant        GM_addValueChangeListener
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/520860/TwitterX%20Copy%20Link%20Modifier.user.js
// @updateURL https://update.greasyfork.org/scripts/520860/TwitterX%20Copy%20Link%20Modifier.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function modifyUrl(url) {
        return url.replace(/^https:\/\/(x|twitter)\.com/, 'https://fixupx.com');
    }

    function handleClipboardChange() {
        navigator.clipboard.readText().then(text => {
            if (text.match(/^https:\/\/(x|twitter)\.com\/.*\/status\//)) {
                const modifiedUrl = modifyUrl(text);
                GM.setClipboard(modifiedUrl);
                console.log('Modified URL copied:', modifiedUrl);
            }
        }).catch(err => {
            console.error('Failed to read clipboard contents: ', err);
        });
    }

    // Watch for clipboard changes
    document.addEventListener('copy', function(e) {
        // Wait a short time to ensure the clipboard has been updated
        setTimeout(handleClipboardChange, 100);
    });

    console.log('Twitter URL Modifier script is active');
})();