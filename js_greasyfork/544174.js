// ==UserScript==
// @name         Display CMP Infos
// @namespace    http://tampermonkey.net/
// @version      2025-07-31
// @description  This displays information about the CMP from the page currently being visited.
// @author       Vanakh Chea
// @match https://*/*
// @match http://*/*
// @grant        none
// @run-at       document-idle
// @noframes
 // @license MIT
// @downloadURL https://update.greasyfork.org/scripts/544174/Display%20CMP%20Infos.user.js
// @updateURL https://update.greasyfork.org/scripts/544174/Display%20CMP%20Infos.meta.js
// ==/UserScript==



(function() {
 'use strict'; // Enforce strict mode for better error handling
    // Create the floating element
    const floatingDiv = document.createElement('div');
    Object.assign(floatingDiv.style, {
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        backgroundColor: '#ffffff',
        border: '1px solid #ccc',
        borderRadius: '4px',
        padding: '10px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
        zIndex: '999999',
        fontFamily: 'Arial, sans-serif',
        fontSize: '14px',
        color: '#000000',
        maxWidth: '300px',
        maxHeight: '200px',
        overflow: 'auto'
    });

    // Create close button
    const closeButton = document.createElement('button');
    closeButton.textContent = '×';
    Object.assign(closeButton.style, {
        position: 'absolute',
        top: '5px',
        right: '5px',
        background: 'none',
        border: 'none',
        fontSize: '16px',
        color: '#000000',
        cursor: 'pointer',
        fontWeight: 'bold'
    });
    closeButton.onclick = () => document.body.removeChild(floatingDiv);
    floatingDiv.appendChild(closeButton);

    // Create content element
    const content = document.createElement('div');
    Object.assign(content.style, {
        marginTop: '15px',
        color: '#000000',
        fontFamily: 'Arial, sans-serif',
        fontSize: '14px',
        lineHeight: '1.5'
    });

    // Strict detection function
    function detectConsentBanner() {
        const scripts = Array.from(document.getElementsByTagName('script'));
        let result = 'No known consent banner detected';

        scripts.forEach(script => {
            // Check for Onetrust
            if (script.src.includes('otSDKStub.js') && script.hasAttribute('data-domain-script')) {
                const id = script.getAttribute('data-domain-script');
                result = `<strong>Vendor:</strong> Onetrust<br><strong>ID:</strong> ${id || 'Not found'}`;
                return;
            }

            // Check for Usercentrics
            if (script.hasAttribute('data-settings-id')) {
                const id = script.getAttribute('data-settings-id');
                let version = 'Unknown version';

                if (script.src.includes('app.usercentrics.eu')) {
                    version = 'Version 2';
                } else if (script.src.includes('web.cmp.usercentrics.eu')) {
                    version = 'Version 3';
                }

                result = `<strong>Vendor:</strong> Usercentrics<br>
                          <strong>Version:</strong> ${version}<br>
                          <strong>ID:</strong> ${id || 'Not found'}`;
                return;
            }

            // Check for Cookiebot
            if (script.src.includes('cookiebot.com') && script.hasAttribute('data-cbid')) {
                const id = script.getAttribute('data-cbid');
                result = `<strong>Vendor:</strong> Cookiebot<br><strong>ID:</strong> ${id || 'Not found'}`;
                return;
            }

            // Check for Trustcommander
            if (script.src.includes('trustcommander.net')) {
                const idMatch = script.src.match(/privacy\/(\d+)\//);
                const id = idMatch ? idMatch[1] : 'Not found';
                result = `<strong>Vendor:</strong> Trustcommander<br><strong>ID:</strong> ${id}`;
                return;
            }
        });

        content.innerHTML = result;
    }

    // Add CSS protection
    const style = document.createElement('style');
    style.textContent = `
        #consent-banner-detector,
        #consent-banner-detector * {
            color: #000000 !important;
            font-family: Arial, sans-serif !important;
            background-color: white !important;
        }
        #consent-banner-detector strong {
            font-weight: bold !important;
        }
    `;
    floatingDiv.id = 'consent-banner-detector';
    document.head.appendChild(style);


   setTimeout(function () {
    detectConsentBanner();
    floatingDiv.appendChild(content);
    document.body.appendChild(floatingDiv);
}, 2000);
})();