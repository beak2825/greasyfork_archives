// ==UserScript==
// @name         AO3: Remove Tag CSS Comma Nonsense
// @namespace    http://tampermonkey.net/
// @version      2024-01-05
// @description  Replace CSS commas with real separators
// @author       Chris S.
// @match        https://archiveofourown.org/tag_sets/*
// @icon         https://icons.duckduckgo.com/ip2/archiveofourown.org.ico
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/483917/AO3%3A%20Remove%20Tag%20CSS%20Comma%20Nonsense.user.js
// @updateURL https://update.greasyfork.org/scripts/483917/AO3%3A%20Remove%20Tag%20CSS%20Comma%20Nonsense.meta.js
// ==/UserScript==

setTimeout(function() {
    // Display the warning tags.
    var warning = document.getElementById("list_for_ArchiveWarning");
    warning.setAttribute("style", "display: block;");
    // Parse each of the list items, save the last one.
    var items = warning.getElementsByTagName("li");
    for (var y = 0; y < items.length - 1; y++) {
        // Keep this at something other than a comma so that you know it's working
        items[y].appendChild(document.createTextNode(";"));
    }
    // Remove the "commas" class
    var temp = warning.getAttribute("class");
    var pmet = temp.replace("commas", "");
    warning.setAttribute("class", pmet);
}, 2000);
