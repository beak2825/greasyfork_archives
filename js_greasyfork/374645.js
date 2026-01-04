// ==UserScript==
// @name         Listia Multi-Listing Edit Screen Opener
// @namespace    http://tampermonkey.net/
// @version      0.1.1.2
// @description  To open all your Listia listings in edit mode at once, add your profile name somewhere in your title or listing description, then do a search for that name. Ordering the listings by highest price and running this script, first substituting your Listia name for 'myprofilename' in the '//@match' line below, will open your listings in edit mode. The script Listia Mass Price Updater, http://bit.ly/2A9y3Oo, can be used in conjunction to quickly update prices by the same percentage for all listings.
// @author       Paul D Pruitt
// @match        https://www.listia.com/search?q=myprofilename&location_id=111&sort=highprice
// @downloadURL https://update.greasyfork.org/scripts/374645/Listia%20Multi-Listing%20Edit%20Screen%20Opener.user.js
// @updateURL https://update.greasyfork.org/scripts/374645/Listia%20Multi-Listing%20Edit%20Screen%20Opener.meta.js
// ==/UserScript==

(function OpenHrefsInNewWindow() {
    'use strict';
var linksToOpen = document.getElementsByClassName("title");
for (var J = 5, numLinks = linksToOpen.length; J < numLinks; ++J) {
    var currentLink = "\"" + linksToOpen[J].href + "\"";
    var linksToOpenStringEnd = currentLink.substring(31,40);
    var editAddedToLink = "http://www.listia.com/auction/edit/" + linksToOpenStringEnd;
    window.open(editAddedToLink);
}}
)();