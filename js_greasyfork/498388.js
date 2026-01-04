// ==UserScript==
// @name         Steam Level Changer
// @namespace    http://tampermonkey.net/
// @version      2024-06-20
// @description  Change your Steam level (only UI)!
// @author       Sr.Caveira
// @match        https://steamcommunity.com/id/*
// @match        https://steamcommunity.com/profiles/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=steamcommunity.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/498388/Steam%20Level%20Changer.user.js
// @updateURL https://update.greasyfork.org/scripts/498388/Steam%20Level%20Changer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Font Awesome Link
    const fontAwesomeLink = document.createElement("link");

    fontAwesomeLink.setAttribute("rel", "stylesheet");
    fontAwesomeLink.href = "https://site-assets.fontawesome.com/releases/v6.2.0/css/all.css";

    // Menu Style
    const menuStyle = document.createElement("style");

    menuStyle.innerHTML = `
.level-menu-container {
  display: none;
  position: fixed;
  max-width: max-content;
}

.level-menu-container * {
  box-sizing: border-box;
}

.level-menu {
  display: flex;
  flex-direction: column;
  background: #3D4450;
  width: 100%;
  font-family: "Arial", sans-serif; /* Motiva Sans */
}

.level-menu-header {
  background: #171d25;
  width: 100%;
  padding: 10px;
}

.level-menu-title {
  color: #fff;
}

.level-menu-title a {
  color: #fff;
}

.level-menu-option {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px;
  color: #fff;
}

#level_number_text {
  padding: 5px;
  border: 1px solid #fff;
  border-radius: 5px;
  width: 60px;
}
`;

    // Menu Div Container
    const menuDiv = document.createElement("div");

    menuDiv.className = "level-menu-container";
    menuDiv.innerHTML = `
<div class="level-menu">
  <div class="level-menu-header">
    <span class="level-menu-title"><i class="fa-brands fa-steam"></i>&nbsp;Steam Level Changer - <a href="https://steamcommunity.com/id/srcaveira/">Sr.Caveira</a>&nbsp;<i class="fa-solid fa-skull"></i>&nbsp;<i class="fa-solid fa-code"></i></span>
  </div>

  <div class="level-menu-option">Level <input type="range" id="level_number" value="0" min="0" max="5099" />
    <input type="number" id="level_number_text" value="0" min="0" max="5099" />
  </div>
</div>
`;

    document.head.appendChild(menuStyle);
    document.head.appendChild(fontAwesomeLink);
    document.body.appendChild(menuDiv);

    // Menu Variables
    const levelMenuContainer = document.querySelector(".level-menu-container");
    const levelNumberElement = document.getElementById("level_number");
    const levelNumberTextElement = document.getElementById("level_number_text");

    // Steam Variables
    let steamLevelElement = null;
    let steamPlayerLevel = null;
    let steamPlayerLevelNumber = null;
    let steamClassLevel = "";
    let steamLevel = 0;
    let isRunning = false;

    // Verifying if are into the profile page to change the level
    if (
        window.location.href.match("https://steamcommunity.com/id/") ||
        window.location.href.match("https://steamcommunity.com/profiles/")
    ) {
        steamLevelElement = document.querySelector(".persona_name.persona_level");
        steamPlayerLevel = steamLevelElement.querySelector(".friendPlayerLevel");
        steamPlayerLevelNumber = steamLevelElement.querySelector(".friendPlayerLevelNum");
        isRunning = true;
        levelNumberTextElement.value = steamPlayerLevelNumber.innerText;
        levelNumberElement.value = steamPlayerLevelNumber.innerText;
        steamClassLevel = roundToTensWithUnits(levelNumberElement.value);
        steamLevel = levelNumberElement.value;
    } else {
        alert("Please, go to your profile and then execute this code again!");
        isRunning = false;
    }

    function updateLevelMenuSettings() {
        levelNumberTextElement.value = levelNumberElement.value;
        levelNumberElement.value = levelNumberElement.value;
        steamClassLevel = roundToTensWithUnits(levelNumberElement.value);
        steamLevel = levelNumberElement.value;

        updateSteamLevel();
    }

    function updateLevelRange() {
        if (levelNumberTextElement.value == "") {
            levelNumberElement.value = 0;
            steamClassLevel = roundToTensWithUnits(levelNumberElement.value);
            steamLevel = levelNumberElement.value;

            updateSteamLevel();

            return;
        } else if (parseInt(levelNumberTextElement.value) > 5099) {
            levelNumberElement.value = 5099;
            levelNumberTextElement.value = "5099";
            steamClassLevel = roundToTensWithUnits(levelNumberElement.value);
            steamLevel = levelNumberElement.value;

            updateSteamLevel();

            return;
        }

        levelNumberElement.value = levelNumberTextElement.value;
        steamClassLevel = roundToTensWithUnits(levelNumberElement.value);
        steamLevel = levelNumberElement.value;

        updateSteamLevel();
    }

    function updateSteamLevel() {
        if (!isRunning) {
            return;
        }

        steamPlayerLevel.className = "friendPlayerLevel " + steamClassLevel;
        steamPlayerLevelNumber.innerText = steamLevel;
    }

    function openSteamLevelChangerMenu(event) {
        event.preventDefault();

        if (levelMenuContainer.style.display == "" || levelMenuContainer.style.display == "none") {
            levelMenuContainer.style.display = "unset";
            levelMenuContainer.style.left = event.clientX + "px";
            levelMenuContainer.style.top = event.clientY + "px";

            return;
        }

        levelMenuContainer.style.display = "none";
    }

    function roundToTensWithUnits(level) {
        level = parseInt(level);

        let levelNumber = 0;
        let levelClass = "";

        if (level < 10) {
            levelNumber = 0;
            levelClass = `lvl_${levelNumber}`;
        } else if (level < 100) {
            levelNumber = Math.floor(level / 10) * 10;
            levelClass = `lvl_${levelNumber}`;
        } else {
            levelNumber = Math.floor(level / 100) * 100;

            const units = level % 100;

            if (units >= 10) {
                levelClass = `lvl_${levelNumber} lvl_plus_${units - (units % 10)}`;
            } else {
                levelClass = `lvl_${levelNumber}`;
            }
        }

        return `lvl_${levelNumber} lvl_plus_${levelClass}`;
    }

    // Update the level oninput the range
    levelNumberElement.addEventListener("input", updateLevelMenuSettings, false);

    // Update the level oninput and onpaste into the input
    levelNumberTextElement.addEventListener("input", updateLevelRange, false);
    levelNumberTextElement.addEventListener("paste", updateLevelRange, false);

    // Event to open the menu to change steam level
    document.addEventListener("contextmenu", event => openSteamLevelChangerMenu(event), false);
})();