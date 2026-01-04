// ==UserScript==
// @name Gamesites IP Connect
// @description Open CSGO, and connect to highlighted IP
// @version 1.1
// @namespace https://www.gamesites.cz/
// @match *://www.gamesites.cz/*
// @grant none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/459279/Gamesites%20IP%20Connect.user.js
// @updateURL https://update.greasyfork.org/scripts/459279/Gamesites%20IP%20Connect.meta.js
// ==/UserScript==

(function() {
  'use strict';

  let serverRows = document.querySelectorAll(".server");

  for (let i = 0; i < serverRows.length; i++) {
    let serverRow = serverRows[i];

    let ipAddress = serverRow.querySelector(".ip").textContent;

    let serverContainer = document.createElement("div");
    serverContainer.style.position = "relative";

    let joinButton = document.createElement("button");
    joinButton.innerHTML = "Join";
    joinButton.style.font = "11.4px Verdana";
    joinButton.style.color = "#838383";
    joinButton.style.position = "absolute";
    joinButton.style.right = "95px";
    joinButton.style.top = "50%";
    joinButton.style.transform = "translateY(-50%)";
    joinButton.style.width = "40px";
    joinButton.style.height = "18px";
    joinButton.addEventListener("mouseover", function() {
        joinButton.style.backgroundColor = "#C7C7CC";
        joinButton.style.transform = "scale(1.1) translateY(-50%)";
});
    joinButton.addEventListener("mouseout", function() {
        joinButton.style.backgroundColor = "";
        joinButton.style.transform = "scale(1) translateY(-50%)";
});
   joinButton.addEventListener("click", function() {
      window.open("steam://connect/" + ipAddress);
});

    let ipAddressDiv = serverRow.querySelector(".ip");
    let playersDiv = serverRow.querySelector(".players");
    ipAddressDiv.parentNode.insertBefore(serverContainer, ipAddressDiv);

    serverContainer.appendChild(ipAddressDiv);
    serverContainer.appendChild(joinButton);
    serverContainer.appendChild(playersDiv);
  }
})();
