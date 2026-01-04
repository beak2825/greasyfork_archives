// ==UserScript==
// @name         VIP
// @version      1
// @description  VIP server fix
// @match https://www.roblox.com/games/*
// @namespace https://greasyfork.org/users/1401083
// @downloadURL https://update.greasyfork.org/scripts/518545/VIP.user.js
// @updateURL https://update.greasyfork.org/scripts/518545/VIP.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const url = window.location.href;

    if (url.includes("?privateServerLinkCode=")) {
        var content = document.getElementsByClassName("content")[0].textContent;
        content = content.slice(content.indexOf("xLaunch.Request")+55);
        content = content.substring(0,content.indexOf(")")).replace(", null","").replaceAll("\'","").split(", ");
        window.location = window.location.href.replace("?","#")+"&"+content[1]
    } else if (url.includes("&")) {
        var id = url.slice(url.indexOf("games/")+6);
        id = id.substring(0,id.indexOf("/"))
        const data = url.slice(url.indexOf("Code=")+5).split("&")
        Roblox.GameLauncher.joinPrivateGame(id,data[1],data[0]);
    }
})();