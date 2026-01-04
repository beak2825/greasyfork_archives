// ==UserScript==
// @name         NightLight Match Review Hotkeys
// @namespace    http://tampermonkey.net/
// @version      2025-08-17
// @description  Adds hotkeys to the NightLight match review screen. 1,2,3,4,5 picks a row. c toggles crossplay. r,f,m sets player association. b toggles bot. alt+m sets map.
// @author       Brok3nPix3l
// @match        https://nightlight.gg/review/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=nightlight.gg
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/546091/NightLight%20Match%20Review%20Hotkeys.user.js
// @updateURL https://update.greasyfork.org/scripts/546091/NightLight%20Match%20Review%20Hotkeys.meta.js
// ==/UserScript==

(function () {
  "use strict";
  const scoreboard = document.querySelector(
    "div._match_fi063_585._sb_870_fi063_335"
  );
  if (scoreboard === null) {
    console.error("couldn't find scoreboard div");
  }
  const playerRows = [];
  for (let i = 0; i < 5; i++) {
    playerRows[i] = scoreboard.children[i + 1];
  }
  const crossplayToggles = [];
  for (let i = 0; i < 5; i++) {
    crossplayToggles[i] =
      scoreboard.children[
        i + 1
      ].children[0].children[0].children[0].children[0];
  }
  const botToggles = [];
  for (let i = 0; i < 5; i++) {
    botToggles[i] =
      scoreboard.children[
        i + 1
      ].children[0].children[1].children[0].children[0];
  }
  const playerAssociations = [];
  for (let i = 0; i < 5; i++) {
    playerAssociations[i] = {
      random: scoreboard.children[i + 1].children[0].children[2].children[1],
      friend: scoreboard.children[i + 1].children[0].children[2].children[3],
      me: scoreboard.children[i + 1].children[0].children[2].children[5],
    };
  }
  let selectedRow = null;

  const otherOptions = document.querySelector(
    "div._matchContainerOptions_fi063_601"
  );
  const map =
    otherOptions.children[0].children[0].children[0].children[1].children[0]
      .children[0].children[1];

  const selectedOutlineStyle = "2px solid red";

  document.addEventListener("keydown", function (event) {
    switch (event.key) {
      case "1":
      case "2":
      case "3":
      case "4":
      case "5":
        for (let i = 0; i < 5; i++) {
          playerRows[i].style.outline = "";
        }
        if (selectedRow === Number(event.key) - 1) {
          selectedRow = null;
        } else {
          selectedRow = Number(event.key) - 1;
          playerRows[Number(event.key) - 1].style.outline =
            selectedOutlineStyle;
        }
        break;
      case "c":
        if (selectedRow === null) {
          break;
        }
        crossplayToggles[selectedRow].click();
        break;
      case "r":
        if (selectedRow === null) {
          break;
        }
        playerAssociations[selectedRow].random.click();
        break;
      case "f":
        if (selectedRow === null) {
          break;
        }
        playerAssociations[selectedRow].friend.click();
        break;
      case "m":
        if (event.altKey) {
          map.click();
          break;
        }
        if (selectedRow === null) {
          break;
        }
        playerAssociations[selectedRow].me.click();
        break;
      case "b":
        if (selectedRow === null) {
          break;
        }
        botToggles[selectedRow].click();
        break;
      default:
        console.debug(`unexpected key pressed: ${event.key}`);
    }
  });
})();
