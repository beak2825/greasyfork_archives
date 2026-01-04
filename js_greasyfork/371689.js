// ==UserScript==
// @name         Memrise Easy Quiz Input
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Select special characters for Memrise quizzes using keyboard shortcuts 1 to 0.
// @author       Cezille07
// @match        https://www.memrise.com/course/*
// @grant        none
// @license      GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/371689/Memrise%20Easy%20Quiz%20Input.user.js
// @updateURL https://update.greasyfork.org/scripts/371689/Memrise%20Easy%20Quiz%20Input.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var $ = window.jQuery;
    var selector = '.keyboard a.shiny-box';

    $(document).ready(function () {
        console.log('[MEQI] Initializing Memrize Easy Quiz Input');
        var boxes = document.getElementById('boxes');
        if (boxes) {
            var observer = new MutationObserver(function(mutationRecords) {
                var inputs = $(selector);
                if (inputs.length) {
                    console.log('[MEQI] Adding Numbers', inputs);
                    for (var i = 0; i < inputs.length; i++) {
                        console.log('Adding help', i, inputs[i]);
                        inputs[i].innerText = (i + 1) + ': ' + inputs[i].innerText;
                    }
                } else {
                    console.log('[MEQI] No shortcuts to add hints to');
                }
            });
            observer.observe(boxes, {
                childList: true
            });
        }
    });

    window.addEventListener('keydown', function (e) {
        var inputs = $(selector);
        var ZERO = 48;
        var NUM_ZERO = 96;

        if (inputs.length > 0 &&
            (e.keyCode >= ZERO && e.keyCode < ZERO + 10) ||
            (e.keyCode >= NUM_ZERO && e.keyCode < NUM_ZERO + 10)
        ) {
            var map = {};
            for (var i = 0; i < 10; i++) {
                map[i + ZERO] = i - 1;
                map[i + NUM_ZERO] = i - 1;
            }
            // Zero is the 10th item
            map[ZERO] = 9;
            map[NUM_ZERO] = 9;

            console.log('[MEQI] Clicking', e.code);
            document.activeElement.blur();
            setTimeout(function () {
                var el = inputs[map[e.keyCode]];
                // This condition prevents inputting a 9 (for instance) if less than 9 boxes are available
                if (el) {
                    var colIdx = el.innerText.indexOf(': ');
                    var num = el.innerText.slice(0, colIdx);
                    el.innerText = el.innerText.slice(colIdx + 2);
                    el.click();
                    el.innerText = num + ': ' + el.innerText;
                }
            }, 0);
        }
    });
})();
