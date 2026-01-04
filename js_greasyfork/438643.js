// ==UserScript==
// @name         kupfundusz.pl - czytelniejsze wyniki
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Skrypt pokazujący w przyjazny sposób wynik całego portfela oraz każdego z funduszy z osobna
// @author       Bartek Igielski
// @match        https://www.kupfundusz.pl/portfel
// @icon         https://www.kupfundusz.pl/favicon/favicon-96x96.png
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/438643/kupfunduszpl%20-%20czytelniejsze%20wyniki.user.js
// @updateURL https://update.greasyfork.org/scripts/438643/kupfunduszpl%20-%20czytelniejsze%20wyniki.meta.js
// ==/UserScript==

function parsePrice(text) {
    return parseFloat(
        text
            .replace('&nbsp;', '')
            .replace(',', '.')
            .replace('PLN', '')
            .replaceAll(/\s/g, '')
    )
}

// Show results for the whole account
(function() {
    const [value, payments, payouts] = [ ...document.querySelectorAll('.walletGeneralInfoContent div p.font24')].map(el => parsePrice(el.innerText))
    const invested = payments - payouts
    const result = (value - invested).toFixed(2)
    const percent = ((value / invested - 1) * 100).toFixed(2)

    document.querySelector('.walletGeneralInfoContent').innerHTML = `
        <div>
           <p class="font24">
               ${value}
               <span class="currency">PLN</span>
           </p>

            <p class="font12 textBold">Wartość portfela</p>
        </div>

        <div>
           <p class="font24">
               ${result}
               <span class="currency">PLN</span>
           </p>

            <p class="font12 textBold">Wynik w zł</p>
        </div>

        <div>
           <p class="font24">
               ${percent}%
           </p>

            <p class="font12 textBold">Wynik w %</p>
        </div>
    `
})();

// Show percentage results for each fund
(function() {
    document.querySelectorAll('#tabd .walletSumUpDetails.emptyWalletVisible .fundWrapper:not(.sortWrapper)').forEach(row => {
        const [current, invested, result] = [...row.querySelectorAll('span.price')].map(el => parsePrice(el.innerText))
        const percent = ((current / invested - 1) * 100).toFixed(2)
        row.querySelector('div:nth-child(6) > p > span.price').innerText = `${percent}%`
        row.querySelector('div:nth-child(6) p.smallText').innerText = `${result} zł`
    })
})();