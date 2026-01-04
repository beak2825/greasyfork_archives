// ==UserScript==
// @name         character ai edit message border removal
// @namespace    made by joshclark756
// @version      1.0
// @description  Removes the annoying blue  edit border
// @author       joshclark756
// @match        https://character.ai/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/519855/character%20ai%20edit%20message%20border%20removal.user.js
// @updateURL https://update.greasyfork.org/scripts/519855/character%20ai%20edit%20message%20border%20removal.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const styles = document.createElement('style');
    styles.innerHTML = '.border-blue { border-color: transparent !important; }';
    document.head.appendChild(styles);
}());