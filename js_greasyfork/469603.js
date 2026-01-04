// ==UserScript==
// @name Change Gmail Logo
// @namespace http://tampermonkey.net/
// @version 1.0
// @description Changes the Gmail logo on the specified URL.
// @match https://mail.google.com/mail/u/0/h/vf4u6ogtqrap/*
// @grant none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/469603/Change%20Gmail%20Logo.user.js
// @updateURL https://update.greasyfork.org/scripts/469603/Change%20Gmail%20Logo.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var targetImg = document.querySelector('img[alt="Gmail by Google"]');
    if (targetImg) {
        targetImg.src = 'https://googlewebhp.neocities.org/Gmail20114.PNG';
    }
})();