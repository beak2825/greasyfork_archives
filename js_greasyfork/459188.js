// ==UserScript==
// @name         Price converter
// @namespace    http://tampermonkey.net/
// @version      0.1.2
// @description  Price converter for yemeksepeti trendyol sokmarket
// @author       pullso
// @match        *www.sokmarket.com.tr/*
// @match        *www.yemeksepeti.com/*
// @match        *www.trendyol.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license      MIT 
// @downloadURL https://update.greasyfork.org/scripts/459188/Price%20converter.user.js
// @updateURL https://update.greasyfork.org/scripts/459188/Price%20converter.meta.js
// ==/UserScript==


(function() {
'use strict';

const URLProxy = {
  _currentURL: window.location.href,
  _rates: null,

  start: function() {
    this.update();
    const interval = setInterval(() => {
      if (this._currentURL !== window.location.href) {
        console.log('The URL has changed:', window.location.href);
        this._currentURL = window.location.href;
        this.update();
      }
    }, 100);
  },

  update: function() {
    if (!this._rates) {
      this._rates = this._getRatesFromLocalStorage();
    }
    if (!this._rates || this._isRatesOutdated()) {
      this._fetchRates();
    } else {
      this._applyRates();
    }
    console.log(this._rates)
  },

  _applyRates: function() {
    const interval = setInterval(() => {
      const nodes = document.querySelectorAll('.pricetag span, .prc-dsc, .product-prices, .price-box ,discounted, .current-price__current, .prc-box-sllng, .prc-box-dscntd, .item-price, span[data-testid="item-modifier-item-price"], p[data-testid="menu-product-price"], span[data-testid="mov-currency"], [data-testid="menu-product-price"]');
      if (nodes.length) {
        clearInterval(interval)
        for (const el of nodes) {
          if(!el.dataset.priceUpdated){
              const price = Number(el.innerText.split(' ')[0].replace('.','').replace(',', '.'));
              console.log(price, this._rates.USD)
              el.innerText += `\n${(price * this._rates.USD).toFixed(2)}$\n${(price * this._rates.RUB).toFixed(0)} ₽`;
              el.dataset.priceUpdated = true
          }
        }
      }
    }, 1500);
  },

  _fetchRates: function() {
    const currency = 'TRY';
    const url = `https://v6.exchangerate-api.com/v6/1f808d4b3979aad7fdf604d9/latest/${currency}`;

    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        this._rates = data.conversion_rates;
        this._rates.date = new Date();
        localStorage.setItem('rates', JSON.stringify(this._rates));
        this._applyRates();
      })
      .catch((error) => console.error(error));
  },

  _getRatesFromLocalStorage: function() {
    const rates = localStorage.getItem('rates');
    if (rates) {
      return JSON.parse(rates);
    }
    return null;
  },

  _isRatesOutdated: function() {
    return new Date() - new Date(this._rates.date) > 2 * 60 * 60 * 1000;
  },
};

URLProxy.start();

})();