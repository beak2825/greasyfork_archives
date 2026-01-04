// ==UserScript==
// @name         Revive Button to Attack Page
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Change the Revive Button on the Hospital Page to an Attack Button
// @match        https://www.torn.com/hospitalview.php
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/514395/Revive%20Button%20to%20Attack%20Page.user.js
// @updateURL https://update.greasyfork.org/scripts/514395/Revive%20Button%20to%20Attack%20Page.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Define the new SVG icon with absolute positioning to prevent layout shifts
    const newIcon = `
    <svg xmlns="http://www.w3.org/2000/svg" class="profileButtonIcon"
         style="position: absolute; top: 50%; left: 4px; transform: translateY(-50%); fill: #d4d4d4; width: 36px; height: 36px;"
         viewBox="101.6 178 46 46">
        <path d="M118.1,198.6v.8a1.11,1.11,0,0,0,1.1,1.1l2.7.1a1.11,1.11,0,0,0,1.1-1.1,1.591,1.591,0,0,0-.1-.9.31.31,0,0,0-.1.2h0a.1.1,0,0,1,.1.1c0,.1,0,.1-.1.1a2.053,2.053,0,0,1-1,1.5.1.1,0,0,1-.1-.1h-.1c-.2,0-.1-.3-.1-.3l.4-1.2a3.582,3.582,0,0,0-.4-1.1l-2.3-.3a1.11,1.11,0,0,0-1.1,1.1Zm-9.2-6,.4-.5h.2l.3.5h20.6l.2-.6h.4l.2.6h.7a.446.446,0,0,1,.4.3V195l-.1.1v.7a.433.433,0,0,1,.2.4c0,.3-.2.3-.2.3a4.265,4.265,0,0,0-.9.2c-.9.3-1,1.2-.8,2.5a7.189,7.189,0,0,0,.9,2.4c-.1,0-.1,0-.1.1s.1.1.2.1l.1.1c-.1,0-.1,0-.1.1s.1.1.2.1l.1.1c-.1,0-.1,0-.1.1s.1.1.2.1l.1.1c-.1,0-.1,0-.1.1a.349.349,0,0,0,.2.1l.1.1c-.1,0-.1,0-.1.1a.349.349,0,0,0,.2.1l.1.2c-.1,0-.1,0-.1.1a.349.349,0,0,0,.2.1l.1.1-.1.1.1.1.1.2a.1.1,0,0,0-.1.1l.1.1.1.2h0a.1.1,0,0,0,.1.1l.1.2h0a.1.1,0,0,0,.1.1l.1.2h0a.1.1,0,0,0,.1.1l.1.2h0a.1.1,0,0,0,.1.1l.1.2h0l.1.1a.349.349,0,0,0,.1.2h0v.1c0,.1.1.1.1.2h0l.1.1c0,.1,0,.1.1.2h0l.1.1c0,.1,0,.1.1.2h0l.1.1v.6a1.957,1.957,0,0,1-.1,1c-.2.4-1,.7-1,.7h-.8v.1a1.7,1.7,0,0,1,.4.7c0,.4-.6.3-.6.3h-4c-.9,0-.8-.6-.8-.6l-.1-.6a3.208,3.208,0,0,1-.5-.3,1.072,1.072,0,0,1-.2-.6v-.7a5.4,5.4,0,0,0-.4-1.2,1.134,1.134,0,0,0-.6-.6c-.2-.1-.1-.2-.1-.2a1.125,1.125,0,0,0,0-1.1c-.2-.4-.3-.7-.6-.8s-.2-.3-.2-.3.3-.4-.1-1.4c-.3-.6-.6-.8-1-.8a2.368,2.368,0,0,0-1,.3,4.869,4.869,0,0,1-1.2.1c-.2,0-3.9-.2-3.9-.2l-.1-.2.1-.2a3.461,3.461,0,0,0,.2-1.4,5.7,5.7,0,0,0-.1-1.3,2.623,2.623,0,0,0-.8-.6s-6.5-.2-7.2-.3c-.7,0-.7-.5-.7-.5s-.1-.7-.1-.9v-.4h-.1v-.6h0l-.1-.1a2.442,2.442,0,0,1-.1-.7,1.383,1.383,0,0,1,.2-.7v-.2c0-.1.1,0,.1-.2a.2.2,0,0,1,.2-.2l-.2-.1Z"></path>
    </svg>`;

    function updateReviveLinks() {
        const reviveLinks = document.querySelectorAll('a.revive');

        reviveLinks.forEach(link => {
            const href = link.getAttribute('href');

            if (href && href.includes('revive.php?action=revive')) {
                const idMatch = href.match(/ID=(\d+)/);
                if (idMatch) {
                    const userID = idMatch[1];
                    const newHref = `https://www.torn.com/loader.php?sid=attack&user2ID=${userID}`;
                    link.setAttribute('href', newHref);

                    // Adjust classes to ensure only 'revive' is applied
                    link.className = 'revive';
                    link.style.position = 'relative'; // Ensure relative positioning for absolute icon

                    // Remove inline 'onclick' attribute if present
                    link.removeAttribute('onclick');

                    // Clone the link to remove any attached event listeners
                    const linkClone = link.cloneNode(true);
                    link.replaceWith(linkClone);

                    // Add a new click event listener to open in a new tab
                    linkClone.addEventListener('click', function(event) {
                        event.preventDefault();  // Prevent default Ajax handling
                        window.open(newHref, '_blank');  // Open link in new tab
                    });

                    // Set the inner HTML to the new icon and text
                    linkClone.innerHTML = newIcon + '<span class="title bold t-gray-3" style="margin-left: 36px;">REVIVE</span>';
                }
            }
        });
    }

    const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            if (mutation.addedNodes.length) {
                updateReviveLinks();
            }
        });
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    updateReviveLinks();
})();