// ==UserScript==
// @name         PWA Installation Prompt
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Prompt users to install the PWA on all websites
// @author       YourName
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/537563/PWA%20Installation%20Prompt.user.js
// @updateURL https://update.greasyfork.org/scripts/537563/PWA%20Installation%20Prompt.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let deferredPrompt;

    window.addEventListener('beforeinstallprompt', (e) => {
        // Prevent the mini-infobar from appearing on mobile
        e.preventDefault();
        // Stash the event so it can be triggered later
        deferredPrompt = e;

        // Create and show the custom install prompt
        showInstallPrompt();
    });

    function showInstallPrompt() {
        if (!deferredPrompt) return;

        // Create a button to trigger the PWA install
        const installBtn = document.createElement('button');
        installBtn.textContent = 'Install this PWA';
        installBtn.style.position = 'fixed';
        installBtn.style.bottom = '20px';
        installBtn.style.right = '20px';
        installBtn.style.padding = '10px 20px';
        installBtn.style.zIndex = '1000';
        installBtn.style.backgroundColor = '#0073e6';
        installBtn.style.color = 'white';
        installBtn.style.border = 'none';
        installBtn.style.cursor = 'pointer';
        installBtn.style.borderRadius = '5px';
        installBtn.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.2)';

        document.body.appendChild(installBtn);

        installBtn.addEventListener('click', async () => {
            // Show the install prompt
            deferredPrompt.prompt();
            // Wait for the user to respond to the prompt
            const { outcome } = await deferredPrompt.userChoice;
            if (outcome === 'accepted') {
                console.log('User accepted the PWA installation prompt');
            } else {
                console.log('User dismissed the PWA installation prompt');
            }
            // Clear the deferred prompt
            deferredPrompt = null;
            document.body.removeChild(installBtn);
        });
    }
})();