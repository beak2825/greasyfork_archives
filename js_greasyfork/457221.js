// ==UserScript==
// @name         Advent of Code Title Highlighter
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Each day of Advent of Code includes a message that is revealed when you hover over a certain piece of text. This script makes it easy to find that message by highlighting the piece of text that includes it.
// @author       Ahmet Kun
// @match        https://adventofcode.com/*/day/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/457221/Advent%20of%20Code%20Title%20Highlighter.user.js
// @updateURL https://update.greasyfork.org/scripts/457221/Advent%20of%20Code%20Title%20Highlighter.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let spans = document.querySelectorAll('article span[title]');
    spans.forEach(span => {
        span.style.textDecoration = 'underline';
        span.style.color = 'red';
    });
})();