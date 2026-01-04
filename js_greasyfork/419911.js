// ==UserScript==
// @name         Bank Interest Collector
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Automatically collect daily interest when visiting bank. For updated site layout
// @author       romboyz
// @match        http://www.neopets.com/bank.phtml
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/419911/Bank%20Interest%20Collector.user.js
// @updateURL https://update.greasyfork.org/scripts/419911/Bank%20Interest%20Collector.meta.js
// ==/UserScript==

var collect = document.querySelectorAll("input[value='Collect Interest']");

if (collect.length > 0) {
    collect[0].click();
}