// ==UserScript==
// @name         TORN: OC Payday
// @namespace    eu.torned.ocpayday
// @version      1.0.6
// @author       DeKleineKobini
// @description  Easily do a payday after completing an oc.
// @match        https://www.torn.com/factions.php?step=your
// @run-at       document-body
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/407618/TORN%3A%20OC%20Payday.user.js
// @updateURL https://update.greasyfork.org/scripts/407618/TORN%3A%20OC%20Payday.meta.js
// ==/UserScript==

/*
 * Settings
 */
const addFactionCut = true;
const currentTab = false; // might not work

/* Code */

new MutationObserver((mutations, observer) => {
    const crimes = $("#faction-crimes");
    if (!crimes.length) return;

    new MutationObserver((mutations, observer) => {
        let found = false;

        for (let mutation of mutations) {
            if (!mutation.addedNodes) continue;

            for (let node of mutation.addedNodes) {
                if (!node.classList || !node.classList.contains("crime-result")) continue;

                found = true;
                break;
            }

            if (found) break;
        }

        if (found) {
            handleCrime();
        }
    }).observe(crimes.get(0), {childList: true});

    observer.disconnect();
}).observe(document, {childList: true, subtree: true});

function handleCrime() {
    const participants = $(".crime-result").attr("data-criminals").slice(1, -1).split(",").map(parseFloat);
    let cashValue = $(".crime-result .make-wrap:last() > p:eq(0)").text().match(/\$(.*) made/i)[1];
    while (cashValue.includes(",")) cashValue = cashValue.replace(",", "");
    cashValue = parseInt(cashValue);

    const splitPart = addFactionCut ? participants.length + 1 : participants.length;
    const splitCash = parseInt(cashValue / splitPart);

    if (currentTab) {
        $(".crime-result .plan-again").append(`<span class="btn-wrap again-btn silver right" title="Pay Day these members."><span class="btn"><button class="torn-btn" onclick="gotoHash('${getURLHash(participants, splitCash)}');">PAY DAY</button></span></span>`)
    } else {
        $(".crime-result .plan-again").append(`<span class="btn-wrap again-btn silver right" title="Pay Day these members."><span class="btn"><a class="torn-btn" href="${getFullURL(participants, splitCash)}" target="_blank">PAY DAY</a></span></span>`)
    }
}

function getFullURL(players, amount) {
    return `/factions.php?step=your#/tab=controls&option=pay-day&select=${players.join(",")}&pay=${amount}`;
}

function getURLHash(players, amount) {
    return `tab=controls&option=pay-day&select=${players.join(",")}&pay=${amount}`;
}

window.gotoHash = (hash) => {
    location.hash = hash;
    location.reload();
}