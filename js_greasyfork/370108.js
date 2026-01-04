// ==UserScript==
// @name         Coub Right and Left Arrow Navigation
// @namespace    https://github.com/FireEmerald
// @version      0.1
// @description  Navigate through posts using right and left arrow keys
// @author       FireEmerald
// @license      MIT
// @match        http*://coub.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/370108/Coub%20Right%20and%20Left%20Arrow%20Navigation.user.js
// @updateURL https://update.greasyfork.org/scripts/370108/Coub%20Right%20and%20Left%20Arrow%20Navigation.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Simulate key pressed: https://elgervanboxtel.nl/site/blog/simulate-keydown-event-with-javascript
    // Key codes:            https://www.cambiaresearch.com/articles/15/javascript-char-codes-key-codes
    document.addEventListener('keydown', function( event ) {
        var key = event.key;

        var e = new Event('keydown', {
            bubbles: true,
            altKey: false,
            ctrlKey: true,
            shiftKey: false,
            metaKey: false
        });

        if (key === 'ArrowRight') {
            console.log('Redirect: ' + key + ' > ArrowDown');

            e.key='ArrowDown';
            e.keyCode=40;
            e.which=e.keyCode;

            window.dispatchEvent(e);
        } else if (key === 'ArrowLeft') {
            console.log('Redirect: ' + key + ' > ArrowUp');

            e.key='ArrowUp';
            e.keyCode=38;
            e.which=e.keyCode;

            window.dispatchEvent(e);
        }
    });
})();