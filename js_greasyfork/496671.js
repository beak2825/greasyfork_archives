// ==UserScript==
// @name:ru       steam  протокол
// @name    steam protocol opener
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description:ru  steam protocol opener Добавляет кнопку на все параметры Steam, чтобы открыть в приложении steam.
// @description  steam protocol opener Adds a button to all Steam sites to open in the Steam application.
// @author       dEN5_and_updated_for_Lolboblol
// @match  /https:\/\/.*steam.*\.com\/.*/
// @match         http*://steamcommunity.com/*
// @match         http*://store.steampowered.com/*
// @icon         https://www.google.com/s2/favicons?domain=steampowered.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/496671/steam%20protocol%20opener.user.js
// @updateURL https://update.greasyfork.org/scripts/496671/steam%20protocol%20opener.meta.js
// ==/UserScript==

function find(){
document.location.href = "steam://openurl/"+document.location.href;

}

var global_actions = document.querySelector("#global_actions");
var zNode = document.createElement ('button');
zNode.innerHTML = '<button class="global_action_link" id="find" type="button">open on steam</button>'
global_actions.appendChild (zNode);


document.getElementById ("find").addEventListener (
    "click", find, false
);