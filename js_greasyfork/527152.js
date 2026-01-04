// ==UserScript==
// @name         EP info card clicker
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @description  Not a cheat/hack of any kind. This script automates clicking the info card.
// @author       cookertim
// @match        https://app.educationperfect.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license     GPLv2
// @downloadURL https://update.greasyfork.org/scripts/527152/EP%20info%20card%20clicker.user.js
// @updateURL https://update.greasyfork.org/scripts/527152/EP%20info%20card%20clicker.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let clicker_task = 0;

    const toggle_func = () => {
        if (clicker_task == 0) {
            clicker_task = setInterval(() => {
                document.querySelector(".information-controls > div:nth-child(1)").childNodes[1].click()
            }, 100);
        } else {
            clearInterval(clicker_task);
            clicker_task = 0;
        }
    };

    window.document.addEventListener("keydown", ({
        altKey,
        key
    }) => {
        if (altKey && key == "s") toggle_func();
    });


})();