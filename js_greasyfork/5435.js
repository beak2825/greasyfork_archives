// ==UserScript==
// @name          WaniKani Cursor Behavior
// @namespace     https://www.wanikani.com
// @description   change cursor behavior so that it doesn't jump to the end when editing kana
// @version       0.1.0
// @include       https://www.wanikani.com/review/session
// @include       https://www.wanikani.com/lesson/session
// @include       http://www.wanikani.com/review/session
// @include       http://www.wanikani.com/lesson/session
// @run-at        document-end
// @grant         none
// @downloadURL https://update.greasyfork.org/scripts/5435/WaniKani%20Cursor%20Behavior.user.js
// @updateURL https://update.greasyfork.org/scripts/5435/WaniKani%20Cursor%20Behavior.meta.js
// ==/UserScript==

/*global console, wanakana*/

/*
source very slightly modified from:
https://github.com/WaniKani/WanaKana
License: The MIT License (MIT)
*/

(function () {
    'use strict';
    wanakana._onInput = function (event) {
        var input, newText, normalizedInputString, range, startingCursor, startingLength;
        input = event.target;
        startingCursor = input.selectionStart;
        startingLength = input.value.length;
        normalizedInputString = wanakana._convertFullwidthCharsToASCII(input.value);
        newText = wanakana.toKana(normalizedInputString, {
            IMEMode: true
        });
        if (normalizedInputString !== newText) {
            input.value = newText;
            if (typeof input.selectionStart === "number") {
                // input.selectionStart = input.selectionEnd = input.value.length; // original line
                input.selectionStart = input.selectionEnd = startingCursor + input.value.length - startingLength;
            } else if (typeof input.createTextRange !== "undefined") {
                input.focus();
                range = input.createTextRange();
                range.collapse(false);
                range.select();
            }
        }
    };
    console.log('WaniKani Cursor Behavior: script load end');
}());
