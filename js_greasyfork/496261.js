// ==UserScript==
// @name        Empornium Tag Sorter
// @namespace   Violentmonkey Scripts
// @include     /^https://www\.empornium\.(me|sx|is)/
// @grant       none
// @license     WTFPL
// @version     1.1
// @author      DrNerdgasm
// @description Sort tags for each torrent when browsing
// @downloadURL https://update.greasyfork.org/scripts/496261/Empornium%20Tag%20Sorter.user.js
// @updateURL https://update.greasyfork.org/scripts/496261/Empornium%20Tag%20Sorter.meta.js
// ==/UserScript==

document
  .querySelectorAll("tr div.tags")
  .forEach((tagDiv) => {
    const newTags = Array.from(tagDiv.querySelectorAll("a"))
    newTags.sort((a1, a2) => {
      const nameA = a1.innerHTML;
      const nameB = a2.innerHTML;
      if (!nameA || !nameB) return;
      return nameA.localeCompare(nameB);
    });
    tagDiv.innerHTML = "";
    for (const tag of newTags) {
      tagDiv.appendChild(tag);
      tagDiv.appendChild(document.createTextNode(" "));
    }
  });
