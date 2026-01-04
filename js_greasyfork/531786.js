// ==UserScript==
// @name         Copy Page URL on Alt+C with Top Center Toast
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Copies the current page URL with Alt+C
// @author       Druid
// @license MIT
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/531786/Copy%20Page%20URL%20on%20Alt%2BC%20with%20Top%20Center%20Toast.user.js
// @updateURL https://update.greasyfork.org/scripts/531786/Copy%20Page%20URL%20on%20Alt%2BC%20with%20Top%20Center%20Toast.meta.js
// ==/UserScript==


(function () {
    'use strict';

    document.addEventListener('keydown', function (event) {
        if (event.altKey && event.code === 'KeyC') {
            event.preventDefault();

            const currentUrl = window.location.href;

            navigator.clipboard.writeText(currentUrl).then(() => {
                showToast("Page link copied!");
            }).catch(err => {
                showToast("Failed to copy link.");
                console.error("Clipboard copy failed:", err);
            });
        }
    });

    function showToast(message) {
        const toast = document.createElement('div');
        toast.textContent = message;
        Object.assign(toast.style, {
            position: 'fixed',
            top: '30px',
            left: '50%',
            transform: 'translateX(-50%)',
            background: '#222',
            color: '#fff',
            padding: '10px 20px',
            fontSize: '16px',
            borderRadius: '6px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
            zIndex: '9999',
            opacity: '0',
            transition: 'opacity 0.3s ease-in-out',
        });

        document.body.appendChild(toast);

        // Fade in
        requestAnimationFrame(() => {
            toast.style.opacity = '1';
        });

        // Fade out and remove after 2 seconds
        setTimeout(() => {
            toast.style.opacity = '0';
            setTimeout(() => toast.remove(), 300);
        }, 2000);
    }
})();
