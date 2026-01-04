// ==UserScript==
// @name         TheTVDB Hide Non-Episodic Specials from All Seasons
// @version      1.3
// @description  Show only "Episodic Special" episodes on All Seasons pages on TheTVDB.com
// @author       xdpirate
// @license      GPLv3
// @match        https://thetvdb.com/series/*/allseasons/*
// @match        https://www.thetvdb.com/series/*/allseasons/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=thetvdb.com
// @grant        none
// @namespace http://tampermonkey.net/
// @downloadURL https://update.greasyfork.org/scripts/490218/TheTVDB%20Hide%20Non-Episodic%20Specials%20from%20All%20Seasons.user.js
// @updateURL https://update.greasyfork.org/scripts/490218/TheTVDB%20Hide%20Non-Episodic%20Specials%20from%20All%20Seasons.meta.js
// ==/UserScript==

let labels = document.querySelectorAll("span.label-sunglow");
for(let i = 0; i < labels.length; i++) {
    let labelName = labels[i].innerText.trim();
    if(!labelName.includes("Episodic Special")) {
        labels[i].closest("li").style.display = "none";
    }
}

// Find unlabeled specials and hide them too
let episodeLabels = document.querySelectorAll("small.episode-label");
for(let i = 0; i < episodeLabels.length; i++) {
    if(episodeLabels[i].innerText.trim().startsWith("SPECIAL")) {
        if(!episodeLabels[i].parentElement.previousElementSibling) {
            episodeLabels[i].closest("li").style.display = "none";
        }
    }
}