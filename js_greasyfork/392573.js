// ==UserScript==
// @name         TCPAC
// @namespace    TCPAC
// @version      1
// @description  Clicks the gift button.
// @author       rfk.
// @match        *://www.twitch.tv/*
// @require      http://code.jquery.com/jquery-latest.js
// @downloadURL https://update.greasyfork.org/scripts/392573/TCPAC.user.js
// @updateURL https://update.greasyfork.org/scripts/392573/TCPAC.meta.js
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