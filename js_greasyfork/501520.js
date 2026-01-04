// ==UserScript==
// @name         MADBLOX ad blocker
// @namespace    http://tampermonkey.net/
// @version      2024-07-24
// @description  madblox ad blocker.
// @author       watrabi
// @match        https://robloxa.cf/*
// @icon         https://robloxa.cf/images/MADBLOXsmall.png
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/501520/MADBLOX%20ad%20blocker.user.js
// @updateURL https://update.greasyfork.org/scripts/501520/MADBLOX%20ad%20blocker.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const targetDiv = document.querySelector('div img[src="/images/madbloxlogo.png"]');
    if (targetDiv && targetDiv.parentElement) {
        targetDiv.parentElement.remove();
    }

    function removeClassByPattern(pattern) {
        const elements = document.querySelectorAll('*');
        elements.forEach(element => {
            const classes = element.className.split(' ');
            classes.forEach(cls => {
                if (pattern.test(cls)) {
                    element.classList.remove(cls);
                }
            });
        });
    }

    const adPattern = /ad/i;
    const advPattern = /advertisement/i;
    const advertPattern = /advert/i;
    const cardPattern = /card/i;

    removeClassByPattern(adPattern);
    removeClassByPattern(cardPattern);
    removeClassByPattern(advertPattern);
    removeClassByPattern(advPattern);
})();
