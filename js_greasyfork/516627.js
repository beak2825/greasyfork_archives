// ==UserScript==
// @name         Refined cppreference.com
// @namespace    https://cppref.microblock.cc/
// @version      0.0.0
// @description  Redirect to cppref.microblock.cc automatically.
// @author       MicroBlock
// @match        https://*.cppreference.com/**
// @icon         https://www.google.com/s2/favicons?sz=64&domain=cppreference.com
// @grant        none
// @run-at       document-start
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/516627/Refined%20cppreferencecom.user.js
// @updateURL https://update.greasyfork.org/scripts/516627/Refined%20cppreferencecom.meta.js
// ==/UserScript==

(function() {
    'use strict';

    document.location.hostname = 'cppref.microblock.cc'
})();