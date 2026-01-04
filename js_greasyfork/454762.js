// ==UserScript==
// @name        Lecteur Auto-Selector
// @namespace   Violentmonkey Scripts
// @match       https://*voiranime.com/*
// @grant       none
// @version     2023.09.29#1
// @author      -
// @license     MIT
// @description 13/11/2022 22:04:50
// @downloadURL https://update.greasyfork.org/scripts/454762/Lecteur%20Auto-Selector.user.js
// @updateURL https://update.greasyfork.org/scripts/454762/Lecteur%20Auto-Selector.meta.js
// ==/UserScript==
function playerExist(player, playerList) {
  for (let p of playerList) {
    if (`LECTEUR ${player}` === p.label) {
      return true;
    }
  }
  return false;
}

if (localStorage.getItem('player') === null) {
  let players = document.getElementsByClassName('select-view')[0].children[0].children[0].children[0].children;
  let playersString = new String();

  for (let p of players) {
    playersString += `- ${p.label}\n`;
  }

  let player = prompt(`You need to set a default player. Here are the detected players:\n${playersString}Please write which one should be used:`);

  while (playerExist(player, players) === false) {
      player = prompt(`You entered a non valid player !\nYou need to set a default player. Here are the detected players:\n${playersString}Please write which one should be used:`);
  }

  localStorage.setItem('player', `LECTEUR ${player}`);
}

let selector = document.getElementsByClassName("selectpicker host-select")[0];
selector.value = localStorage.getItem('player');