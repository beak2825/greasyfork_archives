// ==UserScript==
// @name         Trakt Links for Rotten Tomatoes
// @namespace    furnapso
// @version      0.1
// @description  Adds a link to Trakt search for Rotten Tomatoes movies and shows
// @author       furnapso
// @match        https://www.rottentomatoes.com/m/*
// @match        http://*.rottentomatoes.com/m/*
// @match        https://www.rottentomatoes.com/tv/*
// @match        http://*.rottentomatoes.com/tv/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/420162/Trakt%20Links%20for%20Rotten%20Tomatoes.user.js
// @updateURL https://update.greasyfork.org/scripts/420162/Trakt%20Links%20for%20Rotten%20Tomatoes.meta.js
// ==/UserScript==

(function() {
    const scorePanelWrapper = document.querySelector(".score-panel-wrap");
    const currentUrl = window.location.href;
    const traktUrl = "https://trakt.tv/";

    let mediaType = currentUrl.split("/")[3];
    mediaType = mediaType == "m" ? "movie" : "shows";

    let mediaTitle = currentUrl.split("/")[4];

    mediaTitle = mediaTitle.replaceAll("_", "-");

    const searchButtonWrapper = document.createElement("div");
    searchButtonWrapper.classList.add("mop-ratings-wrap__score-detail-container");
    const searchButton = document.createElement("button");
    searchButton.innerText = "Open on Trakt.TV";
    searchButton.classList.add("mop-ratings-wrap__score-detail-text");
    searchButton.addEventListener('click', () => {
        window.open(traktUrl + mediaType + "/" + mediaTitle);
    })

    searchButtonWrapper.appendChild(searchButton);
    scorePanelWrapper.appendChild(searchButtonWrapper);
})();