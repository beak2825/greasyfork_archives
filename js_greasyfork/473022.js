// ==UserScript==
// @name         erogamescape-table-sorter
// @namespace    http://erogamescape.dyndns.org/~ap2/ero/toukei_kaiseki/
// @version      1.0.2
// @description  「ErogameScape -エロゲー批評空間-」の表にソートを追加する
// @author       ame-chan
// @match        http://erogamescape.dyndns.org/~ap2/ero/toukei_kaiseki/*
// @match        https://erogamescape.dyndns.org/~ap2/ero/toukei_kaiseki/*
// @match        http://erogamescape.org/~ap2/ero/toukei_kaiseki/*
// @match        https://erogamescape.org/~ap2/ero/toukei_kaiseki/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=erogamescape.dyndns.org
// @require      https://greasyfork.org/scripts/473024-tablesort-library/code/tablesort-library.js?version=1234866
// @grant        unsafeWindow
// @license      MIT
// @run-at       document-idle
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/473022/erogamescape-table-sorter.user.js
// @updateURL https://update.greasyfork.org/scripts/473022/erogamescape-table-sorter.meta.js
// ==/UserScript==
(async () => {
  'use strict';
  const addStyle = `<style id="tablesort-userjs-style">
  th[role=columnheader]:not(.no-sort) {
    position: relative;
    cursor: pointer;
  }
  th[role=columnheader]:not(.no-sort):after {
    position: absolute;
    content: "▲";
    float: right;
    top: 50%;
    transform: translateY(-50%);
    visibility: hidden;
    opacity: 0;
    user-select: none;
    z-index: 9999;
  }
  th[role=columnheader]:not(.no-sort):hover:after {
    visibility: visible;
    opacity: 1;
  }
  th[aria-sort=ascending]:not(.no-sort):after {
    content: "▼";
  }
  th[aria-sort]:not(.no-sort):after {
    visibility: visible;
    opacity: 0.4;
  }
  </style>`;
  unsafeWindow.setTableSort = () => {
    const tables = document.querySelectorAll('table');
    const hasTableSortFunc = window.Tablesort instanceof Function;
    if (!hasTableSortFunc || !tables.length) return;
    const removeLinks = (theads) =>
      theads.forEach((th) => {
        const link = th.querySelector('a');
        if (link?.href.includes('order')) {
          th.innerHTML = link.innerHTML;
        }
      });
    const processRowspan = (table) => {
      const tableRows = table.rows;
      const rowsToProcess = [];
      for (let i = 0; i < tableRows.length; i++) {
        const trElm = tableRows[i];
        if (trElm.classList.contains('odd')) continue;
        const rowspanElm = trElm.querySelector('td[rowspan]');
        const rowspan = rowspanElm?.rowSpan || 1;
        const gameNameElm = trElm.querySelector('a[href*="game.php"]') || null;
        if (rowspan > 1) {
          const nextTrElm = tableRows[i + 1];
          const colspanElm = nextTrElm?.querySelector('td[colspan]');
          const colspanText = colspanElm?.textContent || '';
          if (colspanText !== '') {
            rowspanElm?.removeAttribute('rowspan');
            nextTrElm.remove();
            rowsToProcess.push([gameNameElm, colspanText]);
            i--;
          }
        }
      }
      rowsToProcess.forEach(([gameNameElm, rowText]) => {
        if (rowText !== '' && gameNameElm) {
          const html = `<br><span>${rowText}</span>`;
          gameNameElm.insertAdjacentHTML('afterend', html);
        }
      });
    };
    const setNoSortAttr = (tr, i) => {
      const hasAllTh = [...tr.children].every((el) => el.tagName === 'TH');
      if (i > 0 && hasAllTh) {
        tr.setAttribute('data-sort-method', 'none');
      }
    };
    if (document.querySelector('#tablesort-userjs-style') === null) {
      document.head.insertAdjacentHTML('beforeend', addStyle);
    }
    for (const table of tables) {
      const tableHeadRow = table.querySelector('tr:first-of-type');
      if (tableHeadRow === null) continue;
      const theads = tableHeadRow.querySelectorAll('th');
      const tdata = tableHeadRow.querySelectorAll('td');
      const hasHeadLink = tableHeadRow.querySelectorAll('a');
      const hasRowSpan = [...table.querySelectorAll('td')].some((td) => td.rowSpan > 1);
      const hasListOfGames = table.closest('#list_of_games') !== null;
      if (theads.length && !tdata.length) {
        const thElms = table.querySelectorAll('tr');
        thElms.forEach(setNoSortAttr);
        if (hasRowSpan && hasListOfGames) {
          processRowspan(table);
        }
        if (hasHeadLink.length) {
          removeLinks(theads);
        }
        tableHeadRow.setAttribute('data-sort-method', 'none');
        new window.Tablesort(table);
      }
    }
  };
  unsafeWindow.setTableSort();
})();
