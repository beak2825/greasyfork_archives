// ==UserScript==
// @name         PR: Expand All "Show resolved" buttons
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Expand All "Show resolved" buttons in pull request reviews.
// @author       Marcin Warpechowski
// @match        https://github.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/396012/PR%3A%20Expand%20All%20%22Show%20resolved%22%20buttons.user.js
// @updateURL https://update.greasyfork.org/scripts/396012/PR%3A%20Expand%20All%20%22Show%20resolved%22%20buttons.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const pluginName = 'processed-by-warpech-expand-show-resolved';

    let scheduledTimeout;

    function findAndApplyChanges() {
        console.log('Running... Expand All "Show resolved" buttons in PRs');
        Array.from(document.querySelectorAll(`button:not([${pluginName}]), .btn-link:not([${pluginName}])`)).forEach((elem) => {
            elem.setAttribute(pluginName, '');
            if ((elem.innerText === 'Show resolved' || elem.innerText === ' Show conversation')) {
                elem.dispatchEvent(new MouseEvent('click', {
                    bubbles: true,
                    cancelable: true
                }));
            }
        });
    }

    // console.log('Postponing... Expand All "Show resolved" buttons in PRs');
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
                    // console.log('Postponing... Expand All "Show resolved" buttons in PRs');
                    clearTimeout(scheduledTimeout);
                    scheduledTimeout = setTimeout(findAndApplyChanges, 1000);
                    break;
            }
        });
    }

    const observer = new MutationObserver(mutationCallback);
    observer.observe(targetNode, observerOptions);
})();