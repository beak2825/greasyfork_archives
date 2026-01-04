// ==UserScript==
// @name         GBF Raidfinder Custom
// @namespace    http://tampermonkey.net/
// @version      1.1.1
// @description  Auto Join Raid
// @author       eterNEETy
// @match        http://gbf-raidfinder.aikats.us
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/383195/GBF%20Raidfinder%20Custom.user.js
// @updateURL https://update.greasyfork.org/scripts/383195/GBF%20Raidfinder%20Custom.meta.js
// ==/UserScript==
// jshint esversion: 6

const DEBUG = false;

const xhr = new XMLHttpRequest(),
    server = "http://127.0.0.1:2487";

function waitForElementToExist(selector, action) {
    const elm = document.querySelector(selector);

    if (elm !== null) return action(elm);
    setTimeout(waitForElementToExist.bind(null, selector, action), 1000);
}

// // Adds click event listener to `el`
function hookClickToJoin(el) {
    console.log(el);
    let raidCode = el.attributes["data-raidid"].value;
    let cmd = [];
    cmd.push({"cmd":"set_raid","raid_id":raidCode});
    xhr.open('POST', server);
    xhr.send(JSON.stringify(cmd));
}

// Adds click event listener to all existing raids in the page
function hookExistingRaids() {
    const raids = document.querySelectorAll(".gbfrf-tweet");
    console.log(raids);

    raids.forEach(raid => hookClickToJoin(raid));
}

// Observes `el` for new raids and add click event listener to it
function observeNewRaids(raidColumnEl) {
    const tweets = raidColumnEl.querySelector(".gbfrf-tweets");
    const config = { childList: true };
    const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            mutation.addedNodes.forEach(node => {
                hookClickToJoin(node);
            });
        });
    });

    console.log("Observing raids in column", raidColumnEl);
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
                console.log("New column found");
                observeNewRaids(node);
            });
        });
    });

    console.log("Observing for new columns…");
    observer.observe(columns, config);
}


// Main
function init() {
    console.log("Initialized");
    // hookExistingRaids();
    let onExist = function () {
        // hookExistingRaids();
        observeExistingColumns();
        observeNewColumns();
    }
    waitForElementToExist(".mdl-list.gbfrf-tweets", onExist);
}

init();