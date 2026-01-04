// ==UserScript==
// @name         Enable All Tags
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Enables all elements on a web page
// @author       Anthony Littlewood
// @include      *
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/37583/Enable%20All%20Tags.user.js
// @updateURL https://update.greasyfork.org/scripts/37583/Enable%20All%20Tags.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var all = document.getElementsByTagName("*");
    for (var i=0, max=all.length; i < max; i++) {
        all[i].disabled = false;
    }
})();