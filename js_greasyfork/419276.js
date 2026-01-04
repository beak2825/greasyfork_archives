// ==UserScript==
// @name         Twitch: Drops harvester
// @namespace    http://tampermonkey.net/
// @version      0.0.1
// @description  Get twitch drops.
// @author       xleeuwx <info@xleeuwx.nl>
// @match        https://www.twitch.tv/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/419276/Twitch%3A%20Drops%20harvester.user.js
// @updateURL https://update.greasyfork.org/scripts/419276/Twitch%3A%20Drops%20harvester.meta.js
// ==/UserScript==


(function () {
    'use strict';
    setTimeout(waitForInitialize, 25);
}());

function waitForInitialize() {
    if (typeof window !== 'undefined') {
        initialize();
    } else {
        setTimeout(waitForInitialize, 25);
    }
}

function initialize() {
    waitForFindButtonElement();
    console.log('Twitch drops harvester is initialized');
}

function waitForFindButtonElement() {
    setTimeout(findButtonElement, (10 * 1000) );
}

function findButtonElement() {

    // First find the chat element
    var foundButton = document.querySelectorAll("[data-test-selector='drops-claim-highlight-claim-button']");


    if(foundButton.length > 0) {
        console.log('Found the damm button, now click it');
        if(typeof foundButton[0] !== 'undefined') {
            clickElement(foundButton[0]);
        }
    }

    waitForFindButtonElement();
}

function clickElement(buttonEl) {
    if(typeof buttonEl !== 'undefined' && buttonEl !== null) {
        try {
            buttonEl.click();
            console.log('i clicked it for you');
        } catch (e) {
            console.log('Cannot click the damm button, something whent wrong', e);
        }
    }
}
