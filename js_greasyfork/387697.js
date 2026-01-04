// ==UserScript==
// @name         Old Twitter Layout
// @namespace    https://twitter.com/
// @version      0.1
// @description  Bring back the old Twitter Layout
// @author       Wolvan
// @match        https://twitter.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/387697/Old%20Twitter%20Layout.user.js
// @updateURL https://update.greasyfork.org/scripts/387697/Old%20Twitter%20Layout.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function getCookie(name) {
        var value = "; " + document.cookie;
        var parts = value.split("; " + name + "=");
        if (parts.length == 2) return parts.pop().split(";").shift();
    }

    if (navigator.userAgent !== "Mozilla/5.0 (Windows NT 6.3; Trident/7.0; rv:11.0) like Gecko") return alert("Please set your UserAgent to\nMozilla/5.0 (Windows NT 6.3; Trident/7.0; rv:11.0) like Gecko\nbefore using this script");

    if (getCookie("rweb_optin") !== "off") {
        console.log("Detected bad rweb_optin cookie");
        document.cookie = "rweb_optin=off;secure;domain=twitter.com; path=/";
        location.reload(true);
    }
})();