// ==UserScript==
// @name        JAL menu search fix 
// @namespace   Violentmonkey Scripts
// @match       *://*.jal.co.jp/*
// @require     http://ajax.googleapis.com/ajax/libs/jquery/2.1.0/jquery.min.js
// @require     https://greasyfork.org/scripts/5392-waitforkeyelements/code/WaitForKeyElements.js?version=115012
// @grant       GM_addStyle
// @version     1.0
// @author      lokisnake
// @description 1/13/2020, 3:29:22 PM
// @downloadURL https://update.greasyfork.org/scripts/395117/JAL%20menu%20search%20fix.user.js
// @updateURL https://update.greasyfork.org/scripts/395117/JAL%20menu%20search%20fix.meta.js
// ==/UserScript==

waitForKeyElements (".wcag2_disNon", removeClass);

function removeClass (jNode) {
    jNode.removeClass ("wcag2_disNon");
}
