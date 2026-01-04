// ==UserScript==
// @name         FCResearch Result Scraper
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  Scrap FCResearch PO/SKU page
// @author       Paweł Malak (pawemala) LCJ2
// @match        http://fcresearch-eu.aka.amazon.com/*/results?s=*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=amazon.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/474152/FCResearch%20Result%20Scraper.user.js
// @updateURL https://update.greasyfork.org/scripts/474152/FCResearch%20Result%20Scraper.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // Extract warehouse id from url
  const warehouse = window.location.href.split('/')[3];
  const fcResearchHost = 'http://fcresearch-eu.aka.amazon.com';

  class Result {
    /**
     * Check if parameter exists in
     * @param {string} key name of sought parameter
     * @returns {string|null} value of parameter if it exists, or null if it doesn't
     */
    static getParameter(key) {
      const searchParams = new URLSearchParams(window.location.search);

      if (!searchParams.has(key)) {
        return null;
      }

      return searchParams.get(key);
    }
  }

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

    /**
     * Wait n seconds for an element. Return element if exists or null if not
     * @param {String} selector CSS selector of an element
     * @param {Number} timeout Time to wait for element in seconds
     * @returns {Promise<HTMLElement | null>} Element if exists or null if not
     */
    static timeForElement(selector, timeout = 10) {
      return new Promise(resolve => {
        if (document.querySelector(selector)) {
          return resolve(document.querySelector(selector));
        }

        const startTime = Date.now();
        timeout *= 1000;

        const wait = setInterval(() => {
          if (document.querySelector(selector)) {
            window.clearInterval(wait);
            return resolve(document.querySelector(selector));
          }

          if (Date.now() - startTime > timeout) {
            window.clearInterval(wait);
            return resolve(null);
          }
        }, 1000);
      });
    }

    /**
     *
     * @param {*} selector
     * @param {*} callback
     * @returns
     */
    static watchForChanges(selector, callback) {
      const observer = new MutationObserver(callback);

      observer.observe(document.querySelector(selector), {
        attributes: true,
        childList: true,
        subtree: true
      });

      return observer;
    }

    static sectionLoaded(selector) {
      const el = document.querySelector(selector);

      if (el) {
        if (el.classList.contains('failure')) {
          return window.location.reload();
        }

        return !document.querySelector(selector).classList.contains('loading');
      }

      return false;
    }
  }

  class OrderData {
    async load() {
      // Check if FCResearch is stuck and reload it if it is
      const isResponsive = await UI.timeForElement('span.help', 2);

      if (!isResponsive) {
        window.location.reload();
      }

      return Promise.resolve();
    }

    /**
     * Scrap order (PO) data and return SKU numbers
     * @returns {Promise<String>} list of shipmentId:SKUNumber pairs separated with ","
     */
    async scrap() {
      await this.load();

      return new Promise(async resolve => {
        // Wait for SKU table
        await UI.waitForElement('#table-purchase-order-item');

        const tableRows = document.querySelectorAll(
          '#table-purchase-order-item tbody tr'
        );

        const shipmentId = Result.getParameter('shipmentId');

        const skuNumbers = [];

        for (let row of tableRows) {
          const sku = row
            .querySelector('td:nth-of-type(2) a')
            .textContent.trim();
          skuNumbers.push(`${shipmentId}::${sku}`);
        }

        const uniqueSkuNumbers = Array.from(new Set(skuNumbers)).join(',');

        return resolve(uniqueSkuNumbers);
      });
    }

    /**
     * Extract all SKU numbers from current order
     */
    async process() {
      // Get SKU numbers from current order
      let skuNumbers = await this.scrap();

      // Check if any SKU numbers are already stored
      if (localStorage.skuNumbers) {
        skuNumbers += `,${localStorage.skuNumbers}`;
      }

      // Store SKUs
      localStorage.setItem('skuNumbers', skuNumbers);

      // Extract current order id from url and remove it from order number list
      const currentId = Result.getParameter('s');
      const orderNumbers = localStorage.orderNumbers
        .split(',')
        .filter(id => !id.includes(currentId));

      // Check if there any orders left
      if (orderNumbers.length) {
        // Extract next orderId, store the rest
        const [shipmentId, orderNumber] = orderNumbers[0].split('::');
        localStorage.setItem('orderNumbers', orderNumbers.join(','));

        // Redirect to next order
        window.location.replace(
          `${fcResearchHost}/${warehouse}/results?s=${orderNumber}&resultType=order&shipmentId=${shipmentId}`
        );
      } else {
        // Create list of unique SKU numbers
        skuNumbers = skuNumbers.split(',');
        skuNumbers = Array.from(new Set(skuNumbers));

        // Store data
        localStorage.setItem('skuNumbers', skuNumbers.join(','));
        localStorage.removeItem('orderNumbers');

        // Check if there are any SKU numbers to scrap
        if (skuNumbers.length) {
          const [shipmentId, sku] = skuNumbers[0].split('::');

          window.location.replace(
            `${fcResearchHost}/${warehouse}/results?s=${sku}&resultType=product&shipmentId=${shipmentId}`
          );
        }
      }
    }
  }

  class ProductData {
    async load() {
      // Check if FCResearch is stuck and reload it if it is
      const isResponsive = await UI.timeForElement('span.help', 2);

      if (!isResponsive) {
        window.location.reload();
      }

      return new Promise(resolve => {
        if (
          UI.sectionLoaded('#inventory-status') &&
          UI.sectionLoaded('#product-status')
        ) {
          resolve();
        } else {
          // Setup navigation watcher
          const sectionWatcher = UI.watchForChanges(
            '#sections-list',
            async () => {
              if (
                UI.sectionLoaded('#inventory-status') &&
                UI.sectionLoaded('#product-status')
              ) {
                resolve();
                sectionWatcher.disconnect();
              }
            }
          );
        }
      });
    }

    async scrap() {
      await this.load();

      return new Promise(async resolve => {
        // Create product object
        const productMetadata = { raw: {} };

        // Wait for basic product table
        const productTable = await UI.waitForElement(
          '.a-column.a-span7 table.a-keyvalue'
        );

        // Parse product table
        for (let row of productTable.querySelectorAll('tbody tr')) {
          // Extract raw key:value pairs
          const key = row
            .querySelector('th')
            .textContent.trim()
            .toLowerCase()
            .replaceAll(' ', '_');
          let value = row.querySelector('td').textContent.trim();
          value = value.length ? value : null;

          // Store raw data
          productMetadata['raw'][key] = value;

          // Extract and parse custom fields
          const customKeys = [
            ['asin', 'asin', e => e],
            ['sortowalna', 'isSortable', e => e == 'true'],
            ['szybkość_asin_(w_przybliż.)', 'velocity', e => parseFloat(e)]
          ];

          for (let customKey of customKeys) {
            const [oldKey, newKey, transformFunction] = customKey;

            if (!productMetadata[newKey]) {
              productMetadata[newKey] = transformFunction(
                productMetadata['raw'][oldKey]
              );
            }
          }
        }

        const hasInventory =
          document.querySelector('#table-inventory_wrapper') != null;

        productMetadata['hasInventory'] = hasInventory;

        if (hasInventory) {
          const inventoryTableWatcher = UI.watchForChanges(
            '#table-inventory_wrapper thead',
            () => {
              inventoryTableWatcher.disconnect();

              const inventoryCountEl = document.querySelector(
                'th#inventory-quantity span'
              );

              let inventoryCount = inventoryCountEl.textContent
                .replace(/(\(|\))/g, '')
                .trim();

              productMetadata['quantity'] = inventoryCount;

              resolve(productMetadata);
            }
          );

          const inputs = [
            {
              selector: '[data-col="inventory-disposition"] .a-input-text',
              value: 'SELLABLE'
            },
            {
              selector: '[data-col="inventory-consumer"] .a-input-text',
              value: 'UNOWNED'
            }
          ];

          for (let i = 0; i < inputs.length; i++) {
            const { selector, value } = inputs[i];
            const el = document.querySelector(selector);

            if (!el) {
              productMetadata['quantity'] = 0;
              break;
            }

            el.value = value;

            if (i + 1 == inputs.length) {
              el.dispatchEvent(new Event('change'));
            }
          }
        } else {
          resolve(productMetadata);
        }
      });
    }

    async process() {
      const { asin, velocity, quantity, hasInventory } = await this.scrap();
      let products = [];

      if (localStorage.products) {
        products = JSON.parse(localStorage.products).products;
      }

      const shipmentId = Result.getParameter('shipmentId');

      products.push({ asin, velocity, quantity, hasInventory, shipmentId });

      localStorage.setItem('products', JSON.stringify({ products }));

      let skuNumbers = localStorage.skuNumbers.split(',');
      const currentId = Result.getParameter('s');
      skuNumbers = skuNumbers.filter(id => !id.includes(currentId));

      if (skuNumbers.length) {
        const [shipmentId, sku] = skuNumbers[0].split('::');
        localStorage.setItem('skuNumbers', skuNumbers.join(','));

        window.location.replace(
          `http://fcresearch-eu.aka.amazon.com/${warehouse}/results?s=${sku}&resultType=product&shipmentId=${shipmentId}`
        );
      } else {
        window.location.replace(
          `http://fcresearch-eu.aka.amazon.com/${warehouse}/search?showResults=true`
        );
      }
    }
  }

  (function main() {
    let dataAgent = null;

    switch (Result.getParameter('resultType')) {
      case 'order':
        dataAgent = new OrderData();
        break;
      case 'product':
        dataAgent = new ProductData();
        break;
    }

    if (dataAgent) {
      dataAgent.process();
    }
  })();
})();
