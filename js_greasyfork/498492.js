// ==UserScript==
// @name         Watch for ShadowRoot and Style Player Character
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Watch for shadowRoot to be created by the extension, query player character, and style it
// @match        *://*/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/498492/Watch%20for%20ShadowRoot%20and%20Style%20Player%20Character.user.js
// @updateURL https://update.greasyfork.org/scripts/498492/Watch%20for%20ShadowRoot%20and%20Style%20Player%20Character.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to handle the found shadowRoot
    function handleShadowRoot(shadowRoot) {
        const shadowRootInterval = setInterval(()=>{
            console.log('shadowRootInterval', shadowRoot?.querySelector("#MOONBOUNCE\\.PORTAL > div:last-child")?.previousElementSibling)?.querySelector('div')
            if(shadowRoot?.querySelector("#MOONBOUNCE\\.PORTAL > div:last-child")) {
                const playerCharacter = shadowRoot
                ?.querySelector("#MOONBOUNCE\\.PORTAL > div:last-child")
                ?.previousElementSibling
                ?.querySelector('div');

                console.log('Player character found and stored globally:', playerCharacter);

                if (playerCharacter) {
                    playerCharacter.style.opacity = '1';
                    playerCharacter.firstChild.style.border = '2px solid red';
                    playerCharacter.firstChild.style.backgroundColor = '#0000'
                }
                clearInterval(shadowRootInterval)
            }
        }, 1000)
    }

    // Create a MutationObserver to watch for the shadowRoot
    const observer = new MutationObserver((mutations) => {
        for (let mutation of mutations) {
            if (mutation.type === 'childList') {
                for (let node of mutation.addedNodes) {
                    if (mutation.target.id?.indexOf('MOONBOUNCE') != -1) console.log('mutation.target.id', mutation.target.id)
                    if (node.id === 'moonbounce-ext-container-mbheeaapbjpckahhciogfdodofjjldem' && node.shadowRoot) {
                        handleShadowRoot(node.shadowRoot);
                    }
                }
            } else if (mutation.type === 'attributes' && mutation.attributeName === 'id') {
                if (mutation.target.id === 'moonbounce-ext-container-mbheeaapbjpckahhciogfdodofjjldem' && mutation.target.shadowRoot) {
                    handleShadowRoot(mutation.target.shadowRoot);
                }
            }
        }
    });

    // Start observing the document for changes
    observer.observe(document.documentElement, {
        childList: true,
        subtree: true,
        attributes: true
    });

    // Watch for the removal of the shadowRoot
    const removalObserver = new MutationObserver((mutations) => {
        for (let mutation of mutations) {
            if (mutation.type === 'childList') {
                for (let node of mutation.removedNodes) {
                    if (node.id === 'moonbounce-ext-container-mbheeaapbjpckahhciogfdodofjjldem') {
                        console.log('Player character removed, restarting observer.');
                        // Restart the observer
                        observer.observe(document.documentElement, {
                            childList: true,
                            subtree: true,
                            attributes: true
                        });
                    }
                }
            }
        }
    });

    // Start observing the document for removals
    removalObserver.observe(document.documentElement, {
        childList: true,
        subtree: true
    });
})();