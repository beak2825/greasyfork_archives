// ==UserScript==
// @name         Nitro Math Leaderboards
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Fixes the leaderboard button in Nitro Math.
// @author       D1sRuPti0n
// @match        https://www.nitromath.com/leaderboards
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/453398/Nitro%20Math%20Leaderboards.user.js
// @updateURL https://update.greasyfork.org/scripts/453398/Nitro%20Math%20Leaderboards.meta.js
// ==/UserScript==

(function() {
    'use strict';
    window.addEventListener("load", function () {
        const comingSoon = document.querySelector("#root > div.structure.structure--nitromath.structure--noAds > main > section > div");
        comingSoon.remove ();

        const main = document.querySelector(".structure-content");

        const containerStyle = {
            margin: "0-150px"
        }

        //Object.assign(main.style, containerStyle);

        const iframeStyle = {
            webkitTransform: "scale(1)",
            width: "100%",
            height: "6550px",
            display: "block",
        }

        var leaderboard = document.createElement("iframe");


        leaderboard.src = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSxjSWtEdVn3sF6RmagU7k5GR1cGeodGW6wNoh0_0an9MRMxjGCUuJua1KprgnOXT3NQ_gaeuvNmZAX/pubhtml?gid=609964986&amp;single=true&amp;widget=true&amp;headers=false";

        Object.assign(leaderboard.style, iframeStyle);
        Object.assign(main.style, containerStyle);

        main.append(leaderboard);
    }, false)
})();
