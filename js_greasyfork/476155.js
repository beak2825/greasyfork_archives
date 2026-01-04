// ==UserScript==
// @name         IdlePixel UI Tweaks - Zlef Extension
// @namespace    com.zlef.idlepixel
// @version      1.0.1
// @description  An extension to the IdlePixel UI Tweaks - GodofNades Fork
// @author       Original Author: Zlef
// @license      MIT
// @match        *://idle-pixel.com/login/play*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/476155/IdlePixel%20UI%20Tweaks%20-%20Zlef%20Extension.user.js
// @updateURL https://update.greasyfork.org/scripts/476155/IdlePixel%20UI%20Tweaks%20-%20Zlef%20Extension.meta.js
// ==/UserScript==

(function() {
    'use strict';
    
    // Wait for the document to be fully loaded
    $(document).ready(function() {

        class ZlefUITweaks extends UITweaksPlugin {
            constructor(id = 'zlef-ui-tweaks-extension', opts) {
                super(id, opts);
                this.initUI(); // This will initialize the UI elements and event handlers
            }

            initUI() {
                // Adding the new buttons after the clear button
                $("#chat-clear-button").after(`
                    <button id="chat-font-down-button" style="color: blue">FONT DOWN</button>
                    <button id="chat-font-up-button" style="color: blue">FONT UP</button>
                `);

                // Attaching event handlers
                $("#chat-font-down-button").on("click", () => {
                    this.decreaseFontSize();
                });

                $("#chat-font-up-button").on("click", () => {
                    this.increaseFontSize();
                });
            }

            // Method to increase font size
            increaseFontSize() {
                let currentSize = parseInt($("#chat-area").css('font-size'));
                if (isNaN(currentSize)) {
                    currentSize = 16;
                }
                $("#chat-area").css('font-size', (currentSize + 1) + "px");
            }

            // Method to decrease font size
            decreaseFontSize() {
                let currentSize = parseInt($("#chat-area").css('font-size'));
                if (isNaN(currentSize)) {
                    currentSize = 16;
                }
                if (currentSize > 10) {
                    $("#chat-area").css('font-size', (currentSize - 1) + "px");
                }
            }
        }

        // Registering the plugin with IdlePixelPlus
        const zlefUITweaks = new ZlefUITweaks('zlef-ui-tweaks-extension', {});
        IdlePixelPlus.registerPlugin(zlefUITweaks);

    });
})();
