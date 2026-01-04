// ==UserScript==
// @name         DockMaster Scraper
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Get list of all appointments for the day
// @author       Paweł Malak (pawemala) LCJ2
// @match        https://fc-inbound-dock-hub-eu.aka.amazon.com/en_US/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=amazon.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/474146/DockMaster%20Scraper.user.js
// @updateURL https://update.greasyfork.org/scripts/474146/DockMaster%20Scraper.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // Extract warehouse id from url
  const warehouseId = window.location.href.split('/')[7].split('?')[0];
  const dockMasterHost =
    'https://fc-inbound-dock-hub-eu.aka.amazon.com/en_US/#/dockmaster';

  class UI {
    style = `
      .action-button {
        background: red;
        position: fixed;
        bottom: 20px;
        right: 20px;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        border: 1px solid transparent;
      }

      .result-textarea {
        min-height: 250px;
        width: 100%;
        background-color: #c3e8a9;
        border: none;
      }
    `;

    constructor() {
      this.injectStyles();
    }

    /**
     * Wait for an element with a given selector to be available
     * @param {String} selector CSS selector of an element
     * @returns {Promise<HTMLElement>}
     */
    static waitForElement(selector) {
      return new Promise(resolve => {
        if (document.querySelector(selector)) {
          return resolve(document.querySelector(selector));
        }

        const observer = new MutationObserver(() => {
          if (document.querySelector(selector)) {
            resolve(document.querySelector(selector));
            observer.disconnect();
          }
        });

        observer.observe(document.body, {
          childList: true,
          subtree: true
        });
      });
    }

    /**
     * Apply custom CSS to the document
     */
    injectStyles() {
      const customStylesEl = document.createElement('style');
      customStylesEl.textContent = this.style;
      document.head.appendChild(customStylesEl);
    }

    /**
     * Create button to execute main script
     * @param {Function} eventHandler function to be called upon button click event
     */
    createActionBtn(eventHandler) {
      const btnEl = document.createElement('button');
      btnEl.className = 'action-button';
      btnEl.addEventListener('click', eventHandler);
      document.body.appendChild(btnEl);
    }

    /**
     * Create textarea to display script results
     * @returns {Promise<HTMLTextAreaElement>}
     */
    createResultArea() {
      return new Promise(async resolve => {
        const elementId = 'result-textarea';

        const containerEl = await UI.waitForElement('#filter-wrapper');
        const resultEl = document.createElement('textarea');
        resultEl.id = elementId;
        resultEl.className = elementId;

        containerEl.appendChild(resultEl);

        return resolve(resultEl);
      });
    }
  }

  class Data {
    /**
     * Get and return id for each appointment for a given day
     * @returns {Array<String>} array of appointment ids
     */
    static getAppointments() {
      let appointments = [];

      // Get all appointment slots for a given day
      const appointmentBoxes = document.querySelectorAll('.appointment_slot');

      for (let appointmentEl of appointmentBoxes) {
        const appointmentId = appointmentEl
          .querySelector('a[href*="dockmaster"]')
          .textContent.trim();

        const appointmentUnitCount = parseInt(
          appointmentEl
            .querySelector('.row:last-of-type')
            .textContent.trim()
            .replace('U: ', '')
        );

        if (appointmentUnitCount > 0) {
          appointments.push(appointmentId);
        }
      }

      appointments = Array.from(new Set(appointments));

      return appointments;
    }

    /**
     * Clear data from previous runs
     */
    static clearData() {
      localStorage.removeItem('appointmentIds');
      localStorage.removeItem('orderNumbers');
    }
  }

  const startScript = () => {
    // Clear data from previous runs
    Data.clearData();

    // Get all non-empty appointments for a day
    let appointmentIds = Data.getAppointments();

    if (appointmentIds.length) {
      // Prepare id for first appointment and store the rest
      const nextId = appointmentIds[0];
      appointmentIds = appointmentIds.join(',');
      localStorage.setItem('appointmentIds', appointmentIds);

      // Redirect to first appointment
      window.location.href = `${dockMasterHost}/appointment/${warehouseId}/view/${nextId}/shipmentList`;
      window.location.reload();
    }
  };

  (async function main() {
    const ui = new UI();

    // Create action button to start the script
    ui.createActionBtn(startScript);

    // Check if there are any orders stored
    const hasResults = localStorage.getItem('orderNumbers');

    if (hasResults) {
      // Display results
      const resultsEl = await ui.createResultArea();

      resultsEl.textContent = localStorage.orderNumbers;
      resultsEl.select();

      // Clear data from previous runs
      Data.clearData();
    }
  })();
})();
