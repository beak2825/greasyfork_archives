// ==UserScript==
// @name         Prevent Autofocus on AllenAI, Mistral
// @description  Blocks programmatic focus on <textarea> and contenteditable elements
// @match        https://playground.allenai.org/*
// @match        https://chat.mistral.ai/*
// @match        https://www.kimi.com/*
// @run-at       document-start
// @version 0.0.1.20250715101215
// @namespace https://greasyfork.org/users/1435046
// @downloadURL https://update.greasyfork.org/scripts/535681/Prevent%20Autofocus%20on%20AllenAI%2C%20Mistral.user.js
// @updateURL https://update.greasyfork.org/scripts/535681/Prevent%20Autofocus%20on%20AllenAI%2C%20Mistral.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Save original focus
    const originalFocus = HTMLElement.prototype.focus;

    // Override focus globally
    Object.defineProperty(HTMLElement.prototype, 'focus', {
        configurable: true,
        enumerable:   true,
        writable:     true,
        value: function(...args) {
            // If it's a <textarea> or a contenteditable element, do nothing
            if (this.tagName === 'TEXTAREA' || this.isContentEditable) {
                return;
            }
            // Otherwise proceed as normal
            return originalFocus.apply(this, args);
        }
    });
})();
