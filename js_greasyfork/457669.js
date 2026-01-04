// ==UserScript==
// @name        Steam Market Linker
// @description Adds a button to the bottom right corner of the page when you visit a Steam store page for a game. When you click the button, it opens the Steam Market page for that game in a new tab.
// @namespace   steam
// @match       *://store.steampowered.com/app/*
// @grant       none
// @license     MIT
// @version 0.0.1.20230105040843
// @downloadURL https://update.greasyfork.org/scripts/457669/Steam%20Market%20Linker.user.js
// @updateURL https://update.greasyfork.org/scripts/457669/Steam%20Market%20Linker.meta.js
// ==/UserScript==

const linkButton = document.createElement("button");
linkButton.innerText = "Link to Steam Market";
linkButton.style.position = "fixed";
linkButton.style.bottom = "10px";
linkButton.style.right = "10px";
linkButton.addEventListener("click", () => {
  const gameId = window.location.pathname.match(/\/app\/(\d+)\//)[1];
  const steamMarketUrl =`https://steamcommunity.com/market/search?q=&category_753_Game%5B%5D=tag_app_${gameId}&category_753_cardborder%5B%5D=tag_cardborder_0&appid=753#p1_popular_desc`;
  window.open(steamMarketUrl, "_blank");
});
document.body.appendChild(linkButton);
