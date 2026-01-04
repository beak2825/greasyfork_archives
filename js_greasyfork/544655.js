// ==UserScript==
// @name         LinkedIn Company Filter
// @namespace    https://axley.net/
// @version      1.0.0
// @description  Simple, configurable filter to ignore job postings from companies you've ruled out
// @author       Jason Axley
// @license      MIT
// @match        https://www.linkedin.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=linkedin.com
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM.getValue
// @grant        GM.setValue
// @grant        GM_registerMenuCommand
// @run-at       document-end
// @require      https://openuserjs.org/src/libs/sizzle/GM_config.js
// @downloadURL https://update.greasyfork.org/scripts/544655/LinkedIn%20Company%20Filter.user.js
// @updateURL https://update.greasyfork.org/scripts/544655/LinkedIn%20Company%20Filter.meta.js
// ==/UserScript==

(async function() {
    'use strict';
    const cfg = new GM_config({
        id: 'LinkedInFilterConfig',
        title: 'Script Settings', // Panel Title
        fields: {
            'blockedCompanies': // This is the id of the field
            {
                'label': 'Blocked Companies', // Appears next to field
                'type': 'string', // Makes this setting a text field
                'default': ["Gusto",
                            "Costco Wholesale",
                            "Grubhub", "DoorDash",
                            "Uber",
                            "Snap Inc.",
                            "Coinbase",
                            "Ripple",
                            "Starbucks",
                            "Meta",
                            "Gemini", // web3
                            "Peloton Interactive",
                            "Accenture",
                            "EY",
                            "Deloitte"]
            }
        }
    });

    cfg.onSave(() => prune(cfg.get('blockedCompanies')));

    const container = document.querySelector("body");

    const observerOptions = {
        childList: true,
        subtree: true,
    };

    async function prune(blockedCompaniesStr) {

        let blockedCompanies;
        if (blockedCompaniesStr && blockedCompaniesStr.length > 0) {
            blockedCompanies = blockedCompaniesStr.split(',');
        } else {
            return;
        }

        prune_job_search_results(blockedCompanies);
        prune_job_cards(blockedCompanies);
    }

    async function prune_job_search_results(blockedCompanies) {
        let nodesToPrune = document.getElementsByClassName("job-card-container__primary-description");

        for(let i = 0 ; i<nodesToPrune.length ; i++){
            const node = nodesToPrune[i];
            //console.log(`Processing node: ${node.innerText}`);
            if (blockedCompanies.includes(node.innerText)) {
                console.log(`Nuking node: ${node.innerText}`);
                const closest = node.closest(".discovery-templates-entity-item") || node.closest(".jobs-search-results__list-item")
                if (closest) {
                    closest.style.cssText += 'display:none';
                } else {
                    console.log(`Node ${node.innerText} closest parent not found.`);
                }
            }
        }
    }

    async function prune_job_cards(blockedCompanies) {
//        let nodesToPrune = document.getElementsByClassName("job-card-job-posting-card-wrapper__content");
        let nodesToPrune = document.querySelectorAll('[data-occludable-job-id]')
        if (nodesToPrune.length == 0) {
            nodesToPrune = document.querySelectorAll("[data-view-name='job-card']");
        }

        for(let i = 0 ; i<nodesToPrune.length ; i++){
            let companyName = nodesToPrune[i].querySelector(".artdeco-entity-lockup__subtitle > [dir='ltr']").innerText;
            //console.log(`Processing node: ${node.innerText}`);
            if (blockedCompanies.includes(companyName)) {
                console.log(`Nuking node: ${companyName}`);
                nodesToPrune[i].style.cssText += 'display:none';
                // also, click to suppress
                let nodeToClick = nodesToPrune[i].querySelector("button.job-card-container__action-small");
                if (nodeToClick.querySelector("[data-test-icon='close-small']")) {
                    nodeToClick.click();
                }
            }
        }
    }

    const observer = new MutationObserver((one, two) => prune(cfg.get('blockedCompanies')));
    observer.observe(container, observerOptions);

    GM_registerMenuCommand("Change settings", function(event) {
        cfg.open();
    }, {
        autoClose: true
    });
    prune(cfg.get('blockedCompanies'));
})();