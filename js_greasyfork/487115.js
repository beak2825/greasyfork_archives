// ==UserScript==
// @name        Youtube Ambient Pro +
// @namespace   Violentmonkey Scripts
// @match       *://www.youtube.com/*
// @grant       GM_addStyle
// @run-at      document-end
// @version     2.3
// @author      Lalit22
// @license     MIT
// @description This script is 100% safe and will take your ambient experience to the next level!
// @icon        https://i.ibb.co/s2zCDQB/brightness-and-contrast.png
// @downloadURL https://update.greasyfork.org/scripts/487115/Youtube%20Ambient%20Pro%20%2B.user.js
// @updateURL https://update.greasyfork.org/scripts/487115/Youtube%20Ambient%20Pro%20%2B.meta.js
// ==/UserScript==
(function () {
    'use strict';

    let isAmbientEnabled = false; // Track the state of Ambient Mode

    // Function to toggle Ambient Mode
    function toggleAmbientMode() {
        const ambi = document.querySelector("#cinematics.ytd-watch-flexy");
        const ambientMenuItem = document.querySelector('.ytp-menuitem.ambient-mode-plus');

        if (ambi) {
            if (isAmbientEnabled) {
                ambi.style.cssText = 'filter: none; transform: none; opacity: 0; mix-blend-mode: normal; transition: all 700ms ease-in-out;';
                setTimeout(() => {
                    ambi.style.opacity = '1';
                }, 1200);
                console.log('Ambient + closed Made by Lalit22 ...');
            } else {
                ambi.style.cssText = 'filter: saturate(300%) blur(10px) contrast(1.2) brightness(1.7); transform: scale(2.5); opacity: 1; mix-blend-mode: lighten; transition: all 500ms ease-in-out; transition-delay: 0.5s;';
                console.log('Ambient + is applied bro Enjoy <3 ....');
            }

            isAmbientEnabled = !isAmbientEnabled;

            // Update menu item state
            if (ambientMenuItem) {
                ambientMenuItem.setAttribute('aria-checked', isAmbientEnabled.toString());
            }
        }
    }

    // Function to handle mutations
    function handleMutations(mutationsList, observer) {
        for (const mutation of mutationsList) {
            if (mutation.type === 'childList') {
                const settingsMenu = document.querySelector('.ytp-popup.ytp-settings-menu');
                if (settingsMenu) {
                    const ambientModeItem = settingsMenu.querySelector('.ytp-menuitem');
                    if (ambientModeItem && !settingsMenu.querySelector('.ambient-mode-plus')) {
                        const clonedItem = ambientModeItem.cloneNode(true);
                        const label = clonedItem.querySelector('.ytp-menuitem-label');

                        // Clear the existing content in the label
                        label.textContent = '';

                        // Create a new text node and <sup> element
                        const textNode = document.createTextNode('Ambient ');
                        const supElement = document.createElement('sup');
                        supElement.textContent = '+';

                        // Append the text node and <sup> element to the label
                        label.appendChild(textNode);
                        label.appendChild(supElement);

                        // Replace the icon with a custom SVG
                        const iconElement = clonedItem.querySelector('.ytp-menuitem-icon');
                        if (iconElement) {
                            // Remove the existing icon SVG
                            while (iconElement.firstChild) {
                                iconElement.removeChild(iconElement.firstChild);
                            }

                            // Create the SVG element
                            const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
                            svg.setAttribute('width', '24');
                            svg.setAttribute('height', '24');
                            svg.setAttribute('viewBox', '0 0 24 24');

                            // Create the path for the icon
                            const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
                            path.setAttribute('d', 'M21 7v10H3V7h18m1-1H2v12h20V6zM11.5 2v3h1V2h-1zm1 17h-1v3h1v-3zM3.79 3 6 5.21l.71-.71L4.5 2.29 3.79 3zm2.92 16.5L6 18.79 3.79 21l.71.71 2.21-2.21zM19.5 2.29 17.29 4.5l.71.71L20.21 3l-.71-.71zm0 19.42.71-.71L18 18.79l-.71.71 2.21 2.21z');
                            path.setAttribute('fill', 'white');
                            path.classList.add('glowing-icon'); // Add a class for glow effect

                            // Append the path to the SVG
                            svg.appendChild(path);

                            // Append the SVG to the icon element
                            iconElement.appendChild(svg);
                        }

                        // Set aria-disabled to false
                        clonedItem.setAttribute('aria-disabled', 'false');
                        clonedItem.classList.add('ambient-mode-plus');
                        clonedItem.setAttribute('aria-checked', isAmbientEnabled.toString());
                        clonedItem.addEventListener('click', toggleAmbientMode);

                        ambientModeItem.after(clonedItem);
                        observer.disconnect();
                        break;
                    }
                }
            }
        }
    }

    // Initialize MutationObserver
    const observer = new MutationObserver(handleMutations);
    observer.observe(document.documentElement, { childList: true, subtree: true });

    // Add keyboard shortcut handler
    document.addEventListener('keydown', (e) => {
        if (e.shiftKey && e.key.toLowerCase() === 'a') {
            toggleAmbientMode();
        }
    });

    // CSS to set overflow-x to hidden by default
    GM_addStyle('body { overflow-x: hidden; }');

    // Event listener for changes in video player state
    document.addEventListener('yt-navigate-finish', function () {
        // Reset overflow-x to hidden when a new video is played
        document.body.style.overflowX = 'hidden';
    });

    // Add glow effect for the SVG icon
    GM_addStyle(`
        .glowing-icon {
            filter: drop-shadow(0 0 5px rgba(255, 255, 255, 0.8));
            transition: filter 0.3s ease-in-out;
        }

        .glowing-icon:hover {
            filter: drop-shadow(0 0 10px rgba(255, 255, 255, 1));
        }
    `);

})();
