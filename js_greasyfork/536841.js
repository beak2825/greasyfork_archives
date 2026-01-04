// ==UserScript==
// @name         daily_roul_balance
// @namespace    http://tampermonkey.net/
// @version      0.1.3
// @description  Подсчитывает общую статистику на https://daily.heroeswm.ru/roulette/player.php
// @license      yo momma so fat she has her own timezone
// @author       Something begins
// @match        https://daily.heroeswm.ru/roulette/player.php*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=heroeswm.ru
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/536841/daily_roul_balance.user.js
// @updateURL https://update.greasyfork.org/scripts/536841/daily_roul_balance.meta.js
// ==/UserScript==

(function() {
    const attachTo = document.querySelector('input[value="Показать"]');
    attachTo.insertAdjacentHTML("afterend", `<button id = "roul_balance">Статистика</button>`);
    document.querySelector("#bet_his_length > label > select").selectedIndex = 3;
    const event = new Event('change', { bubbles: true });
    document.querySelector("#bet_his_length > label > select").dispatchEvent(event);
    function pickButton(parent, i){
        for (const child of parent.children){
            const num = parseInt(child.textContent);
            if (!Number.isInteger(num))continue;
            if (num === i) return child;
        }
    }
    function oneTable(tableNo=0, sum=0, bet=0, won=0){
        const buttonsParent = document.querySelector("#bet_his_paginate > span");
        if (tableNo >= parseInt(buttonsParent.lastChild.textContent)) {
            attachTo.nextSibling.insertAdjacentHTML("afterend", `<br><span>Поставлено: ${bet.toLocaleString()}</span><br><span>Выиграно: ${won.toLocaleString()}</span><br><span>Баланс: ${sum.toLocaleString()}</span>`);
            pickButton(buttonsParent, 1).click();
            return;
        }
        pickButton(buttonsParent, tableNo+1).click();
        for (let i = 0; i < document.querySelector("#bet_his > tbody").children.length; i++){
            const profitNum = parseInt(document.querySelector(`#bet_his > tbody > tr:nth-child(${i+1}) > td:nth-child(4)`).textContent);
            const betNum = parseInt(document.querySelector(`#bet_his > tbody > tr:nth-child(${i+1}) > td:nth-child(2)`).textContent);
            const wonNum = parseInt(document.querySelector(`#bet_his > tbody > tr:nth-child(${i+1}) > td:nth-child(3)`).textContent);
            bet+= betNum;
            won+= wonNum;
            sum+=profitNum;

        }
        console.log(`Страница ${tableNo+1}, баланс ${sum}`);
        setTimeout(()=>{oneTable(tableNo+1, sum, bet, won)}, 100);
    }

    document.querySelector("#roul_balance").addEventListener("click", event => {
        event.preventDefault();
        oneTable();
    })
})();