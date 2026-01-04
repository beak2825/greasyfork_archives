// ==UserScript==
// @name         Figma Auto Layout, Floating Search, and Pride Loading Bar
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Enables Figma's auto layout feature, beta search box, and brings back the pride loading bar
// @author       You
// @match        https://www.figma.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/392797/Figma%20Auto%20Layout%2C%20Floating%20Search%2C%20and%20Pride%20Loading%20Bar.user.js
// @updateURL https://update.greasyfork.org/scripts/392797/Figma%20Auto%20Layout%2C%20Floating%20Search%2C%20and%20Pride%20Loading%20Bar.meta.js
// ==/UserScript==

(function() {
    window.INITIAL_OPTIONS.feature_flags.auto_layout = true
    window.INITIAL_OPTIONS.feature_flags.quick_commands_floating_search = true
    window.INITIAL_OPTIONS.feature_flags.pride_loading_bar = true
})();