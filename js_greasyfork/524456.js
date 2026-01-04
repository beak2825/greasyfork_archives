// ==UserScript==
// @name         Auto click the continue button on DeepSeek
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Automatically click the continue button on DeepSeek
// @author       You
// @match        https://chat.deepseek.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/524456/Auto%20click%20the%20continue%20button%20on%20DeepSeek.user.js
// @updateURL https://update.greasyfork.org/scripts/524456/Auto%20click%20the%20continue%20button%20on%20DeepSeek.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const buttonClass = "ds-button ds-button--secondary ds-button--bordered ds-button--rect ds-button--m";

    function clickButton() {
        const button = document.querySelector(`.${buttonClass.split(' ').join('.')}`);
        if (button) {
            button.click();
            console.log("Button clicked!");
        }
    }

    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.addedNodes && mutation.addedNodes.length > 0) {
                clickButton();
            }
        });
    });

    observer.observe(document.body, { childList: true, subtree: true });
})();