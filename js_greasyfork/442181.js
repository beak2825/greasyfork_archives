// ==UserScript==
// @name         FMC Expand Toggle
// @namespace    http://tampermonkey.net/
// @version      1.11
// @description  Fixes expand all button to allow for collapse all
// @author       geesmavi
// @include      https://trans-logistics.amazon.com/fmc/*
// @include      https://trans-logistics-eu.amazon.com/fmc/*
// @icon         https://www.google.com/s2/favicons?domain=amazon.com
// @grant        GM_addStyle
// @run-at document-start
// @downloadURL https://update.greasyfork.org/scripts/442181/FMC%20Expand%20Toggle.user.js
// @updateURL https://update.greasyfork.org/scripts/442181/FMC%20Expand%20Toggle.meta.js
// ==/UserScript==

(function() {
    'use strict';
    GM_addStyle(`
        .comment-visibility-toggle {
        user-select: none;
        }
    `);

    // restarts detailsToggleObserver on url change
    let lastUrl = location.href;
    new MutationObserver(() => {
        const url = location.href;
        if (url !== lastUrl) {
            lastUrl = url;
            detailsToggleObserver.observe(document, {
                childList: true,
                subtree: true
            });
        }
    }).observe(document, {subtree: true, childList: true});

    // watches page for dashboard-details-toggle which loads after page load
    // if element exists starts the detailsToggler
    const detailsToggleObserver = new MutationObserver((mutations, obs) => {
        const detailsToggle = document.querySelector('th.dashboard-details-toggle');
        if (detailsToggle) {
            const fmcShown = document.querySelector('.fmc-shown');
            if (fmcShown) {
                detailsToggle.classList.remove('child-row-expand-trigger');
                detailsToggle.classList.add('child-row-collapse-trigger');
            }
            detailsToggler(detailsToggle);
            obs.disconnect();
            return;
        }
    });

    detailsToggleObserver.observe(document, {
        childList: true,
        subtree: true
    });

    // swaps the expand/collapse classes of given element
    function detailsToggler(element) {
            const removeClass = function(removedClass) {
                element.classList.remove(removedClass);
                return;
            };
            const addClass = function(addedClass) {
                element.classList.add(addedClass);
                return;
            };

            element.addEventListener("click", function() {
                switch(true){
                    case element.classList.contains('child-row-expand-trigger'):
                        removeClass('child-row-expand-trigger');
                        addClass('child-row-collapse-trigger');
                        break;
                    case element.classList.contains('child-row-collapse-trigger'):
                        removeClass('child-row-collapse-trigger');
                        addClass('child-row-expand-trigger');
                        break;
                    default:
                        break;
                }

                return;
            });
        };
})();