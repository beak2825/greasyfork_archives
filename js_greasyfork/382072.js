// ==UserScript==
// @name         Connection script
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Private server connection script
// @author       irondoom45
// @match        https://agar.io/index.html
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/382072/Connection%20script.user.js
// @updateURL https://update.greasyfork.org/scripts/382072/Connection%20script.meta.js
// ==/UserScript==

$(document).ready(function() { 

setTimeout(function() {

core.disableIntegrityChecks(true); core.connect("ws://10.0.0.152:1599");  // You can modify server for your own server I.E 127.0.0.0:443

}, 45000); //45 Seconds will elapse and it will connect you!

});

