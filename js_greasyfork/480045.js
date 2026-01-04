// ==UserScript==
// @name         Remove AI Search Results
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Adds the modifier "-ai" to the Google Image Search search box by default.
// @author       joshdotnet
// @match        https://images.google.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=greasyfork.org
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/480045/Remove%20AI%20Search%20Results.user.js
// @updateURL https://update.greasyfork.org/scripts/480045/Remove%20AI%20Search%20Results.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var inputs = document.getElementsByTagName('textarea');
    if (inputs.length) {
        inputs[0].value = '-ai ';
    }
})();