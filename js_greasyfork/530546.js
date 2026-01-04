// ==UserScript==
// @name         Quick Search Title
// @namespace    https://greasyfork.org
// @license      MIT
// @version      1.2
// @description  Helps to quickly search titles for the game title chain forum game.
// @author       Nyannerz
// @match        https://gazellegames.net/torrents.php?id=*
// @icon         https://gazellegames.net/favicon.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/530546/Quick%20Search%20Title.user.js
// @updateURL https://update.greasyfork.org/scripts/530546/Quick%20Search%20Title.meta.js
// ==/UserScript==

const filterAdult = true;

(function() {
  'use strict';
  const titleElement = document.getElementById("groupplatform").nextSibling;
  const displayName = document.getElementById("display_name");
  const splitTitleParts = titleElement.nodeValue.trim().split(" ");
  titleElement.nodeValue = "";

  displayName.append(" – ");
  const fragment = document.createDocumentFragment();
  const adultRemovalAddon = filterAdult ? "&taglist=-adult" : "";

  for (let i = 1; i < splitTitleParts.length - 1; i++) {
    const trimmedPart = splitTitleParts[i].trim();
    const link = document.createElement("a");
    link.href = `https://gazellegames.net/torrents.php?action=basic&searchstr=${trimmedPart}${adultRemovalAddon}&order_by=relevance&order_way=desc`;
    link.textContent = trimmedPart;
    fragment.append(link, " ");
  }

  fragment.append(splitTitleParts[splitTitleParts.length - 1]);
  displayName.append(fragment);

  const groupRating = document.querySelector(".group_rating");
  if (groupRating && groupRating.parentElement) {
    displayName.append(groupRating);
  }
})();