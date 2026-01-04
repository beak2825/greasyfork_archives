// ==UserScript==
// @name         remove right panel; making the content bigger
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        http://www.linuxidc.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/34384/remove%20right%20panel%3B%20making%20the%20content%20bigger.user.js
// @updateURL https://update.greasyfork.org/scripts/34384/remove%20right%20panel%3B%20making%20the%20content%20bigger.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    var right=document.getElementById('middle')
    var right_tds=right.getElementsByTagName('td')
    var right_td=right_tds[right_tds.length-1]
    right_td.parentNode.removeChild(right_td)
})();