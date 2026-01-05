// ==UserScript==
// @name         Open In Steam
// @namespace    http://brooksaar.com/
// @version      0.2
// @description  Adds a link to open Steam content in the desktop client.
// @author       Aaron Brooks
// @match        *://steamcommunity.com/*
// @match        *://store.steampowered.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/10727/Open%20In%20Steam.user.js
// @updateURL https://update.greasyfork.org/scripts/10727/Open%20In%20Steam.meta.js
// ==/UserScript==

function CreateButton(namedPage, pageId) {
    var steamButton = document.createElement("a");
    var buttonText = document.createTextNode("Open in Steam!");
    steamButton.setAttribute("href", "steam://url/" + namedPage + pageId);
    steamButton.setAttribute("class", "menuitem");
    steamButton.appendChild(buttonText);

    var superNav = document.getElementsByClassName("supernav_container")[0];
    superNav.appendChild(steamButton);
}

// Thanks David Morales, https://stackoverflow.com/questions/11582512/how-to-get-url-parameters-with-javascript/11582513#11582513
function getURLParameter(name) {
    return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search)||[,""])[1].replace(/\+/g, '%20'))||null;
}

var namedPage = ""; // trailing slash important!
var pageId = "";

var currentUrl = window.location.href;
if(currentUrl.match("store.steampowered.com/app/")) {
    var urlParts = currentUrl.split("/");

    namedPage = "StoreAppPage/";
    pageId = urlParts[4];

    CreateButton(namedPage, pageId);
} else if(currentUrl.match("steamcommunity.com/sharedfiles/")) {
    pageId = getURLParameter("id");
    namedPage = "CommunityFilePage/";

    CreateButton(namedPage, pageId);
}