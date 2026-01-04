// ==UserScript==
// @name         TCPAC
// @namespace    TCPAC
// @version      0.2
// @description  Clicks the Chest button.
// @author       AnonTwitchUser.
// @match        *://www.twitch.tv/*
// @require      http://code.jquery.com/jquery-latest.js
// @downloadURL https://update.greasyfork.org/scripts/392574/TCPAC.user.js
// @updateURL https://update.greasyfork.org/scripts/392574/TCPAC.meta.js
// ==/UserScript==

function main() {
    var btnCollection = document.getElementsByClassName("tw-button tw-button--success tw-interactive");
    if (btnCollection.length > 0) {
        btnCollection[0].click();
        console.log("TCPAC clicked!");
    }
}

$(document).ready(function() {
    console.log("TCPAC ready");
    setInterval(main, 1500);
})