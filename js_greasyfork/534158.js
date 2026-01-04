// ==UserScript==
// @name         parkrun p-index display
// @description  The parkrun p-index is an unofficial statistic that measures the number of different parkrun events a person has completed a specific number of times. To achieve a p-index of 10, you must have completed at least 10 different parkrun events 10 times each. This script calculate the p-index for a parkrunner and displays it on their results page.
// @author       Pete Johns (@johnsyweb)
// @grant        none
// @homepage     https://johnsy.com/tampermonkey-parkrun/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=parkrun.com.au
// @license      MIT
// @match        *://www.parkrun.ca/parkrunner/*/all/
// @match        *://www.parkrun.co.at/parkrunner/*/all/
// @match        *://www.parkrun.co.nl/parkrunner/*/all/
// @match        *://www.parkrun.co.nz/parkrunner/*/all/
// @match        *://www.parkrun.co.za/parkrunner/*/all/
// @match        *://www.parkrun.com.au/parkrunner/*/all/
// @match        *://www.parkrun.com.de/parkrunner/*/all/
// @match        *://www.parkrun.dk/parkrunner/*/all/
// @match        *://www.parkrun.fi/parkrunner/*/all/
// @match        *://www.parkrun.fr/parkrunner/*/all/
// @match        *://www.parkrun.ie/parkrunner/*/all/
// @match        *://www.parkrun.it/parkrunner/*/all/
// @match        *://www.parkrun.jp/parkrunner/*/all/
// @match        *://www.parkrun.lt/parkrunner/*/all/
// @match        *://www.parkrun.my/parkrunner/*/all/
// @match        *://www.parkrun.no/parkrunner/*/all/
// @match        *://www.parkrun.org.uk/parkrunner/*/all/
// @match        *://www.parkrun.pl/parkrunner/*/all/
// @match        *://www.parkrun.se/parkrunner/*/all/
// @match        *://www.parkrun.sg/parkrunner/*/all/
// @match        *://www.parkrun.us/parkrunner/*/all/
// @namespace    http://tampermonkey.net/
// @run-at       document-end
// @supportURL   https://github.com/johnsyweb/tampermonkey-parkrun/issues/
// @tag          parkrun
// @version      1.0.30
// @downloadURL https://update.greasyfork.org/scripts/534158/parkrun%20p-index%20display.user.js
// @updateURL https://update.greasyfork.org/scripts/534158/parkrun%20p-index%20display.meta.js
// ==/UserScript==

(function () {
  'use strict';
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
      calculatePIndex,
      extractEventDetails,
      findResultsTable,
    };
  } else {
    main();
  }
  function main() {
    const table = findResultsTable();
    if (!table) {
      console.error('Results table not found');
      return;
    }
    const eventDetails = extractEventDetails(table);
    const { pIndex, contributingEvents } = calculatePIndex(eventDetails);
    displayPIndex(pIndex, contributingEvents);
  }

  function displayPIndex(pIndex, contributingEvents) {
    const h2Element = document.querySelector('h2');
    if (h2Element) {
      const pIndexElement = document.createElement('div');
      pIndexElement.textContent = 'p-index: ' + pIndex;
      pIndexElement.style.fontSize = '1.5em';
      pIndexElement.style.fontWeight = 'bold';
      pIndexElement.style.marginTop = '10px';
      pIndexElement.style.backgroundColor = '#2b223d';
      pIndexElement.style.color = '#ffa300';
      pIndexElement.style.padding = '10px';
      pIndexElement.style.borderRadius = '5px';
      pIndexElement.style.display = 'flex';
      pIndexElement.style.flexDirection = 'column';
      pIndexElement.style.alignItems = 'center';
      pIndexElement.style.justifyContent = 'center';
      pIndexElement.setAttribute('id', 'p-index-display');

      const eventList = document.createElement('ul');
      eventList.style.listStyleType = 'none';
      eventList.style.padding = '0';
      contributingEvents.forEach((event) => {
        const listItem = document.createElement('li');
        listItem.textContent = event;
        listItem.style.fontWeight = 'normal';
        listItem.style.fontSize = '1em';
        eventList.appendChild(listItem);
      });
      pIndexElement.appendChild(eventList);

      h2Element.parentNode.insertBefore(pIndexElement, h2Element.nextSibling);

      setTimeout(() => {
        const rect = pIndexElement.getBoundingClientRect();
        const maxDimension = Math.max(rect.width, rect.height);
        pIndexElement.style.width = maxDimension + 'px';
        pIndexElement.style.height = maxDimension + 'px';
      }, 0);
    }
  }

  function extractEventDetails(table) {
    const eventDetails = [];
    const rows = table.querySelectorAll('tbody > tr');
    rows.forEach((row) => {
      const eventName = row.querySelector('td:nth-child(1) > a').textContent.trim();
      const date = row.querySelector('td:nth-child(2)').textContent.trim();
      const eventNumber = row.querySelector('td:nth-child(3)').textContent.trim();
      eventDetails.unshift({ eventName, date, eventNumber });
    });

    // Group event details by event name
    const groupedEvents = eventDetails.reduce((acc, { eventName, date, eventNumber }) => {
      if (!acc[eventName]) {
        acc[eventName] = [];
      }
      acc[eventName].push({ date, eventNumber });
      return acc;
    }, {});

    // Convert groupedEvents to an array of entries and sort by the number of visits
    const sortedGroupedEvents = Object.entries(groupedEvents).sort(
      (a, b) => b[1].length - a[1].length
    );

    return sortedGroupedEvents;
  }

  function findResultsTable() {
    const tables = document.querySelectorAll('#results');
    return tables[tables.length - 1];
  }

  function calculatePIndex(eventDetails) {
    const filteredGroupedEvents = eventDetails.filter(([, events], index) => events.length > index);
    const pIndex = filteredGroupedEvents.length;

    function convertDate(dateStr) {
      return new Date(dateStr.split('/').reverse().join('-'));
    }

    const contributingEvents = filteredGroupedEvents
      .map(([eventName, events]) => {
        const first = events[0];
        const pIndexReached = events[pIndex - 1];
        return {
          eventName,
          eventCount: events.length,
          firstDate: first.date,
          firstEventNumber: first.eventNumber,
          pIndexDate: pIndexReached.date,
          pIndexEventNumber: pIndexReached.eventNumber,
          firstDateForSorting: convertDate(first.date),
          pIndexDateForSorting: convertDate(pIndexReached.date),
        };
      })
      .sort((a, b) => a.pIndexDateForSorting - b.pIndexDateForSorting)
      .slice(0, pIndex)
      .map(
        (event) =>
          event.eventName +
          ' (' +
          event.eventCount +
          '): ' +
          event.firstDate +
          ' (#' +
          event.firstEventNumber +
          ') - ' +
          event.pIndexDate +
          ' (#' +
          event.pIndexEventNumber +
          ')'
      );

    return { pIndex, contributingEvents };
  }
})();
