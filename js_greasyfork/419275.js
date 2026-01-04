// ==UserScript==
// @name         Twitch: Chat points harvester
// @namespace    http://tampermonkey.net/
// @version      0.0.1
// @description  Get extra points by clicking the chat extra points
// @author       xleeuwx <info@xleeuwx.nl>
// @match        https://www.twitch.tv/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/419275/Twitch%3A%20Chat%20points%20harvester.user.js
// @updateURL https://update.greasyfork.org/scripts/419275/Twitch%3A%20Chat%20points%20harvester.meta.js
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
    console.log('Chat points harvester is initialized');
}

function waitForFindButtonElement() {
    setTimeout(findButtonElement, (10 * 1000) );
}

function findButtonElement() {
    // First find the chat element
    var chatButtonsEl = document.querySelectorAll('.chat-input__buttons-container');

    if(chatButtonsEl.length > 0){
        var firstEl = chatButtonsEl[0];

        var foundButton = firstEl.querySelectorAll('.community-points-summary .tw-tooltip-wrapper > button');
        if(foundButton.length > 0) {
            console.log('Found the damm button, now click it');
            if(typeof foundButton[0] !== 'undefined') {
                clickElement(foundButton[0]);
            }
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