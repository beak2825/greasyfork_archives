// ==UserScript==
// @license MIT
// @name         RandomTitle
// @version      1.0.0
// @description  All Website Random Title
// @author       XXX
// @match        *://*
// @match        *://*/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @namespace http://tampermonkey.net/
// @downloadURL https://update.greasyfork.org/scripts/491728/RandomTitle.user.js
// @updateURL https://update.greasyfork.org/scripts/491728/RandomTitle.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // Wait for load
    window.addEventListener('load', function() {
		var randnumber = Math.round(Math.random()*100);
		document.title = randnumber;
    });
})();