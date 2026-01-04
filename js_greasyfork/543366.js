// ==UserScript==
// @name         EvE Frontier Smart-Assembly-Base View Enhancer
// @namespace    http://tampermonkey.net/
// @version      2025-07-23_02:12
// @description  Adds colors to some of the items in the Smart Assembly Explorer
// @author       Rho
// @match        https://smart-assembly-base.stillness.evefrontier.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=evefrontier.com
// @grant        none
// @license      GNU GPL v3.0
// @downloadURL https://update.greasyfork.org/scripts/543366/EvE%20Frontier%20Smart-Assembly-Base%20View%20Enhancer.user.js
// @updateURL https://update.greasyfork.org/scripts/543366/EvE%20Frontier%20Smart-Assembly-Base%20View%20Enhancer.meta.js
// ==/UserScript==

(function() {
    'use strict';
    console.info("EvE Frontier Smart-Assembly-Base View Enhancer is running.");
    /** MUTATION OBSERVATION PACKAGE */
    let reactionToMutationsTimeout = null;
    let mutationObserver = null;

    startObservingDocumentBodyForMutations();

    function startObservingDocumentBodyForMutations(){
        mutationObserver = new MutationObserver(handleNewMutations);
        mutationObserver.observe(document.body, { childList: true, subtree: true, attributes: true });
    }

    function handleNewMutations(mutations){
        scheduleReactionToMutations();
    }    

    /** Schedules running the reaction, cancels previously scheduled reactions if less than 100ms passed. This enables throttling. */
    function scheduleReactionToMutations() {
        console.debug("Scheduling a Reaction to a mutations set");
        clearTimeout(reactionToMutationsTimeout);
        reactionToMutationsTimeout = setTimeout(() => {
            reactToMutationsSet();    
        }, 100);
    }

    /** Runs all actions in reaction to a finisheed set of mutations */
    function reactToMutationsSet() {

        mutationObserver.disconnect(); // STOP THE MUTATION OBSERVER WHILE WE WORK

        console.debug("Reacting to a mutations set");
        enhanceTheStorageListView();

        startObservingDocumentBodyForMutations(); // RESTART THE MUTATION OBSERVER
    }
    /** // MUTATION OBSERVATION PACKAGE */    

    function enhanceTheStorageListView(){
        let listOfSpans = document.querySelectorAll('.grid.w-full.text-neutral.text-sm span')
        listOfSpans.forEach((span)=>{
            const SPACE = " ";
            const DASH = "-";
            let itemName = span.innerText.toLowerCase().split(SPACE).join(DASH);
            const numbersOnly = /^[0-9]*$/g
            if(itemName.match(numbersOnly)){
                return; // ONLY NMUMBERS HERE
            } else {
                const forbiddenCharacters = /[\(\)]/g
                const NOTHING = "";
                let className = itemName.replace(forbiddenCharacters, NOTHING);
                span.classList.add(className);
                // console.log(`Processed: ${itemName}`);
            }
        })
    }

    function addStylesToBody(styles){
        let styleElem = document.createElement('style');
        styleElem.textContent = styles;
        document.head.append(styleElem);
    }

    const itemTypeStyles = `
        .carbon-weave, .carbon-weave + span {
            background: #a7a7a7;
            color: black;
        }
        .reinforced-alloys, .reinforced-alloys + span {
            background: #42bdd3;
            color: black;
        }
        .thermal-composites, .thermal-composites + span {
            background: #d9865f;
            color: black;
        }
    `;

    addStylesToBody(itemTypeStyles);

})();