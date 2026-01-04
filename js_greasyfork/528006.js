// ==UserScript==
// @name         YouTube URL Cleaner
// @namespace    http://tampermonkey.net/
// @version      1.6
// @description  Clean YouTube URLs to only keep the video ID when Shift + Left Click is used and show a popup
// @author       maanimis
// @match        *://*.youtube.com/*
// @grant        clipboardWrite
// @run-at      document-end
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/528006/YouTube%20URL%20Cleaner.user.js
// @updateURL https://update.greasyfork.org/scripts/528006/YouTube%20URL%20Cleaner.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const showPopup = (message) => {
        const popup = document.createElement('div');
        Object.assign(popup.style, {
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            padding: '10px',
            background: 'black',
            color: 'white',
            borderRadius: '5px',
            boxShadow: '0px 0px 10px rgba(0,0,0,0.5)',
            zIndex: '1000',
            fontSize: '14px',
            fontFamily: 'Arial, sans-serif'
        });
        popup.textContent = message;
        document.body.appendChild(popup);

        setTimeout(() => popup.remove(), 3000);
    };

    const cleanUrl = () => {
        const urlMatch = window.location.href.match(/https?:\/\/www\.youtube\.com\/watch\?v=([a-zA-Z0-9_-]+)/);
        if (!urlMatch) return;

        const cleanUrl = `https://www.youtube.com/watch?v=${urlMatch[1]}`;
        navigator.clipboard.writeText(cleanUrl)
            .then(() => {
                console.log('Cleaned URL copied to clipboard:', cleanUrl);
                showPopup(`Copied: ${cleanUrl}`);
            })
            .catch(err => {
                console.error('Failed to copy URL:', err);
                showPopup('Failed to copy URL');
            });
    };

    document.addEventListener('click', (event) => {
        if (event.shiftKey && event.button === 0) {
            cleanUrl();
        }
    });
})();
