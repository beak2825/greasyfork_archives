// ==UserScript==
// @name         Remove the top-banner of mdn
// @namespace    http://tampermonkey.net/
// @version      2024-05-07
// @description  Remove the top-banner of mdn!
// @author       You
// @match        https://developer.mozilla.org/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=mozilla.org
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/494281/Remove%20the%20top-banner%20of%20mdn.user.js
// @updateURL https://update.greasyfork.org/scripts/494281/Remove%20the%20top-banner%20of%20mdn.meta.js
// ==/UserScript==

(function() {
    'use strict';
    document.querySelector(".top-banner").style.display = "none";
})();