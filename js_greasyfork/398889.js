// ==UserScript==
// @name         Fakku Blacklist
// @namespace    https://jacenboy.com/
// @version      1.1
// @description  Flag media on Fakku that has tags that you don't want to see
// @author       JacenBoy
// @match        http*://*.fakku.net/*
// @require      https://openuserjs.org/src/libs/sizzle/GM_config.js
// @grant        GM_getValue
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/398889/Fakku%20Blacklist.user.js
// @updateURL https://update.greasyfork.org/scripts/398889/Fakku%20Blacklist.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Prepare the config page
    GM_config.init({
        "id": "blacklistConfig",
        "title": "Fakku Blacklist",
        "fields": {
            "blacklist": {
                "label": "Blacklist (comma separated)",
                "type": "text",
                "default": ""
            }
        }
    });

    // Generate option to open config panel
    const menuoption = document.createElement("a");
    menuoption.href = "#";
    menuoption.onclick = () => {GM_config.open();};
    const menuli = document.createElement("li");
    menuli.appendChild(document.createTextNode("Blacklist"));
    menuoption.appendChild(menuli);
    document.getElementById("my-account-drop-links").appendChild(menuoption);

    // Generate blacklist array
    const blacklist = GM_config.get("blacklist").toLowerCase().replace(/\s/g, "").split(",");

    // Loop through the tags and recolor the ones marked as blacklisted
    var taglists = document.getElementsByClassName("tags");
    for (var list of taglists) {
        var tags = list.getElementsByTagName("a");
        for (var tag of tags) {
            if (blacklist.includes(tag.innerText.toLowerCase().replace(/\s/g, ""))) {
                tag.style.backgroundColor = "rgb(215, 0, 0)";
                tag.style.color = "rgb(255, 255, 255)";
            }
        }
    }
})();