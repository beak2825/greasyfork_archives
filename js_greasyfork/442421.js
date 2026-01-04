// ==UserScript==
// @name           Trovo: Mana harvester
// @name:ru        Trovo: автосборщик маны
// @description    Get trovo mana
// @description:ru Скрипт автоматического сбора маны
// @namespace      http://tampermonkey.net/
// @version        0.0.8
// @author         traceer, xleeuwx
// @match          https://trovo.live/*
// @grant          none
// @license        MIT
// @icon           https://www.google.com/s2/favicons?domain=trovo.live
// @downloadURL https://update.greasyfork.org/scripts/442421/Trovo%3A%20Mana%20harvester.user.js
// @updateURL https://update.greasyfork.org/scripts/442421/Trovo%3A%20Mana%20harvester.meta.js
// ==/UserScript==


(function () {
    'use strict';
    setTimeout(waitForInitialize, 30);
}());

function waitForInitialize() {
    if (typeof window !== 'undefined') {
        initialize();
    } else {
        setTimeout(waitForInitialize, 30);
    }
}

function initialize() {
    waitForFindButtonElement(0);
    console.log('Mana harvester is initialized');
}

function waitForFindButtonElement(waitLonger) {
    if (waitLonger == 1) {
        var RandRangeNum = Math.floor(Math.random() * (270 - 120) + 120);
    } else {
        var RandRangeNum = Math.floor(Math.random() * (90 - 15) + 15);
    };
    setTimeout(findButtonElement, (RandRangeNum * 1000) );
}

function findBoxElement() {

    // find opened the Cast Spell box
    var foundBox = document.querySelectorAll("article.gift-box");
    var foundBtn = document.querySelectorAll("button.spell-btn");
    var foundProgress = document.querySelectorAll("div.progress-bg")
    var waitLonger = 0;

    if(foundBox.length > 0) {
        console.log('Found the Cast Spell box, will close it');
        clickElement(foundBtn[0]);
    }

    if(foundProgress.length > 0 && foundProgress[0].style.cssText == 'transform: scaleX(1);') {
        var waitLonger = 1;
    } else {
        var waitLonger = 0;
    }

    // delete styles which hide the Cast Spell box
    const text = document.querySelectorAll('.giftbox-style');
    for (const el of text) {
       el.remove();
    }
    waitForFindButtonElement(waitLonger);
}

function findButtonElement() {

    // First find the chat element
    var foundButton = document.querySelectorAll("button.spell-btn");
    var foundGiftBox = document.querySelectorAll("article.gift-box");

    if(foundButton.length > 0 && foundGiftBox.length != 1) {
        console.log('Found the damm button, now click it');
        if(typeof foundButton[0] !== 'undefined') {
            clickElement(foundButton[0]);

            // add style for hide Cast Spell box
            var head = document.head || document.getElementsByTagName('head')[0];
            var style = document.createElement('style');
            var css = '.gift-box { display: none !important; }';
            style.type = 'text/css';
            style.classList.add("giftbox-style");
            style.appendChild(document.createTextNode(css));
            head.appendChild(style);
        }

        setTimeout(findBoxElement, 1000 );
    } else {
        setTimeout(waitForFindButtonElement, 1000 );
    }
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