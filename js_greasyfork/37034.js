// ==UserScript==
// @name     ethermine-to-fiat
// @description shows the current unpaid balance as fiat on the ethermine miners page
// @version  1.2.0
// @include		https://ethermine.org/miners/*
// @namespace https://greasyfork.org/users/165561
// @downloadURL https://update.greasyfork.org/scripts/37042/ethermine-to-fiat.user.js
// @updateURL https://update.greasyfork.org/scripts/37042/ethermine-to-fiat.meta.js
// ==/UserScript==
var currencies = [
    { "l": "$", "c": "USD" },
    { "l": "$", "c": "AUD" },
    { "l": "R$", "c": "BRL" },
    { "l": "$", "c": "CAD" },
    { "l": "CHF", "c": "CHF" },
    { "l": "$", "c": "CLP" },
    { "l": "¥", "c": "CNY" },
    { "l": "$", "c": "CZK" },
    { "l": "kr", "c": "DKK" },
    { "l": "€", "c": "EUR" },
    { "l": "£", "c": "GBP" },
    { "l": "$", "c": "HKD" },
    { "l": "Ft", "c": "HUF" },
    { "l": "Rp", "c": "IDR" },
    { "l": "₪", "c": "ILS" },
    { "l": "INR", "c": "INR" },
    { "l": "¥", "c": "JPY" },
    { "l": "₩", "c": "KRW" },
    { "l": "$", "c": "MXN" },
    { "l": "RM", "c": "MYR" },
    { "l": "kr", "c": "NOK" },
    { "l": "$", "c": "NZD" },
    { "l": "₱", "c": "PHP" },
    { "l": "₨", "c": "PKR" },
    { "l": "zł", "c": "PLN" },
    { "l": "₽", "c": "RUB" },
    { "l": "kr", "c": "SEK" },
    { "l": "$", "c": "SGD" },
    { "l": "฿", "c": "THB" },
    { "l": "TRY", "c": "TRY" },
    { "l": "NT$", "c": "TWD" },
    { "l": "R", "c": "ZAR" }
];
var select = document.createElement('select');
select.style.color = '#000';
select.onchange = function (e) {
    getEthereum(JSON.parse(e.target.selectedOptions[0].value));
};
select.innerHTML = currencies.map(function (o) {
    return "<option value='" + JSON.stringify(o) + "'>" + o.c + "</option>";
}).join('');
var panel = document.querySelector('.panel-info > div:nth-child(2) > h4:nth-child(1)');
var value = /[0-9\.]+/.exec(panel.innerHTML)[0].trim();
var init = false;
var valueInFiat;
var getEthereum = function (currency) {
    var request = new XMLHttpRequest();
    request.addEventListener("load", function () {
        if (!init) {
            valueInFiat = document.createElement('p');
            valueInFiat.id = 'getf';
            valueInFiat.style.padding = '20px 0px 0px 0px';
            panel.parentElement.appendChild(valueInFiat);
            panel.parentElement.appendChild(select);
            init = true;
        }
        valueInFiat.innerHTML = currency.l + (parseFloat(this.response[0]["price_" + currency.c.toLowerCase()]) * parseFloat(value)).toFixed(5);
    });
    request.responseType = 'json';
    request.open("GET", "https://api.coinmarketcap.com/v1/ticker/ethereum?convert=" + currency.c);
    request.send();
};
getEthereum(currencies[0]);
