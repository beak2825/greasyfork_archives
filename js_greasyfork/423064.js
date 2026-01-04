// ==UserScript==
// @name         One-click to remove a verbose site from Google Search results.
// @version      1.0
// @description  Adds a link to Google Search, to re-run the search with a domain removed. Preset for en.wikipedia.org, but this can easily be changed.
// @author       dhaden, based on a GitHub script by Ryan Buening, who based it on a Reddit blocking script.
// @include      http*://www.google.*/search*
// @include      http*://google.*/search*
// @run-at       document-end
// @namespace https://greasyfork.org/users/186630
// @downloadURL https://update.greasyfork.org/scripts/423064/One-click%20to%20remove%20a%20verbose%20site%20from%20Google%20Search%20results.user.js
// @updateURL https://update.greasyfork.org/scripts/423064/One-click%20to%20remove%20a%20verbose%20site%20from%20Google%20Search%20results.meta.js
// ==/UserScript==

// Change this to false if you do not want to add the link just to the right of Google's 'Tools' label.
const appendRight = true;

// There are two user USER VARIABLEs you can change below. The site URL and the text label.

// Set up the regex
const queryRegex = /q=[^&]+/g;
const siteRegex = /\+site(?:%3A|\:).+\.[^&+]+/g;
// ** USER VARIABLE - Change the URL after www. to the one you regularly want to remove from results.
// e.g. www.ncbi.nlm.nih.gov - remember to include the www. or equivalant, but not the http:// bit!
// The %3A bit means : in Google-speak.
const url = "+-site%3Aen.wikipedia.org";

(function() {
    // Creating the element
    var el = document.createElement('div');
    el.className = 'hdtb-mitem';
    var link = document.createElement('a');

    // Hyperlink and label, to add the knockout '-site:en.wikipedia.org' to the query.
    // ** USER VARIABLE - Change 'Remove' to change the wording of the new link label that appears on Google Search.
    link.appendChild(document.createTextNode('Remove'));
    link.href = window.location.href.replace(queryRegex, (match) => {
        // Replaces the existing 'site' flags
        return match.search(siteRegex) >= 0 ? match.replace(siteRegex, url) : match + url;
    });
    el.appendChild(link);

    // Inserting the element into Google search
    if (appendRight) {
        var toolsBtn = document.getElementById('hdtb-tls');
        toolsBtn.parentNode.insertBefore(el, toolsBtn.nextSibling);
    } else {
        var button = document.getElementById('hdtb-msb-vis');
        button.appendChild(el);
    }
})();