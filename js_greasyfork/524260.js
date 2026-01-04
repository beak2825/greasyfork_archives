// ==UserScript==
// @name         THEHIGHLOW.IO FIX
// @namespace    http://tampermonkey.net/
// @version      2025-01-20
// @license MIT
// @description  Fix thehighlow reproduction issue.
// @author       _KInez_
// @match        https://thehighlow.io/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=thehighlow.io
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/524260/THEHIGHLOWIO%20FIX.user.js
// @updateURL https://update.greasyfork.org/scripts/524260/THEHIGHLOWIO%20FIX.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const noRef = document.createElement("meta");
    noRef.name = "referrer";
    noRef.content = "no-referrer";
    document.head.appendChild(noRef);
})();