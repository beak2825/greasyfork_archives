// ==UserScript==
// @name         AoM Profile Redirector
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Adds quick profile navigation buttons for Age of Mythology stats websites.
// @author       Webmaster
// @match        https://freefoodparty.com/aom/*
// @match        https://aomstats.io/profile/*
// @match        https://www.aom.gg/profile/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/528785/AoM%20Profile%20Redirector.user.js
// @updateURL https://update.greasyfork.org/scripts/528785/AoM%20Profile%20Redirector.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Extract the player ID from the URL
    let playerId;
    if (window.location.hostname.includes("freefoodparty.com")) {
        playerId = new URLSearchParams(window.location.search).get("idPlayer");
    } else {
        playerId = window.location.pathname.split("/").pop();
    }

    if (!playerId) return;

    // Create container for links
    let container = document.createElement("div");
    container.style = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        display: flex;
        gap: 10px;
        background: rgba(0, 0, 0, 0.7);
        padding: 10px;
        border-radius: 5px;
    `;

    // Define link styles
    const linkStyle = `
        background: #007bff;
        color: white;
        padding: 10px;
        font-size: 16px;
        border-radius: 5px;
        text-decoration: none;
        transition: background 0.3s;
    `;

    const hoverStyle = `background: #0056b3;`;

    // Create the buttons as links
    function createLink(name, url) {
        let link = document.createElement("a");
        link.innerText = name;
        link.href = url;
        link.target = "_blank";
        link.style = linkStyle;
        link.onmouseover = () => link.style.background = "#0056b3";
        link.onmouseout = () => link.style.background = "#007bff";
        container.appendChild(link);
    }

    // Determine which site we are on and add the appropriate links
    if (window.location.hostname.includes("freefoodparty.com")) {
        createLink("AoM Stats", `https://aomstats.io/profile/${playerId}?leaderboard=2`);
        createLink("AoM GG", `https://www.aom.gg/profile/${playerId}`);
    } else if (window.location.hostname.includes("aomstats.io")) {
        createLink("FreeFoodParty", `https://freefoodparty.com/aom/profile?idPlayer=${playerId}`);
        createLink("AoM GG", `https://www.aom.gg/profile/${playerId}`);
    } else if (window.location.hostname.includes("aom.gg")) {
        createLink("FreeFoodParty", `https://freefoodparty.com/aom/profile?idPlayer=${playerId}`);
        createLink("AoM Stats", `https://aomstats.io/profile/${playerId}?leaderboard=2`);
    }

    document.body.appendChild(container);
})();
