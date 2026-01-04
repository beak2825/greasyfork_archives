// ==UserScript==
// @name         Always Active Codespaces
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  Automatically restarts inactive Codespaces on GitHub Dev when timed out.
// @author       SC0TT
// @license      MIT
// @icon         https://github.gallerycdn.vsassets.io/extensions/github/codespaces/1.16.10/1707254009255/Microsoft.VisualStudio.Services.Icons.Default
// @match        https://*.github.dev/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/488226/Always%20Active%20Codespaces.user.js
// @updateURL https://update.greasyfork.org/scripts/488226/Always%20Active%20Codespaces.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function restartCodespace() {
        const restartButton = document.querySelector('button.button-link');
        if (restartButton) {
            restartButton.click();
        } else {
            console.error("Error: Unable to find the 'Restart codespace' button on the page.");
        }
    }

    function handleMutations(mutations) {
        mutations.forEach(mutation => {
            if (mutation.type === 'childList') {
                restartCodespace();
            }
        });
    }

    const observer = new MutationObserver(handleMutations);

    observer.observe(document.body, { childList: true, subtree: true });

    window.addEventListener('load', function() {
        restartCodespace();
    });
})();
