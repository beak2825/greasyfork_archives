// ==UserScript==
// @name         Rallysimfans.hu Comment Enjoyers
// @namespace    http://tampermonkey.net/
// @version      1.0.3
// @description  Keybinds: C (show rows with comments), V (expand comments)
// @author       pckv
// @license      MIT
// @match        https://*.rallysimfans.hu/rbr/rally_online.php*stage_no=*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=rallysimfans.hu
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/482802/Rallysimfanshu%20Comment%20Enjoyers.user.js
// @updateURL https://update.greasyfork.org/scripts/482802/Rallysimfanshu%20Comment%20Enjoyers.meta.js
// ==/UserScript==

(function () {
  "use strict";

  const hideDefault = GM_getValue("hideRowsWithoutComments", false);
  const expandDefault = GM_getValue("expandComments", false);

  const getRows = () => {
    const rows = document.querySelectorAll(
      ".rally_results_stres:not(.rally_results_header_sticky .rally_results_stres) .rally_results_stres_left > tbody tr"
    );
    return Array.from(rows);
  };

  const getTipText = (row) => {
    const onmouseover = row.getAttribute("onmouseover");
    if (onmouseover === null) {
      return null;
    }

    return onmouseover.match(/Tip\('(.*)'\)/)[1];
  };

  const resultRows = getRows();
  const resultRowsWithTipText = resultRows.filter(
    (row) => getTipText(row) !== null
  );
  const resultRowsWithoutTipText = resultRows.filter(
    (row) => getTipText(row) === null
  );

  const addTipRow = (row) => {
    const tipText = getTipText(row);
    const tipRow = document.createElement("tr");
    tipRow.classList.add("tip-row");
    const emptyCell = document.createElement("td");
    tipRow.appendChild(emptyCell);
    const tipCell = document.createElement("td");
    tipCell.setAttribute("colspan", "100%");
    tipCell.style.backgroundColor = "rgb(183, 190, 202)";
    tipCell.innerText = tipText;
    tipRow.appendChild(tipCell);
    row.parentNode.insertBefore(tipRow, row.nextSibling);
  };

  const getTipRows = () => {
    const rows = document.querySelectorAll(".tip-row");
    return Array.from(rows);
  };

  let hide = false;
  let expand = false;

  const handleHideRowsWithoutComments = () => {
    hide = !hide;

    if (hide && resultRowsWithTipText.length === 0) {
      return;
    }

    for (const row of resultRowsWithoutTipText) {
      if (hide) {
        row.style.display = "none";
      } else {
        row.style.display = "";
      }
    }
  };

  const handleExpandComments = () => {
    expand = !expand;

    if (expand) {
      for (const row of resultRowsWithTipText) {
        addTipRow(row);
      }
    } else {
      for (const row of getTipRows()) {
        row.remove();
      }
    }
  };

  const handleKey = (event) => {
    if (event.key === "c") {
      handleHideRowsWithoutComments();
      GM_setValue("hideRowsWithoutComments", hide);
    }
    if (event.key === "v") {
      handleExpandComments();
      GM_setValue("expandComments", expand);
    }
  };

  document.addEventListener("keyup", handleKey);

  if (hideDefault) {
    handleHideRowsWithoutComments();
  }

  if (expandDefault) {
    handleExpandComments();
  }
})();
