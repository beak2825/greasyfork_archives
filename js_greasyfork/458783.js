// ==UserScript==
// @name         Steam Pirate
// @namespace    https://petar.cc/
// @version      0.2
// @description  Searches steam games using my CSE
// @author       Petar
// @match        *://store.steampowered.com/app/*
// @match        *://store.steampowered.com/sub/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=steamcommunity.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/458783/Steam%20Pirate.user.js
// @updateURL https://update.greasyfork.org/scripts/458783/Steam%20Pirate.meta.js
// ==/UserScript==
var search = "https://cse.google.com/cse?cx=327518a9e3b04456c#gsc.tab=0&gsc.ref=more%3Atop_10&gsc.sort=&gsc.q=";
var downloadBox;
var gameName;
var buttonClasses;
if (window.location.href.match(/(app\/|sub\/)/gm)[0] == "app/") {
	downloadBox = document.querySelector(".game_area_purchase_game_wrapper .game_area_purchase_game .game_purchase_action .game_purchase_action_bg");
	gameName = document.querySelector(".apphub_AppName").innerText;
	buttonClasses = "btn_green_steamui btn_medium";
} else {
	downloadBox = document.querySelector("#game_area_purchase_top .game_purchase_action_bg");
	gameName = document.querySelector(".pageheader").innerText;
	buttonClasses = "btnv6_green_white_innerfade btn_medium";
}
var downloadBtnParent = document.createElement("div");
downloadBtnParent.className = "btn_addtocart";
var downloadBtn = document.createElement("a");
downloadBtn.className = buttonClasses;
var downloadBtnText = document.createElement("span");
downloadBtnText.innerText = "Pirate";
downloadBtn.href = search + gameName;
downloadBtn.target = "_blank";
downloadBtn.appendChild(downloadBtnText);
downloadBtnParent.appendChild(downloadBtn);
downloadBox.appendChild(downloadBtnParent);
