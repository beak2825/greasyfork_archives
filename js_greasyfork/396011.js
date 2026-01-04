// ==UserScript==
// @name         PR: Expand All "Load more" buttons
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Expand All "Load more" buttons in pull request reviews.
// @author       Marcin Warpechowski
// @match        https://github.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/396011/PR%3A%20Expand%20All%20%22Load%20more%22%20buttons.user.js
// @updateURL https://update.greasyfork.org/scripts/396011/PR%3A%20Expand%20All%20%22Load%20more%22%20buttons.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const pluginName = 'processed-by-warpech-expand-load-more';

    let scheduledTimeout;

    function findAndApplyChanges() {
        console.log('Running... Expand All "Load more" buttons in PRs');
        Array.from(document.querySelectorAll(`button.ajax-pagination-btn:not([${pluginName}])`)).forEach((elem) => {
            elem.setAttribute(pluginName, '');
            if (!elem.hasAttribute('disabled') && elem.innerText === 'Load more…') {
                elem.dispatchEvent(new MouseEvent('click', {
                    bubbles: true,
                    cancelable: true
                }));
            }
            else if (elem.hasAttribute('disabled') && elem.innerText === 'Loading…') {
                // waiting
            }
            else {
                console.log("unrecognized 'Load more' button", elem);
            }
        });
    }

    // console.log('Postponing... Expand All "Load more" buttons in PRs');
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
                    // console.log('Postponing... Expand All "Load more" buttons in PRs');
                    clearTimeout(scheduledTimeout);
                    scheduledTimeout = setTimeout(findAndApplyChanges, 1000);
                    break;
            }
        });
    }

    const observer = new MutationObserver(mutationCallback);
    observer.observe(targetNode, observerOptions);
})();