// ==UserScript==
// @name         LDW wrapper.
// @namespace    http://www.ehu.es
// @version      0.2
// @description  Allows you to manually enter a server IP.
// @author       joniturrioz
// @match        http://agar.io/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/10095/LDW%20wrapper.user.js
// @updateURL https://update.greasyfork.org/scripts/10095/LDW%20wrapper.meta.js
// ==/UserScript==

$(document).ready(function() {
    var region = $("#region");
    if (region.length) {
        $("<div class=\"form-group\"><input id=\"serverInput\" class=\"form-control\" placeholder=\"255.255.255.255:443\" maxlength=\"20\"></input></div>").insertAfter("#helloDialog > form > div:nth-child(3)");
        $("<div class=\"form-group\"><button disabled type=\"button\" id=\"connectBtn\" class=\"btn btn-warning btn-needs-server\" onclick=\"connect('ws://' + $('#serverInput').val());\" style=\"width: 100%\">Connect</button></div>").insertAfter($("#serverInput").parent());
    }
});