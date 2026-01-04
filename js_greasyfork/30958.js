// ==UserScript==
// @name           Forbes - Skip Welcome Screen
// @namespace      https://greasyfork.org/en/users/136288-benjamin-landry
// @description    Skips the welcome screen; The one with the "Thought of the Day" and the full page ad. Pretty much simulates clicking the link, "Skip this welcome screen", as soon as the welcome screen loads.
// @author         KillerBadger, updated by benjamin238
// @version        1.0 : 27-Jun-2017
// @include        https://www.forbes.com/forbes/welcome/*
// @downloadURL https://update.greasyfork.org/scripts/30958/Forbes%20-%20Skip%20Welcome%20Screen.user.js
// @updateURL https://update.greasyfork.org/scripts/30958/Forbes%20-%20Skip%20Welcome%20Screen.meta.js
// ==/UserScript==
/*

History
-------------
1.0  : 27-Jun-2017 Changed http:// to https:// for new forbes welcome page.
0.05 : 15-Sep-2016 Updated to new redirect page.
0.04 : 05-Oct-2015 Added setTimeout to click, in case the script runs too early.
0.03 : 12-Oct-2014 Changed script to work
0.02 : 24-Sep-2008 Added @namespace
0.01 : 03-Jul-2008 Initial release
============

Known Issues
-------------
Fanboy's Enhanced Tracking List breaks the Forbes welcome page.
Users of that list should add the following exceptionrule (ABP Options > Add your own filters):
@@||images.forbes.com/scripts/omniture/*
============
*/
url = document.URL;
newURL = extractURL(url,"toURL=","&refURL");
redirect(newURL);

function redirect(nLoc) {
    document.title = 'Redirecting...';
    window.location.replace(nLoc);
}
function extractURL(rawElement, startString, endString) {
    b = String(rawElement);
    newLoc = b.substring(b.indexOf(startString)+startString.length,b.indexOf(endString));
    return newLoc;
}