// ==UserScript==
// @name         BILD.de immer als AMP CDN version anschauen, ohne Werbung
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Die dumme BILD experimentiert mit Anti-Adblock. Die AMP-Cache-version geht bei mir aber dennoch.
// @author       Hein Blöd
// @match        http://www.bild.de/*
// @match        https://www.bild.de/*
// @grant        none
// @run-at       document-body
// @downloadURL https://update.greasyfork.org/scripts/389923/BILDde%20immer%20als%20AMP%20CDN%20version%20anschauen%2C%20ohne%20Werbung.user.js
// @updateURL https://update.greasyfork.org/scripts/389923/BILDde%20immer%20als%20AMP%20CDN%20version%20anschauen%2C%20ohne%20Werbung.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // Don't use this if the user used the "back" button, maybe it did not work.
    if (window.performance && window.performance.navigation.type == window.performance.navigation.TYPE_BACK_FORWARD) return;
    // Avoid cycles:
    if (!window.location || window.location.hostname.indexOf("ampproject.org") >= 0) return;
    // Find an AMP URL:
    var burl;
    var links = document.getElementsByTagName('link');
	for (var i=0; i<links.length; i++) {
        var link = links[i];
        if (link.getAttribute("rel") == "amphtml") {
            burl = link.getAttribute("href");
            break;
        }
    }
    if (!burl) {
        var root = document.documentElement;
        if (root.hasAttribute("amp") ||  root.hasAttribute("\u26A1")) burl = window.location;
    }
    if (!burl) return;
    if (burl.startsWith("https://")) {
        window.location = "https://cdn.ampproject.org/c/s/" + burl.substring(8);
    }
    else if (burl.startsWith("http://")) {
        window.location = "https://cdn.ampproject.org/c/" + burl.substring(7);
    } else {
        console.log("Neither http nor https?", burl);
    }
})();