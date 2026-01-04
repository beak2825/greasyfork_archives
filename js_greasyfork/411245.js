// ==UserScript==
// @name         On+ Paid Days
// @namespace    on+_paid_days
// @version      1.1
// @description  Подсчёт количества оплаченных дней на сайте провайдера ОнПлюс
// @author       Alexandr Stankovich
// @match        https://stat.onplus.ru/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/411245/On%2B%20Paid%20Days.user.js
// @updateURL https://update.greasyfork.org/scripts/411245/On%2B%20Paid%20Days.meta.js
// ==/UserScript==

(function() {
    let balance = document.querySelector('tr:nth-child(4) > td.boxline.green').innerHTML;
    let request = new XMLHttpRequest();

    fetch('https://stat.onplus.ru/?tact=info/services')
        .then(response => response.text())
        .then(result => {
            let DOM = new DOMParser().parseFromString(result, 'text/html'),
                cost = DOM.querySelector('tr.boxline > td:nth-child(1)').innerHTML,
                paidDays = Math.ceil(balance.replace(',', '.') / cost.replace(',', '.') * 30);

            document.querySelector('tr:nth-child(4) > td.boxline.green').innerHTML = balance + ' (дней с интернетом: ' + paidDays + ', включая этот)';
        });
})();