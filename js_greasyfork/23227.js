// ==UserScript==
// @name         Reddit link sanitizer
// @namespace    https://github.com/noahkissinger
// @version      0.1
// @description  Sanitize reddit URLs when using subdomains
// @author       /u/noahjk
// @match        https://*.reddit.com/r/*
// @downloadURL https://update.greasyfork.org/scripts/23227/Reddit%20link%20sanitizer.user.js
// @updateURL https://update.greasyfork.org/scripts/23227/Reddit%20link%20sanitizer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var home = document.getElementById("header-img-a");
    home.setAttribute("href", "https://www.reddit.com/");

})();