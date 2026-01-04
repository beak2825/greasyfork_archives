// ==UserScript==
// @name           KvRaudio.com hide foes' quotes
// @namespace      https://www.kvraudio.com/forum/
// @description    This removes foes' comments quoted in posts by other members at the KvRaudio forum.
// @include        https://www.kvraudio.com/forum/viewtopic.php*
// @include        https://www.kvraudio.com/forum/search.php*
// @version        0.666
// @grant          none
// @downloadURL https://update.greasyfork.org/scripts/432925/KvRaudiocom%20hide%20foes%27%20quotes.user.js
// @updateURL https://update.greasyfork.org/scripts/432925/KvRaudiocom%20hide%20foes%27%20quotes.meta.js
// ==/UserScript==


// ============= foes list ===========================================
let foes =  [ "*", '*', '*', "*", "*" ] ;
// ===================================================================

//       Edit the above, replace asterisks with user names on your foes list (note: case sensitive!)
//       e.g. [ "*", '*', '*', "*", "*" ] -> [ "muted guy", "Right Bastard", "sOmetr0ll", "*", "*" ] 

//       Add more if necessary.











// find all quotes
let allQuotes, thisQuote, quotee;
allQuotes = document.getElementsByTagName('cite');

// check for foes' quotes
for (let i = allQuotes.length-1; i>=0; i--) { // reverse order to prevent script from crashing on nested quotes
    thisQuote = allQuotes[i];
    // find quote author
    quotee = thisQuote.firstChild.innerHTML;
    if (typeof(quotee) != "string") { // old forum style
        quotee = thisQuote.innerHTML.slice(0, -7);
    }
    // if author is a foe, ditch the quote
    if (foes.indexOf(quotee) != -1) {
        thisQuote.parentNode.innerHTML = "&#160; <b>"+quotee+"</b> wrote something but is on your ignore list.";
    }
}