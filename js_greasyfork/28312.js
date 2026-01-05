// ==UserScript==
// @name        Youtube Material Beta
// @version     1.0.0
// @description Enable the beta Material Design for YouTube.
// @match       http://*.youtube.com/*
// @match       https://*.youtube.com/*
// @grant       none
// @run-at      document-start
// @namespace   https://greasyfork.org/en/scripts/28312-youtube-material-beta
// @downloadURL https://update.greasyfork.org/scripts/28312/Youtube%20Material%20Beta.user.js
// @updateURL https://update.greasyfork.org/scripts/28312/Youtube%20Material%20Beta.meta.js
// ==/UserScript==

var loaded = function() {
    document.cookie="PREF=f6=7;path=/;domain=.youtube.com";
};