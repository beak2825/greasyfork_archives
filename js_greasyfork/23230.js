// ==UserScript==
// @name         Steam - Open in App
// @version      0.2
// @description  adds a button to open steam games/workshop files in the app
// @author       Samu
// @match        http://store.steampowered.com/app/*
// @match        http://store.steampowered.com/agecheck/app/*
// @match        https://steamcommunity.com/sharedfiles/filedetails/*
// @match        https://steamcommunity.com/workshop/filedetails/*
// @match        http://steamcommunity.com/app/*
// @grant        none
// @namespace    https://greasyfork.org/en/scripts/23230-steam-open-in-app
// @downloadURL https://update.greasyfork.org/scripts/23230/Steam%20-%20Open%20in%20App.user.js
// @updateURL https://update.greasyfork.org/scripts/23230/Steam%20-%20Open%20in%20App.meta.js
// ==/UserScript==


var url = document.location.href;
var steamUrl;

var storeAppX = new RegExp("http://store.steampowered.com/(?:agecheck/)?app/([0-9]+)");
var communityAppX = new RegExp("http://steamcommunity.com/app/([0-9]+)");
var workshopX = new RegExp("https://steamcommunity.com/(?:sharedfiles|workshop)/filedetails/?.*id=([0-9]+)");

if (storeAppX.test(url)) {

    steamUrl = "steam://store/" + url.match(storeAppX)[1];

} else if (communityAppX.test(url)) {

    steamUrl = "steam://url/GameHub/" + url.match(communityAppX)[1];
    
} else if (workshopX.test(url)) {

    steamUrl = "steam://url/CommunityFilePage/" + url.match(workshopX)[1];
    
}


var btn = document.createElement("div");
btn.setAttribute("style", "position: fixed;top: 10px;right: 10px;background: #171a21; border: 1px solid #b1b1b1;padding: 2px;color: #dadada;box-shadow: black 2px 2px 5px;cursor: pointer");
btn.innerHTML = "Open in app";
btn.addEventListener("click", openSteam);
document.body.appendChild(btn);


function openSteam() {
    document.location.href = steamUrl;
}