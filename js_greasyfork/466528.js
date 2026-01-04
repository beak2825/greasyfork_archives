// ==UserScript==
// @name         Price Converter with Tax for Specific Websites
// @namespace    http://tampermonkey.net/
// @version      0.8
// @description  Convert price tags on websites
// @author       Nears
// @match        *://*.newegg.ca/*
// @match        *://*.canadacomputers.com/*
// @match        *://*.amazon.ca/*
// @match        *://ca.pcpartpicker.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/466528/Price%20Converter%20with%20Tax%20for%20Specific%20Websites.user.js
// @updateURL https://update.greasyfork.org/scripts/466528/Price%20Converter%20with%20Tax%20for%20Specific%20Websites.meta.js
// ==/UserScript==
(async function() {
    'use strict';
    // Define the tax rate
    const TAX_RATE = 0.14975;
    // Fetch the Euro conversion rate
    async function fetchExchangeRate() {
        const requestURL = 'https://api.exchangerate.host/convert?from=CAD&to=EUR';
        const response = await fetch(requestURL);
        const data = await response.json();
        return data.result;
    }
    const CAD_TO_EURO = await fetchExchangeRate();
    const euroFormatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'EUR',
    });
    // Define the websites and their price tag selectors
    const websites = [{
        domain: 'newegg.ca',
        css: `
        .tax-included {
          color: #bd0000;
        }
        .price-note-euro {
          color: #bd0000;
          font-weight: 700;
        }
        .product-price .price-current {
          margin: 0 !important;
        }
      `,
        selectors: ['li.price-current', '.goods-price-current'],
        updatePrice: (element) => {
            const strongElement = element.querySelector('strong');
            const supElement = element.querySelector('sup');
            if(strongElement && supElement) {
                const price = parseFloat(`${strongElement.textContent.replace(',', '')}${supElement.textContent}`);
                const convertedPrice = convertPrice(price);
                const euroPrice = convertToEuros(convertedPrice);
                const priceParts = convertedPrice.toString().split(".");
                let taxedPriceEl = htmlToElement(`
            <li style="margin: 0">
              <span class="price-current tax-included">$<strong>${priceParts[0]}</strong><sup>.${priceParts[1]}</sup></span>
              <span class="price-note-label"> incl. tax</span>
              <span class="price-note-euro">(${euroFormatter.format(euroPrice)})</span>
            </li>`);
                insertAfter(taxedPriceEl, element);
            }
        }
    }, {
        domain: 'canadacomputers.com',
        css: `
        .tax-included {
          color: #bd0000;
          font-size: 2rem;
          font-weight: 400;
          display: inline-block;
          white-space: nowrap;
          line-height: 1;
        }
        .product-price .price-current {
          margin: 0 !important;
          white-space: nowrap;
        }
        .price-note-label {
          color: black;
          font-size: 0.5em;
          font-weight: normal;
          line-height: 1;
          white-space: nowrap;
        }
        .price-note-euro{
          color: #bd0000;
          font-size: 0.7em;
          font-weight: normal;
          margin-left: 4px;
          white-space: nowrap;
          line-height: 1;
        }
      `,
        selectors: ['.h2-big > strong:nth-child(1)', '.text-red d-block mb-0 pq-hdr-product_price line-height', '.d-block.mb-0.pq-hdr-product_price.line-height', '.text-danger h2 price', ],
        updatePrice: (element) => {
            const price = parseFloat(element.textContent.replace('$', '').replace(',', ''));
            const convertedPrice = convertPrice(price);
            const euroPrice = convertToEuros(convertedPrice);
            const priceParts = convertedPrice.toString().split(".");
            let taxedPriceEl = htmlToElement(`
          <div style="margin: 0;">
            <span class="price-current tax-included">
              $<strong>${priceParts[0]}</strong><sup>.${priceParts[1]}</sup>
              <span class="price-note-label"> incl. tax</span>
            </span>
            <span class="price-note-euro">(${euroFormatter.format(euroPrice)})</span>
          </div>
        `);
            insertAfter(taxedPriceEl, element);
        }
    }, {
        domain: 'amazon.ca',
        css: `
        .tax-included {
          color: #bd0000;
          font-size: 1.2em;
          font-weight: 700;
        }
        `,
        selectors: ['span.a-price', 'div.a-section.a-spacing-micro'],
        updatePrice: (element) => {
            const priceWholeElement = element.querySelector('.a-price-whole');
            const priceFractionElement = element.querySelector('.a-price-fraction');
            if (priceWholeElement && priceFractionElement) {
                const priceWhole = priceWholeElement.textContent.replace(',', '');
                const priceFraction = priceFractionElement.textContent;
                const price = parseFloat(`${priceWhole}.${priceFraction}`);
                const convertedPrice = convertPrice(price);
                const euroPrice = convertToEuros(convertedPrice);
                const priceParts = convertedPrice.toString().split(".");
                let taxedPriceEl = htmlToElement(`
				  <div class="a-row a-size-base a-color-base">
					<span class="price-current tax-included">
					  $<strong>${priceParts[0]}</strong>.${priceParts[1]}
					  <span class="price-note-label"> incl. tax</span>
					</span>
					<span class="price-note-euro">(${euroFormatter.format(euroPrice)})</span>
				  </div>
				`);
                insertAfter(taxedPriceEl, element);
            }
        }
    },{
    domain: 'ca.pcpartpicker.com',
    css: `
        .tax-included {
            color: #bd0000;
            font-size: 1.2em;
            font-weight: 700;
            display: block;
        }
        .price-container-p {
            display: block;
        }
    `,
    selectors: ['.td__base.priority--2', 'td.td__finalPrice', '.guide__numbers', '.log__price', 'tr.tr__total tr__total--final', 'td.td__price a', 'td.td__price:nth-child(2)'],
    updatePrice: (element) => {
        const priceText = element.textContent.replace('$', '').replace(',', '');
        const price = parseFloat(priceText);
        const convertedPrice = convertPrice(price);
        const euroPrice = convertToEuros(convertedPrice);
        const priceParts = convertedPrice.toString().split(".");
        let taxedPriceEl = htmlToElement(`
            <div class="price-container-p">
                <span>${element.textContent}</span>
                <span class="price-current tax-included">
                    $<strong>${priceParts[0]}</strong>.${priceParts[1]}
                    <span class="price-note-label"> incl. tax</span>
                </span>
                <span class="price-note-euro">(${euroFormatter.format(euroPrice)})</span>
            </div>
        `);
        element.parentNode.replaceChild(taxedPriceEl, element);
    }
}];


    function htmlToElement(html) {
        var template = document.createElement('template');
        html = html.trim(); // Never return a text node of whitespace as the result
        template.innerHTML = html;
        return template.content.firstChild;
    }

    function insertAfter(newNode, existingNode) {
        existingNode.parentNode.insertBefore(newNode, existingNode.nextSibling);
    }
    // Function to convert the price with tax
    function convertPrice(price) {
        const priceWithTax = price * (1 + TAX_RATE);
        return priceWithTax.toFixed(2);
    }
    // Function to convert the price to Euros
    function convertToEuros(price) {
        const priceInEuros = price * CAD_TO_EURO;
        return priceInEuros.toFixed(2);
    }
    // Function to update price tags on the website
    function updatePriceTags(website) {
        website.selectors.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            elements.forEach(element => {
                website.updatePrice(element);
            });
        });
    }
    // Get the current hostname
    const hostname = window.location.hostname;
    // Update price tags for the matching website
    websites.forEach(website => {
        if(hostname.includes(website.domain)) {
            const styleElement = document.createElement('style');
            styleElement.textContent = website.css;
            document.head.appendChild(styleElement);
            updatePriceTags(website);
        }
    });
})();