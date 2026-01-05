// ==UserScript==
// @name        CH Turkopticon Blocklist Indicator
// @author      clickhappier
// @namespace   clickhappier
// @description If you paste in your HIT Scraper blocklist and includelist inside this script's code, you can see on the TO site if an MTurk requester's name is already on your blocklist or includelist.
// @version     1.0.1c
// @include     http://turkopticon.ucsd.edu/*
// @include     https://turkopticon.ucsd.edu/*
// @require     http://code.jquery.com/jquery-latest.min.js
// @grant       GM_log
// @downloadURL https://update.greasyfork.org/scripts/12796/CH%20Turkopticon%20Blocklist%20Indicator.user.js
// @updateURL https://update.greasyfork.org/scripts/12796/CH%20Turkopticon%20Blocklist%20Indicator.meta.js
// ==/UserScript==


// Paste the contents of your HIT Scraper blocklist onto the line below, between the quotes ("). You must manually re-paste it when you want to update this script's awareness of it. A script running on a different domain like this can't access where the original HIT Scraper data is saved.
var yourBlocklistHere = "";

// Likewise, paste the contents of your HIT Scraper includelist onto the line below, between the quotes (").
var yourIncludelistHere = "";

// State the date you last pasted in your updated HIT Scraper blocklist and includelist here, for reference in the indicators' text:
var lastUpdated = "";


var ignore_list = yourBlocklistHere.split('^');
var include_list = yourIncludelistHere.split('^');

// check ignore list for requester name and HIT title (wildcard support from feihtality)
function ignore_check(r,t){
    var tempList = ignore_list.map(function(item) { return item.toLowerCase().replace(/\s+/g," "); });
    var foundR = -1;
    var foundT = -1;
    var blockWilds = [], blockExact = [];
    blockExact = tempList.filter(function(item) { // separate glob patterns from literal strings
        if (item.search(".*?[*].*")) return true; else if (item.length > 1) {blockWilds.push(item); return false;} 
    });
    // run default matching first
    foundR = blockExact.indexOf(r.toLowerCase().replace(/\s+/g," "));
    foundT = blockExact.indexOf(t.toLowerCase().replace(/\s+/g," "));
    // if no match, try globs
    if (foundR == -1 && foundT == -1) {
        for (var i=0; i<blockWilds.length; i++) {
            blockWilds[i] = blockWilds[i].replace(/([+${}[\](\)^|?.\\])/g, "\\$1"); // escape special characters
            blockWilds[i] = "^".concat(blockWilds[i].replace(/([^*]|^)[*](?!\*)/g, "$1.*").replace(/\*{2,}/g, function(s) { return s.replace(/\*/g, "\\*"); })).concat("$"); //set up wildcards and escape consecutive asterisks
            foundR = r.toLowerCase().replace(/\s+/g," ").search(blockWilds[i]);
            foundT = t.toLowerCase().replace(/\s+/g," ").search(blockWilds[i]);
            if (foundR != -1 || foundT != -1)
                 break;
        }
    }
    var found = foundR == -1 && foundT == -1;
    return found;  // returns false (making !(ignore_check(x,y)) true) if HIT should be blocked, returns true if it shouldn't be blocked
}

// check include list for requester name and HIT title
function include_check(r,t)
{
    var tempList = include_list.map(function(item) { return item.toLowerCase().replace(/\s+/g," "); });
    var foundR = -1;
    var foundT = -1;
    foundR = tempList.indexOf(r.toLowerCase().replace(/\s+/g," "));
    foundT = tempList.indexOf(t.toLowerCase().replace(/\s+/g," "));
    var found = foundR == -1 && foundT == -1;
    return found;  // returns false (making !(include_check(x,y)) true) if HIT should be highlighted, returns true if it shouldn't be highlighted
}


// display indicators for blocklisted and includelisted requesters
$('div.strong a[href^="/reports?id="]').each(function()
{
    var requesterBlocklistedNote_title = "Be aware that in some cases depending on how a review was submitted, the earliest name used by a requester may be displayed on the review instead of their most recent name, so make sure you have the older versions on your blocklist too; and in some cases a requester name that contains ampersands (&), apostrophes (\'), or accented characters will be misinterpreted by TO and thus not be able to match your blocklist unless you add the messed-up version to it too.";
    var requesterBlocklistedNote_text = "This requester name is on your blocklist";
    var requesterIncludelistedNote_title = "Be aware that in some cases depending on how a review was submitted, the earliest name used by a requester may be displayed on the review instead of their most recent name, so make sure you have the older versions on your includelist too; and in some cases a requester name that contains ampersands (&), apostrophes (\'), or accented characters will be misinterpreted by TO and thus not be able to match your includelist unless you add the messed-up version to it too.";
    var requesterIncludelistedNote_text = "This requester name is on your includelist";
    if (lastUpdated != "")
    {
        requesterBlocklistedNote_text += " as of " + lastUpdated;
        requesterIncludelistedNote_text += " as of " + lastUpdated;
    }
    
    var requester_name = $(this).text().trim();
    if (!ignore_check(requester_name,"zyxabcdplaceholder"))
    {
        $(this).parent().parent().append('<br><br><span class="requesterBlocklistedNote" title="' + requesterBlocklistedNote_title + '"><b>' + requesterBlocklistedNote_text + '</b></span>');
    }
    else if (!include_check(requester_name,"zyxabcdplaceholder"))
    {
        $(this).parent().parent().append('<br><br><span class="requesterIncludelistedNote" title="' + requesterIncludelistedNote_title + '"><i>' + requesterIncludelistedNote_text + '</i></span>');
    }
});
