// ==UserScript==
// @name         ZenMoney Currency Percents
// @namespace    shukhrat@shukhrat.org
// @version      0.1
// @description  On the ZenMoney service (zenmoney.ru) calculates the total percent each currency concludes and shows you alert if you need to buy or sell a currency. By default works for USD, EUR and RUB, with desired percents 30, 30 and 40 respectively. Change the __PARAMS__ settings below to your desired values. Timeout setting is required, because when the page loads, the objects are not ready yet.
// @author       shukhrat@shukhrat.org
// @match        https://zenmoney.ru/a/*
// @downloadURL https://update.greasyfork.org/scripts/13052/ZenMoney%20Currency%20Percents.user.js
// @updateURL https://update.greasyfork.org/scripts/13052/ZenMoney%20Currency%20Percents.meta.js
// ==/UserScript==

var __PARAMS__ = {
    desired: {
        'USD': {
            percent: 0.3,
            criticalDiff: 500
        },
        'EUR': {
            percent: 0.3,
            criticalDiff: 500
        },
        'RUB': {
            percent: 0.4,
            criticalDiff: 25000
        }
    },
    timeout: 2000
};

$(function () {
    var attach = function () {
        var totals = getTotalsCurrencyPercents(zm.profile, __PARAMS__.desired),
            css = '<style>#totals {float: right} #totals td {padding:2px 5px} #totals td.decimal {text-align: right} #totals td.alert {color: red}</style>';
        $('#header').append(css);
        $('#header').append(draw(totals));
    };
    setTimeout(attach, __PARAMS__.timeout);
});

function getTotalsCurrencyPercents(profile, desired) {
    var accounts = profile.account;
    var defaultCurrency = profile.user.currency;
    var allCurrencies = profile.instrument;
    var totals = {};
    var currency, balance, key, rate, amount, currencyCode;
    for (var i = 0; i < profile.in_balance.length; i++) {
        key = profile.in_balance[i];
        currency = accounts[key].instrument;
        balance = parseFloat(accounts[key].balance);
        rate = allCurrencies[currency].value * allCurrencies[currency].multiplier;
        currencyCode = allCurrencies[currency].title_short;
        if (typeof totals[currencyCode] === 'undefined') {
            totals[currencyCode] = {
                balance: balance,
                inDefaultCurrency: balance * rate,
                rate: rate,
                symbol: allCurrencies[currency].symbol 
            };
        } else {
            totals[currencyCode].balance += balance;
            totals[currencyCode].inDefaultCurrency += balance * rate;
        }
    }
    for (currency in totals) {
        amount = totals[currency];
        amount.percent = Math.round(amount.inDefaultCurrency / profile.balance * 100);
        if (typeof desired[currency] === 'undefined') {
            amount.needToBuy = '';
            amount.alert = '';
        } else {
            amount.needToBuy = (profile.balance / amount.rate) * desired[currency].percent - amount.balance;
            amount.needToBuy = Math.round(amount.needToBuy * 100) / 100;
            amount.alert = (Math.abs(amount.needToBuy) > desired[currency].criticalDiff);
        }
        // Let us round up the values
        amount.balance = Math.round(amount.balance * 100) / 100;
        amount.inDefaultCurrency = Math.round(amount.inDefaultCurrency * 100) / 100;
    }
    return totals;
}

function draw(totals) {
    console.log(totals);
    var table = '<table id="totals">'
        +'<thead><tr>'
        + '<th class="decimal">Баланс</th>'
        + '<th></th>'
        + '<th></td>'
        + '<th class="decimal">Курс</th>'
        + '<th class="decimal">Надо купить</th>'
        + '</tr></thead>'
        +'<tbody>';
    var amount, row;
    for (var currency in totals) {
        amount = totals[currency];
        row = '<tr title="Идентификатор валюты: ' + currency +'">'
                + '<td class="decimal">' + amount.balance + '</td>'
                + '<td>' + amount.symbol + '</td>'
                + '<td>' + amount.percent + '%</td>'
                + '<td class="decimal">' + amount.rate + '</td>'
                + '<td class="decimal' + ((amount.alert) ? ' alert' : ' ') + '">' + amount.needToBuy + '</td>'
                + '</tr>'
            ;
        table += row;
    }
    table += '</tbody></table>';
    return table;
}
