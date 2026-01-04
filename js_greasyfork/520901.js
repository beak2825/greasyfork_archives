// ==UserScript==
// @name         View Round Location Between Rounds
// @version      v0.0.3
// @description  Click the flag icon to view the location
// @author       sp4ghet
// @match        https://www.geoguessr.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=geoguessr.com
// @namespace    https://greasyfork.org/en/users/1273557-sp4ghet
// @license      none
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/520901/View%20Round%20Location%20Between%20Rounds.user.js
// @updateURL https://update.greasyfork.org/scripts/520901/View%20Round%20Location%20Between%20Rounds.meta.js
// ==/UserScript==

// Enforce ES8
/* jshint esversion: 8 */

const checkURL = () => location.pathname.endsWith("/me/activities")

const getChallengeId = () => {
    const regexp = /.*\/live-challenge\/(.*)/
    const matches = location.pathname.match(regexp)
    if(matches.length > 1){
        return matches[1];
    }
    return null;
}

function decodePanoId(encoded) {
    const len = Math.floor(encoded.length / 2)
    let panoId = []
    for (let i = 0; i < len; i++) {
        const code = parseInt(encoded.slice(i * 2, i * 2 + 2), 16)
        const char = String.fromCharCode(code)
        panoId = [...panoId, char]
    }
    return panoId.join("")
}

async function getGoogleMapsURL(id){
    const url = `https://game-server.geoguessr.com/api/live-challenge/${id}`
    const response = await fetch(url,{
        method: "GET",
        credentials: "include"
    });
    const data = await response.json();
    const currentRound = data.currentRoundNumber - 1
    const rounds = data.rounds
    const panorama = rounds[currentRound].question.panoramaQuestionPayload.panorama
    const panoIdHex = panorama.panoId
    const lat = panorama.lat
    const lng = panorama.lng
    const heading = panorama.heading
    const pitch = panorama.pitch
    const zoom = panorama.zoom
    const panoId = decodePanoId(panoIdHex)
    const mapUrl = `https://google.com/maps/@?api=1&map_action=pano&pano=${panoId}&viewpoint=${lat},${lng}&heading=${heading}&pitch=${pitch}&zoom=${zoom}`
    return mapUrl
}

let sentinel = false

async function main() {
    if(sentinel){
        return;
    }
    sentinel = true
    const challengeId = getChallengeId()
    const pinClass = ".result-map_roundPin__3ieXw";
    const pinDiv = document.querySelector(pinClass);
    const pinChildren = pinDiv.firstChild
    const clickable = document.createElement('a');
    clickable.id = "fuck";
    clickable.target = "_blank";
    clickable.href = await getGoogleMapsURL(challengeId);
    pinDiv.appendChild(clickable);
    clickable.appendChild(pinChildren);
}


new MutationObserver((mutations) => {
    const pinClass = ".result-map_roundPin__3ieXw";
    if(!document.querySelector(pinClass)){
        sentinel = false;
        return;
    }
    main();
}).observe(document.body, { subtree: true, childList: true });