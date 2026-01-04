// ==UserScript==
// @name         Profit Balance lolz
// @namespace    https://lolz.guru/members/2203310/
// @version      0.3
// @description  Профитный баланс
// @author       Bladhard
// @match        https://lzt.market/user/payments
// @match        https://lzt.market/user/*/payments*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=lolz.guru
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/450395/Profit%20Balance%20lolz.user.js
// @updateURL https://update.greasyfork.org/scripts/450395/Profit%20Balance%20lolz.meta.js
// ==/UserScript==

(function() {
    'use strict';

function profit() {
    let full_balance = document.getElementsByClassName('Incomes')[0].innerText.replace(' ', ''),
        spent_balance = document.getElementsByClassName('Outgoings')[0].innerText.replace(' ', '')
    let profit_balance = parseInt(full_balance) - parseInt(spent_balance)
    if (profit_balance < 0) {
        document.getElementsByClassName('Incomes')[0].insertAdjacentHTML(
            'beforeend',
            `<style>
        .red_profit {
            color: red;
        }

    </style>
            <span class="red_profit">(${profit_balance})</span>`
        )
    } else {
        document.getElementsByClassName('Incomes')[0].insertAdjacentHTML(
            'beforeend',
            `<style>
        .green_profit {
            color: rgb(6 191 90);
        }

    </style>
            <span class="green_profit">(${profit_balance})</span>`
        )
    }
}

profit()

let object_click = document.getElementsByClassName('market--userPaymentsFilter')[0]
let ranges_click = document.getElementsByClassName('ranges')[0]
let date_click = document.getElementsByClassName('applyBtn')[0]

object_click.addEventListener('click', () => {
    if (document.getElementsByClassName('green_profit')[0]) {
        document.getElementsByClassName('green_profit')[0].remove('green_profit')
    } else if (document.getElementsByClassName('red_profit')[0]) {
        document.getElementsByClassName('red_profit')[0].remove('red_profit')
    }
    setTimeout(() => {
        profit()
    }, 200)
})

ranges_click.addEventListener('click', () => {
    if (document.getElementsByClassName('green_profit')[0]) {
        document.getElementsByClassName('green_profit')[0].remove('green_profit')
    } else if (document.getElementsByClassName('red_profit')[0]) {
        document.getElementsByClassName('red_profit')[0].remove('red_profit')
    }
    setTimeout(() => {
        profit()
    }, 250)
})

    date_click.addEventListener('click', () => {
    if (document.getElementsByClassName('green_profit')[0]) {
        document.getElementsByClassName('green_profit')[0].remove('green_profit')
    } else if (document.getElementsByClassName('red_profit')[0]) {
        document.getElementsByClassName('red_profit')[0].remove('red_profit')
    }
    setTimeout(() => {
        profit()
    }, 200)
})




})();