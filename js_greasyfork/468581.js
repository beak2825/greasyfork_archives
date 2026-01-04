// ==UserScript==
// @name         Ebay - Set item location to home country
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Set ebay location to home country (based on https://forums.overclockers.co.uk/threads/greasemonkey-ebay-uk-only-script.18632813/)
// @author       Me
// @icon         https://www.google.com/s2/favicons?sz=64&domain=ebay.co.uk
// @grant        none
// @license MIT

// @match        https://www.ebay.co.uk/sch/*
// @match        https://www.ebay.com/sch/*
// @match        https://www.ebay.fr/sch/*
// @match        https://www.ebay.de/sch/*
// @downloadURL https://update.greasyfork.org/scripts/468581/Ebay%20-%20Set%20item%20location%20to%20home%20country.user.js
// @updateURL https://update.greasyfork.org/scripts/468581/Ebay%20-%20Set%20item%20location%20to%20home%20country.meta.js
// ==/UserScript==

var url = window.location.href;
if (url.indexOf("LH_PrefLoc=") == -1) {
    window.location.href = (url.indexOf("?") == -1) ? url + "?LH_PrefLoc=1" : url + "&LH_PrefLoc=1";
}
