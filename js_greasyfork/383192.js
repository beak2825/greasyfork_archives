// ==UserScript==
// @name Crunchyroll adblock fix
// @description Lets you watch anime on crunchyroll without disabling your ad blocker
// @match https://*.crunchyroll.com/*
// @version 0.0.1.20190517214335
// @namespace https://greasyfork.org/users/302753
// @downloadURL https://update.greasyfork.org/scripts/383192/Crunchyroll%20adblock%20fix.user.js
// @updateURL https://update.greasyfork.org/scripts/383192/Crunchyroll%20adblock%20fix.meta.js
// ==/UserScript==

window.onload = function() {
    var clonedDetail = cloneInto({ segment_anonymous_id: 'nope' }, document.defaultView);
    var noTrackingAllowed = new CustomEvent('SEGMENT_IDENTIFY_EXECUTED', { detail: clonedDetail });
    document.dispatchEvent(noTrackingAllowed);
}