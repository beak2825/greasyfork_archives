// ==UserScript==
// @name        Letterboxd Extra Profile Stats
// @namespace   https://github.com/rcalderong/userscripts
// @description Adds average number of films watched per month and per week to profile pages
// @copyright   2014+, Ramón Calderón (http://rcalderon.es)
// @homepageURL https://github.com/rcalderong/userscripts
// @supportURL  https://github.com/rcalderong/userscripts/issues
// @icon        https://raw.githubusercontent.com/rcalderong/userscripts/master/img/letterboxd_icon.png
// @license     GPLv3; http://www.gnu.org/licenses/gpl.html
// @version     1.4
// @include     /^http://letterboxd.com/\w+/#?$/
// @exclude     /^http://letterboxd.com/films//
// @exclude     /^http://letterboxd.com/lists//
// @exclude     /^http://letterboxd.com/people//
// @exclude     /^http://letterboxd.com/search//
// @exclude     /^http://letterboxd.com/settings//
// @exclude     /^http://letterboxd.com/activity//
// @exclude     /^http://letterboxd.com/invitations//
// @exclude     /^http://letterboxd.com/about//
// @exclude     /^http://letterboxd.com/pro//
// @exclude     /^http://letterboxd.com/welcome//
// @exclude     /^http://letterboxd.com/contact//
// @exclude     /^http://letterboxd.com/201\d//
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/4605/Letterboxd%20Extra%20Profile%20Stats.user.js
// @updateURL https://update.greasyfork.org/scripts/4605/Letterboxd%20Extra%20Profile%20Stats.meta.js
// ==/UserScript==

var headerElt = document.getElementById("profile-header"),
    avatarElt = headerElt.getElementsByClassName("avatar")[0],
    infoElt = headerElt.getElementsByClassName("profile-person-info")[0],
    statsElt = headerElt.getElementsByClassName("stats")[0],
    dataMatch = statsElt.innerHTML.match(/<a href="(.*?)"><strong>(\d+).*This year/),
    diaryUrl = dataMatch[1],
    filmsPerYear = dataMatch[2],
    filmsPerMonth,
    filmsPerWeek,
    avgElt,
    avgInnerElt,
    numElt,
    textElt;

// Calculate averages
filmsPerMonth = (filmsPerYear / (new Date().getMonth() + 1));
filmsPerWeek = ((filmsPerMonth / 30) * 7);

// Insert calculated averages in page
[filmsPerWeek, filmsPerMonth].forEach(function (filmsAvg, index) {
    avgElt = document.createElement("li");
    avgInnerElt = document.createElement("a");
    numElt = document.createElement("strong");
    textElt = document.createElement("span");

    // Round to one decimal place and remove trailing zero if present
    filmsAvg = filmsAvg.toFixed(1).replace(/^(\d+)\.0$/, "$1");
    
    // Fill element with data
    avgInnerElt.href = diaryUrl;
    numElt.textContent = filmsAvg;
    textElt.textContent = (index === 0) ? "Per week" : "Per month";

    // Build element structure
    avgInnerElt.appendChild(numElt);
    avgInnerElt.appendChild(textElt);
    avgElt.appendChild(avgInnerElt);
    
    // Insert element in page
    statsElt.insertBefore(avgElt, statsElt.children[2]);
});

// Prevent overflow in layout
infoElt.style.width = "auto";
infoElt.style.maxWidth = headerElt.offsetWidth -
    avatarElt.offsetWidth - statsElt.offsetWidth + "px";