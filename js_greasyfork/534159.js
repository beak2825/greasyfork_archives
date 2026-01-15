// ==UserScript==
// @name         parkrun Volunteer Days Display
// @description  Displays the number of volunteer days for parkrun finishers on results pages, for celebration purposes (and let's not make assumptions about ratios)
// @author       Pete Johns (@johnsyweb)
// @grant        none
// @homepage     https://www.johnsy.com/tampermonkey-parkrun/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=parkrun.com.au
// @license      MIT
// @match        *://www.parkrun.ca/*/results/*
// @match        *://www.parkrun.co.at/*/results/*
// @match        *://www.parkrun.co.nl/*/results/*
// @match        *://www.parkrun.co.nz/*/results/*
// @match        *://www.parkrun.co.za/*/results/*
// @match        *://www.parkrun.com.au/*/results/*
// @match        *://www.parkrun.com.de/*/results/*
// @match        *://www.parkrun.dk/*/results/*
// @match        *://www.parkrun.fi/*/results/*
// @match        *://www.parkrun.fr/*/results/*
// @match        *://www.parkrun.ie/*/results/*
// @match        *://www.parkrun.it/*/results/*
// @match        *://www.parkrun.jp/*/results/*
// @match        *://www.parkrun.lt/*/results/*
// @match        *://www.parkrun.my/*/results/*
// @match        *://www.parkrun.no/*/results/*
// @match        *://www.parkrun.org.uk/*/results/*
// @match        *://www.parkrun.pl/*/results/*
// @match        *://www.parkrun.se/*/results/*
// @match        *://www.parkrun.sg/*/results/*
// @match        *://www.parkrun.us/*/results/*
// @namespace    http://tampermonkey.net/
// @run-at       document-end
// @supportURL   https://github.com/johnsyweb/tampermonkey-parkrun/issues/
// @tag          parkrun
// @version      1.0.68
// @downloadURL https://update.greasyfork.org/scripts/534159/parkrun%20Volunteer%20Days%20Display.user.js
// @updateURL https://update.greasyfork.org/scripts/534159/parkrun%20Volunteer%20Days%20Display.meta.js
// ==/UserScript==
// DO NOT EDIT - generated from src/ by scripts/build-scripts.js
// Built: 2026-01-14T04:30:23.032Z

(function () {
  'use strict';

  /**
   * Adds volunteer day information to each finisher who has volunteered
   */
  function showVolunteerDays() {
    document
      .querySelectorAll('tr[data-vols] > td.Results-table-td.Results-table-td--name > div.detailed')
      .forEach(function (div) {
        var volDays = div.closest('tr').getAttribute('data-vols');
        if (volDays && parseInt(volDays) > 0) {
          var spacer = document.createElement('span');
          spacer.classList.add('spacer');
          spacer.textContent = ' | ';
          var volSpan = document.createElement('span');
          volSpan.textContent = ''
            .concat(volDays, ' volunteer day')
            .concat(volDays === '1' ? '' : 's');
          volSpan.classList.add('volunteer-days');
          var firstElement = div.firstElementChild;
          if (firstElement) {
            firstElement.insertAdjacentElement('afterend', spacer);
            spacer.insertAdjacentElement('afterend', volSpan);
          } else {
            div.appendChild(volSpan);
          }
        }
      });
  }

  /**
   * Waits for the page to fully load before adding volunteer information
   */
  function init() {
    var firstRow = document.querySelector('tr[data-vols]');
    if (firstRow) {
      showVolunteerDays();
      addVolunteerDaysSort();
    } else {
      setTimeout(init, 500);
    }
  }

  /**
   * Adds sort options for volunteer days and wires up sorting behaviour
   */
  function addVolunteerDaysSort() {
    var firstRow = document.querySelector('tr[data-vols]');
    if (!firstRow) return;
    var tbody = firstRow.closest('tbody');
    // Try to find an existing sort <select>
    var sortSelect = document.querySelector(
      'select[name="sort"], .Results-sort select, select.Results-sort, .Results-controls select'
    );

    // Sorting function using data-vols
    function sortByVolunteerDays(direction) {
      if (!tbody) return;
      // Include all rows in tbody; treat missing data-vols as 0
      var rows = Array.from(tbody.querySelectorAll('tr'));

      // Keep original order index to ensure stable sort for ties
      var indexed = rows.map(function (row, index) {
        return {
          row: row,
          index: index,
        };
      });
      indexed.sort(function (a, b) {
        var av = parseInt(a.row.getAttribute('data-vols') || '0', 10);
        var bv = parseInt(b.row.getAttribute('data-vols') || '0', 10);
        if (av === bv) return a.index - b.index;
        return direction === 'asc' ? av - bv : bv - av;
      });

      // Re-append sorted finisher rows; other rows remain in place
      indexed.forEach(function (_ref) {
        var row = _ref.row;
        return tbody.appendChild(row);
      });
    }

    // If there's an existing select, augment it
    if (sortSelect) {
      // Add options if not already present
      if (!sortSelect.querySelector('option[value="vols-asc"]')) {
        var optAsc = new Option('Sort by Volunteer days ▲', 'vols-asc');
        var optDesc = new Option('Sort by Volunteer days ▼', 'vols-desc');
        sortSelect.appendChild(optAsc);
        sortSelect.appendChild(optDesc);
      }

      // Avoid adding duplicate listeners
      if (!sortSelect.dataset.volsSortWired) {
        // Capture phase listener to prevent native handlers when using our custom options
        sortSelect.addEventListener(
          'change',
          function (e) {
            var value = e.target.value || '';
            if (value === 'vols-asc' || value === 'vols-desc') {
              if (e.cancelable) e.preventDefault();
              if (typeof e.stopImmediatePropagation === 'function') e.stopImmediatePropagation();
              if (typeof e.stopPropagation === 'function') e.stopPropagation();
              sortByVolunteerDays(value.endsWith('asc') ? 'asc' : 'desc');
            }
          },
          true
        );
        // Bubble phase listener (fallback) if capture was bypassed
        sortSelect.addEventListener('change', function (e) {
          var value = e.target.value || '';
          if (value === 'vols-asc') {
            sortByVolunteerDays('asc');
          } else if (value === 'vols-desc') {
            sortByVolunteerDays('desc');
          }
        });
        sortSelect.dataset.volsSortWired = 'true';
      }
    }
  }
  init();
})();
