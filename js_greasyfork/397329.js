// ==UserScript==
// @name         Expand OD commits
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://our.internmc.facebook.com/intern/ondemand/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/397329/Expand%20OD%20commits.user.js
// @updateURL https://update.greasyfork.org/scripts/397329/Expand%20OD%20commits.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let list = document.getElementsByClassName('expandCollapsibleCardButton');
    for (let item of list) {
        item.click();
    }
    list = document.querySelectorAll('.rfloat > a > .img')
    for (let item of list) {
        item.click();
    }
})();