// ==UserScript==
// @name         GeoGuessr More Player Stats
// @namespace    http://tampermonkey.net/
// @version      0.0.5
// @description  Show more information about a geoguessr player on their profile page
// @author       btastic
// @match        https://www.geoguessr.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=geoguessr.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/537484/GeoGuessr%20More%20Player%20Stats.user.js
// @updateURL https://update.greasyfork.org/scripts/537484/GeoGuessr%20More%20Player%20Stats.meta.js
// ==/UserScript==

function checkURL() {
    return location.pathname.includes("/user") || location.pathname.includes("/me/profile");
}

function insertAfter(newNode, existingNode) {
    existingNode.parentNode.insertBefore(newNode, existingNode.nextSibling);
}

async function getUserProgress(profileId) {
    return fetch(location.origin + "/api/v4/ranked-system/progress/" + profileId)
        .then(out => out.json())
        .catch(err => { console.log(err); return null; });
}

async function getUserStats(profileId) {
    return fetch(location.origin + "/api/v3/users/" + profileId + "/stats")
        .then(out => out.json())
        .catch(err => { console.log(err); return null; });
}

function appendDivWithText(divToAppendTo, divId, text) {
    let div = document.createElement("div");
    insertAfter(div, divToAppendTo);
    div.innerHTML = '<div id="' + divId + '"></div>';
    document.getElementById(divId).innerText = text;
}

function displayAverageGameScore(moreInfoDiv, stats) {
    let averageGameScoreText = "Average game score: " + stats.averageGameScore.amount + " " + stats.averageGameScore.unit + " (" + Math.round(stats.averageGameScore.percentage, 2) + "%)";
    appendDivWithText(moreInfoDiv, "average-gs", averageGameScoreText)
}

function displayAverageTimeToPlonk(moreInfoDiv, stats) {
    let averageTimeToPlonkText = "Average time to plonk: " + stats.averageTime;
    appendDivWithText(moreInfoDiv, "average-ttp", averageTimeToPlonkText)
}

function displayAverageDistance(moreInfoDiv, stats) {
    let averageDistanceText = "Average guess distance: " + stats.averageDistance.meters.amount + " " + stats.averageDistance.meters.unit;
    appendDivWithText(moreInfoDiv, "average-distance", averageDistanceText)
}

function displayGuessesFirstPercentage(moreInfoDiv, user) {
    let percentageText = null;

    if(user) {
        percentageText = Math.round(user.guessedFirstRate * 100) + "%";
    }

    let guessFirstPercentage = percentageText ?? "N/A";
    appendDivWithText(moreInfoDiv, "guesses-first", "Guesses first: " + guessFirstPercentage)
}

function createMoreInfoDiv(baseDiv, proDiv) {
    let moreInfoDiv = document.createElement("div");
    moreInfoDiv.innerHTML = `<div id="more-info"></div>`;

    if (proDiv) {
        baseDiv.style = "display: inline-block; margin-right: 10px";
        moreInfoDiv.style.display = "inline-block";
    }

    insertAfter(moreInfoDiv, baseDiv);

    return moreInfoDiv;
}

let observer = new MutationObserver(async (mutations) => {
    if (!checkURL()) {
        return;
    }

    const profileLink = (location.pathname.includes("/me/profile")) ? document.querySelector('[name="copy-link"]').value : location.href;
    const profileId = profileLink.substr(profileLink.lastIndexOf("/") + 1);

    let user = await getUserProgress(profileId);
    let stats = await getUserStats(profileId);

    if(document.getElementById("more-info") != null)
    {
        return;
    }

    let proDiv = document.querySelector("[class*='profile-header_proBadgeWrapper__']");
    let baseDiv = (proDiv) ? proDiv.firstChild : document.querySelector("[data-qa='user-card-title']");

    let moreInfoDiv = createMoreInfoDiv(baseDiv, proDiv);

    displayAverageGameScore(moreInfoDiv, stats);
    displayAverageTimeToPlonk(moreInfoDiv, stats);
    displayAverageDistance(moreInfoDiv, stats);
    displayGuessesFirstPercentage(moreInfoDiv, user);
})

observer.observe(document.body, { subtree: true, childList: true });