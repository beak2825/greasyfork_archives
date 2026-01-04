// ==UserScript==
// @name         Geoguessr Solo Duel Blocker
// @namespace    https://greasyfork.org/en/users/1501889
// @version      1.312
// @description  prevents solo duel queueing, adds a great image
// @author       Clemens
// @match        https://www.geoguessr.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=geoguessr.com
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/546853/Geoguessr%20Solo%20Duel%20Blocker.user.js
// @updateURL https://update.greasyfork.org/scripts/546853/Geoguessr%20Solo%20Duel%20Blocker.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const buttonSelector = 'div[data-qa="function-lock"] button';
    const buttonContainerSelector = 'div[data-qa="function-lock"]';
    const overlayId = 'geoguessr-warning-overlay';

    function handleButtonState() {
        const button = document.querySelector(buttonSelector);
        const container = document.querySelector(buttonContainerSelector);
        const overlay = document.getElementById(overlayId);

        if (window.location.href === 'https://www.geoguessr.com/multiplayer') {
            if (button && container) {
                button.disabled = true;
                button.style.cursor = 'not-allowed';
                button.style.pointerEvents = 'none';
                container.style.opacity = '0.5';
                container.style.filter = 'grayscale(100%)';
                console.log("Geoguessr Solo Duel 'Play' button has been disabled.");
            }

            if (!overlay) {
                const img = document.createElement('img');
                img.id = overlayId;
                img.src = 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f5/ISO_7010_W009.svg/2560px-ISO_7010_W009.svg.png';
                img.style.cssText = `
                    position: fixed;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    max-width: 80%;
                    max-height: 80%;
                    width: auto;
                    height: auto;
                    z-index: 9999;
                    opacity: 1.0;
                    pointer-events: none;
                `;
                document.body.appendChild(img);
                console.log("Geoguessr warning overlay has been added.");
            }
        } else {
            if (button && container) {
                button.disabled = false;
                button.style.cursor = '';
                button.style.pointerEvents = '';
                container.style.opacity = '';
                container.style.filter = '';
                console.log("Geoguessr Solo Duel 'Play' button has been re-enabled.");
            }

            if (overlay) {
                overlay.remove();
                console.log("Geoguessr warning overlay has been removed.");
            }
        }
    }

    const observer = new MutationObserver((mutationsList, observer) => {
        handleButtonState();
    });

    observer.observe(document.body, { childList: true, subtree: true });

    handleButtonState();
})();