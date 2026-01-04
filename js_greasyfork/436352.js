// ==UserScript==
// @name        Mangaupdates Hiatus/Discontinued/Axed/Dead Warning
// @namespace   476f64df6392be4940a610f1a484f18d
// @include     https://www.mangaupdates.com/series/*
// @include     http://www.mangaupdates.com/series/*
// @exclude     https://www.mangaupdates.com/series/advanced-searc*
// @exclude     http://www.mangaupdates.com/series/advanced-searc*
// @version     1.5
// @grant       none
// @description Adds a dark red warning to the titles of manga on their pages if they won't be finished or are on hiatus.
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/436352/Mangaupdates%20HiatusDiscontinuedAxedDead%20Warning.user.js
// @updateURL https://update.greasyfork.org/scripts/436352/Mangaupdates%20HiatusDiscontinuedAxedDead%20Warning.meta.js
// ==/UserScript==

var uniqueid="tampermonkey_hiatuswarning";

var searchNwarn = function() {
    var cell = document.getElementById("mu-main"); //Find main content structure, so as to avoid getting false positives from poll questions or other such things unrelated to the current series.

    // To avoid getting false positives from list names, we remove the dropdown for lists. We'll restore it after we're done searching.
    var dd = cell.getElementsByClassName("inbox")[0];
    var ddsib = dd.nextSibling;
    var ddpar = dd.parentElement;
    dd.remove();

    // Check if any of the dreaded words appear anywhere in the series information
    var uconf = cell.textContent.match(/(Hiatus|Discontinued|Axed|[dD]eath of author|author dead)(?! list)/);

    // If so, we have an unconfirmed match. Let's see if we can confirm it.
    if (null!==uconf)
    {
        // Let's go through the subheadings until we arrive at "Status in Country of Origin".
        // If the dreaded words appear there, we confirm the match.
        var cats = cell.getElementsByClassName("info-box_sCat__QFEaH");
        var conf = null;
        for (var i=0;i<cats.length;i++)
        {
            if (cats[i].textContent.match("Status in Country of Origin"))
            {
                conf = cats[i].nextElementSibling.textContent.match(/Hiatus|Discontinued|Axed|[dD]eath of author|author dead/);
                break; // either way, let's get out of this loop now that we've arrived at the desired subheading
            }
        }

        // Now we create the warning
        var span = document.createElement("span");
        span.style.color = "darkred";
        var warn;
        if (null!==conf) // if we have a confirmed match, display it
        {
            warn = document.createTextNode(" ("+conf[0]+")");
        }
        else // if the match is outside of "Status in Country of Origin", we can't be 100% sure it's not a false positive, so we'll add a question mark to the warning.
        {
            warn = document.createTextNode(" ("+uconf[0]+"?)");
        }
        span.appendChild(warn);
        span.className="releasestitle tabletitle";
        span.id=uniqueid;
        // Now that we've created the warning, we have to insert it after the series title
        var prev = document.getElementById(uniqueid);
        if (prev!==null) prev.remove();
        cell.getElementsByClassName("releasestitle")[0].parentNode.appendChild(span);
    }
    // And finally, we're going to restore the list dropdown we removed.
    ddpar.appendChild(dd);
};
searchNwarn();
// For some reason, MU reloads the title div after a while, maybe scripts that are supposed to add ads?
// Anyway, I'm dealing with it by re-running most of the script after 1 and 2 seconds, to be sure the warning doesn't get erased by that reload.
// If your device or Internet is still too slow for the warning to remain, increase those times (or maybe add a fourth time at say 4 seconds?).
var timeout1 = setTimeout(searchNwarn,1000);
var timeout2 = setTimeout(searchNwarn,2000);