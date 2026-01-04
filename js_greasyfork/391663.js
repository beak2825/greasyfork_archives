// ==UserScript==
// @name         Get Channel Points Twitch
// @version      1.6
// @description  Script that automatically get Twitch channel point chests.
// @author       Spielberg
// @include      https://www.twitch.tv/*
// @grant        none
// @icon         https://static.twitchcdn.net/assets/favicon-32-d6025c14e900565d6177.png
// @namespace      https://greasyfork.org/pt-BR/scripts/391663-get-channel-points-twitch
// @downloadURL https://update.greasyfork.org/scripts/391663/Get%20Channel%20Points%20Twitch.user.js
// @updateURL https://update.greasyfork.org/scripts/391663/Get%20Channel%20Points%20Twitch.meta.js
// ==/UserScript==

function getCoin() {
  setInterval(() => {
    const chest = document.querySelector(".claimable-bonus__icon");
    if (chest != undefined) {
        chest.click();
    }
  }, 1000);
}

getCoin();
