// ==UserScript==
// @name Steam Cracked Category
// @description Adds buttons to Steam pages that searches for games on different websites on a new tab.
// @version 1.1
// @license MIT
// @match https://store.steampowered.com/app/*
// @icon https://i.imgur.com/8CoJnwB.png
// @namespace
// @namespace https://greasyfork.org/users/1167434
// @downloadURL https://update.greasyfork.org/scripts/474686/Steam%20Cracked%20Category.user.js
// @updateURL https://update.greasyfork.org/scripts/474686/Steam%20Cracked%20Category.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // Get the game name from the URL after /app/number/
  var gameName = decodeURIComponent(window.location.pathname.split("/")[3].replace(/_/g, " "));

  // Find the ignore button
  var ignoreButton = document.querySelector("#ignoreBtn");

  // Create a container div for the "CRACKED" category
  var categoryContainer = document.createElement("div");
  categoryContainer.style.marginTop = "30px";

  // Create a new category header for "CRACKED"
  var categoryHeader = document.createElement("div");
  categoryHeader.style.fontWeight = "bold";
  categoryHeader.style.fontSize = "21px"; // Set font size to 21px
  categoryHeader.style.marginBottom = "10px"; // Add 10px margin gap below
  categoryHeader.textContent = "CRACKED:"; // Uppercase "CRACKED"

  // Append the category header to the container
  categoryContainer.appendChild(categoryHeader);

  // Buttons for various websites in the "CRACKED" category
  var sites = [
    { url: "https://www.skidrowreloaded.com/?s=", text: "SkidrowReloaded", bgColor: "rgba(103, 193, 245, 0.2)" },
    { url: "https://igg-games.com/?s=", text: "IGG-Games", bgColor: "rgba(103, 193, 245, 0.2)" },
    { url: "https://x1337x.ws/srch?search=", text: "x1337x", bgColor: "rgba(103, 193, 245, 0.2)" },
    { url: "https://game3rb.com/?s=", text: "Game3rb", bgColor: "rgba(103, 193, 245, 0.2)" },
    { url: "https://online-fix.me/index.php?do=search&subaction=search&story=", text: "Onlinefix", bgColor: "rgba(103, 193, 245, 0.2)" },
    { url: "https://fitgirl-repacks.site/?s=", text: "Fitgirl Repacks", bgColor: "rgba(103, 193, 245, 0.2)" },
    { url: "https://dodi-repacks.site/?s=", text: "Dodi Repack", bgColor: "rgba(103, 193, 245, 0.2)" }
  ];

  // Create and insert the buttons under the "CRACKED" category
  for (var i = 0; i < sites.length; i++) {
    var button = createButton(sites[i].url, sites[i].text, sites[i].bgColor);
    categoryContainer.appendChild(button);
  }

  // Insert the category container after the "Ignore" button (if it exists)
  if (ignoreButton) {
    ignoreButton.parentNode.insertBefore(categoryContainer, ignoreButton.nextSibling);
  }

  // Create a new button element for "SkidrowReloaded"
  function createButton(url, buttonText, bgColor) {
    var button = document.createElement("a");
    button.className = "btnv6_blue_hoverfade btn_medium";
    button.style.marginLeft = "10px";
    button.innerHTML = '<span>' + buttonText + '</span>';
    button.style.backgroundColor = bgColor;
    button.style.color = "#67c1f5"; // Set font color to #67c1f5

    button.onclick = function () {
      window.open(url + encodeURIComponent(gameName));
    };

    return button;
  }
})();
