// ==UserScript==
// @name         LztCurrencyApi
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Отображает курс валют на маркете
// @author       vuchaev2015
// @match        https://lzt.market/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=lzt.market
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/471607/LztCurrencyApi.user.js
// @updateURL https://update.greasyfork.org/scripts/471607/LztCurrencyApi.meta.js
// ==/UserScript==

const api_url = 'https://raw.githubusercontent.com/fawazahmed0/currency-api/1/latest/currencies/';

const currencyMap = {
    'Рубль': 'rub',
    'Гривна': 'uah',
    'Тенге': 'kzt',
    'Бел. рубль': 'byn',
    'Доллар': 'usd',
    'Евро': 'eur',
    'Фунт стерлингов': 'gbp',
    'Юань': 'cny',
    'Турецкая лира': 'try'
};

const currencySymbolMap = {
    'rub': '₽',
    'uah': '₴',
    'kzt': '₸',
    'byn': 'BYN',
    'usd': '$',
    'eur': '€',
    'gbp': '£',
    'cny': '¥',
    'try': '₺'
};

const chosenCurrencyText = document.querySelector("#content > div > div > aside > div > div > div:nth-child(2) > div > div.marketSidebarMenu.bordered-top > div > form > div > a > span").textContent.trim();

const chosenCurrency = chosenCurrencyText.split(' — ')[0];
console.log(chosenCurrencyText)
const currency = currencyMap[chosenCurrency];
console.log(currency)
const currencySymbol = currencySymbolMap[currency];
console.log(currencySymbol)

const usd_url = `${api_url}/usd/${currency}.json`;
const eur_url = `${api_url}/eur/${currency}.json`;
const cny_url = `${api_url}/cny/${currency}.json`;

async function getCurrencyValue(url) {
    const response = await fetch(url);
    const data = await response.json();
    return data[currency];
}

async function addCurrencyValues() {
    const usd_value = await getCurrencyValue(usd_url);
    const eur_value = await getCurrencyValue(eur_url);
    const cny_value = await getCurrencyValue(cny_url);

    const currencies = [
        { name: 'USD', value: usd_value },
        { name: 'EUR', value: eur_value },
        { name: 'CNY', value: cny_value }
    ];

   const currencyHtml = currencies.map((currency, index) => `
    <div class="item">
        <div class="trimmedTitle">${currency.name}</div>
        <div class="paymentFooter">
            <span class="priceBadgeTransparent">${currency.value} ${currencySymbol}</span>
        </div>
    </div>
    ${index === currencies.length - 1 ? '' : '<br>'}
`).join('');


    const html = `
        <br><div class="secondaryContent">
            <h3><a href="https://github.com/fawazahmed0/currency-api/tree/1/latest">Курс валют</a></h3>
            <div class="marketCurrencyApi marketCurrencyItems">
                <div class="wrapper">
                    ${currencyHtml}
                </div>
            </div>
            <a href="https://github.com/fawazahmed0/currency-api/tree/1/latest/" class="mn-15-0-0 button full">Посмотреть все</a>
        </div>
    `;

    document.querySelector('#content > div > div > aside > div > div > div:nth-child(3)').innerHTML += html;
}

addCurrencyValues();