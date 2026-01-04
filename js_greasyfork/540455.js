// ==UserScript==
// @name         learngerman.dw.com
// @namespace    http://tampermonkey.net/
// @version      2025-06-15
// @description  DW learn german website style fix
// @author       You
// @match        https://learngerman.dw.com/en/**
// @icon         https://www.google.com/s2/favicons?sz=64&domain=dw.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/540455/learngermandwcom.user.js
// @updateURL https://update.greasyfork.org/scripts/540455/learngermandwcom.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Define the CSS variables we want to disable
    const OVERFLOW_VAR = '--global-disable-scrolling-overflow';
    const PADDING_VAR = '--global-disable-scrolling-padding';

    // Store original methods
    const originalSetProperty = CSSStyleDeclaration.prototype.setProperty;
    const originalRemoveProperty = CSSStyleDeclaration.prototype.removeProperty;

    // Override setProperty
    CSSStyleDeclaration.prototype.setProperty = function(property, value, priority) {
        if (this === document.documentElement.style && (property === OVERFLOW_VAR || property === PADDING_VAR)) {
            console.log(`Tampermonkey: Blocked setProperty for ${property}`);
            return; // Block the operation
        }
        // Call original method for all other properties or elements
        originalSetProperty.call(this, property, value, priority);
    };

    // Override removeProperty
    CSSStyleDeclaration.prototype.removeProperty = function(property) {
        if (this === document.documentElement.style && (property === OVERFLOW_VAR || property === PADDING_VAR)) {
            console.log(`Tampermonkey: Blocked removeProperty for ${property}`);
            return ''; // Block the operation, return empty string as original might
        }
        // Call original method for all other properties or elements
        return originalRemoveProperty.call(this, property);
    };

    console.log('Tampermonkey: Modal scrolling style disabler script loaded.');

})();