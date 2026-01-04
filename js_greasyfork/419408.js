// ==UserScript==
// @name         DeGiro improved filters
// @namespace    https://yelidmod.com/degiro
// @version      0.7
// @description  Adds missing sort options and amount of shares to buy calculator
// @author       DonNadie
// @match        https://trader.degiro.nl/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/419408/DeGiro%20improved%20filters.user.js
// @updateURL https://update.greasyfork.org/scripts/419408/DeGiro%20improved%20filters.meta.js
// ==/UserScript==

// jshint esversion: 6

(function() {
    'use strict';

    const section = {
        equity: 1,
        etf: 131
    };

    let filtersIndex = {
        volume: 0,
        isin: null,
    };
    const sortButton = '<i role="img" data-name="icon" data-type="sort" aria-hidden="true" class="ife-sort-icon"><svg viewBox="0 0 24 24"><path d="M16.8 13.2L12 18l-4.8-4.8h9.6zM12 6l4.8 4.8H7.2L12 6z"></path></svg></i>';

    const addStyle = (styleString) => {
        const style = document.createElement('style');
        style.textContent = styleString;
        document.head.append(style);
    };

    const sort = () => {
        const trList = document.querySelectorAll('[data-name="productTypeSearch"] tr');

        new Promise((resolve, reject) => {
            let list = [];
            let val;
            trList.forEach((tr, e) => {
                tr.querySelectorAll('td').forEach((td, i) => {
                    if (i !== filtersIndex.volume) {
                        return;
                    }
                    val = parseInt(td.innerText.replace(".", ""));
                    list.push({
                        tr: tr,
                        value : isNaN(val) ? 0 : val
                    });
                });
                if (e == (trList.length - 1)) {
                    resolve(list);
                }
            });
        }).then(list => {
            list.sort((a, b) => (a.value < b.value) ? 1 : -1);
            list.forEach(entry => {
                document.querySelector('[data-name="productTypeSearch"] tbody').appendChild(entry.tr);
            });
        });

    };

    const onLoaded = () => {
        const url = new URL(location.href.replace("#", ''));

        if (!url.searchParams.has('productType')) {
            return;
        }

        const currentSection = parseInt(url.searchParams.get('productType'));

        document.querySelectorAll('[data-name="productTypeSearch"] th').forEach((el, i) => {
            if (el.innerText == "Volumen") {
                filtersIndex.volume = i;
                el.classList.add('ife-container');
                el.innerHTML += sortButton;
                el.addEventListener("click", sort);
            } else if (el.innerText.includes("ISIN")) {
                filtersIndex.isin = i;
            }
        });

        if (filtersIndex.isin == null || ![section.etf, section.equity].includes(currentSection)) {
            return;
        }
        const morningType = currentSection == section.etf ? 'ETF' : 'STOCK';

        document.querySelectorAll('[data-name="productTypeSearch"] tr').forEach((tr, e) => {
             tr.querySelectorAll('td').forEach((td, i) => {
                 if (i !== filtersIndex.isin) {
                     return;
                 }
                 let isin;

                 if (td.innerText.includes("/")) {
                   isin = td.innerText.split(" / ")[1];
                 } else if (td.innerText.length > 5) {
                   isin = td.innerText;
                 }

                 td.querySelector("span").innerHTML = td.innerText.replace(isin, '<a href="https://www.morningstar.es/es/funds/SecuritySearchResults.aspx?type=' + morningType + '&search=' + isin + '" class="ife-link" target="_blank">' + isin + '</a>');
             });
         });
    };

    const showCalculator = (mutationsList) => {
        let section = document.querySelector('[data-name="orderForm"] section');

        if (section == null ||
            document.getElementById('simple-calculator') != null ||
            typeof window.calculatorInjected !== "undefined") {
            return;
        }
        window.calculatorInjected = true;

        const calculatorContainer = document.createElement("div");
        calculatorContainer.id = "simple-calculator";
        calculatorContainer.classList.add("ife-calculator-container");
        calculatorContainer.innerHTML += '<div class="ife-input-container"><div class="ife-input-label"><input id="calculator-money" type="number" min="0" step="1" placeholder="0" class="ife-input"><span>€</span></div></div>'
        + "." +
        '<div class="ife-input-container"><div class="ife-input-label"><input id="calculator-shares" type="text" class="ife-input" placeholder="0" disabled><span>shares</span></div></div>';

        const moneyInput = calculatorContainer.querySelector("#calculator-money");
        const sharesInput = calculatorContainer.querySelector("#calculator-shares");

        moneyInput.addEventListener("input", () => {
            const sharePrice = parseFloat(document.querySelector('[data-field="CurrentPrice"]').title.replace(".", "").replace(",", "."));
            sharesInput.value = Math.floor(moneyInput.value / sharePrice);
        });

        setTimeout(() => {
            // it seems like section is recreated in just a few secs :S
            section = document.querySelector('[data-name="orderForm"] section');
            section.parentNode.insertBefore(calculatorContainer, section);
            delete(window.calculatorInjected);
        }, 1000);
    };

    addStyle(`
     .ife-container {
        align-items: center;
        display: flex;
        flex-direction: row;
        padding-right: 12px;
        position: relative;
     }
     .ife-sort-icon {
        contain: strict;
        display: inline-block;
        flex-shrink: 0;
        font-style: normal;
        font-weight: 400;
        line-height: 1;
        opacity: 1;
        overflow: hidden;
        width: 20px;
        height: 20px;
        text-align: center;
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
        vertical-align: middle;
        position: absolute;
        right: -8px;
        top: 50%;
        transform: translateY(-50%);
        cursor: pointer;
   }
   .ife-link {
        color: #009fdf;
   }
   .ife-calculator-container {
        align-items: flex-start;
        display: flex;
        flex-direction: row;
    }
   .ife-input-container {
        display: flex;
        flex: 1 1 50%;
        flex-direction: column;
        max-width: 50%;
        margin-top: 10px;
        margin-bottom: 10px;
    }
   .ife-input-label {
       background-color: #f3f4f5;
       border: 1px solid transparent;
       display: inline-block;
       height: 32px;
       min-height: 32px;
       position: relative;
   }
   .ife-input {
       background-color: inherit;
       border: 0;
       border-radius: inherit;
       display: block;
       font-size: 1rem;
       height: 100%;
       line-height: 1.5;
       min-height: 100%;
       padding: 0 8px;
       width: 100%;
   }
   .ife-input[disabled], .ife-input[disabled]::placeholder {
       color: #00a658;
   }
   .ife-input-label span {
       color: #00a658;
       position: absolute;
       top: 30%;
       right: 10px;
   }
   `);

    let observerTimeout = null;
    const observerCallback = (mutationsList, observer) => {
        showCalculator(mutationsList);

        // since we can't track an specific id, we observe any body changes and
        // check if our classes are present.
        if (document.querySelectorAll('.ife-container').length > 0) {
            return;
        }
        if (observerTimeout != null) {
            clearTimeout(observerTimeout);
        }
        observerTimeout = setTimeout(onLoaded, 1000 * 2);
    };

    (new MutationObserver(observerCallback)).observe(document.body, {childList: true, subtree: true });
})();