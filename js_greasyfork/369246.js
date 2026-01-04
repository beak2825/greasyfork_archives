// ==UserScript==
// @name         Sessionize Blind Compare
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Hide personal speaker info in sessionize CFP evaluation page
// @author       Kevin Galligan
// @match        https://sessionize.com/*/*/event/evaluation/compare/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/369246/Sessionize%20Blind%20Compare.user.js
// @updateURL https://update.greasyfork.org/scripts/369246/Sessionize%20Blind%20Compare.meta.js
// ==/UserScript==

(function() {
    'use strict';
var elems = document.getElementsByClassName("social-body")
for (var k in elems) {
    elems[k].style.display = "none"
}
    // Your code here...
})();