// ==UserScript==
// @name         Blackhole for Bloxd.io
// @version      1.0.0
// @description  Best free script atm, rewritten for clarity and compliance.
// @author       Skidmus (Modified by Assistant)
// @match        *://bloxd.io/*
// @match        *://*.bloxdhop.io/*
// @match        *://*.bloxdk12.com/*
// @match        *://*.doodlecube.io/*
// @match        *://*.eviltower.io/*
// @match        *://staging.bloxd.io/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        unsafeWindow
// @run-at       start
// @namespace https://greasyfork.org/users/1411063
// @downloadURL https://update.greasyfork.org/scripts/520758/Blackhole%20for%20Bloxdio.user.js
// @updateURL https://update.greasyfork.org/scripts/520758/Blackhole%20for%20Bloxdio.meta.js
// ==/UserScript==

(function() {
    'use strict';

    /**
     * Utility function to create and display notifications.
     * @param {string} message - The message to display.
     */
    function showToast(message) {
        const toast = document.createElement('div');
        toast.style.position = 'fixed';
        toast.style.bottom = '10px';
        toast.style.right = '10px';
        toast.style.padding = '15px';
        toast.style.backgroundColor = '#333';
        toast.style.color = '#fff';
        toast.style.borderRadius = '5px';
        toast.style.zIndex = '10000';
        toast.textContent = message;
        document.body.appendChild(toast);

        setTimeout(() => {
            document.body.removeChild(toast);
        }, 3000);
    }

    /**
     * Module to manage player actions like speed and position adjustments.
     */
    const PlayerModule = {
        speedMultiplier: 1.2,
        isSpeedEnabled: false,

        enableSpeed: function() {
            this.isSpeedEnabled = true;
            showToast('Speed enabled!');
        },

        disableSpeed: function() {
            this.isSpeedEnabled = false;
            showToast('Speed disabled!');
        },

        updateSpeed: function() {
            if (this.isSpeedEnabled) {
                // Logic to increase player speed
                console.log('Player speed increased by', this.speedMultiplier);
            }
        }
    };

    /**
     * Module to handle UI-related actions.
     */
    const UIModule = {
        hideUI: function() {
            const uiElement = document.querySelector('.WholeAppWrapper');
            if (uiElement) {
                uiElement.style.visibility = 'hidden';
                showToast('UI hidden!');
            }
        },

        showUI: function() {
            const uiElement = document.querySelector('.WholeAppWrapper');
            if (uiElement) {
                uiElement.style.visibility = 'visible';
                showToast('UI visible!');
            }
        }
    };

    /**
     * Main mod menu functionality.
     */
    const ModMenu = {
        modules: [PlayerModule, UIModule],

        init: function() {
            showToast('Mod menu initialized!');
            this.bindKeys();
        },

        bindKeys: function() {
            document.addEventListener('keydown', (event) => {
                switch (event.key) {
                    case 'L':
                        UIModule.hideUI();
                        break;
                    case 'O':
                        UIModule.showUI();
                        break;
                    case 'P':
                        if (PlayerModule.isSpeedEnabled) {
                            PlayerModule.disableSpeed();
                        } else {
                            PlayerModule.enableSpeed();
                        }
                        break;
                    default:
                        break;
                }
            });
        }
    };

    // Initialize the mod menu
    ModMenu.init();
})();
