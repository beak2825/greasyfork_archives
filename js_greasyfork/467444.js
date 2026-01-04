// ==UserScript==
// @name         Mod Menu V2
// @version      0.1
// @description  This is a simple mod menu that can be used to change the game's settings.
// @author       Caiden
// @match        https://orteil.dashnet.org/cookieclicker/*
// @grant        none
// @namespace https://greasyfork.org/users/1086912
// @downloadURL https://update.greasyfork.org/scripts/467444/Mod%20Menu%20V2.user.js
// @updateURL https://update.greasyfork.org/scripts/467444/Mod%20Menu%20V2.meta.js
// ==/UserScript==

(function() {

  // Create the mod menu element.
  var modMenu = document.createElement("div");
  modMenu.id = "mod-menu";

  // Add some buttons to the mod menu.
  var button1 = document.createElement("button");
  button1.textContent = "God Mode";
  button1.onclick = function() {
    // Do something when the "God Mode" button is clicked.
  };

  var button2 = document.createElement("button");
  button2.textContent = "Noclip";
  button2.onclick = function() {
    // Do something when the "Noclip" button is clicked.
  };

  // Add the buttons to the mod menu.
  modMenu.appendChild(button1);
  modMenu.appendChild(button2);

  // Append the mod menu to the document.
  document.body.appendChild(modMenu);

})();
