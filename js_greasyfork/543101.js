// ==UserScript==
// @name	Chunithm Currency Exchange Helper (International ver.)
// @version	1.0.1
// @description	Currency Shop Option Expander
// @match	https://chunithm-net-eng.com/mobile/netStore/currencyExchange
// @grant	none
// @license	MIT
// @namespace https://greasyfork.org/users/1405339
// @downloadURL https://update.greasyfork.org/scripts/543101/Chunithm%20Currency%20Exchange%20Helper%20%28International%20ver%29.user.js
// @updateURL https://update.greasyfork.org/scripts/543101/Chunithm%20Currency%20Exchange%20Helper%20%28International%20ver%29.meta.js
// ==/UserScript==

(function () {
    'use strict';
    console.log("Script Loaded");

    // 현재 보유 재화 값
    const currentCurrencyBlock = document.querySelector('.current_currency_block span.text_b');
    const currentCurrency = parseInt(currentCurrencyBlock.textContent.replace(/,/g, ''), 10);

    // 교환 아이템 처리
    document.querySelectorAll('div.w400.box04').forEach(item => {
        const getValue = (label) => {
            const el = [...item.querySelectorAll('.text_c.text_b')]
                .find(e => e.textContent.includes(label));
            return parseInt(el.textContent.split(':')[1].replace(/,/g, '').trim(), 10);
        };

        const itemCost = getValue('Required currency');
        const owningNumbers = getValue('Owning numbers');

        // 최대 교환 가능 수량
        let maxExchange = Math.min(
            Math.floor(currentCurrency / itemCost),
            99 - owningNumbers
        );

        const select = item.querySelector('select');
        select.innerHTML = '';

        if (maxExchange <= 0) {
            select.appendChild(new Option('Exchange is not available', 0));
        } else {
            for (let i = maxExchange; i >= 1; i--) {
                select.appendChild(new Option(
                    `Buy × ${i} (Cost: ${i * itemCost} Currency)`,
                    i
                ));
            }
            select.dispatchEvent(new Event('change', { bubbles: true }));
        }
    });
})();