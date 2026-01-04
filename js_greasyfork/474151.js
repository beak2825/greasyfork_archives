// ==UserScript==
// @name         FCResearch Orders Input
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  Create input to paste string from DockMaster or create CSV output
// @author       Paweł Malak (pawemala) LCJ2
// @match        http://fcresearch-eu.aka.amazon.com/*/search*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=amazon.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/474151/FCResearch%20Orders%20Input.user.js
// @updateURL https://update.greasyfork.org/scripts/474151/FCResearch%20Orders%20Input.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // Extract warehouse id from url
  const warehouseId = window.location.href.split('/')[3];

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
    style = `
      .asin-input {
        width: 30%;
        margin: 20px auto;
        display: block;
        position: relative;
        z-index: 10;
        background-color: #56606a;
      }

      .asin-input.success {
        background-color: #c3e8a9;
      }

      .asin-input:hover {
        cursor: pointer;
      }

      .btn-container {
        max-width: 30%;
        margin: 0 auto;
        display: flex;
        justify-content: space-around;
      }
    `;

    constructor() {
      this.injectStyles();
      this.createInputBox();
      this.createBtnContainer();
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
     * Create textarea to input output from dockmaster
     */
    createInputBox() {
      const inputId = 'asin-input';

      if (!document.getElementById(inputId)) {
        const inputEl = document.createElement('textarea');
        inputEl.id = inputId;
        inputEl.className = inputId;
        document.body.appendChild(inputEl);
        this.inputEl = inputEl;
      }
    }

    /**
     * Create container to store buttons
     */
    createBtnContainer() {
      const elementId = 'btn-container';

      if (!document.getElementById(elementId)) {
        const btnContainerEl = document.createElement('div');
        btnContainerEl.id = elementId;
        btnContainerEl.className = elementId;
        this.inputEl.after(btnContainerEl);
        this.btnContainerEl = btnContainerEl;
      }
    }

    /**
     * Create button and append it to the container
     * @param {String} id element identifier for JS and CSS
     * @param {String} text button text content
     * @param {Function} eventHandler function to be called upon button click event
     */
    createBtn(id, text, eventHandler) {
      if (!document.getElementById(id)) {
        const btnEl = document.createElement('button');
        btnEl.id = id;
        btnEl.className = id;
        btnEl.textContent = text;
        this.btnContainerEl.appendChild(btnEl);
        btnEl.addEventListener('click', eventHandler);
      }
    }
  }

  class Data {
    constructor(products) {
      this.products = products.map(product => {
        const { velocity, quantity } = product;
        const calculatedData = this.calculate(velocity, quantity);

        return { ...product, ...calculatedData };
      });

      this.products = this.products.filter(
        ({ actionRequired }) => actionRequired
      );

      this.products = this.products.sort(
        (a, b) => a.missingInPrime - b.missingInPrime
      );
    }

    calculate(velocity, quantity) {
      const missingInPrime = this.calculateMissing(velocity, quantity);
      const demandFullfilment = this.calculateFullfilment(velocity, quantity);
      const actionRequired = this.isStowRequired(missingInPrime);

      return { missingInPrime, demandFullfilment, actionRequired };
    }

    isStowRequired(missingInPrime) {
      return missingInPrime < 0;
    }

    calculateMissing(velocity, quantity) {
      if (quantity == 'n/a' && velocity > 0) {
        return -velocity;
      }

      if (quantity == 'n/a' && velocity == 0) {
        return -10;
      }

      if (quantity > velocity) {
        return 0;
      }

      if (quantity > 0 && quantity < velocity) {
        return quantity - velocity;
      }

      if (velocity > 0 && quantity == 0) {
        return quantity - velocity;
      }

      if (quantity == velocity) {
        return 0;
      }

      return -10;
    }

    calculateFullfilment(velocity, quantity) {
      let rawFullfilment = 0;

      if (quantity > 0 && velocity > 0) {
        rawFullfilment = quantity / velocity;
      }

      if (quantity > 0 && velocity == 0) {
        rawFullfilment = 1;
      }

      return rawFullfilment > 1 ? 1 : rawFullfilment;
    }
  }

  class Csv {
    constructor(headers, data) {
      this.headers = headers;
      this.data = data;
    }

    generateFileContent() {
      const fileHeader = `data:text/csv;charset=utf-8,`;
      const dataHeaders = this.headers.join(',');

      const data = this.data.map(product => {
        const {
          asin,
          velocity,
          quantity,
          shipmentId,
          missingInPrime,
          demandFullfilment
        } = product;

        return `${shipmentId},${asin},${velocity},${
          quantity >= 0 ? quantity : 'n/a'
        },${missingInPrime},${(demandFullfilment * 100).toFixed(0)}%`;
      });

      const dataRows = data.join('\n');

      return `${fileHeader}${dataHeaders}\n${dataRows}`;
    }

    saveFile(filename = asins) {
      const fileContent = this.generateFileContent();

      const encodedUri = encodeURI(fileContent);
      const link = document.createElement('a');

      link.setAttribute('href', encodedUri);
      link.setAttribute('download', `${filename}.csv`);
      document.body.appendChild(link);

      link.click();
    }
  }

  const startScript = () => {
    // Check if input element exists
    const asinInput = document.getElementById('asin-input');

    if (asinInput) {
      // Clear data from previous runs
      localStorage.removeItem('orderNumbers');
      localStorage.removeItem('skuNumbers');
      localStorage.removeItem('products');

      // Get output from dockmaster
      const orderNumbers = asinInput.value;

      if (orderNumbers) {
        // Store DockMaster output
        localStorage.setItem('orderNumbers', orderNumbers);

        // Extract first orderNumber to scrap
        const pos = orderNumbers.split(',')[0];
        const [shipmentId, orderNumber] = pos.split('::');

        // Redirect to order page
        window.location.replace(
          `http://fcresearch-eu.aka.amazon.com/${warehouseId}/results?s=${orderNumber}&resultType=order&shipmentId=${shipmentId}`
        );
      } else {
        alert('DockMaster output is missing');
      }
    }
  };

  const generateTimestamp = () => {
    const pad = p => (p < 10 ? `0${p}` : p);
    const date = new Date();

    const year = date.getFullYear();
    const month = pad(date.getMonth() + 1);
    const day = pad(date.getDate() + 1);

    return `${year}_${month}_${day}`;
  };

  const saveCsv = () => {
    let { products } = JSON.parse(localStorage.products);
    const data = new Data(products);

    const headers = [
      'shipment_id',
      'asin',
      'velocity',
      'quantity',
      'missing_in_prime',
      'demand_fullfilment'
    ];

    const csv = new Csv(headers, data.products);

    const filename = `fud_predictions-${warehouseId}-${generateTimestamp()}`;

    csv.saveFile(filename);
  };

  (function main() {
    const ui = new UI();

    // Create action button to start the script
    ui.createBtn('action-btn', 'Get SKUs', startScript);

    // Check if results exists and should be displayed
    if (localStorage.products && Result.getParameter('showResults')) {
      // Get output element
      const outputEl = document.getElementById('asin-input');
      outputEl.classList.add('success');

      // Create button to download CSV file with parsed results
      ui.createBtn('csv-btn', 'Download', saveCsv);
    }
  })();
})();
