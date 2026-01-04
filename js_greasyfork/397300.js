// ==UserScript==
// @name         PR: Expand All "Load diff" buttons
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Expand All "Load diff" buttons in pull request Files tab.
// @author       Marcin Warpechowski
// @match        https://github.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/397300/PR%3A%20Expand%20All%20%22Load%20diff%22%20buttons.user.js
// @updateURL https://update.greasyfork.org/scripts/397300/PR%3A%20Expand%20All%20%22Load%20diff%22%20buttons.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const pluginName = 'processed-by-warpech-expand-load-diff';

    let scheduledTimeout;

    function findAndApplyChanges() {
        console.log('Running... Expand All "Load diff" buttons in PRs');
        Array.from(document.querySelectorAll(`.load-diff-button.btn-link.width-full:not([${pluginName}])`)).forEach((elem) => {
            elem.setAttribute(pluginName, '');
            elem.dispatchEvent(new MouseEvent('click', {
                bubbles: true,
                cancelable: true
            }));
        });
    }

    // console.log('Postponing... Expand All "Load diff" buttons in PRs');
    scheduledTimeout = setTimeout(findAndApplyChanges, 1000);

    const targetNode = document.querySelector("div.application-main");
    const observerOptions = {
        childList: true,
        subtree: true
    }

    const mutationCallback = (mutationList, observer) => {
        mutationList.forEach((mutation) => {
            switch(mutation.type) {
                case 'childList':
                    // console.log('Postponing... Expand All "Load diff" buttons in PRs');
                    clearTimeout(scheduledTimeout);
                    scheduledTimeout = setTimeout(findAndApplyChanges, 1000);
                    break;
            }
        });
    }

    const observer = new MutationObserver(mutationCallback);
    observer.observe(targetNode, observerOptions);
})();