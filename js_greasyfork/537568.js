// ==UserScript==
// @name         marcar sim em exigir assinatura
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  marca "sim" automaticamente durante a transferencia.
// @author       ils94
// @match        https://asiweb.tre-rn.jus.br/asi/web?target=com.linkdata.patrimonio.transferencia.localizacao.interna.web.TransferenciaInternaEditGateway&action=start
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/537568/marcar%20sim%20em%20exigir%20assinatura.user.js
// @updateURL https://update.greasyfork.org/scripts/537568/marcar%20sim%20em%20exigir%20assinatura.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to mark the radio button
    function markRadioButton() {
        const radioButton = document.querySelector('input[name="exigeAssinatura"][value="true"]');
        if (radioButton) {
            console.log('Found radio button:', radioButton);
            if (!radioButton.checked) {
                radioButton.checked = true;
                if (radioButton.onclick) {
                    console.log('Triggering onclick event');
                    radioButton.onclick();
                }
            } else {
                console.log('Radio button already checked');
            }
            return true;
        } else {
            console.log('Radio button not found');
            return false;
        }
    }

    // Initialize observer and retry interval
    let retryInterval = null;
    const observer = new MutationObserver(function(mutations) {
        console.log('DOM changed, checking for radio button');
        if (markRadioButton()) {
            console.log('Radio button marked, stopping observer');
            observer.disconnect(); // Stop observing once marked
            if (retryInterval) {
                clearInterval(retryInterval); // Stop retry interval
                console.log('Retry interval cleared');
            }
        }
    });

    // Start observing DOM changes
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // Try marking the radio button immediately on page load
    window.addEventListener('load', function() {
        console.log('Page loaded, attempting to mark radio button');
        if (markRadioButton()) {
            console.log('Radio button marked on load, stopping observer');
            observer.disconnect();
            return;
        }

        // Retry every 500ms up to 10 times
        let attempts = 0;
        const maxAttempts = 10;
        retryInterval = setInterval(function() {
            attempts++;
            console.log(`Retry attempt ${attempts}`);
            if (markRadioButton() || attempts >= maxAttempts) {
                console.log('Stopping retry interval');
                clearInterval(retryInterval);
                observer.disconnect();
            }
        }, 500);
    });
})();