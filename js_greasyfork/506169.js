// ==UserScript==
// @name        When2Meet User Filter with Styling
// @namespace   Violentmonkey Scripts
// @match       https://www.when2meet.com/*
// @grant       none
// @version     1.0
// @author      ulyssys
// @description Source: https://gist.github.com/Ulyssys/160e12ed2f14c0dadf0ee769a474d19b
// @grant GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/506169/When2Meet%20User%20Filter%20with%20Styling.user.js
// @updateURL https://update.greasyfork.org/scripts/506169/When2Meet%20User%20Filter%20with%20Styling.meta.js
// ==/UserScript==

// paste this into your browser console when looking at when2meet results
if (!window.OrigAvailableAtSlot) window.OrigAvailableAtSlot = AvailableAtSlot;
if (!window.OrigAvailableIDs) window.OrigAvailableIDs = AvailableIDs;
let nameFilter;
if ((nameFilter = document.getElementById("NameFilter"))) nameFilter.remove();
nameFilter = document.createElement("ul");
nameFilter.id = "NameFilter";
document.getElementById("LeftPanel").appendChild(nameFilter);
const idOn = (id) => document.getElementById(id).checked;
for (let i = 0; i < PeopleNames.length; i++) {
  const li = document.createElement("li");
  li.innerHTML =
    `<input type="checkbox" id="${PeopleIDs[i]}" checked>` +
    `&nbsp;<label for="${PeopleIDs[i]}">${PeopleNames[i]}</label>`;
  nameFilter.appendChild(li);
  li.addEventListener("change", () => {
    AvailableIDs = OrigAvailableIDs.filter(idOn);
    AvailableAtSlot = OrigAvailableAtSlot.map((avail) => avail.filter(idOn));
    ReColorGroup();
  });
}

GM_addStyle (`
.HalfPanel ul li {
    text-align: left !important;
}
`)