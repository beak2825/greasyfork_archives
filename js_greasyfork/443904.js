// ==UserScript==
// @name         Reddit - Auto-redeem awards
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Auto-redeem free awards
// @author       thedrunkendev
// @match        https://www.reddit.com/**
// @icon         https://www.google.com/s2/favicons?sz=64&domain=reddit.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/443904/Reddit%20-%20Auto-redeem%20awards.user.js
// @updateURL https://update.greasyfork.org/scripts/443904/Reddit%20-%20Auto-redeem%20awards.meta.js
// ==/UserScript==
/* global waitForKeyElements */

(async function() {
    'use strict';

    await waitFor(() => document.querySelector("#COIN_PURCHASE_DROPDOWN_ID")?.innerText.includes("Free"));
    document.querySelector("#COIN_PURCHASE_DROPDOWN_ID")?.click();

    await waitFor(() => document.querySelector(`[role="menu"] [role="button"]`));
    document.querySelectorAll(`[role="menu"] [role="button"]`).forEach(a => a.innerText === "Claim" ? a.click() : null);

    await waitFor(() => document.querySelector(`[role="dialog"] div > svg`));
    document.querySelector(`[role="dialog"] div > svg`)?.parentElement.click();
})();

function waitFor(fn) {
    let remainingAttempts = 10;
    const poll = (resolve) => {
        remainingAttempts--;
        if (fn()) resolve();
        else if (remainingAttempts===0) {console.log("Max attempts reached"); return;}
        else setTimeout(_ => poll(resolve), 500);
    }

    return new Promise(poll);
}
