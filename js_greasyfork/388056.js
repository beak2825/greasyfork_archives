// ==UserScript==
// @name         Agma Animation Script
// @namespace    http://tampermonkey.net/
// @version      1.2.1
// @description  Let your cell spin, jump, shake, flip and wacky!
// @author       You
// @match        *://agma.io/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/388056/Agma%20Animation%20Script.user.js
// @updateURL https://update.greasyfork.org/scripts/388056/Agma%20Animation%20Script.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Mouse button to use to start. Nell = do not listen to mosue click.
    // 0 = left, 1 = middle, 2 = right
    var startMouseButton = null

    // Key to use to start. Null = do not key press..
    // Use this tool to find out key codes - just press a button: https://unixpapa.com/js/testkey.html
    // 17 = CTRL
    var startKeyCode = 17;

    // True = Combine wacky with others animations,
    // False = Only other aninmations
    var combine = true;

    console.log('Agma Animation Script started! ?');

    /**
     * Returns a random number between min (inclusive) and max (exclusive)
     * Source: MDN
     */
    var getRandomArbitrary = function(min, max) {
        return Math.random() * (max - min) + min;
    }

    var chatAnimate = function()
    {
        // The available commands
        var items = ['spin', 'flip', 'shake', 'jump'];

        // Choose randomly an item of the items array
        // Source: https://stackoverflow.com/questions/5915096/get-random-item-from-javascript-array
        var item = items[Math.floor(Math.random()*items.length)];

        if (combine) {
            item = 'wacky' + item;
        }

        // Add text into the chatbox and focus it
        $('#chtbox').val('/' + item).focus();

        // Stop the event so that the pressed key won't be written into the chatbox!
        event.preventDefault();
    }

    window.addEventListener('mousedown', function(event)
    {
        if (event.button == startMouseButton) {
            chatAnimate();
        }
    });
    window.addEventListener('keydown', function(event)
    {
        if (event.keyCode == startKeyCode && ! event.shiftKey) {
            chatAnimate();
        }
    });
})();