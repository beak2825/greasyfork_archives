// ==UserScript==
// @name         [GC] Smarter Stock Market
// @description  Highlights stocks that meet thresholds for buying and selling.
// @icon         https://www.google.com/s2/favicons?sz=64&domain=grundos.cafe
// @match        https://www.grundos.cafe/games/stockmarket/*
// @author       aether
// @namespace    https://github.com/hlmartin/gc-userscripts/
// @version      1.1.1
// @license      MIT
// @supportURL   https://github.com/hlmartin/gc-userscripts/issues
// @require      https://cdn.jsdelivr.net/npm/sortable-tablesort@4.1.1/dist/sortable.min.js
// @resource     SORTABLE_CSS https://cdn.jsdelivr.net/gh/tofsjonas/sortable@4.1.1/dist/sortable-base.min.css
// @grant        GM_addStyle
// @grant        GM_getResourceText
// @downloadURL https://update.greasyfork.org/scripts/547466/%5BGC%5D%20Smarter%20Stock%20Market.user.js
// @updateURL https://update.greasyfork.org/scripts/547466/%5BGC%5D%20Smarter%20Stock%20Market.meta.js
// ==/UserScript==

// ------------------------------------------------------
// User editable variables

const BUY_THRESHOLD = 15; // in neopoints
const SELL_THRESHOLD = 150.00; // in change percentage
const HIGHLIGHT_COLOUR = ''; // a hex colour or HTML-safe colour name

// ------------------------------------------------------

const sortableCss = GM_getResourceText("SORTABLE_CSS");
GM_addStyle(sortableCss);

const isDarkMode = document.querySelector('html').getAttribute('data-dark-mode') === 'true';
const defaultHighlightColour = isDarkMode ? '#313171' : '#bdbdff';
const highlightColour = HIGHLIGHT_COLOUR === '' ? defaultHighlightColour : HIGHLIGHT_COLOUR;

const customCss = `
  .highlighted-cell {
    background-color: ${highlightColour} !important;
  }
  .no-stocks {
    font-size: 24px;
    text-align: center;
  }
`;
GM_addStyle(customCss);

let tableName;

const tableClass = () => `.${tableName}-table`;
const cellClass = () => `.${tableName}-cell`;

const sortTable = (applyHighlightFn) => {
  const isStocks = tableName === 'stocks';
  const isPortfolio = tableName === 'portfolio';

  const table = document.querySelector(tableClass());
  if (!table) {
    return;
  }
  table.classList.add("sortable");

  // Exclude the top-tier portfolio headers and logo column from being sortable
  if (isPortfolio) {
    const topHeaders = document.querySelectorAll(`${tableClass()} > thead > tr:first-of-type > th`);
    topHeaders.forEach((header) => header.classList.add("no-sort"));
  }

  const logo = document.querySelector(`${tableClass()} > thead > tr:last-of-type > th:first-of-type`);
  logo.classList.add("no-sort");

  // Give the totals row a unique id so we can find it later
  const lastRow = document.querySelector(`${tableClass()} > tbody > tr:last-of-type`);
  if (lastRow.textContent.includes("Totals")) {
    lastRow.id = "totals-row";
  }

  const rows = document.querySelectorAll(`${tableClass()} > tbody > tr`);
  rows.forEach((row) => {
    const isHidden = window.getComputedStyle(row).display === "none";
    const isTotals = row.getAttribute("id") === "totals-row";
    if (isHidden || isTotals) {
      return;
    }

    // Give the % Change rows a more normative sort value so it properly sorts them
    // in the order of positive, zero, and negative percentages.
    const change = row.querySelector(`${cellClass()}:last-of-type`);
    change.setAttribute("data-sort", change.textContent.replace(/\s|%|\+/g, ''))

    // The other large numerical values need a sort value excluding commas
    if (isPortfolio) {
      const qty = row.querySelector(`${cellClass()}:nth-of-type(6)`);
      qty.setAttribute("data-sort", qty.textContent.replace(/\s|\,+/g, ''));

      const paid = row.querySelector(`${cellClass()}:nth-of-type(7)`);
      paid.setAttribute("data-sort", paid.textContent.replace(/\s|\,+/g, ''));

      const mktValue = row.querySelector(`${cellClass()}:nth-of-type(8)`);
      mktValue.setAttribute("data-sort", mktValue.textContent.replace(/\s|\,+/g, ''));
    }

    if (isStocks) {
      const volume = row.querySelector(`${cellClass}:nth-of-type(4)`);
      volume.setAttribute("data-sort", volume.textContent.replace(/\s|\,+/g, ''));
    }

    if (applyHighlightFn(row)) {
      row.classList.add("highlighted-row");
      Object.values(row.children).forEach((cell) => cell.classList.add("highlighted-cell"));
    }
  });

  const hasHighlightedRows = !!document.querySelector(".highlighted-row");
  if (!hasHighlightedRows && isStocks) {
    const div = document.createElement("div");
    div.textContent = "😭 There are no buyable stocks at this time.";
    div.classList.add("no-stocks");

    const tableContainer = table.closest("div.center");
    tableContainer.prepend(div);
  };
}

const isSellable = (row) => {
  const change = row.querySelector(`${cellClass()}:last-of-type`);
  const sortValue = change.getAttribute("data-sort");
  return parseFloat(sortValue) >= SELL_THRESHOLD;
};

const isBuyable = (row) => {
  const currentValue = row.querySelector(`${cellClass()}:nth-child(6)`).textContent;
  return parseInt(currentValue) == BUY_THRESHOLD;
};

const sortPortfolio = () => {
  sortTable(isSellable);

  // default sort by % change
  const change = document.querySelector(`${tableClass()} > thead > tr:last-of-type > th:last-of-type`)
  change.click();
}

const sortStocks = () => {
  sortTable(isBuyable);
  highlightsToTop();
}

const highlightsToTop = () => {
  // Moves any highlighted values to the top.
  const highlighted = document.querySelectorAll(".highlighted-row");
  if (!highlighted) {
    return;
  }

  const tbody = document.querySelector(`${tableClass()} > tbody`);
  // Clones each row in reverse to maintain initial sorted order
  Array.from(highlighted).reverse().forEach((row) => {
    const ticker = row.querySelector("td:nth-of-type(2) a").textContent;
    const sellRow = document.getElementById(ticker);
    if (sellRow) {
      const clonedSellRow = sellRow.cloneNode(true);
      tbody.prepend(clonedSellRow);
      sellRow.remove();
    }

    const clonedRow = row.cloneNode(true);
    tbody.prepend(clonedRow);
    row.remove();
  });
}

const totalsToBottom = () => {
  // Ensures the total stays at the bottom.
  const totals = document.getElementById("totals-row");
  if (!totals) {
    return;
  }

  const tbody = document.querySelector(`${tableClass()} > tbody`);
  const cloneTotals = totals.cloneNode(true);
  tbody.append(cloneTotals);
  totals.remove();
}

document.addEventListener('sort-end', function() {
  totalsToBottom();
  highlightsToTop();
});

window.addEventListener('load', function() {
  switch (document.location.pathname) {
    case "/games/stockmarket/stocks/":
      tableName = 'stock';
      sortStocks();
      break;
    case "/games/stockmarket/portfolio/":
      tableName = 'portfolio';
      sortPortfolio();
      break;
  }
});
