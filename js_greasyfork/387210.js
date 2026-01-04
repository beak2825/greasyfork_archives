// ==UserScript==
// @name         GBF Raidfinder | Dim Reposted Raids
// @namespace    http://fabulous.cupcake.jp.net
// @version      20190705.1
// @description  Automatically dim raidcodes that was already posted
// @author       FabulousCupcake
// @include      /^https?:\/\/.+-raidfinder\.herokuapp\.com.*$/
// @include      /^https?:\/\/gbf-raidfinder\.aikats\.us.*$/
// @include      /^https?:\/\/gbf-raidfinder\.la-foret\.me.*$/
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/387210/GBF%20Raidfinder%20%7C%20Dim%20Reposted%20Raids.user.js
// @updateURL https://update.greasyfork.org/scripts/387210/GBF%20Raidfinder%20%7C%20Dim%20Reposted%20Raids.meta.js
// ==/UserScript==

const DEBUG = false;

// Utilities
function log(...args) {
    if (!DEBUG) return;
    console.debug("vm_webapi_integration »", ...args);
}

function waitForElementToExist(selector, action) {
    const elm = document.querySelector(selector);

    if (elm !== null) return action(elm);
    setTimeout(waitForElementToExist.bind(null, selector, action), 1000);
}

// DOM stuff
// Dim all raid entry with the same code
function dimRaids(raidCode) {
    const els = document.querySelectorAll(`li[data-raidid="${raidCode}"]`);
    els.forEach(el => {
        el.classList.add("gbfrf-tweet--copied");
    });
}

// Tries to find code in raidlist
function findRaid(raidCode) {
    const els = document.querySelectorAll(`li[data-raidid="${raidCode}"]`)
    return els.length > 1;
}

// Observes `el` for new raids and add click event listener to it
function observeNewRaids(raidColumnEl) {
    const tweets = raidColumnEl.querySelector(".gbfrf-tweets");
    const config = { childList: true };
    const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            mutation.addedNodes.forEach(node => {
                const raidCode = node.attributes["data-raidid"].value;
                if (findRaid(raidCode)) {
                    dimRaids(raidCode);
                }
            });
        });
    });

    log("Observing raids in column", raidColumnEl);
    observer.observe(tweets, config);
}

// Adds new raid observer to existing columns
function observeExistingColumns() {
    const columns = document.querySelectorAll(".gbfrf-column");

    columns.forEach(column => observeNewRaids(column));
}

// Adds new raid observer to new columns
function observeNewColumns() {
    const columns = document.querySelector('.gbfrf-columns');
    const config = { childList: true };
    const observer = new MutationObserver( mutations => {
        mutations.forEach(mutation => {
            mutation.addedNodes.forEach(node => {
                log("New column found");
                observeNewRaids(node);
            });
        });
    });

    log("Observing for new columns…");
    observer.observe(columns, config);
}


// Main
function init() {
    log("Initialized");
    waitForElementToExist(".mdl-list.gbfrf-tweets", () => {
        observeExistingColumns();
        observeNewColumns();
    });
}

init();
