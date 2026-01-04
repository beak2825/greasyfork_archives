// ==UserScript==
// @name         XLR Search via URL (for SimpleSelectSearch)
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  This allows you to search for a CID using the URL by appending "circuitID=" and your CID to the common URL. Tailored to be used in conjunction with SimpleSelectSearch. URL for SimpleSelectSearch is "http://xlr.zayo.com/CircuitInfo/CircuitLayoutRecord.aspx?circuitID=%s"
// @author       Lucas Labounty
// @match        http://xlr.zayo.com/CircuitInfo/CircuitLayoutRecord.aspx*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/395094/XLR%20Search%20via%20URL%20%28for%20SimpleSelectSearch%29.user.js
// @updateURL https://update.greasyfork.org/scripts/395094/XLR%20Search%20via%20URL%20%28for%20SimpleSelectSearch%29.meta.js
// ==/UserScript==
//https://greasyfork.org/en/scripts/395094-xlr-search-via-url-for-simpleselectsearch
(function() {
    'use strict';
    //A straightforward approach would be to detect the URL, extract the CID, past that into the search box, and Refresh XLR
    //This, however, forces a page reload with the exact same URL. This causes the page to "load" the CID every time the page finishes loading
    //Instead, we detect if the search box is already empty (like if we opened the page for the first time), and then, and only then, do we load the XLR


    var pageURL = window.location.href; //grab the browser's URL, which /should/ include our CID at the end
    var circuitStart = pageURL.indexOf("circuitID=") + 10; //figure out where our CID starts

    if (circuitStart < 49){ //this is more "idiot light" logic than it is real checking to see if we actually have a CID in that variable
    } else if (document.getElementById("txtCircuitID").value == ""){ //check to see if the search bar is empty. If it's not, then the page has already loaded the contents of the XLR the user requested
        var dirtyCID = pageURL.slice(circuitStart, pageURL.length); //extract the CID from the browser's URL, +'s and %'s included
        var cleanCID = decodeURIComponent(dirtyCID); //get rid of all of those pesky %20s and other URL encoded characters to human-readable form
        cleanCID = cleanCID.replace(/\+/g, ""); //get rid of all of the + signs put there by SimpleSelectSearch, should it be used

        document.getElementById("txtCircuitID").value = cleanCID; //put the CID in the search box by referencing the internal identifyer
        document.getElementById("btnFindCircuitDesignID").click(); //emulate clicking the search ("Refresh XLR") button
    }

})();