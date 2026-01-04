// ==UserScript==
// @name         MouseHunt - OG Cutoffs
// @author       Tran Situ (tsitu)
// @namespace    https://greasyfork.org/en/users/232363-tsitu
// @version      0.1.1
// @description  Computes "OG" tourney placements next to tied values
// @match        http://www.mousehuntgame.com/*
// @match        https://www.mousehuntgame.com/*
// @downloadURL https://update.greasyfork.org/scripts/418641/MouseHunt%20-%20OG%20Cutoffs.user.js
// @updateURL https://update.greasyfork.org/scripts/418641/MouseHunt%20-%20OG%20Cutoffs.meta.js
// ==/UserScript==

(function () {
  function scan() {
    const target = document.querySelector(".scoreboardTableView-table");

    if (target) {
      const currentPage = +document.querySelector(
        ".pagerView-section-currentPage"
      ).textContent;

      if (currentPage && currentPage > 0) {
        let iter = 1;
        document
          .querySelectorAll(
            ".scoreboardTableView-row:not(.viewer) .scoreboardTableView-row-rank.scoreboardTableView-column"
          )
          .forEach(el => {
            const ogVal = (currentPage - 1) * 25 + iter;
            iter += 1;
            const output = el.querySelector(".tournament-team-rank");
            const currText = output.textContent;
            if (currText.indexOf("/") < 0) {
              output.textContent = `${ogVal} / ${currText}`;
            }
          });
      }
    }
  }

  scan();
  $(document).ajaxStop(scan);
})();
