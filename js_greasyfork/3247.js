// ==UserScript==
// @name       Steam Linkfilter Redirector (/linkredirector/)
// @namespace  http://mrmcpowned.com/
// @version    0.4.1
// @description  Redirects links filtered by steam
// @match      https://steamcommunity.com/linkfilter/*
// @copyright  2014, Mr McPowned
// @license    http://creativecommons.org/licenses/by-nc-sa/3.0/
// @run-at     document-start
// @downloadURL https://update.greasyfork.org/scripts/3247/Steam%20Linkfilter%20Redirector%20%28linkredirector%29.user.js
// @updateURL https://update.greasyfork.org/scripts/3247/Steam%20Linkfilter%20Redirector%20%28linkredirector%29.meta.js
// ==/UserScript==

// TODO List
// - Solve problem with multi-parametered links not bypasssing extra parameters
// - [Further Inquiry] Links utilizing a hashbang, and different possible methods of it's existence in a URL 

// AUTHOR'S NOTES
// This would technically work as the best (and simplest) approach, but would require
// that the script run after the page loads the body, which isn't a 
// very pretty way of executing this type of script.
//
//  window.location = document.getElementById('proceedButton').href;


//JS to get a URL's params. http://stackoverflow.com/questions/901115/how-can-i-get-query-string-values-in-javascript
    getParameterByName = function(name) {
        name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
        var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
            results = regex.exec(location.search);
        return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
    }
    
    var filteredLink = getParameterByName('url');

// This segment used to be a half-assed approach at solving a problem that exists in
// in JS. MEGA's links use a hashbang (#!) for it's links to provide an id and access
// key for their files. JS tends to parse the hashbang as a specific hash, no matter
// where it finds it in the URL. Since in the case of steam's linkfilter, it isn't
// particularly a hash, but JS doesn't know that and places it under window.location.hash
// anyway.
//
//    if (filteredLink == "https://mega.co.nz/") {
//        var filteredLink = filteredLink + window.location.hash;
//    }

// I'm not sure if you'd call this a less half-assed approach or simply a full-assed
// approach at the problem, but instead of looking for MEGA links specifically, it instead
// looks for links which contain a hashbang, and append them to the base URL which the
// initial function found. Obviously, this is working on the assumption that links with a
// hashbang would be in a format which mirrors that of MEGA's (e.g. http[s]://[domain]/[Hashbang token])
// 
	if (!!window.location.hash) {
        var filteredLink = filteredLink + window.location.hash;
    }
    
    window.location = filteredLink;

// If you actually managed to read all of this, congrats! I hope to chronicle most of the
// edits I make to this, so look forward to some more reading. I also do some twitch/hitbox
// streaming from time to time, and I have a steam account too. You can add me to your 
// friends list or follow me on twitch if you'd like:
//
// Twitch: http://twitch.tv/MrMcPowned
// Hitbox: http://hitbox.tv/MrMcPowned
// Steam: http://steamcommunity.com/id/mrmc