// ==UserScript==
// @name         override ProductPage IFrame with localhost
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://ecom.wix.com/storefront/product/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/374533/override%20ProductPage%20IFrame%20with%20localhost.user.js
// @updateURL https://update.greasyfork.org/scripts/374533/override%20ProductPage%20IFrame%20with%20localhost.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // Your code here...
    console.log('overrides IFrame works');
    location.href = `http://localhost:4000${location.search}`;
})();

