// ==UserScript==
// @name         Collapse/expand all HIT details - TurkerView
// @version      0.1
// @description  Collapses/expands all HIT details
// @author       lucassilvas1
// @match        https://turkerview.com/requesters/*
// @grant        GM_addStyle
// jshint        esversion: 6
// @namespace https://greasyfork.org/users/846945
// @downloadURL https://update.greasyfork.org/scripts/437877/Collapseexpand%20all%20HIT%20details%20-%20TurkerView.user.js
// @updateURL https://update.greasyfork.org/scripts/437877/Collapseexpand%20all%20HIT%20details%20-%20TurkerView.meta.js
// ==/UserScript==

(function () {
  "use strict";

  document.getElementById("liHITs").addEventListener(
    "click",
    () => {
      let collapsed = true;

      const checkIfExists = setInterval(() => {
        const hitsTab = document.getElementById("HITs");
        if (hitsTab) {
          clearInterval(checkIfExists);

          const rows = document
            .getElementsByTagName("tbody")[0]
            .querySelectorAll("tr");
          const detailRows = [...rows].filter((_, i) => i % 2 != 0);

          GM_addStyle(`
          #collapse-expand-btn {
            display: inline-block;
            float: right;
            background-color: transparent;
            border: none;
            text-decoration: underline;
          }
        `);

          hitsTab.insertAdjacentHTML(
            "afterbegin",
            '<button type="button" id="collapse-expand-btn">expand all</button>'
          );

          const button = document.getElementById("collapse-expand-btn");

          button.addEventListener("click", () => {
            if (collapsed) {
              button.textContent = "collapse all";
              collapsed = false;
              detailRows.forEach((row) => row.classList.remove("hidden"));
            } else {
              button.textContent = "expand all";
              collapsed = true;
              detailRows.forEach((row) => row.classList.add("hidden"));
            }
          });
        }
      }, 300);
    },
    { once: true }
  );
})();
