// ==UserScript==
// @name         Prefer AMP CDN versions of pages (less ads, better adblock)
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  The AMP versions usually have less ads and are often better to use. You can use "back" to get the regular version - this script will not activate on "back" navigation.
// @author       Ray Castro
// @match        http://*/*
// @match        https://*/*
// @exclude      https://rdrr.io/*
// @exclude      https://*.reddit.com/*
// @grant        none
// @run-at       document-body
// @downloadURL https://update.greasyfork.org/scripts/389924/Prefer%20AMP%20CDN%20versions%20of%20pages%20%28less%20ads%2C%20better%20adblock%29.user.js
// @updateURL https://update.greasyfork.org/scripts/389924/Prefer%20AMP%20CDN%20versions%20of%20pages%20%28less%20ads%2C%20better%20adblock%29.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // Don't use this if the user used the "back" button, maybe it did not work.
    if (window.performance && window.performance.navigation.type == window.performance.navigation.TYPE_BACK_FORWARD) return;
    // Avoid cycles:
    if (!window.location || window.location.hostname.indexOf("ampproject.org") >= 0) return;
    if (document.referrer && document.referrer.indexOf("amproject.org") >= 0) return;
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
    } else if (burl.startsWith("http://")) {
        window.location = "https://cdn.ampproject.org/c/" + burl.substring(7);
    } else console.log("Neither http nor https?", burl);
})();
