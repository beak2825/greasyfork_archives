// ==UserScript==
// @name         Example UserScript
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  An example script with a proper license
// @author       Your Name
// @match        https://www.example.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/516002/Example%20UserScript.user.js
// @updateURL https://update.greasyfork.org/scripts/516002/Example%20UserScript.meta.js
// ==/UserScript==

// ==UserScript==
// @name         Example UserScript
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  An example script using @match annotation
// @author       You
// @match        https://www.example.com/*
// @match        https://anotherwebsite.com/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // This code will run on pages that match the above @match URLs

    console.log("Hello, world! This script is running on:", window.location.href);

    // Example action: Change background color of the page
    document.body.style.backgroundColor = "lightblue";
})();

// ==UserScript==
// @name         Example UserScript with @include
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  An example script using @include annotation
// @author       You
// @include      https://www.example.com/*
// @include      https://anotherwebsite.com/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // This code will run on pages that match the above @include URLs

    console.log("Hello, world! This script is running on:", window.location.href);

    // Example action: Change background color of the page
    document.body.style.backgroundColor = "lightgreen";
})();

