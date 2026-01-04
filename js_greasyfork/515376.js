// ==UserScript==
// @name         365scores HS live url
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Přidá do detailu zápasu tlačítko pro live url s HS
// @author       JK
// @match        www.365scores.com/football/match/*
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/515376/365scores%20HS%20live%20url.user.js
// @updateURL https://update.greasyfork.org/scripts/515376/365scores%20HS%20live%20url.meta.js
// ==/UserScript==

function addHSLiveUrl() {
    const matchID = location.href.match(/id=(\d+)/)[1];
    const hsliveurl = "https://webws.365scores.com/web/athletes/games/lineups?gameId=" + matchID

    const misto = document.querySelector("div[class*='description-header_container']");

    const div = document.createElement("div");
    const button = document.createElement("button");
    button.textContent = "LIVE URL HS";

    function openUrl() {
        window.open(hsliveurl, "_blank");
    }

    button.addEventListener("mousedown", function (event) {
        if (event.button === 0 || event.button === 1) {
            openUrl();
        }
    })

    misto.insertAdjacentElement("afterend", div);
    div.append(button);

    /** CSS STYLES **/

    div.style.textAlign = "center";

    button.style.textContent = "LIVE URL HS";
    button.style.color = "#16181b";
    button.style.background = "#f8e71c";
    button.style.fontSize = "25px";
    button.style.padding = "10px 20px";
    button.style.margin = "20px";
    button.style.borderRadius = "99px";
};

setTimeout(addHSLiveUrl, 2000);


