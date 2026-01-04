// ==UserScript==
// @name         GeoGuessr Battle Royale Flag Names
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Shows the country's ISO code underneath the flag and the country name on hover in GeoGuessr Battle Royale
// @author       lacmac
// @match        https://www.geoguessr.com/battle-royale/*
// @grant        none
// @connect      restcountries.eu
// @downloadURL https://update.greasyfork.org/scripts/422049/GeoGuessr%20Battle%20Royale%20Flag%20Names.user.js
// @updateURL https://update.greasyfork.org/scripts/422049/GeoGuessr%20Battle%20Royale%20Flag%20Names.meta.js
// ==/UserScript==

(async function() {
    'use strict';

    const apiURL = "https://restcountries.eu/rest/v2/alpha/";

    // Wait for ui to load
    while (!document.querySelector(".game-state-overview")) {
        await new Promise(r => setTimeout(r, 1000));
    }

    // Call manually once as flags may already be guessed. (Reconnecting, etc)
    showNames();

    // Show country code each time a new flag is guessed
    var observer = new MutationObserver(function(mutations) {
        for (let mutation of mutations) {
            if (mutation.type === "childList" && (mutation.target.className === "wrong-guesses__flags" || mutation.target.className === "game-state-overview")) {
                showNames();
                break;
            }
        }
    });

    // Start the observer on the guessed flags "list" element
    observer.observe(document.getElementsByClassName("game-state-overview")[0], { attributes: false, childList: true, characterData: false, subtree: true });

    function showNames() {
        // Retrieve all guessed flags
        let flags = document.getElementsByClassName("wrong-guesses__flag");
        for (let flag of flags) {
            let flag_div = flag.firstElementChild.firstElementChild.firstElementChild.firstElementChild;
            // Only add the country code once
            if (flag_div.parentNode.children.length === 1) {
                // Retrieve the 'alt' attribute from the flag img element
                let country_code = flag_div.firstElementChild.getAttribute("alt").toUpperCase();
                // Insert the html underneath the image and correct the country code
                flag_div.insertAdjacentHTML("afterend", '<span style="text-align: center;display: block;width: inherit;margin-top: 0.35rem;font-weight: bold;">Temp_Name</span>');
                flag_div.nextElementSibling.textContent = country_code;
                flag.style.marginBottom = "1rem";
                // Set the country name to show on hover
                fetch(apiURL + country_code)
                    .then(res => res.json())
                    .then(country => flag.setAttribute("title", country.name));
                flag.style.zIndex = 1;
            }
        }
    }
})();