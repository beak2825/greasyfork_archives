// ==UserScript==
// @name         TPC Filter
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  script to remove posts of a particular seller who sells fake stuff
// @author       You
// @match        https://tipidpc.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/36698/TPC%20Filter.user.js
// @updateURL https://update.greasyfork.org/scripts/36698/TPC%20Filter.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    $("li:contains('lineage')").remove();
})();