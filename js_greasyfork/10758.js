// ==UserScript==
// @name         Agar.io Guillaume connector.
// @namespace    guiconn
// @version      0.1
// @description  Connect to my private server
// @author       Guillaume LE MARTRET
// @match        http://agar.io/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/10758/Agario%20Guillaume%20connector.user.js
// @updateURL https://update.greasyfork.org/scripts/10758/Agario%20Guillaume%20connector.meta.js
// ==/UserScript==

$(document).ready(function() {
       $("<div class=\"form-group\"><button type=\"button\" id=\"connectBtn\" class=\"btn btn-warning btn-needs-server\" onclick=\"connect('ws://devbeta.ddns.net:443');\" style=\"width: 100%\">Connect</button></div>").insertAfter($("#playBtn").parent());
});