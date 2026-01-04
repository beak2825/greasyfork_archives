// ==UserScript==
// @name         IndieGala Keys to TextArea
// @namespace    http://tampermonkey.net/
// @version      0.1.6
// @description  Displays a text area with game titles and keys.
// @author       Lex
// @match        https://www.indiegala.com/library*
// @match        https://www.indiegala.com/gift*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/403193/IndieGala%20Keys%20to%20TextArea.user.js
// @updateURL https://update.greasyfork.org/scripts/403193/IndieGala%20Keys%20to%20TextArea.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Formats games array to a string to be displayed
    // Games is an array [ [title, key], ... ]
    function formatGames(games) {
        // Ignore games which do not have keys revealed
        games = games.filter(e => e[1]);
        // Format the output as tab-separated
        games = games.map(e => e[0]+"\t"+e[1]);
        return games.join("\n");
    }

    // Return a list of games as an array of [title, key] pairs
    function getGames() {
        // The active bundle (the rest are all hidden)
        const active = document.querySelector("ul.profile-private-page-library-sublist-active");
        // Individual items
        const es = active.querySelectorAll(".profile-private-page-library-key-cont");
        // Take each item element and convert to an array of [title, key] pairs
        return Array.prototype.map.call(es, e => {
            const title = e.querySelector(".profile-private-page-library-title div").textContent.trim();
            const inps = e.querySelector("input.profile-private-page-library-key-serial");
            const key = inps ? inps.value : "";
            return [title, key];
        });
    }

    // Adds a textarea to the bottom of the games listing with all the titles and keys
    function injectTextbox() {
        // The active bundle (the rest are all hidden)
        const active = document.querySelector("ul.profile-private-page-library-sublist-active");
        if (!active) return;
        // Find an old textarea on the active bundle
        let area = active.querySelector("textarea.igktt");
        // otherwise make a new one
        if (!area) {
            area = document.createElement("textarea");
            area.className = "igktt";
            active.append(area);
        }

        let games = getGames();
        const gamesFmt = formatGames(games);
        if (gamesFmt != area.value) {
            area.value = gamesFmt;
            area.style.width = "100%";
            // Adjust the height so all the contents are visible
            area.style.height = "";
            area.style.height = area.scrollHeight + 20 + "px";
        }
    }

    /* When a user clicks a different bundle, it takes a while to load
       Watches for the load to finish before adding the textarea */
    function waitForBundleLoaded() {
        const loader = document.querySelector("ul.profile-private-page-library-sublist-active .profile-private-page-library-subitem-loading");
        // If the loading indicator both exists and is hidden (no longer needed)
        if (!loader || loader.style.display == "none") {
            injectTextbox();
            // Watches every 2 seconds in case a different bundle is opened or a key is revealed
            setTimeout(waitForBundleLoaded, 2000);
        } else {
            setTimeout(waitForBundleLoaded, 100);
        }
    }

    /* Add event listeners to every bundle link for clicks */
    function injectLoaders() {
        const as = document.querySelectorAll(".profile-private-page-library-list .fit-click");
        as.forEach(a => {a.addEventListener("click", waitForBundleLoaded)});
    }

    //injectLoaders();
    waitForBundleLoaded();
})();