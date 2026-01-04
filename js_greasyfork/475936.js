// ==UserScript==
// @name         Steamid64 Viewer
// @name:ru      Steamid64 Viewer
// @version      0.13
// @description  Simple script for view steamid64 on userpages
// @description:ru Простой скрипт для просмотра steamid64 на странице пользователя
// @author       ushastoe
// @match        *steamcommunity.com/id/*
// @match        *steamcommunity.com/profiles/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=steamcommunity.com
// @grant        none
// @license MIT
// @namespace https://greasyfork.org/users/448505
// @downloadURL https://update.greasyfork.org/scripts/475936/Steamid64%20Viewer.user.js
// @updateURL https://update.greasyfork.org/scripts/475936/Steamid64%20Viewer.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var newElement = document.createElement("div");
    newElement.classList.add("steamid");
    var element = document.querySelector(".responsive_status_info");
    if (element) {
        newElement.innerText = "SteamID64: " + g_rgProfileData.steamid;
        element.appendChild(newElement);
    }
})();