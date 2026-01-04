// ==UserScript==
// @name         Youtube not loading comments Fix.
// @version      1.1
// @description  Fixes the issue where comments wouldn't load after blocking the cookies from "consent.youtube.com".
// @author       Nick
// @match        *://www.youtube.com/*
// @run-at       document-start
// @namespace https://greasyfork.org/users/755612
// @downloadURL https://update.greasyfork.org/scripts/424579/Youtube%20not%20loading%20comments%20Fix.user.js
// @updateURL https://update.greasyfork.org/scripts/424579/Youtube%20not%20loading%20comments%20Fix.meta.js
// ==/UserScript==

javascript:void(document.cookie="CONSENT=YES+");

window.onload = function() {
    if(!window.location.hash) {
        window.location = window.location + '#comments';
        window.location.reload();
    }
}
// Do not delete because sometimes the first line gets skipped for whatever reason.
javascript:void(document.cookie="CONSENT=YES+");