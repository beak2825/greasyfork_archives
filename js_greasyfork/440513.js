// ==UserScript==
// @name        AO3: [Wrangling] Wrangled Tags Banner Links
// @description Turns tag list in the wrangled tags banner into links to tag edit pages.
// @version     0.2

// @author      endofthyme
// @namespace   http://tampermonkey.net/
// @license     GPL-3.0 <https://www.gnu.org/licenses/gpl.html>

// @match       *://*.archiveofourown.org/tags/*/wrangle?*
// @require     https://ajax.googleapis.com/ajax/libs/jquery/1.9.0/jquery.min.js
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/440513/AO3%3A%20%5BWrangling%5D%20Wrangled%20Tags%20Banner%20Links.user.js
// @updateURL https://update.greasyfork.org/scripts/440513/AO3%3A%20%5BWrangling%5D%20Wrangled%20Tags%20Banner%20Links.meta.js
// ==/UserScript==

var LIST_OF_COLON_FANDOMS = [
    "The Adventures of Jimmy Neutron: Boy Genius",
    "Sekiro: Shadows Die Twice (Video Game)",
];

var fields = document.getElementsByClassName("flash notice");
if (fields.length > 0) {
    var originalText = fields[0].innerHTML;
    var removePrefix = originalText.match(/^The following tags were successfully wrangled to (?<postfix>.*)/).groups.postfix;
    var splitOnComma = removePrefix.split(", ");

    // First pass on filtering out colon-containing fandoms
    var removeColonFandoms = splitOnComma.filter(function(value){
        return !LIST_OF_COLON_FANDOMS.includes(value);
    });

    // Find index of element in removeColonFandoms that contains a colon-containing fandom that is last
    // in the fandom list, if that element exists. Record the fandom and a replacement element sans colon.
    var problemIndex = 0;
    var removedFandom = "";
    var fixedText = "";
    for (const element of removeColonFandoms) {
        for (const colonFandom of LIST_OF_COLON_FANDOMS) {
            if (element.startsWith(colonFandom)) {
                fixedText = "*randomText*" + element.slice(colonFandom.length);
                removedFandom = element.slice(0, colonFandom.length);
                break;
            }
        }
        if (fixedText != "") {
            break;
        }
        problemIndex += 1;
    }
    if (fixedText != "") {
        removeColonFandoms = removeColonFandoms.map(function(value, index){
            if (index == problemIndex) {
                return fixedText;
            }
            return value;
        });
    }

    // With new list of fandoms sans colons, drop everything that comes before the first colon,
    // to get the list of tags.
    var mergeSplit = removeColonFandoms.join(", ");
    var splitOnColon = mergeSplit.split(": ");
    var allTags = splitOnColon.slice(1).join(": ").split(", ");

    // Reconstruct the banner text.
    var outputText = "";
    var lastFandom = splitOnColon[0];
    if (lastFandom == "*randomText*") {
        lastFandom = removedFandom;
    }
    var prefixMatch = "The following tags were successfully wrangled to " + lastFandom + ": ";
    if (originalText.startsWith(prefixMatch)) {
        outputText = prefixMatch;
    } else {
        outputText = originalText.split(", " + lastFandom + ": ")[0] + ", " + lastFandom + ": ";
    }

    // Create and add the link list.
    var allTagsWithLinks = allTags.map(function(tagName){
        var tagNameAO3 = tagName.replace(/\//g, "*s*").replace(/\./g, "*d*").replace(/\?/g, "*q*").replace(/#/g, "*h*").replace(/"/g, '&quot;');
        return "<a href=\"https://archiveofourown.org/tags/" + tagNameAO3 + "/edit\">" + tagName + "</a>";
    });
    outputText += allTagsWithLinks.join(", ");
    fields[0].innerHTML = outputText;
}