// ==UserScript==
// @name         Randomize Xopar Tracker Room Name
// @namespace    https://github.com/RuiNtD
// @version      1.0
// @description  Adds a button to Xopar Tracker that randomizes the room name
// @author       RuiNtD
// @match        https://ootr-random-settings-tracker.web.app/
// @icon         https://icons.duckduckgo.com/ip2/ootrandomizer.com.ico
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/469623/Randomize%20Xopar%20Tracker%20Room%20Name.user.js
// @updateURL https://update.greasyfork.org/scripts/469623/Randomize%20Xopar%20Tracker%20Room%20Name.meta.js
// ==/UserScript==

const btn = document.createElement("button");
btn.innerText = "Random Name";
btn.classList.add("ready");
btn.addEventListener("click", () => {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let id = "";
  for (var i = 0; i < 20; i++)
    id += chars.charAt(Math.floor(Math.random() * chars.length));

  /** @type {HTMLInputElement} */
  const roomID = document.querySelector("#room_id");
  roomID.value = id;
  roomID.dispatchEvent(new MouseEvent("input"));
});

setTimeout(() => {
  const eleAfter = document.querySelector("br");
  document.body.insertBefore(btn, eleAfter);
});
