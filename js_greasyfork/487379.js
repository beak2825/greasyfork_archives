// ==UserScript==
// @name         Tabelka Gross
// @namespace    http://tampermonkey.net/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=butosklep.pl
// @version      1.2
// @description  Tabelka w PDF dla zamówień Grossa
// @author       Marcin
// @match        https://butosklep.finnergroup.com/picklist/orders/*
// @grant        none
// @require      https://cdnjs.cloudflare.com/ajax/libs/jspdf/1.5.3/jspdf.debug.js
// @downloadURL https://update.greasyfork.org/scripts/487379/Tabelka%20Gross.user.js
// @updateURL https://update.greasyfork.org/scripts/487379/Tabelka%20Gross.meta.js
// ==/UserScript==

(function () {
  "use strict";

  let table = document.querySelector(".card-body");
  let firstValues = [...table.querySelectorAll("a>div:nth-child(1)")].map(
    (e) => e.textContent
  );
  let secondValues = [...table.querySelectorAll("a>div:nth-child(2)")].map(
    (e) => e.textContent
  );
  let thirdValues = [...table.querySelectorAll("a>div:nth-child(3)")].map(
    (e) => e.textContent
  );

  let data = firstValues.map((value, index) => ({
    lp: value,
    order: secondValues[index],
    items: thirdValues[index],
    EMPTY: "",
  }));

  function generatePDF(dataArray) {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const startY = 7;
    const endY = doc.internal.pageSize.getHeight() - 7;
    const cellHeight = 16;
    const columnWidths = [30, 30, 50, 90];
    const startX = (pageWidth - columnWidths.reduce((a, b) => a + b, 0)) / 2;
    let currentY = startY;

    doc.setFontSize(18);

    function centerText(text, startX, columnWidth) {
      const textWidth = doc.getTextWidth(text);
      return startX + (columnWidth - textWidth) / 2;
    }

    function drawCellBorders(startY, endY) {
      for (let y = startY; y <= endY; y += cellHeight) {
        let x = startX;
        doc.line(
          startX,
          y,
          startX + columnWidths.reduce((a, b) => a + b, 0),
          y
        );
        for (let i = 0; i <= columnWidths.length; i++) {
          doc.line(x, startY, x, endY);
          x += i < columnWidths.length ? columnWidths[i] : 0;
        }
      }
    }

    ["Rolka", "Produkty", "Zamówienie", "Braki"].forEach((header, index) => {
      const x = centerText(
        header,
        startX + columnWidths.slice(0, index).reduce((a, b) => a + b, 0),
        columnWidths[index]
      );
      doc.text(header, x, currentY + cellHeight / 2);
    });
    currentY += cellHeight;

    dataArray.forEach((item, index) => {
      [item.lp, item.items, item.order, item.EMPTY].forEach((text, index) => {
        const x = centerText(
          text,
          startX + columnWidths.slice(0, index).reduce((a, b) => a + b, 0),
          columnWidths[index]
        );
        doc.text(text, x, currentY + cellHeight / 2);
      });
      currentY += cellHeight;
      if (currentY + cellHeight > endY) {
        drawCellBorders(startY, currentY);
        doc.addPage();
        currentY = 7;
        ["Rolka", "Produkty", "Zamówienie", "Braki"].forEach(
          (header, index) => {
            const x = centerText(
              header,
              startX + columnWidths.slice(0, index).reduce((a, b) => a + b, 0),
              columnWidths[index]
            );
            doc.text(header, x, currentY + cellHeight / 2);
          }
        );
        currentY += cellHeight;
      }
    });

    drawCellBorders(startY, currentY);

    doc.save("report.pdf");
  }

  const button = document.createElement("button");
  button.className = "float-right btn btn-lg btn-primary";
  button.textContent = "Generuj tabelkę";

  const wrapperDiv = document.createElement("div");
  wrapperDiv.classList.add("text-right");
  wrapperDiv.appendChild(button);

  let placeholder = document.querySelector(".card.bg-light.top");
  placeholder.appendChild(wrapperDiv);
  button.addEventListener("click", () => generatePDF(data));
})();
