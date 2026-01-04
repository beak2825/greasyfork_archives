// ==UserScript==
// @name         Connection script
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  Private server connection script
// @author       irondoom45
// @match        https://agar.io/index.html
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/382075/Connection%20script.user.js
// @updateURL https://update.greasyfork.org/scripts/382075/Connection%20script.meta.js
// ==/UserScript==

$(document).ready(function() { 

setTimeout(function() {

core.disableIntegrityChecks(true); core.connect("ws://76.23.136.210:1599");  // You can modify server for your own server I.E 127.0.0.0:443

}, 30000); //30 Seconds will elapse and it will connect you!

});

