// ==UserScript==
// @name         Highlight PA Positions
// @namespace    https://torn.report/userscripts/
// @version      0.1
// @description  Split all available members into PA positions to facilitate planning.
// @author       Skeletron [318855]
// @match        https://www.torn.com/factions.php?step=your*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @license      GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/495400/Highlight%20PA%20Positions.user.js
// @updateURL https://update.greasyfork.org/scripts/495400/Highlight%20PA%20Positions.meta.js
// ==/UserScript==

const colors = {
  1: "#65a30d66",
  2: "#eab30866",
  3: "#ea580c66",
  4: "#dc262666",
};

(function () {
  "use strict";

  const targetNode = document.getElementById("faction-crimes");
  const config = { childList: true, subtree: true };

  const highlightPositions = (mutationList, observer) => {
    const paPlanner = document.querySelector("li.item-wrap.last");
    if (paPlanner) {
      const membersList = paPlanner.querySelector("ul.plans-list");
      if (membersList) {
        const members = membersList.children;
        const participants = members.length - (members.length % 4);
        const teamCount = participants / 4;
        for (let i = 0; i < members.length; i++) {
          const position = Math.floor(i / teamCount) + 1;
          members[i].style.backgroundColor = colors[position];
        }
      }
    }
    // observer.disconnect();
  };

  const observer = new MutationObserver(highlightPositions);
  observer.observe(targetNode, config);
})();
