// ==UserScript==
// @name         Youtrack + Vimium fixes
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  modify youtrack behavior
// @author       You
// @match        https://*.myjetbrains.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/370808/Youtrack%20%2B%20Vimium%20fixes.user.js
// @updateURL https://update.greasyfork.org/scripts/370808/Youtrack%20%2B%20Vimium%20fixes.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    console.log("blur", document.activeElement);
        document.activeElement.blur();
})();