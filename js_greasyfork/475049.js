// ==UserScript==
// @name         MooMoo.io Grey Rain UI
// @version      2.0
// @description  A script that changes some UI-related things
// @author       QueenBee
// @license      MIT
// @match        https://moomoo.io/*
// @match        https://sandbox.moomoo.io/*
// @grant        none
// @run-at       document-end
// @namespace a
// @downloadURL https://update.greasyfork.org/scripts/475049/MooMooio%20Grey%20Rain%20UI.user.js
// @updateURL https://update.greasyfork.org/scripts/475049/MooMooio%20Grey%20Rain%20UI.meta.js
// ==/UserScript==

//---------------------------------------------------------------------------------------------------------
// v 1-1.3 added the basics (reload button)
// v 1.4 added changelog and a nice-looking border/rounded edges to the reload button
// v 1.5 merged another script of mine into this > leaderboard change / some other stuff
// v 1.5.1 bug fixes
// v 1.6 added mostly random things (chat removal, improved readability of the code)
// v 1.7 changed stuff in the shop, chat
// v 1.8 I forgot actually / leaderboard changes
// v 1.9 changed things related to: age bar, hotbar, age text
// v 1.10 made shop and alliance button visuals, game name change, kill display change
// v 1.11 made changes to the mapDisplay
// v 1.11.1 (nice) mostly code readability improved, minor bug fixes/name change of the script
// v 2.0 (final version) pingDisplay, main menu changes
//---------------------------------------------------------------------------------------------------------
(function () {
    'use strict';

    // Reload button
    function addReloadButton() {
        const reloadButton = document.createElement("button");
        reloadButton.innerText = "Reload?";
        reloadButton.style.position = "fixed";
        reloadButton.style.top = "425px";
        reloadButton.style.right = "24px";
        reloadButton.style.zIndex = "9999";
        reloadButton.style.color = "black";
        // reloadButton.tooltip = "you'll regret that"; // I might finish that later
        reloadButton.style.borderRadius = "8px";
        reloadButton.style.border = "2px solid black";
        reloadButton.style.backgroundColor = "rgba(128, 128, 128, 0.7)";
        reloadButton.addEventListener("click", function () {
            location.reload();
        });
        document.body.appendChild(reloadButton);
    }

    addReloadButton();
    console.log("Reload button added.");

    //---------------------------------------------------------------------------------------------------------
    //Leaderboard
    const Leaderboard = document.getElementById("leaderboard");
    Leaderboard.style.position = "position";
    Leaderboard.style.border = "2px solid black";
    Leaderboard.style.backgroundColor = "rgba(128, 128, 128, 0.7)";
    Leaderboard.style.color = "black";
    Leaderboard.style.fontSize = "35px";
    Leaderboard.style.borderRadius = "8px";

    //---------------------------------------------------------------------------------------------------------
    // Clan button
    document.getElementById("allianceHolder").style.border = "2px solid black";
    document.getElementById("allianceHolder").style.backgroundColor = "rgba(128, 128, 128, 0.7)";

    //---------------------------------------------------------------------------------------------------------
    // Removes the chat button that no one uses (enter still works, don't worry)
    const Chat = document.getElementById("chatButton");
    Chat.style.display = "none";

    //---------------------------------------------------------------------------------------------------------
    //Store button
    const storeHolderElement = document.getElementById("storeHolder");
    storeHolderElement.style.border = "2px solid black";
    storeHolderElement.style.display = "inline-block";
    storeHolderElement.style.backgroundColor = "rgba(128, 128, 128, 0.7)";

    //---------------------------------------------------------------------------------------------------------
    /* (Yes, I had to use chat GPT there to understand what
    div.storeTab means, everything else was my work,
    besides some other stuff I didn't understand) */
    var storeTabs = document.querySelectorAll('.storeTab');
    storeTabs.forEach(function (tab) {
        if (tab.textContent === "Hats") {
            tab.textContent = "Hair";
        } else if (tab.textContent === "Accessories") {
            tab.textContent = "Anal Plugs";
        }
    });

    //---------------------------------------------------------------------------------------------------------
    // Chat button
    var chatBox = document.getElementById("chatBox");
    if (chatBox) {
        chatBox.placeholder = "💬...";
        chatBox.style.backgroundColor = "rgba(128, 128, 128, 0.7)";
        chatBox.style.border = "2px solid black";
    }

    //---------------------------------------------------------------------------------------------------------
    // Everything related to the age
    const ageBar = document.querySelector("#ageBar");
    ageBar.style.height = "7px";
    ageBar.style.position = "fixed";
    ageBar.style.bottom = "20px";
    ageBar.style.left = "50%";
    ageBar.style.transform = "translateX(-50%)";
    ageBar.style.border = "2px solid black";
    ageBar.style.backgroundColor = "rgba(128, 128, 128, 0.7)";

    var actionBar = document.querySelector("#actionBar");
    actionBar.style.display = "none";

    var ageText = document.querySelector("#ageText");
    ageText.style.position = "fixed";
    ageText.style.bottom = "38px";
    //---------------------------------------------------------------------------------------------------------

    // pingDisplay
    var pingDisplay = document.getElementById("pingDisplay");
    if (pingDisplay) {
    pingDisplay.style.color = "black";
    pingDisplay.style.border = "2px solid black";
    pingDisplay.style.textColor = "black";
    pingDisplay.style.borderRadius = "6px";
    pingDisplay.style.backgroundColor = "rgba(128, 128, 128, 0.7)";
}
    //---------------------------------------------------------------------------------------------------------
    // Kill count, Alliance button, Shop button
    var killCounter = document.getElementById("killCounter");
    if (killCounter) {
        killCounter.style.border = "2px solid black";
        killCounter.style.backgroundColor = "rgba(128, 128, 128, 0.7)";
    }
    var allianceButton = document.getElementById("allianceButton");
    allianceButton.style.backgroundColor = "rgba(128, 128, 128, 0.7)";
    allianceButton.style.border = "2px solid black";

    var storeButton = document.getElementById("storeButton");
    storeButton.style.backgroundColor = "rgba(128, 128, 128, 0.7)";
    storeButton.style.border = "2px solid black";

    //---------------------------------------------------------------------------------------------------------
    // Game name
    const gameName = document.getElementById("gameName");
    gameName.style.position = "relative";
    gameName.style.bottom = "30px";
    gameName.innerHTML = "Grey Rain UI";
    gameName.style.textDecoration = "underline";
    gameName.style.textUnderlineOffset = "0.1em";
    //---------------------------------------------------------------------------------------------------------
    // Game name
    const enterGame = document.getElementById("enterGame");
    enterGame.style.border = "2px solid black";

    enterGame.innerHTML = "好转";
    const promoImgHolder = document.getElementById("promoImgHolder");
    promoImgHolder.style.display = "none";
    const partyButton = document.getElementById("partyButton");
    partyButton.style.display = "none";
    const mainMenu = document.getElementById("mainMenu");
    mainMenu.style.backgroundColor = "rgba(0, 0, 0)";
    //---------------------------------------------------------------------------------------------------------
    // Gold, Food, Wood, Stone
    const foodDisplay = document.querySelector("#foodDisplay");
    foodDisplay.style.backgroundColor = "rgba(128, 128, 128, 0.7)";
    foodDisplay.style.border = "2px solid black";

    const woodDisplay = document.querySelector("#woodDisplay");
    woodDisplay.style.backgroundColor = "rgba(128, 128, 128, 0.7)";
    woodDisplay.style.border = "2px solid black";

    const stoneDisplay = document.querySelector("#stoneDisplay");
    stoneDisplay.style.backgroundColor = "rgba(128, 128, 128, 0.7)";
    stoneDisplay.style.border = "2px solid black";

    const scoreDisplay = document.querySelector("#scoreDisplay");
    scoreDisplay.style.border = "2px solid black";
    scoreDisplay.style.backgroundColor = "rgba(128, 128, 128, 0.7)";

    //---------------------------------------------------------------------------------------------------------
    // Map
    const mapDisplay = document.querySelector("#mapDisplay");
    mapDisplay.style.backgroundColor = "rgba(128, 128, 128, 0.7)";
    mapDisplay.style.border = "2px solid black";
})();
