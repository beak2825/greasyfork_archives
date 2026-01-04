// ==UserScript==
// @name         Export M1 Holdings as CSV
// @namespace    http://tampermonkey.net/
// @version      0.2.1
// @description  Export M1Finance holdings as csv file!
// @match        https://dashboard.m1finance.com/d/research/my-pies/details/*
// @match        https://dashboard.m1finance.com/d/invest/holdings
// @icon         https://www.google.com/s2/favicons?domain=m1finance.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/435353/Export%20M1%20Holdings%20as%20CSV.user.js
// @updateURL https://update.greasyfork.org/scripts/435353/Export%20M1%20Holdings%20as%20CSV.meta.js
// ==/UserScript==

(function () {
  "use strict";

  var createExportButton = function () {
    const exportHoldingsBtn = document.createElement(`exportHoldingsBtn`);
    exportHoldingsBtn.innerHTML = `<button id="exportHoldingsBtn" class="Tab__StyledTab-sc-14kqdmz-0 fglGvd">Export Holdings</button>`;
    const exportPieBtn = document.createElement(`exportPieBtn`);
    exportPieBtn.innerHTML = `<button id="exportPieBtn" class="Tab__StyledTab-sc-14kqdmz-0 fglGvd">Export Pie</button>`;

    // force react to rendor whole page
    var scrollingElement = document.scrollingElement || document.body;
    scrollingElement.scrollTop = scrollingElement.scrollHeight;
    scrollingElement.scrollTop = 0;

    const downloadToFile = (content, filename, contentType) => {
      const a = document.createElement("a");
      const file = new Blob([content], { type: contentType });

      a.href = URL.createObjectURL(file);
      a.download = filename;
      a.click();

      URL.revokeObjectURL(a.href);
    };

    if (
      window.location.href ===
      "https://dashboard.m1finance.com/d/invest/holdings"
    ) {
      document
        .querySelector(".style__withOneAccountCta__36K14")
        .insertAdjacentElement("afterEnd", exportHoldingsBtn);

      document
        .querySelector("#exportHoldingsBtn")
        .addEventListener("click", () => {
          let grid = [];
          function getOnlyTopInnerText(el) {
            var texts = [];
            var child = el.firstChild;
            while (child) {
              if (child.nodeType == 3) {
                texts.push(child.data);
              }
              child = child.nextSibling;
            }
            if (texts.length == 0) {
              texts.push(el.innerText);
            }
            return texts.join("");
          }
          var headerDivs = document.querySelectorAll(
            ".header-cell__StyledGridTableHeaderCell-sc-1va53me-0"
          );
          let headers = [];
          headerDivs.forEach((el) => {
            var header = getOnlyTopInnerText(el);
            if(header === "Name" )
                header = "Symbol"
            else if(header === "Shares")
                header = "# of Shares"
            else if(header === "Avg. price")
                header = "Avg Buying Price"
            headers.push(header);
          });

          const tickerCol = [];
          document
            .querySelectorAll(".row__StyledGridTableRow-ncfewc-0")
            .forEach((el) => {
              tickerCol.push(
                el
                  .querySelector(".style__identifiers__2GQQX")
                  .querySelector(".sc-bdnylx.iknZmu").innerText
              );
            });

          grid.push(headers);

          document
            .querySelectorAll(".row__StyledGridTableRow-ncfewc-0")
            .forEach((row, i) => {
              let outRow = [];
              row
                .querySelectorAll(".cell__StyledGridTableCell-sc-1xvj9hq-0")
                .forEach((col, j) => {
                  if (j == 0) {
                    outRow.push(
                      col
                        .querySelector(".style__identifiers__2GQQX")
                        .querySelector(".sc-bdnylx.iknZmu").innerText
                    );
                  } else {
                    outRow.push(getOnlyTopInnerText(col).replace(",", ""));
                  }
                });

              grid.push(outRow.join(", "));
            });
          console.log(grid);
          downloadToFile(
            grid.join("\n").replace(/[\x00-\x08\x0E-\x1F\x7F-\uFFFF]/g, ""),
            "holdings.csv",
            "application/json; charset=utf-8"
          );
        });
    } else {
      document
        .querySelector(".style__withOneAccountCta__36K14")
        .insertAdjacentElement("afterEnd", exportPieBtn);

      document.querySelector("#exportPieBtn").addEventListener("click", () => {
        let list = document.querySelectorAll(".style__slice__3nWPE");
        var stocks = [];
        for (let item of list) {
          var nodes = item.querySelectorAll(".sc-bdnylx");
          var first = nodes[0].innerHTML;
          var last = nodes[nodes.length - 1].innerHTML;
          stocks.push([first, last].join(", "));
        }
        var holdingsString = "STOCK, PERCENTAGE\n" + stocks.join("\n");
        downloadToFile(holdingsString, "holdings.csv", "text/plain");
      });
    }
  };
  setTimeout(createExportButton, 2000);
})();
