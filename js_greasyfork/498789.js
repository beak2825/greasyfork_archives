// ==UserScript==
// @name         GeoGuessr Rank Display
// @namespace    https://greasyfork.org/en/users/1323365
// @version      1.1
// @description  Displays your world rank on the multiplayer page
// @author       Funnier04
// @match        *://*.geoguessr.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=geoguessr.com
// @grant        none
// @run-at       document-idle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/498789/GeoGuessr%20Rank%20Display.user.js
// @updateURL https://update.greasyfork.org/scripts/498789/GeoGuessr%20Rank%20Display.meta.js
// ==/UserScript==

var currentUrl = window.location.href;
var rank = "-";
let i = 0;
let j = 0;
let found = false;

const observer = new MutationObserver(() => {
    const newUrl = window.location.href;
    if (newUrl !== currentUrl) {
        currentUrl = newUrl;
        apiFetch();
    }
});

observer.observe(document.querySelector('#__next'), { subtree: true, childList: true });

async function apiFetch(){
    if (currentUrl == "https://www.geoguessr.com/multiplayer"){
        let profileFetch = await fetch("https://www.geoguessr.com/api/v3/profiles/");
        let profileJson = await profileFetch.json();
        rank = "-";
        let ratingFetch = await fetch("https://www.geoguessr.com/api/v4/ranked-system/ratings/me");
        let ratingJson = await ratingFetch.json();
        for (i = 0; i < 10; i++){
            if(ratingJson[i].userId == profileJson.user.id){
                rank = JSON.stringify(ratingJson[i].position);
            }
        }
        multiplayerPageText(rank);
    }
}

function multiplayerPageText (currentRank){
    let classToClone = document.querySelectorAll(".avatar_infoArea__5JVN_");
    try{
        let causeError = (classToClone[2].textContent).charAt(0)
    }
    catch{
        let clonedClass = classToClone[1].cloneNode(true);
        clonedClass.children[0].textContent = "#"+currentRank;
        clonedClass.children[1].textContent = "Rank";
        document.getElementsByClassName("avatar_infoRow__HhqSc")[0].appendChild(clonedClass);
    }
}

apiFetch();