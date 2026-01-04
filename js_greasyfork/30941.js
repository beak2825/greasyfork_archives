// ==UserScript==
// @name         Shinwa Autoquest
// @namespace    http://artees.pw/
// @description  This script automatically completes Shinwas quests.
// @version      1.1
// @author       Artees
// @match        *://subeta.net/explore/goddess.php
// @grant        none
// @icon         https://subeta.net/favicon.ico
// @icon64       https://img.subeta.net/items/shinwabracelet_1.gif
// @downloadURL https://update.greasyfork.org/scripts/30941/Shinwa%20Autoquest.user.js
// @updateURL https://update.greasyfork.org/scripts/30941/Shinwa%20Autoquest.meta.js
// ==/UserScript==

if (!start()) {
    goToQuest();
}

function start() {
    var buttons = document.getElementsByClassName("ui button");
    for (var i = 0; i < buttons.length; i++) {
        if (buttons[i].value !== "Start the Quest") continue;
        buttons[i].click();
        return true;
    }
    return false;
}

function goToQuest() {
    var links = document.getElementsByTagName("a");
    for (var i = 0; i < links.length; i++) {
        if (links[i].href.indexOf("quests.php") === -1) continue;
        links[i].click();
        return;
    }
    open("https://subeta.net/quests.php/carl", "_self");
}