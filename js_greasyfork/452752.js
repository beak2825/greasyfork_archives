// ==UserScript==
// @name         Geoguessr unrounded map stats
// @version      0.2.2
// @description  Display the exact number of played games, locations count and likes for Geoguessr maps
// @author       victheturtle#5159
// @license      MIT
// @match        https://www.geoguessr.com/*
// @grant        none
// @icon         https://www.google.com/s2/favicons?sz=64&domain=geoguessr.com
// @namespace    https://greasyfork.org/users/967692-victheturtle
// @downloadURL https://update.greasyfork.org/scripts/452752/Geoguessr%20unrounded%20map%20stats.user.js
// @updateURL https://update.greasyfork.org/scripts/452752/Geoguessr%20unrounded%20map%20stats.meta.js
// ==/UserScript==

let lastURL = "";
let mapData = {};
let mapSearchData = {};

function checkRoundedStat() {
    let q = document.querySelectorAll("div[class*='map-stats_mapStatMetricValue__']");
    if (q == undefined || q.length < 4) return false;
    if (q[1].innerText.includes("M") || q[1].innerText.includes("K")) return true
    if (q[2].innerText.includes("+")) return true
    if (q[3].innerText.includes("K")) return true
    return false;
};

function addDetailedPlayed() {
    let elt = document.querySelectorAll("div[class*='map-stats_mapStatMetricValue__']")[1];
    let value = mapData.props.pageProps.map.numFinishedGames.toLocaleString();
    elt.innerText = value;
    for (let ms of [100,200,300,400,500]) {
        setTimeout(() => {elt.innerText = value;}, ms);
    }
};

function checkGamesPlayedStats() {
    if (mapData.props != null) {
        addDetailedPlayed();
        return;
    }
    fetch(location.href)
    .then(res => res.text())
    .then(str => {
        let parser = new DOMParser();
        let html = parser.parseFromString(str, "text/html");
        let dataHTML = html.getElementById("__NEXT_DATA__");
        mapData = JSON.parse(dataHTML.innerHTML);
        addDetailedPlayed();
    }).catch(err => {throw(err);});
};

function addDetailedLocCount() {
    let divs = document.querySelectorAll("div[class*='map-stats_mapStatMetricValue__']");
    let countElt = divs[2];
    let likesElt = divs[3];
    let countValue = mapSearchData.coordinateCount.toLocaleString();
    let likesValue = mapSearchData.likes.toLocaleString();
    countElt.innerText = countValue; likesElt.innerText = likesValue;
    for (let ms of [100,200,300,400,500]) {
        setTimeout(() => {countElt.innerText = countValue; likesElt.innerText = likesValue;}, ms);
    }
};

function checkOtherStats() {
    let mapId = location.href.split("/").pop()
    fetch(location.origin + "/api/v3/search/map?page=0&count=1&q=" + mapId)
    .then(res => res.json())
    .then(json => {
        if (json[0].id != mapId) return;
        mapSearchData = json[0];
        addDetailedLocCount();
    }).catch(err => {throw(err);});
}

function doCheck() {
    if (location.pathname.includes("/maps/") && location.pathname != lastURL && checkRoundedStat()) {
        checkGamesPlayedStats();
        checkOtherStats();
    } else if (location.pathname != lastURL) {
        mapData = {};
        mapSearchData = {};
    }
    location.pathname != lastURL;
};

function tryAddDetailedOnRefresh() {
    setTimeout(doCheck, 300);
};

function tryAddDetailed() {
    for (let timeout of [250,500,1200,2000]) {
        setTimeout(doCheck, timeout);
    }
};

document.addEventListener('click', tryAddDetailed, false);
document.addEventListener('load', tryAddDetailedOnRefresh(), false);
window.addEventListener('popstate', tryAddDetailed, false);