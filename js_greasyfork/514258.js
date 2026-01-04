// ==UserScript==
// @name         Roblox Website Reverter
// @namespace    https://roblox.com/
// @version      1.1
// @description  Reverts the Roblox Website to the hidden layout.
// @match        *://*.roblox.com/*
// @author       Fireblade
// @license MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/514258/Roblox%20Website%20Reverter.user.js
// @updateURL https://update.greasyfork.org/scripts/514258/Roblox%20Website%20Reverter.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function removeClasses() {
        const rbxBody = document.querySelector('#rbx-body');
        const navContainer = document.querySelector('#navigation-container');

        if (rbxBody) rbxBody.className = '';
        if (navContainer) navContainer.className = '';
    }

    removeClasses();

    function observeElement(selector) {
        const element = document.querySelector(selector);
        if (element) {
            const observer = new MutationObserver(() => {
                element.className = '';
            });
            observer.observe(element, { attributes: true, attributeFilter: ['class'] });
        }
    }

    observeElement('#rbx-body');
    observeElement('#navigation-container');
})();