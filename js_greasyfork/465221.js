// ==UserScript==
// @name        NovelUpdates Warning for Hiatus, Axed, Discontinued, etc.
// @description This will display a red warning label for any series that aren't likely to be finished due do being axed, etc. based on the status field of the NU page.
// @version     0.1
// @match       https://www.novelupdates.com/series/*
// @icon        https://www.novelupdates.com/favicon.ico
// @license MIT
// @namespace https://greasyfork.org/users/721922
// @downloadURL https://update.greasyfork.org/scripts/465221/NovelUpdates%20Warning%20for%20Hiatus%2C%20Axed%2C%20Discontinued%2C%20etc.user.js
// @updateURL https://update.greasyfork.org/scripts/465221/NovelUpdates%20Warning%20for%20Hiatus%2C%20Axed%2C%20Discontinued%2C%20etc.meta.js
// ==/UserScript==


function addStatusText(text) {
  const title = document.querySelector(".seriestitlenu");
  const statusSpan = document.createElement("span");
  statusSpan.style = "color: #ff0000; text-transform: capitalize";
  statusSpan.textContent = ` (${text})`;
  title.append(statusSpan);
}


function main() {
  const statusDiv = document.querySelector("#editstatus");
  const results = statusDiv.textContent.match(/\b(?:hiatus|discontinued|axed|dead|death|cancelled|unfinished)\b/i);
  console.log(results);
  if (results && results.length) {
    const statusText = results[0];
    addStatusText(statusText);
  }
}


main();
