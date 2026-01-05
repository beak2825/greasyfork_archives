// ==UserScript==
// @name         Steam Workshop collection into last_mods statement
// @namespace    https://greasyfork.org/en/users/3372-nixxquality
// @version      1.0.1
// @description  Displays a last_mods statement on Steam Workshop collection pages for easy synchronization of mod lists for multiplayer and stuff
// @author       nixx quality <nixx@is-fantabulo.us>
// @match        http://steamcommunity.com/sharedfiles/filedetails/?id=*
// @match        https://steamcommunity.com/sharedfiles/filedetails/?id=*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/24231/Steam%20Workshop%20collection%20into%20last_mods%20statement.user.js
// @updateURL https://update.greasyfork.org/scripts/24231/Steam%20Workshop%20collection%20into%20last_mods%20statement.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // First of all, is this an applicable Workshop page? The @match isn't enough
    // So, are we...
    // 1. A collection?
    // 2. In the Stellaris workshop? (maybe to be expanded)

    var navigation = document.getElementsByClassName("breadcrumbs")[0];
    if (navigation.children[0].innerText != "Stellaris")
    {
        return;
    }
    if (navigation.children[2].href.search("collections") == -1)
    {
        return;
    }

    // Okay, let's generate the list.

    var s = "last_mods={\r\n";
    [].forEach.call(document.getElementsByClassName("collectionItem"), function(item) {
        s += "\t\"mod/ugc_" + item.id.substr(11) + ".mod\"\r\n";
    });
    s += "}";

    // Now to display it to the user.

    var ourDiv = document.createElement("div");

    var helpfultext = document.createElement("p");
    helpfultext.innerHTML = "Your settings.txt can be found in Documents/Paradox Interactive/Stellaris.<br>Open it and look for the last_mods statement.<br>Replace it with this auto-generated thing:";
    ourDiv.appendChild(helpfultext);

    var textbox = document.createElement("textarea");
    textbox.value = s;
    textbox.style = "width: 100%; height: 100px; margin-bottom: 10px;";
    ourDiv.appendChild(textbox);

    document.getElementsByClassName("collectionChildren")[0].insertBefore(ourDiv, document.getElementsByClassName("collectionItem")[0]);
})();