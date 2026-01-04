// ==UserScript==
// @name         [DEPRECATED]Amex Offer Helper
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Helps you add American Express Offer easily
// @author       Tony Chen
// @match        https://global.americanexpress.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/434584/%5BDEPRECATED%5DAmex%20Offer%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/434584/%5BDEPRECATED%5DAmex%20Offer%20Helper.meta.js
// ==/UserScript==


// Check element credit:
// https://stackoverflow.com/a/47776379
function rafAsync() {
    return new Promise(resolve => {
        requestAnimationFrame(resolve);
    });
}

async function checkElement(selector) {
    let querySelector = null;
    while (querySelector === null) {
        await rafAsync();
        querySelector = document.querySelector(selector);
    }
    return querySelector;
}

let addAllBtn = document.createElement("a");
let TIMEOUT = 2000;

async function addAllOffers() {
    let checked = document.querySelectorAll("input[name='offers_checkbox']:checked");
    let btns;
    var index;
    if (checked.length == 0) {
        btns = [...document.querySelectorAll("button")].filter(btn => btn.title == "Add to Card" || btn.title == "Activate Offer");

        index = 0;
        for (; index < btns.length; index++) {
            btns[index].click();
            await new Promise(r => setTimeout(r, TIMEOUT));
        }
    } else {
        index = 0;
        for (; index < checked.length; index++) {
            checked[index].parentElement.parentElement.parentElement.querySelector("button").click();
            await new Promise(r => setTimeout(r, TIMEOUT));
        }
    }
    addAllBtn.textContent = "Add All Offers";
}

function addCheckbox() {
    let rows = [...document.querySelectorAll(".border-b")].filter(r => r.querySelector("button").title == "Add to Card" || r.querySelector("button").title == "Activate Offer");
    rows.forEach((offer, idx) => {
        let name = "user_select_offer_" + idx;
        let row = offer.querySelector(".row");
        let checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.id = name;
        checkbox.name = "offers_checkbox";
        checkbox.value = name;
        checkbox.addEventListener("click", e => {
            if (document.querySelectorAll("input[name='offers_checkbox']:checked").length == 0) {
                addAllBtn.textContent = "Add All Offers";
            } else {
                addAllBtn.textContent = "Add Selected Offers (" + document.querySelectorAll("input[name='offers_checkbox']:checked").length + ")";
            }
            e.stopPropagation()
        });
        let div = document.createElement("div");
        div.classList = "col-0";
        div.appendChild(checkbox);
        row.prepend(div);
    });
}

function cardSwitchMonitor() {
    checkElement(".axp-account-switcher__accountSwitcher__togglerButton___1H_zk").then(switcher => {
        switcher.addEventListener("click", e => {
            console.log("accountSwitcher clicked")
            checkElement("#accounts").then(acc => {
                acc.addEventListener("click", e => {
                    console.log("card changed")
                    checkElement(".border-b").then(_ => {
                        addCheckbox();
                        cardSwitchMonitor();
                    });
                });
            });
        });
    });
}

let amexOfferUrl = "https://global.americanexpress.com/offers/eligible";
let lastUrl = "";
new MutationObserver(() => {
    const url = location.href;
    if (url === amexOfferUrl && url !== lastUrl) {
        runHelper();
        lastUrl = url;
    }
    lastUrl = url;
}).observe(document, {
    attributes: true,
    childList: true,
    subtree: true
});

function runHelper() {
    'use strict';

    checkElement("#offers > div span").then(title => {
        addAllBtn.classList = "btn-secondary btn btn-fluid";
        addAllBtn.textContent = "Add All Offers";
        addAllBtn.style.width = "auto";
        addAllBtn.addEventListener("click", addAllOffers)
        title.appendChild(addAllBtn);

        checkElement(".border-b").then(_ => {
            addCheckbox();
        });

        cardSwitchMonitor();
    });
}