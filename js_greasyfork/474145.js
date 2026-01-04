// ==UserScript==
// @name         DockMaster Appointment Scraper
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Extract POs from the appointment
// @author       Paweł Malak (pawemala) LCJ2
// @include      *
// @icon         https://www.google.com/s2/favicons?sz=64&domain=amazon.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/474145/DockMaster%20Appointment%20Scraper.user.js
// @updateURL https://update.greasyfork.org/scripts/474145/DockMaster%20Appointment%20Scraper.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // Extract warehouse id from url
  const warehouseId = window.location.href.split('/')[7].split('?')[0];
  const dockMasterHost =
    'https://fc-inbound-dock-hub-eu.aka.amazon.com/en_US/#/dockmaster';

  class UI {
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
  }

  class Data {
    /**
     * Get all order numbers from current appointment
     * @returns {Promise<String>} list of order numbers separated with ","
     */
    static getOrderNumbers() {
      return new Promise(async resolve => {
        let orderNumbers = [];

        // Wait for shipments table to load
        await UI.waitForElement('.datatable-body-row');

        const tableRows = document.querySelectorAll(
          '.datatable-body .datatable-body-row'
        );

        // Extract and store shipmentId:orderNumber pairs
        for (let row of tableRows) {
          const shipmentId = row
            .querySelector('.datatable-body-cell:nth-of-type(2) a')
            .textContent.trim();

          const orderNumber = Array.from(
            row.querySelectorAll('.datatable-body-cell:nth-of-type(4) a')
          )
            .map(l => `${shipmentId}::${l.textContent.trim()}`)
            .join(',');

          if (orderNumber.length) {
            orderNumbers.push(orderNumber);
          }
        }

        orderNumbers = Array.from(new Set(orderNumbers)).join(',');

        return resolve(orderNumbers);
      });
    }
  }

  (async function main() {
    // Get order numbers from current appointment
    let orderNumbers = await Data.getOrderNumbers();

    // Check if any order numbers are already stored
    if (localStorage.orderNumbers) {
      orderNumbers += `,${localStorage.orderNumbers}`;
    }

    // Store order numbers
    localStorage.setItem('orderNumbers', orderNumbers);

    // Extract current appointment id from url, remove it from appointment list and prepare id for next appointment
    const currentId = window.location.href.split('/')[9];
    let appointmentIds = localStorage.appointmentIds.split(',');
    appointmentIds = appointmentIds.filter(id => id != currentId);
    const nextId = appointmentIds[0] || null;

    if (nextId) {
      // Store appointment ids
      appointmentIds = appointmentIds.join(',');
      localStorage.setItem('appointmentIds', appointmentIds);

      // Redirect to next appointment
      window.location.href = `${dockMasterHost}/appointment/${warehouseId}/view/${nextId}/shipmentList`;
      window.location.reload();
    } else {
      // Create list of unique shipmentId:orderNumber pairs
      let uniqueNumbers = localStorage.orderNumbers.split(',');
      uniqueNumbers = Array.from(new Set(uniqueNumbers)).filter(
        el => el.length
      );

      // Store data
      localStorage.removeItem('appointmentIds');
      localStorage.setItem('orderNumbers', uniqueNumbers.join(','));

      // Redirect to results page
      window.location.href = `${dockMasterHost}/dayschedule/${warehouseId}`;
    }
  })();
})();
