// ==UserScript==
// @name         网易歌单自动添加标签
// @namespace    https://music.163.com/
// @version      2.0
// @description  实现自动添加歌单功能
// @author       lacmac
// @match        https://www.geoguessr.com/battle-royale/*
// @grant        none
// @connect      restcountries.eu
// @downloadURL https://update.greasyfork.org/scripts/422182/%E7%BD%91%E6%98%93%E6%AD%8C%E5%8D%95%E8%87%AA%E5%8A%A8%E6%B7%BB%E5%8A%A0%E6%A0%87%E7%AD%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/422182/%E7%BD%91%E6%98%93%E6%AD%8C%E5%8D%95%E8%87%AA%E5%8A%A8%E6%B7%BB%E5%8A%A0%E6%A0%87%E7%AD%BE.meta.js
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