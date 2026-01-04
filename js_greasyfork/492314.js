// ==UserScript==
// @name        epicgames.com Store Age Check Bypass
// @match       https://store.epicgames.com/*/p/*
// @match	https://store.epicgames.com/*/bundles/*
// @grant       none
// @version     0.0.2
// @icon        https://icons.duckduckgo.com/ip2/epicgames.com.ico
// @description Sets cookies to fake passed age check (1970-01-01)
// @license     Unlicense
// @run-at      document-start
// @namespace https://greasyfork.org/users/1257939
// @downloadURL https://update.greasyfork.org/scripts/492314/epicgamescom%20Store%20Age%20Check%20Bypass.user.js
// @updateURL https://update.greasyfork.org/scripts/492314/epicgamescom%20Store%20Age%20Check%20Bypass.meta.js
// ==/UserScript==

function getCookie(name) {
	// Source: https://stackoverflow.com/a/24103596
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for(var i=0;i < ca.length;i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1,c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
    }
    return null;
}

if (!getCookie("HasAcceptedAgeGates")) {
	document.cookie = "egs_age_gate_dob=1970-0-1; path=/";
	document.cookie = "HasAcceptedAgeGates=USK%3A18; path=/";
	document.location = document.location;
}