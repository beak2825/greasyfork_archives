// ==UserScript==
// @name         DekuDeals price currency converter
// @namespace    http://tampermonkey.net/
// @version      2024-06-07-v2
// @description  Allows you to convert prices to whichever currency you prefer
// @author       Di
// @license      GPL-3.0-or-later
// @match        https://www.dekudeals.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=dekudeals.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/499852/DekuDeals%20price%20currency%20converter.user.js
// @updateURL https://update.greasyfork.org/scripts/499852/DekuDeals%20price%20currency%20converter.meta.js
// ==/UserScript==

(function() {
    'use strict';

    async function generateListOfCurrencies() {

        let navbar = document.querySelector('.navbar-nav');
        let country = document.getElementById('navbarCountry1').textContent.match(/\w+/)[0];
        let list = document.querySelectorAll('button.dropdown-item');
        let baseCurrency = '';

        for (let i = 0; i < list.length; i++) {
            if (country === list[i].value.toUpperCase()) {
                baseCurrency = list[i].innerText.slice(-4, -1);
                break;
            }
        }

        let targetCurrency = localStorage.getItem('currency-convert-target');
        if (targetCurrency == null) {
            targetCurrency = baseCurrency;
        }

        let liCurrency = document.createElement('li');
        liCurrency.innerHTML = `<a aria-expanded="false" aria-haspopup="true" class="nav-link nav-link2 nav-link2l"
        data-toggle="dropdown" id="navbarCurrency" role="button"><span class="fa-solid fa-wallet"></span> ${targetCurrency} </a>
        <div aria-labelledby="navbarCurrency" class="dropdown-menu currency-select"><input type="text" placeholder="search.." id="currencyFilter"></div>`;
        navbar.appendChild(liCurrency);

        let input = document.getElementById('currencyFilter');
        input.style.width = '140px';
        input.onkeyup = function() { currencyFilterFunc();};

        liCurrency.classList.add('nav-item', 'dropdown');

        let wallet = document.querySelector('.fa-wallet');
        wallet.style.width = '19.2px';
        wallet.style.height = '19.2px';

        let rates = await getRates(baseCurrency);
        buildCurrencyList(baseCurrency, rates);
    }

    function buildCurrencyList(baseCurrency, rates) {
        let navCurrency = document.getElementById('navbarCurrency');
        let currencies = rates['rates'];
        let menuCurrencies = document.querySelector('.currency-select');
        menuCurrencies.style.height = '300px';
        menuCurrencies.style.width = '120px';
        menuCurrencies.style.overflowY = 'scroll';

        for (let targetCurrency in currencies) {
            let currencyDiv = document.createElement('div');
            currencyDiv.classList.add('.dropdown-item', '.div-currency');
            currencyDiv.onclick = async function() {
                let rates = await getRates(baseCurrency);
                navCurrency.innerHTML = `<span class="fa-solid fa-wallet"></span> ${targetCurrency} `;
                localStorage.setItem('currency-convert-target', targetCurrency);
                updatePrice(targetCurrency, rates);
            };
            currencyDiv.innerHTML = `<span class="fa-solid fa-coins"></span> ${targetCurrency} `;
            currencyDiv.style.width = '100%';
            currencyDiv.style.paddingLeft = '10px';
            currencyDiv.style.paddingBottom = '5px';

            menuCurrencies.appendChild(currencyDiv);
        }

        let games = document.querySelectorAll('.card-badge');

        for (let i = 0; i < games.length; i++) {
            let priceItems = games[i]['children'];
            for (let i = 0; i < priceItems.length; i++) {
                priceItems[i].setAttribute('data-price', `${priceItems[i].innerText}`);
            }
        }

        let targetCurrency = localStorage.getItem('currency-convert-target');
        if (targetCurrency == null) {
            targetCurrency = baseCurrency;
        }
        updatePrice(targetCurrency, rates);
    }

    function updatePrice(targetCurrency, rates) {

        let rate = rates['rates'][`${targetCurrency}`];
        let games = document.querySelectorAll('.card-badge');
        let rePrice = /\d+[\,\.]?\d+/g;
        for (let i = 0; i < games.length; i++) {
            let priceItems = games[i]['children'];
            for (let i = 0; i < priceItems.length; i++) {
                let priceText = priceItems[i].dataset.price;
                if (priceText.match('%'))
                    continue;

                if (priceText.match(rePrice)) {
                    let reCurrencyName = /\s\w+\.?/;
                    let reGroupDelim = /\d\.\d{3}/;
                    let price = priceText.match(rePrice)[0].replace(reCurrencyName, '');
                    if (price.match(reGroupDelim)) {
                        price = price.replace('.', '')
                    }
                    price = price.replace(',', '.');
                    priceItems[i].innerText = ((+price) * rate).toFixed(2) + ` ${targetCurrency}`;
                }
            }
        }
    }

    function isOutdated(rates) {
        try {
            if (rates == null)
                return true;
            return (Date.now() - rates['time_last_update_unix'] * 1000) > 86400000000;
        }
        catch {
            return true;
        }
    }

    async function getRates(baseCurrency) {
        let url = `https://open.er-api.com/v6/latest/${baseCurrency}`;
        let rates;
        try {
            rates = JSON.parse(localStorage.getItem('rates'));
        }
        finally {
            if (isOutdated(rates) || rates['base_code'] != baseCurrency) {
                await fetch(url).then((response) => response.json()).then((_rates) => { rates = _rates; } );
                localStorage.setItem('rates', JSON.stringify(rates));
            }
        }
        return rates;
    }

    function currencyFilterFunc() {
        let input = document.getElementById('currencyFilter');
        let filter = input.value.toUpperCase();
        let div = document.querySelector('.currency-select');
        let divs = div.getElementsByTagName('div');
        for (let i = 0; i < divs.length; i++) {
            if (divs[i].textContent.indexOf(filter) > -1) {
                divs[i].style.display = '';
            } else {
                divs[i].style.display = 'none';
            }
        }
    }

    window.addEventListener('load', generateListOfCurrencies);

})();