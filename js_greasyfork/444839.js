// ==UserScript==
// @name        Flashpoint Browser expand all
// @namespace   https://greasyfork.org/en/users/436563-bbb651
// @match       https://nul.sh/misc/flashpoint/
// @grant       none
// @version     1.0
// @author      Bar Yemini
// @description Expands all games in view to easily see and recognize them by their image.
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/444839/Flashpoint%20Browser%20expand%20all.user.js
// @updateURL https://update.greasyfork.org/scripts/444839/Flashpoint%20Browser%20expand%20all.meta.js
// ==/UserScript==

const form = document.getElementById("search");
const row = document.createElement("div");
row.classList.add("form-row", "mt-2");
form.appendChild(row);

const expandColumn = document.createElement("div");
expandColumn.classList.add("col-auto");
row.appendChild(expandColumn);
const expandButton = document.createElement("button");
expandButton.onclick = () => {
  for (details of document.querySelectorAll(".game-details")) {
    let collapsable = new bootstrap.Collapse(details, {toggle: false});
    collapsable.show();
  }
};
expandButton.classList.add("btn", "btn-secondary");
expandButton.textContent = "Expand All";
expandColumn.appendChild(expandButton);


const collapseColumn = document.createElement("div");
collapseColumn.classList.add("col-auto");
row.appendChild(collapseColumn);
const collapseButton = document.createElement("button");
collapseButton.onclick = () => {
  for (details of document.querySelectorAll(".game-details")) {
    let collapsable = new bootstrap.Collapse(details, {toggle: false});
    collapsable.hide();
  }
};
collapseButton.classList.add("btn", "btn-secondary");
collapseButton.textContent = "Collapse All";
collapseColumn.appendChild(collapseButton);
