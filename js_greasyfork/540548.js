// ==UserScript==
// @name         Hitbox.io Bat Charge Indicator
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Adds a visual bat charge bar indicator under the game iframe with color-coded states
// @author       Mr_FaZ3a
// @match        https://hitbox.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/540548/Hitboxio%20Bat%20Charge%20Indicator.user.js
// @updateURL https://update.greasyfork.org/scripts/540548/Hitboxio%20Bat%20Charge%20Indicator.meta.js
// ==/UserScript==

(function() {
    'use strict';
    
    const KEYBIND = "C".toLowerCase() // EDIT "C" to your keybinds check https://www.toptal.com/developers/keycode

    // Wait for the page to load and for the iframe to be accessible
    function waitForIframeAndLoad(selector, callback) {
        const iframe = document.querySelector(selector);
        if (iframe && iframe.contentWindow && iframe.contentDocument) {
            // Check if iframe content is fully loaded
            if (iframe.contentDocument.readyState === 'complete') {
                callback(iframe);
            } else {
                iframe.onload = () => callback(iframe);
            }
        } else {
            setTimeout(() => waitForIframeAndLoad(selector, callback), 100);
        }
    }

    // Create the bat charge indicator
    function createBatChargeIndicator() {
        const indicator = document.createElement('div');
        indicator.id = 'bat-charge-indicator';
        indicator.style.cssText = `
            position: fixed;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%);
            width: 300px;
            height: 40px;
            background-color: #333;
            border: 2px solid #000;
            border-radius: 20px;
            z-index: 10000;
            display: flex;
            align-items: center;
            justify-content: center;
            font-family: Arial, sans-serif;
            font-weight: bold;
            font-size: 14px;
            color: #fff;
            text-shadow: 1px 1px 2px rgba(0,0,0,0.8);
            box-shadow: 0 4px 8px rgba(0,0,0,0.3);
        `;

        const innerBar = document.createElement('div');
        innerBar.id = 'bat-charge-inner';
        innerBar.style.cssText = `
            position: absolute;
            left: 2px;
            top: 2px;
            height: 36px;
            width: 296px;
            border-radius: 18px;
            transition: background-color 0.1s ease;
            display: flex;
            align-items: center;
            justify-content: center;
        `;

        const text = document.createElement('span');
        text.id = 'bat-charge-text';
        text.textContent = 'BAT READY';
        text.style.cssText = `
            position: relative;
            z-index: 1;
            color: #000;
            font-weight: bold;
            text-shadow: 1px 1px 2px rgba(255,255,255,0.5);
        `;

        innerBar.appendChild(text);
        indicator.appendChild(innerBar);
        document.body.appendChild(indicator);

        return { indicator, innerBar, text };
    }

    // Bat state management
    class BatStateManager {
        constructor(elements, targetDocument) {
            this.elements = elements;
            this.targetDocument = targetDocument; // The document to attach listeners to (iframe's document)
            this.state = 'ready'; // ready, holding, reloading, ready_to_release
            this.chargeTimer = null;
            this.reloadTimer = null;
            this.keyPressed = false;
            this.setupEventListeners();
            this.updateDisplay();
        }

        setupEventListeners() {
            // Listen for 'C' key press and release on the target document (iframe's document)
            this.targetDocument.addEventListener('keydown', (e) => {
                if (e.key.toLowerCase() === KEYBIND && !this.keyPressed && this.state === 'ready') {
                    this.keyPressed = true;
                    this.startHolding();
                }
            });

            this.targetDocument.addEventListener('keyup', (e) => {
                if (e.key.toLowerCase() === KEYBIND && this.keyPressed) { 
                    this.keyPressed = false;
                    if (this.state === 'holding') {
                        // If released before full charge, go back to ready immediately
                        this.state = 'ready';
                        this.updateDisplay();
                        if (this.chargeTimer) {
                            clearTimeout(this.chargeTimer);
                            this.chargeTimer = null;
                        }
                    } else if (this.state === 'ready_to_release') {
                        this.releaseBat();
                    }
                }
            });

            // Also listen for focus/blur events on the target window (iframe's window)
            this.targetDocument.defaultView.addEventListener('blur', () => {
                if (this.keyPressed) {
                    this.keyPressed = false;
                    if (this.state === 'holding' || this.state === 'ready_to_release') {
                        // If tab loses focus while holding or ready_to_release, reset to ready
                        if (this.chargeTimer) {
                            clearTimeout(this.chargeTimer);
                            this.chargeTimer = null;
                        }
                        if (this.reloadTimer) {
                            clearTimeout(this.reloadTimer);
                            this.reloadTimer = null;
                        }
                        this.state = 'ready';
                        this.updateDisplay();
                    }
                }
            });
        }

        startHolding() {
            this.state = 'holding';
            this.updateDisplay();

            // After 0.286 seconds, change to red (ready to release)
            this.chargeTimer = setTimeout(() => {
                if (this.state === 'holding') { // Ensure still holding before changing state
                    this.state = 'ready_to_release';
                    this.updateDisplay();
                }
            }, 286);
        }

        releaseBat() {
            if (this.chargeTimer) {
                clearTimeout(this.chargeTimer);
                this.chargeTimer = null;
            }

            this.state = 'reloading';
            this.updateDisplay();

            // After 0.4 seconds, return to ready
            this.reloadTimer = setTimeout(() => {
                this.state = 'ready';
                this.updateDisplay();
            }, 400);
        }

        updateDisplay() {
            const { innerBar, text } = this.elements;

            switch (this.state) {
                case 'ready':
                    innerBar.style.backgroundColor = '#ffffff';
                    text.textContent = 'BAT READY';
                    text.style.color = '#000';
                    break;
                case 'holding':
                    innerBar.style.backgroundColor = '#ffff00';
                    text.textContent = 'HOLDING...';
                    text.style.color = '#000';
                    break;
                case 'ready_to_release':
                    innerBar.style.backgroundColor = '#ff0000';
                    text.textContent = 'RELEASE!';
                    text.style.color = '#fff';
                    break;
                case 'reloading':
                    innerBar.style.backgroundColor = '#808080';
                    text.textContent = 'RELOADING...';
                    text.style.color = '#fff';
                    break;
            }
        }
    }

    // Initialize the script
    function init() {
        // Wait for the game iframe to load
        waitForIframeAndLoad('iframe', (iframe) => {
            // Create the indicator
            const elements = createBatChargeIndicator();

            // Initialize the bat state manager, passing the iframe's document
            const batManager = new BatStateManager(elements, iframe.contentDocument);

            console.log('Hitbox.io Bat Charge Indicator loaded successfully!');
        });
    }

    // Start the script when the page loads
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();

