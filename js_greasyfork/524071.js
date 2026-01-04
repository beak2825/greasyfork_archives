// ==UserScript==
// @name         IB Lineage Emoji Generator
// @namespace    http://tampermonkey.net/
// @version      1.3
// @license      MIT
// @description  Adds option to add emojis automatically
// @icon         https://i.imgur.com/WlkWOkU.png
// @author       @activetutorial on discord
// @match        https://infinibrowser.wiki/tools/lineage-maker
// @run-at       document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/524071/IB%20Lineage%20Emoji%20Generator.user.js
// @updateURL https://update.greasyfork.org/scripts/524071/IB%20Lineage%20Emoji%20Generator.meta.js
// ==/UserScript==

(function() {
    'use strict';

    (window.AT ||= {}).lineageemojis = {
        mappings: null,
        buttons: { // Button settings
            setEmojisButton: {
                id: "set-emojis",
                className: "btn",
                textContent: "Set Emojis"
            },
            resetEmojisButton: {
                id: "reset-emojis",
                className: "btn",
                textContent: "Reset Emojis"
            }
        },
        createButtons: function() { // Create all buttons
            this.setEmojisButton = document.createElement("button");
            Object.assign(this.setEmojisButton, this.buttons.setEmojisButton);

            this.resetEmojisButton = document.createElement("button");
            Object.assign(this.resetEmojisButton, this.buttons.resetEmojisButton);

            const btnElement = document.querySelectorAll(".btn")[1];
            btnElement.parentElement.appendChild(this.setEmojisButton);
            btnElement.parentElement.appendChild(document.createTextNode(" "));
            btnElement.parentElement.appendChild(this.resetEmojisButton);
        },
        setEmojis: async function() {
            [...document.getElementById('item_list').children].forEach(async i => { // Each item
                if (this.mappings.get(i.lastChild.textContent) == "⬜") { // Only when it doesnt exist
                    const response = await fetch("https://infinibrowser.wiki/api/item?id=" + encodeURIComponent(i.lastChild.textContent));
                    const data = await response.json();
                    i.firstChild.value = data.emoji || "⬜"; // Set emoji
                    i.firstChild.dispatchEvent(new Event('blur')); // Manual event because .blur() doesnt work
                }
            });
        },
        resetEmojis: function() {
            [...document.getElementById('item_list').children].forEach(i => { // Each item
                i.firstChild.value = ""; // Reset emoji
                i.firstChild.dispatchEvent(new Event('blur'));
            });
        },
        start: function () {
            if (document.querySelector('.btn')) { // Wait for IB to load
                this.createButtons();
                // Button event listeners
                this.setEmojisButton.addEventListener("click", this.setEmojis.bind(this));
                this.resetEmojisButton.addEventListener("click", this.resetEmojis.bind(this));

                // Patch Map.prototype.get to access internal emoji mapping
                const originalGet = Map.prototype.get;
                Map.prototype.get = function(key) {
                    if (originalGet.call(this, "Water") == "💧") { // Make sure that it only applies to IBs mapping
                        window.AT.lineageemojis.mappings = this;
                    }
                    return originalGet.call(this, key);
                };

                // Patch String.prototype.split to split off asciidoc formatting
                const originalSplit = String.prototype.split;
                String.prototype.split = function (...args) {
                    const modifiedString = originalSplit.call(this, "  //")[0]; // Split away the thing
                    return originalSplit.call(modifiedString, ...args);
                };
            } else {
                setTimeout(this.start.bind(this), 200);
            }
        }
    };

    window.AT.lineageemojis.start();
})();
