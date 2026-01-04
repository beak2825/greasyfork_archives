// ==UserScript==
// @name     Zelda Name Shortener for Twitch
// @version      1.0
// @author       platypusq
// @match        https://www.twitch.tv/*
// @namespace    http://tampermonkey.net/
// @require  http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js
// @require  https://greasyfork.org/scripts/5392-waitforkeyelements/code/WaitForKeyElements.js?version=115012
// @run-at   document-start
// @description Removes the leading "The Legend of Zelda:" for games on the twitch followed channels sidebar.
// @downloadURL https://update.greasyfork.org/scripts/411306/Zelda%20Name%20Shortener%20for%20Twitch.user.js
// @updateURL https://update.greasyfork.org/scripts/411306/Zelda%20Name%20Shortener%20for%20Twitch.meta.js
// ==/UserScript==

/* globals jQuery, $, waitForKeyElements */
function addCustomSearchResult (jNode) {
    var oldtitle=jNode.text();
    var newtitle=oldtitle.substring(21);
    var beginning=oldtitle.substring(0,20);
    var oldcode='<p class="tw-c-text-alt-2 tw-ellipsis tw-font-size-6 tw-line-height-heading" title="The Legend of Zelda: Ocarina of Time">The Legend of Zelda: Ocarina of Time</p>';
    var newcode='<p class="tw-c-text-alt-2 tw-ellipsis tw-font-size-6 tw-line-height-heading" title="'+ newtitle +'">'+ newtitle + '</p>';
    if(beginning=="The Legend of Zelda:"){
        jNode.replaceWith( newcode )
       }
    return true;
}

waitForKeyElements ("div.side-nav-card__metadata p", addCustomSearchResult);