// ==UserScript==
// @name       Google Maps Force Lite
// @version    0.1
// @description  Google Maps Lite Mode on modern Browser, regardless of GPU and Browser
// @match      http://maps.google.com/*
// @match      https://maps.google.com/*
// @match      http://www.google.com/maps*
// @match      https://www.google.com/maps*
// @match      http://maps.google.de/*
// @match      https://maps.google.de/*
// @match      http://www.google.de/maps*
// @match      https://www.google.de/maps*
// @match      http://maps.google.at/*
// @match      https://maps.google.at/*
// @match      http://www.google.at/maps*
// @match      https://www.google.at/maps*
// @copyright  2016, FloKra
// @run-at     document-end
// @namespace https://greasyfork.org/users/50062
// @downloadURL https://update.greasyfork.org/scripts/20777/Google%20Maps%20Force%20Lite.user.js
// @updateURL https://update.greasyfork.org/scripts/20777/Google%20Maps%20Force%20Lite.meta.js
// ==/UserScript==

if(typeof mapslite != "undefined")
{
    console.log("Google Maps Force Lite - mapslite object is set, so we are in lite mode already");
    return;
}
else
{
    var confirmlitemode = false;
    console.log("Google Maps Force Lite - mapslite object is NOT set - asking user what to do...");
    confirmlitemode = confirm("Google Maps Force Lite Userscript is active!\n\nReload Google Maps in Lite mode?\n\nNote: to remove this dialog you have to delete or disable the UserScript! ");
    if(confirmlitemode)
    {
        console.log("Google Maps Force Lite - user clicked OK - reloading page with ?force=lite");
        if(window.location.href.indexOf("?") > -1) window.location.href = window.location.href + "&force=lite"; // '?' already in base URL
        else window.location.href = window.location.href + "?force=lite"; // no '?' in base URL
    }
    else {
        console.log("Google Maps Force Lite - user clicked cancel - resume...");
        return;
    }
}
