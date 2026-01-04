// ==UserScript==
// @name         LZT Real Balance
// @namespace    https://zelenka.guru/
// @version      1.0
// @author       https://zelenka.guru/sdad/
// @description  Displays your real balance
// @match        https://zelenka.guru/*
// @match        https://lzt.market/*
// @icon         https://zelenka.guru/favicon.ico
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/464247/LZT%20Real%20Balance.user.js
// @updateURL https://update.greasyfork.org/scripts/464247/LZT%20Real%20Balance.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let currentBank = 1;

    const balanceMenu = document.querySelector("#AccountMenu > ul > li.Popup.PopupInPopup.DisableHover > a");
    const balanceElement = document.querySelector("#NavigationAccountBalance > span > span.balanceValue");
    const balanceRubles = balanceElement.innerText;
    const balanceValue = parseFloat(balanceRubles.replace(/\s/g, '').replace(',', '.'));

    /*/    1. ЮMoney 8%    /*/
    let yoomoney = balanceValue - (balanceValue * 0.08);

    /*/    2. QIWI 7%    /*/
    let qiwi = balanceValue - (balanceValue * 0.07);

    /*/    3. PAYEER 10%    /*/
    let payeer = balanceValue - (balanceValue * 0.1);

    /*/    4. Карта Россия 8% + 50₽    /*/
    let russbank = balanceValue - ((balanceValue * 0.08) + 50);

    /*/    5. Cryptomus (Крипта) 6%    /*/
    let cryptomus = balanceValue - (balanceValue * 0.06);

    /*/    6. Кошелек LAVA.ru 5%    /*/
    let lava = balanceValue - (balanceValue * 0.05);

    /*/    7. WebMoney WMZ 6%    /*/
    let webmoney = balanceValue - (balanceValue * 0.06);

    /*/    8. Карта Украина 10%    /*/
    let ukrbank = balanceValue - (balanceValue * 0.1);

    if (currentBank == 1) {
        AddBalance(yoomoney);
    } else if (currentBank == 2) {
        AddBalance(qiwi);
    } else if (currentBank == 3) {
        AddBalance(payeer);
    } else if (currentBank == 4) {
        AddBalance(russbank);
    } else if (currentBank == 5) {
        AddBalance(cryptomus);
    } else if (currentBank == 6) {
        AddBalance(lava);
    } else if (currentBank == 7) {
        AddBalance(webmoney);
    } else if (currentBank == 8) {
        AddBalance(ukrbank);
    }

    function AddBalance(choice) {
        let newBalanceValueNumber = choice.toLocaleString('ru-RU', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
        const newBalanceElement = document.createElement('span');
        newBalanceElement.innerText = ' (' + newBalanceValueNumber + ')';

        balanceElement.parentNode.insertBefore(newBalanceElement, balanceElement.nextSibling);
        balanceMenu.appendChild(newBalanceElement);
    }
})();