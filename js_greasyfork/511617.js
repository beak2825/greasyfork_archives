// ==UserScript==
// @name         Store Variable Example
// @namespace    http://tampermonkey.net/
// @version      2.0
// @license MIT
// @description  Stores a variable using Tampermonkey's storage functions
// @author       You
// @match        https://chatgpt.com/c/6701c622-1fe0-8011-8174-0ac428d929e3
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/511617/Store%20Variable%20Example.user.js
// @updateURL https://update.greasyfork.org/scripts/511617/Store%20Variable%20Example.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Store the value "hee"
    GM_setValue("myVariable", "hi");

    // Retrieve and log the stored value
    let storedValue = GM_getValue("myVariable");
    console.log("Stored value:", storedValue);
})();
