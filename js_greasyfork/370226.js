// ==UserScript==
// @name         Creative Cow Skipper
// @namespace    https://greasyfork.org/en/scripts/370226-creative-cow-skipper
// @version      0.0.3
// @description  Skip the sponsored message nag screen
// @author       Phlegomatic
// @match        https://*.creativecow.net/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/370226/Creative%20Cow%20Skipper.user.js
// @updateURL https://update.greasyfork.org/scripts/370226/Creative%20Cow%20Skipper.meta.js
// ==/UserScript==

var Catch = "?url="; // Look for this
var cURL = window.location.href;

if(cURL.includes(Catch)){
    var Parts = cURL.split(Catch, 2);
    var RAW = Parts[1];
    var URL = RAW.replace("%3A", ":");
    for (var i = 0; i < 8; i++) {
        URL = URL.replace("%2F", "/");
        URL = URL.replace("%3F", "?");
        URL = URL.replace("%3D", "=");
        URL = URL.replace("%26", "&");
    }
    window.location.href = URL;
}

