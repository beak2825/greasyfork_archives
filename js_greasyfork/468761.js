// ==UserScript==
// @name         Show favorited count - MAL (for mobile ver)
// @namespace    https://myanimelist.net/profile/kyoyatempest
// @version      1.2
// @description  Shows favorited anime,manga,characters,people,company count like "Favorite - Anime (10)" on mobile version
// @author       kyoyacchi
// @match        https://myanimelist.net/profile/*
// @grant        none
// @icon         https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://myanimelist.net&size=64
// @run-at       document-end
// @license      gpl-3.0
// @downloadURL https://update.greasyfork.org/scripts/468761/Show%20favorited%20count%20-%20MAL%20%28for%20mobile%20ver%29.user.js
// @updateURL https://update.greasyfork.org/scripts/468761/Show%20favorited%20count%20-%20MAL%20%28for%20mobile%20ver%29.meta.js
// ==/UserScript==

(function() {
    'use strict';


  const headerMappings = {
        "Favorites - Anime": "anime",
        "Favorites - Manga": "manga",
        "Favorites - Characters": "character",
        "Favorites - People": "person",
        "Favorites - Companies": "company"
    };

    const headers = document.querySelectorAll(".header3");
    const sliders = document.querySelectorAll(".slider");

    const counts = {
        anime: 0,
        manga: 0,
        character: 0,
        person: 0,
        company: 0
    };

    sliders.forEach((slider) => {
        for (const key in headerMappings) {
            if (slider.classList.contains(`favorites-${headerMappings[key]}`)) {
                counts[headerMappings[key]]++;
                break;
            }
        }
    });

    headers.forEach((header) => {
        const textContent = header.textContent.trim();
        if (headerMappings.hasOwnProperty(textContent)) {
            header.textContent += ` (${counts[headerMappings[textContent]]})`;
        }
    });

})();