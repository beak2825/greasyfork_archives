// ==UserScript==
// @name         xHamster External Link Warning Skipper
// @namespace    https://greasyfork.org/en/scripts/375155-xhamster-external-link-warning-skipper
// @version      1.0.0
// @description  Skip the nagging warning about leaving xHamster
// @author       Phlegomatic
// @match        https://xhamster.com/*
// @include      https://*.xhamster.com/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/375155/xHamster%20External%20Link%20Warning%20Skipper.user.js
// @updateURL https://update.greasyfork.org/scripts/375155/xHamster%20External%20Link%20Warning%20Skipper.meta.js
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