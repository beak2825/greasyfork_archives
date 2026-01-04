// ==UserScript==
// @name         Torn Better UI
// @namespace    http://tampermonkey.net/
// @version      alpha-1.1
// @description  Make Torn Beautiful
// @author       Jayam Patel
// @match        https://www.torn.com/*
// @icon         https://raw.githubusercontent.com/jayam04/torn-scripts/master/tornBetterUI/icon.png
// @license      Apache License 2.0
// @grant        none
// @require      https://update.greasyfork.org/scripts/501645/1416051/Torn%20UI%20Elements%20%28for%20Developers%29.js
// @require      https://update.greasyfork.org/scripts/501648/1416074/Constants%20for%20Torn%20Scripts%20%28for%20Developers%29.js
// @downloadURL https://update.greasyfork.org/scripts/519001/Torn%20Better%20UI.user.js
// @updateURL https://update.greasyfork.org/scripts/519001/Torn%20Better%20UI.meta.js
// ==/UserScript==

function realignTornUI() {
    const mainContainer = document.getElementById("mainContainer");
    mainContainer.style.marginLeft = "20px";

    // TODO: make this more robust.
    // TODO: make this more efficient, currently, it takes time and shift is visible on every page reload.
    const mainContentContainer =
        document.getElementsByClassName("content-wrapper")[0];
    const topHeaderContainer =
        document.getElementsByClassName("header-wrapper-top")[0];
    const topHeaderContainerChild = topHeaderContainer.children[0];
    topHeaderContainerChild.style.marginLeft = "20px";

    const bottomHeaderContainer = document.getElementsByClassName(
        "header-wrapper-bottom"
    )[0];
    const bottomHeaderContainerChild = bottomHeaderContainer.children[0];
    bottomHeaderContainerChild.style.marginLeft = "20px";
}

function updateFont() {
    const mainContainer = document.getElementById("mainContainer");
    mainContainer.style.fontFamily = "Pangolin";
}

function main() {
    realignTornUI();
}

main();
