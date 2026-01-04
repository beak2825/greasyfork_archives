// ==UserScript==
// @name         Hide SRS rank image on new grammar
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  When looking at synonyms and antonyms on grammar pages, "new" related grammar, that hasn't been added to reviews yet, still show an image, as if they were on SRS Level 0-2. This script removes those images to properly mark them as "new".
// @author       Michael Nix
// @match        https://bunpro.jp/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bunpro.jp
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/444867/Hide%20SRS%20rank%20image%20on%20new%20grammar.user.js
// @updateURL https://update.greasyfork.org/scripts/444867/Hide%20SRS%20rank%20image%20on%20new%20grammar.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // Code adapted from https://developer.mozilla.org/en-US/docs/Web/API/CSSStyleSheet/insertRule

    // Create a new <style> element
    var styleEl = document.createElement('style');

    // Append <style> element to <head>
    document.head.appendChild(styleEl);

    // Grab style element's sheet
    var styleSheet = styleEl.sheet;

    styleSheet.insertRule(".grammar-point__card--related-grammar-new {background-image: url('') !important}")
})();