// ==UserScript==
// @name         Create Random Tracker Room
// @namespace    https://github.com/RuiNtD
// @version      1.0.1
// @description  Adds a button to OoT Networked Item Tracker that creates a random room
// @author       RuiNtD
// @match        https://oot-tracker.web.app/
// @match        https://ootr-tracker.web.app/
// @icon         https://icons.duckduckgo.com/ip2/ootrandomizer.com.ico
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/469619/Create%20Random%20Tracker%20Room.user.js
// @updateURL https://update.greasyfork.org/scripts/469619/Create%20Random%20Tracker%20Room.meta.js
// ==/UserScript==

const btn = document.createElement("button");
btn.innerText = "Create Random Room";
btn.addEventListener("click", () => {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let id = "";
  for (var i = 0; i < 20; i++) {
    id += chars.charAt(Math.floor(Math.random() * chars.length));
  }

  location.pathname = id;
});

let eleAfter = document.querySelector("p");
document.body.insertBefore(btn, eleAfter);
