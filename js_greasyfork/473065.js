// ==UserScript==
// @name         Hitta.se telefonnummber
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Hämta telefonnummer från Hitta.se
// @author       Erik Engervall
// @match        https://www.hitta.se/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=google.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/473065/Hittase%20telefonnummber.user.js
// @updateURL https://update.greasyfork.org/scripts/473065/Hittase%20telefonnummber.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const DEBUG = false;
    const LOCAL_STORAGE_KEY = "hitta_se_telefonnummer";
    const persistedResult = localStorage.getItem(LOCAL_STORAGE_KEY);

    const $personCards = document.querySelectorAll('[data-test="person-item"]');
    const $nextPageButton = document.querySelector('[data-test="next"]');

    // Array<{ name: string, phoneNumber: string }>
    const results = [];

    for (let i = 0; i < $personCards.length; i++) {
        let name, phoneNumber

        const $personCard = $personCards[i]
        const $name = $personCard.querySelector('[data-test="search-result-title"]');
        if ($name) {
            name = $name.textContent;
        } else {
            name = "Unknown";
        }

        const $phoneNumber = $personCard.querySelector('[data-test="phone-link"]');
        if ($phoneNumber) {
            phoneNumber = $phoneNumber.textContent;
        }

        if (phoneNumber) {
            results.push({ name, phoneNumber });
        }
    }

    const { searchParams } = new URL(document.location);
    const sida = parseInt(searchParams.get("sida") ?? "0", 10);

    const phoneNumbers = results.map(result => result.phoneNumber).join("\n");
    console.log(`Telefonnummer (page #${sida ?? 0})`);
    console.log(phoneNumbers);

    let newPersistedResult = phoneNumbers;
    if (sida) {
        newPersistedResult = persistedResult + "\n" + phoneNumbers;
    }
    localStorage.setItem(LOCAL_STORAGE_KEY, newPersistedResult);

    DEBUG && console.debug("newPersistedResult:", newPersistedResult);

    if ($nextPageButton) {
        console.log(`Found next button, going to next page: ${sida} -> ${sida + 1}`);
        $nextPageButton.click();
    } else {
        console.log("🚀 Result... 🚀");
        console.log(localStorage.getItem(LOCAL_STORAGE_KEY));
    }
})();
