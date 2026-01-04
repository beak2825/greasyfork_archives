// ==UserScript==
// @name         Auto Anon
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  If an askbox permits anonymous asks, enable it automatically
// @author       Hex
// @match        https://www.tumblr.com/ask_form/*
// @icon         https://www.tumblr.com/favicon.ico
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/436916/Auto%20Anon.user.js
// @updateURL https://update.greasyfork.org/scripts/436916/Auto%20Anon.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var ask_checkbox = document.getElementById("ask_anonymously");

    if (ask_checkbox) {
        ask_checkbox.click();
    }
    // Your code here...
})();