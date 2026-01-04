// ==UserScript==
// @name         Fake Deposits and Withdraws [GetSpin]
// @namespace    http://tampermonkey.net/
// @version      2.2
// @description  Фейковые депозиты для getspin.club
// @author       Froggie
// @match        https://getspin1.club/*
// @icon         https://getspin1.club/img/favicon.png
// @grant        none
// @license      Froggie
// @downloadURL https://update.greasyfork.org/scripts/468817/Fake%20Deposits%20and%20Withdraws%20%5BGetSpin%5D.user.js
// @updateURL https://update.greasyfork.org/scripts/468817/Fake%20Deposits%20and%20Withdraws%20%5BGetSpin%5D.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // Вводите любое необходимое количество депозитов в следующий массив и они отобразятся на сайте!
    const deposits = [
        {id: 474, time: "17.06.2023 10:12", amount: 5000}, // ID - Айди депозита; TIME - Время депозита; AMOUNT - Сумма депозита.
        {id: 475, time: "18.06.2023 15:23", amount: 7500},
        {id: 476, time: "19.06.2023 14:08", amount: 10000}
    ];

    // Вводите любое необходимое количество выплат в следующий массив и они отобразятся на сайте!
    const withdraws = [
        {id: 1102, amount: 5000}, // ID - Айди выплаты; AMOUNT - Сумма выплаты.
        {id: 1103, amount: 7500},
        {id: 1104, amount: 10000}
    ];

    const tbody = document.getElementById("depsTable-inside");
    tbody.innerHTML = "";

    deposits.reverse().forEach(item => {
        const tr = document.createElement("tr");
        tr.style.cursor = "default";
        tr.style.textAlign = "center";
        tr.innerHTML = `
    <td>${item.id}</td>
    <td>${item.time}</td>
    <td>${item.amount}</td>
  `;
    tbody.appendChild(tr);
});

    // Измените значение переменной removeWithdraws на false, если хотите, чтобы настоящие выплаты тоже отображались
    const removeWithdraws = false;

    const tbody2 = document.querySelector(".modal#withdrawModal .modal-dialog .modal-content .modal-body center .col-md-12 .row .col-md-12 .card .card-body table tbody#depsTable-inside");
    if (removeWithdraws) { tbody2.innerHTML = ""; }

    withdraws.reverse().forEach(item => {
        const tr2 = document.createElement("tr");
        tr2.style.cursor = "default";
        tr2.style.textAlign = "center";
        tr2.innerHTML = `
    <td>${item.id}</td>
    <td>${item.amount}</td>
    <td><span class="badge order-bg-opacity-success text-success rounded-pill active">Выплачено</span></td>
  `;
    tbody2.appendChild(tr2);
});


})();