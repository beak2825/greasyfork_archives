// ==UserScript==
// @name         Aternos Ad Delete
// @namespace    -
// @version      1
// @description  Delete the advertisement on Aternos.org and have more space for editing files
// @author       Plantt
// @match        *://aternos.org/*
// @icon         https://aternos.org/favicon.ico
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/450904/Aternos%20Ad%20Delete.user.js
// @updateURL https://update.greasyfork.org/scripts/450904/Aternos%20Ad%20Delete.meta.js
// ==/UserScript==

addEventListener("load", () => {
    setTimeout(() => {
        while (document.querySelector("aside")) {
            document.querySelector("aside").remove();
        }
        document.querySelector("#adngin-Leaderboard_Adhesion-0-adhesive").remove();
        document.querySelector("#adngin-Leaderboard_1-0").remove();
        if (document.URL == "https://aternos.org/server/") {
            document.querySelector(".server-b-tutorials").remove();
        }
    }, 10);
});