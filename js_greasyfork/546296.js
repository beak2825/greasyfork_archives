// ==UserScript==
// @name           scrumpoker-online.org Average Points
// @description    Adds the average points row to the scrumpoker-online.org page.
// @icon           https://www.google.com/s2/favicons?sz=64&domain=scrumpoker-online.org
// @author         Antonio Terrero <atalgaba@gmail.com>
// @namespace      http://github.com/ihton
// @license        GPL-3.0-or-later
// @copyright      Copyright (C) 2024, Antonio Terrero <atalgaba@gmail.com>
// @match          https://*.scrumpoker-online.org/*/room/*/scrum-poker
// @version        1.3
// @run-at         document-end
// @downloadURL https://update.greasyfork.org/scripts/546296/scrumpoker-onlineorg%20Average%20Points.user.js
// @updateURL https://update.greasyfork.org/scripts/546296/scrumpoker-onlineorg%20Average%20Points.meta.js
// ==/UserScript==

(() => {
  /** --------------------------
   *  Utilities
   *  -------------------------- */
  const $ = (selector, ctx = document) => ctx.querySelector(selector);
  const $$ = (selector, ctx = document) => Array.from(ctx.querySelectorAll(selector));

  const parsePoints = (spans) =>
    spans
      .map((span) => parseFloat(span.textContent.trim()))
      .filter((n) => !isNaN(n));

  const mean = (values) => {
    if (!values.length) return '';
    const avg = values.reduce((a, b) => a + b, 0) / values.length;
    return Number.isInteger(avg) ? `${avg}` : avg.toFixed(1);
  };

  const getNgContentAttr = (row) => {
    if (!row) return null;
    return [...row.attributes].find((a) => a.name.startsWith('_ngcontent-')) || null;
  };

  const applyNgContentRecursively = (el, ngAttr) => {
    if (!ngAttr || !el) return;
    el.setAttribute(ngAttr.name, ngAttr.value);
    el.querySelectorAll('*').forEach((child) =>
      child.setAttribute(ngAttr.name, ngAttr.value)
    );
  };

  const createCell = ({ html, className }) => {
    const td = document.createElement('td');
    td.className = className;
    td.setAttribute('role', 'cell');
    td.setAttribute('mat-cell', '');
    if (html) td.innerHTML = html;
    return td;
  };

  /** --------------------------
   *  Core logic
   *  -------------------------- */
  function updateMeanRow(table) {
    const spans = $$('tr:not(.mean-row) .flip-card-back span', table);
    const points = parsePoints(spans);
    const value = mean(points);

    const firstRow = $('tbody tr:not(.mean-row)', table);
    const ngAttr = getNgContentAttr(firstRow);
    const cardClass = $('.flip-card', table)?.className || 'flip-card';

    let meanRow = $('tr.mean-row', table);

    if (!meanRow) {
      meanRow = document.createElement('tr');
      meanRow.className =
        'mat-mdc-row mdc-data-table__row cdk-row ng-star-inserted mean-row';
      meanRow.setAttribute('role', 'row');
      meanRow.setAttribute('mat-row', '');

      const labelCell = createCell({
        html: '<span style="font-weight: bold">Average</span>',
        className:
          'mat-mdc-cell mdc-data-table__cell cdk-cell cdk-column-displayName mat-column-displayName ng-star-inserted',
      });

      const valueCell = createCell({
        className:
          'mat-mdc-cell mdc-data-table__cell cdk-cell story-points points-column cdk-column-storyPoints mat-column-storyPoints ng-star-inserted',
        html: `
          <div class="${cardClass}">
            <div class="flip-card-inner">
              <div class="flip-card-front">
                <img src="assets/images/logo_trans.png" alt="SP" style="width:30px;height:30px;" class="ng-star-inserted">
              </div>
              <div class="flip-card-back">
                <span class="ng-star-inserted">${value}</span>
              </div>
            </div>
          </div>`,
      });

      meanRow.append(labelCell, valueCell);
      $('tbody', table).appendChild(meanRow);
    } else {
      // Update the card class if it has changed
      const cardDiv = $('.flip-card', meanRow);
      cardDiv.className = cardClass;
      // Update the existing value
      const span = $('.flip-card-back span', meanRow);
      if (span) span.textContent = value;
    }
    // Apply Angular attribute to everything inside the new row
    if (ngAttr) applyNgContentRecursively(meanRow, ngAttr);
  }

  /** --------------------------
   *  Init with safe MutationObserver
   *  -------------------------- */
  function init() {
    const appRoot = $('app-root');
    if (!appRoot) return;

    const rootObserver = new MutationObserver(() => {
      const table = $('table.mat-mdc-table');
      if (!table) return;

      rootObserver.disconnect();

      const tableObserver = new MutationObserver(() => {
        tableObserver.disconnect();
        updateMeanRow(table);
        tableObserver.observe(table, {
          childList: true,
          subtree: true,
          attributes: true,
          characterData: true,
        });
      });

      // initial run
      updateMeanRow(table);

      // start observing table changes
      tableObserver.observe(table, {
        childList: true,
        subtree: true,
        attributes: true,
        characterData: true,
      });
    });

    rootObserver.observe(appRoot, { childList: true, subtree: true });
  }

  init();
})();
