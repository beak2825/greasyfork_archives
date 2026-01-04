// ==UserScript==
// @name         token-eye.web
// @namespace    http://tampermonkey.net/
// @version      2024-02-14
// @description  try to take over the world! site do rhutao
// @author       You
// @match        https://token-eye.web.app/**
// @icon         https://www.google.com/s2/favicons?sz=64&domain=web.app
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/486312/token-eyeweb.user.js
// @updateURL https://update.greasyfork.org/scripts/486312/token-eyeweb.meta.js
// ==/UserScript==

(async function() {
    'use strict';


const delay = (waitTimeInMs) => new Promise(resolve => setTimeout(resolve, waitTimeInMs));

setTimeout(() => {

    let url = new URL(window.location.href);

    let params = new URLSearchParams(url.search);

    let walletValue = params.get('wallet');

    let walletInput = document.getElementById('walletAddress');


    // Defina o valor do campo de entrada
    walletInput.value = walletValue;

    // Dispare um evento de mudança de input
    walletInput.dispatchEvent(new Event('input', { bubbles: true }));

    // Dispare um evento de mudança
    walletInput.dispatchEvent(new Event('change', { bubbles: true }));

    // Dispare um evento de foco
    walletInput.dispatchEvent(new Event('focus', { bubbles: true }));

    // Dispare um evento de teclado para simular o pressionamento da tecla "Enter"
    walletInput.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));





    console.log(walletInput.value)

}, 1000);


setTimeout(() => {

    console.log("click botao");
    let button = document.querySelector('button[type="submit"]');
    button.click();

}, 1000 * 5);

setInterval(async () => {

    console.log("click botao");

    let button = document.querySelector('button[type="submit"]');
    button.click();

}, 1000 * 60 * 5);


setInterval(async () => {

    let trElements;


    while (!(trElements = document.querySelectorAll('div.table-container table tbody tr')).length) {
        console.log("waiting....");
        await delay(1000)
    }

    trElements.forEach((tr, index) => {

        const tds = tr.querySelectorAll("td");

        if (tds[1].textContent == ' So11111111111111111111111111111111111111112 ') {
            tr.style.display = 'none'
        }

        let str = tds[4].textContent;
        let numericStr = str.replace(" $", '');
        numericStr = numericStr.split(" ")[0]
        let intValue = parseInt(numericStr.split('.')[0]);

        let strTotalReserve = tds[5].textContent;
        let numericStrstrTotalReserve = strTotalReserve.replace(" $", '');
        numericStrstrTotalReserve = numericStrstrTotalReserve.split(" ")[0]
        let totalReserve = parseInt(numericStrstrTotalReserve.split('.')[0]);

        if (intValue < 3 || intValue > totalReserve) {
            tr.style.display = 'none'
        } else {
            tds[4].innerHTML = `<b style="color: red;">${intValue}</b>`;
        }
    });

}, 1000 * 20);



})();

