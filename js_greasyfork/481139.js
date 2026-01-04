/* eslint-disable no-multi-spaces */
var buttonSet = [
    { url: "https://steamrip.com/?s=",           title: "SteamRIP" },
    { url: "https://www.ovagames.com/?s=",       title: "OVA Games" },
	{ url: "https://fitgirl-repacks.site/?s=",   title: "FitGirl" },
	{ url: "https://dodi-repacks.site/?s=",      title: "DODI" },
];
var siteSet = [
    { url: "https://store.steampowered.com/app/*", title: "Steam" },
];

/*
All Credit for this userscript goes to Kozinc. I simply removed the unsafe sites from his version and made it into 2 scripts, one for Steam and one for GOG.
*/
// ==UserScript==
// @name         Steam to Free Download Site
// @namespace    AnimeIsMyWaifu
// @author       AnimeIsMyWaifu
// @version      0.1
// @description  Simply adds a pirate link to all games on the Steam store
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js
// @match        https://store.steampowered.com/app/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/481139/Steam%20to%20Free%20Download%20Site.user.js
// @updateURL https://update.greasyfork.org/scripts/481139/Steam%20to%20Free%20Download%20Site.meta.js
// ==/UserScript==

var siteSetResult = "";

siteSet.forEach((el) => {
    if(!!document.URL.match(el.url)) siteSetResult = el.title;
})

console.log("Games Links: ", siteSetResult);
var appName = "";
switch(siteSetResult) {
    case "Steam":
        appName = document.getElementsByClassName("apphub_AppName")[0].textContent;
        appName = appName.trim();
        // $(".game_purchase_action_bg:first").css({"height": "32px"}); remove
        $(".game_purchase_action_bg:first").css({
            "height": "50px",
            "max-width": "500px",
            "text-wrap": "wrap"
        });
        buttonSet.forEach((el) => {
            $(".game_purchase_action_bg:first").append(furnishSteam(el.url+appName, el.title))
        })
        break;
}

function furnishSteam(href, innerHTML) {
    let element = document.createElement("a");
    element.target= "_blank";
    element.style = "margin-left: 10px; padding-right: 10px;";
    element.href = href;
    element.innerHTML= innerHTML;
    return element;
}