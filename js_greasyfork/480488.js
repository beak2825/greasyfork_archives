// ==UserScript==
// @name         Click to copy hex - lawlesscreation.github.io
// @namespace    Violentmonkey Scripts
// @match        https://lawlesscreation.github.io/hex-color-visualiser/
// @grant        none
// @version      1.0
// @author       Riley Martine
// @description  Make individual hex tiles clickable to copy hex value to clipboard
// @license      GPL-3.0-or-later
// @downloadURL https://update.greasyfork.org/scripts/480488/Click%20to%20copy%20hex%20-%20lawlesscreationgithubio.user.js
// @updateURL https://update.greasyfork.org/scripts/480488/Click%20to%20copy%20hex%20-%20lawlesscreationgithubio.meta.js
// ==/UserScript==

"use strict";

// Copy hex value to clipboard, sans hash
function copyHex() {
  const hex = this.innerText.match(/#([0-9a-fA-F]{6})/)[1];
  navigator.clipboard.writeText(hex);

  // Notify that hex has been copied
  const notifyDiv = document.createElement("div");
  notifyDiv.appendChild(document.createTextNode(`Copied ${hex}`));
  notifyDiv.style = `
    position: absolute;
    background-color: #fff;
    padding: 1em;
    border: 3px solid #000;
    z-index: 9999;
  `;

  this.appendChild(notifyDiv);
  setTimeout(() => this.removeChild(notifyDiv), 1000);
}

// When update button is clicked, add onClick listeners to each new tile
const updateButton = document.getElementsByClassName("btn btn-primary")[0];
updateButton.addEventListener("click", () => {
  for (const tile of document.getElementsByClassName("tile")) {
    tile.addEventListener("click", copyHex);
  }
});
