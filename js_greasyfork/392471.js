// ==UserScript==
// @name         Marauder's Gap
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  refresh marauder's map
// @author       You
// @match        https://gsf-supplychain-iad.iad.proxy.amazon.com/inbound/marauders_map
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/392471/Marauder%27s%20Gap.user.js
// @updateURL https://update.greasyfork.org/scripts/392471/Marauder%27s%20Gap.meta.js
// ==/UserScript==

var myVar = setInterval(refresh, 600000);
function refresh() {

document.querySelector(('#refresh')).click();
}