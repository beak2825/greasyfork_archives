// ==UserScript==
// @name         NoLogIn for Nationalgeographic
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  When you browse Nationalgeographic.com, you will not be force to log in!
// @author       SnoopyT
// @match        https://www.nationalgeographic.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=google.com
// @grant        none
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/446780/NoLogIn%20for%20Nationalgeographic.user.js
// @updateURL https://update.greasyfork.org/scripts/446780/NoLogIn%20for%20Nationalgeographic.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    window.addEventListener('scroll', function (event) {
    event.stopPropagation();
}, true);
})();