// ==UserScript==
// @name         Amazon URL Shortener
// @namespace    https://github.com/Leproide/Amazon_URLShortener/
// @version      1.6.4
// @description:en  Adds a button to copy the short link of Amazon products and optionally modifies the URL in the address bar
// @description:it  Aggiunge un pulsante per copiare il link corto dei prodotti Amazon, opzionalmente modifica l'URL nella barra degli indirizzi.
// @author       Leproide
// @include      *://*.amazon.*/*
// @include       https://*.amazon.co.jp/*
// @include       https://*.amazon.com/*
// @include       https://*.amazon.ae/*
// @include       https://*.amazon.co.uk/*
// @include       https://*.amazon.it/*
// @include       https://*.amazon.in/*
// @include       https://*.amazon.eg/*
// @include       https://*.amazon.com.au/*
// @include       https://*.amazon.nl/*
// @include       https://*.amazon.ca/*
// @include       https://*.amazon.sa/*
// @include       https://*.amazon.sg/*
// @include       https://*.amazon.se/*
// @include       https://*.amazon.de/*
// @include       https://*.amazon.com.tr/*
// @include       https://*.amazon.com.br/*
// @include       https://*.amazon.fr/*
// @include       https://*.amazon.com.be/*
// @include       https://*.amazon.pl/*
// @include       https://*.amazon.com.mx/*
// @include       https://*.amazon.cn/*
// @icon         data:image/jpeg;base64,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
// @license      GPL v2
// @description Adds a button to copy the short link of Amazon products and optionally modifies the URL in the address bar
// @downloadURL https://update.greasyfork.org/scripts/524567/Amazon%20URL%20Shortener.user.js
// @updateURL https://update.greasyfork.org/scripts/524567/Amazon%20URL%20Shortener.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Configuration: Enable or disable features
    const enableButton = true; // true to add the copy button, false to disable it
    const modifyUrl = true; // true to modify the browser URL, false to leave it unchanged
    const popupDuration = 1500; // Popup duration in milliseconds (1.5 seconds)

    // Function to generate the short link
    function generateShortLink() {
        const currentUrl = window.location.href;
        let match = currentUrl.match(/\/dp\/([A-Z0-9]{10})/); // Find the ASIN in /dp/
        if (!match) {
            match = currentUrl.match(/\/gp\/product\/([A-Z0-9]{10})/); // Find the ASIN in /gp/product/
            if (match) {
                return `${window.location.origin}/dp/${match[1]}`;
            }
        } else {
            return `${window.location.origin}/dp/${match[1]}`;
        }
        return null;
    }

    // Function to copy text to clipboard
    function copyToClipboard(text) {
        const tempInput = document.createElement('input');
        document.body.appendChild(tempInput);
        tempInput.value = text;
        tempInput.select();
        document.execCommand('copy');
        document.body.removeChild(tempInput);
        showPopup(text);
    }

    // Function to show popup
    function showPopup(text) {
        const lang = navigator.language || navigator.userLanguage;
        const message = lang.startsWith('it') ? 'Link copiato in clipboard' : 'Link copied to clipboard';

        const popup = document.createElement('div');
        const line1 = document.createElement('div');
        const line2 = document.createElement('div');

        // Line 1: "Link copiato"
        line1.textContent = message;
        line1.style.marginBottom = '8px';
        line1.style.fontWeight = 'bold';

        // Line 2: Short link
        line2.textContent = text;
        line2.style.wordBreak = 'break-all'; // Prevent text overflow

        // Popup container
        popup.appendChild(line1);
        popup.appendChild(line2);
        popup.style.position = 'fixed';
        popup.style.top = '50%';
        popup.style.left = '50%';
        popup.style.transform = 'translate(-50%, -50%)';
        popup.style.padding = '20px 40px';
        popup.style.backgroundColor = '#ffa41c';
        popup.style.color = '#111';
        popup.style.borderRadius = '12px';
        popup.style.fontSize = '16px';
        popup.style.textAlign = 'center';
        popup.style.boxShadow = '0 8px 15px rgba(0, 0, 0, 0.3)'; // Shadow around the popup
        popup.style.zIndex = '9999';
        popup.style.opacity = '0'; // Start hidden
        popup.style.transition = 'opacity 0.4s'; // Fade effect

        document.body.appendChild(popup);

        // Fade in
        setTimeout(() => {
            popup.style.opacity = '1';
        }, 10);

        // Fade out and remove
        setTimeout(() => {
            popup.style.opacity = '0';
            setTimeout(() => popup.remove(), 400); // Ensure it is removed after fade-out
        }, popupDuration);
    }

    // Modify the URL in the address bar if enabled
    if (modifyUrl) {
        const shortLink = generateShortLink();
        if (shortLink) {
            window.history.replaceState(null, '', shortLink);
        }
    }

    // Add the copy button if enabled
    if (enableButton) {
        // Find the product title
        const productTitleElement = document.getElementById('productTitle');
        if (productTitleElement) {
            // Detect browser language
            const lang = navigator.language || navigator.userLanguage;
            const buttonText = lang.startsWith('it') ? 'Copia Link Breve' : 'Copy Short Link';

            // Create the button
            const copyButton = document.createElement('button');
            copyButton.textContent = buttonText;
            copyButton.style.marginTop = '10px';
            copyButton.style.marginBottom = '4px'; // Add spacing below the button
            copyButton.style.padding = '8px 16px';
            copyButton.style.backgroundColor = '#ffa41c';
            copyButton.style.color = '#111';
            copyButton.style.border = '1px solid #ffa41c';
            copyButton.style.cursor = 'pointer';
            copyButton.style.borderRadius = '20px';
            copyButton.style.display = 'block'; // Ensure the button is on a new line
            copyButton.style.fontSize = '14px';
            copyButton.style.textAlign = 'center';
            copyButton.style.textDecoration = 'none';
            copyButton.style.boxShadow = '0 2px 5px rgba(0, 0, 0, 0.15)';

            // Add click event to the button
            copyButton.addEventListener('click', () => {
                const shortLink = generateShortLink();
                if (shortLink) {
                    copyToClipboard(shortLink);
                } else {
                    const errorText = lang.startsWith('it') ? 'Errore: impossibile generare il link breve.' : 'Error: Unable to generate the short link.';
                    alert(errorText);
                }
            });

            // Insert the button below the product title
            productTitleElement.parentNode.insertBefore(copyButton, productTitleElement.nextSibling);
        }
    }
})();
