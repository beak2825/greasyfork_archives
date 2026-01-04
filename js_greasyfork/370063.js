// ==UserScript==
// @name         [Obsolete] xHamster Auto Old Design
// @namespace    https://greasyfork.org/en/scripts/370063-xhamster-auto-old-design
// @version      1.0.3
// @description  Reverts to Old Xhamster Design and keeps it that way
// @author       Phlegomatic
// @match        https://xhamster.com/*
// @include      https://*.xhamster.com/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/370063/%5BObsolete%5D%20xHamster%20Auto%20Old%20Design.user.js
// @updateURL https://update.greasyfork.org/scripts/370063/%5BObsolete%5D%20xHamster%20Auto%20Old%20Design.meta.js
// ==/UserScript==

var currentLocation = window.location;
var xOld = "x_odvkey";
var xNew = "x_ndvkey";

checkCookie(xNew);

function checkCookie(cname) {
    var c = document.cookie.match(new RegExp('(^| )' + cname + '=([^;]+)'));
    if (c) {
        // Running New Version.
        xSwitch();
    } else {
        // Running Old Version.
        setCookie(xOld,getCookie(xOld),5*365); // Set the cookie to not expire untill 5 years from now
    }
}

function getCookie(cname) {
    var c = document.cookie.match(new RegExp('(^| )' + cname + '=([^;]+)'));
    if (c) return c[2];
}

function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    var expires = "expires="+d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";domain=.xhamster.com;path=/";
}

function xSwitch() {
    // Switch Version
    window.location = "https://xhamster.com/switch";
    setTimeout(function(){window.location = currentLocation}, 500);
}





