// ==UserScript==
// @name         Remove Key & Right-Click Block
// @namespace   Violentmonkey Scripts
// @version      1.0
// @description  Disables forwarding to google.com when pressing right-click or F12
// @match        https://unirate.xyz/*
// @grant        none
// @author      riyan
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/547177/Remove%20Key%20%20Right-Click%20Block.user.js
// @updateURL https://update.greasyfork.org/scripts/547177/Remove%20Key%20%20Right-Click%20Block.meta.js
// ==/UserScript==

(function() {
    'use strict';

    document.addEventListener('keydown', function(e) {
        e.stopImmediatePropagation();
    }, true);

    document.addEventListener('contextmenu', function(e) {
        e.stopImmediatePropagation();
    }, true);

    document.oncontextmenu = null;
    document.onkeydown = null;

})();