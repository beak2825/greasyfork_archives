// ==UserScript==
// @name         tvnow CleanCouchparty
// @namespace    https://tribbe.de
// @version      1.0.4
// @description  Deletes the memberlist from couchparty in tvnow
// @author       Tribbe
// @match        https://www.tvnow.de/*
// @require      https://greasyfork.org/scripts/6250-waitforkeyelements/code/waitForKeyElements.js?version=23756
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1.2.6/jquery.js
// @downloadURL https://update.greasyfork.org/scripts/419862/tvnow%20CleanCouchparty.user.js
// @updateURL https://update.greasyfork.org/scripts/419862/tvnow%20CleanCouchparty.meta.js
// ==/UserScript==

// Remove participant-list and rescale the player
waitForKeyElements ("now-participant-list", function(jNode) {
    if(jNode.length == 1)
    {
        jNode[0].remove();
        var nowplayer = document.getElementsByTagName("now-player");
        if(nowplayer.length == 1) nowplayer[0].style.width = '100%';
    }
});