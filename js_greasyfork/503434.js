// ==UserScript==
// @name         Auto Open Trainings Reliance QMS
// @namespace    http://tampermonkey.net/
// @version      1
// @description  Automatically clicks on spans with class "toggle-children" on the QMS ETQ portal page
// @author       Ameer Jamal
// @match        https://qms.etq.com/QMS/rel/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=etq.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/503434/Auto%20Open%20Trainings%20Reliance%20QMS.user.js
// @updateURL https://update.greasyfork.org/scripts/503434/Auto%20Open%20Trainings%20Reliance%20QMS.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let clickedElements = new Set();

    // Function to click toggle-children elements with proper waiting
    async function clickToggleChildren() {
        const elements = document.querySelectorAll('span.toggle-children');
        for (let element of elements) {
            if (clickedElements.has(element)) continue;

            // Wait for animations to complete
            await waitForAnimations();

            // Click the element
            element.click();
            clickedElements.add(element);

            await delay(500);

            // If all elements are clicked, stop the observer
            if (clickedElements.size === elements.length) {
                observer.disconnect();
                break;
            }
        }
    }

    // Function to wait for all animations to complete
    function waitForAnimations() {
        return new Promise(resolve => {
            const animatedElements = document.querySelectorAll('.ui-progress-spinner-rotate, .ui-progress-spinner-dash, .ui-progress-spinner-color');
            let remaining = animatedElements.length;

            if (remaining === 0) {
                resolve();
                return;
            }

            animatedElements.forEach(element => {
                const onEnd = () => {
                    element.removeEventListener('animationend', onEnd);
                    if (--remaining === 0) {
                        resolve();
                    }
                };
                element.addEventListener('animationend', onEnd);
            });
        });
    }

    // Utility function to delay execution
    function delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // Observer to watch for any new elements added to the page
    const observer = new MutationObserver(() => {
        clickToggleChildren();
    });

    // Function to trigger the whole process
    async function runProcess() {
        clickedElements.clear(); // Reset clicked elements
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
        await clickToggleChildren();
    }

    // Set up a click listener on the refresh icon
    document.addEventListener('click', async function(event) {
        if (event.target.matches('i.fa.fa-refresh[data-id="REFRESH_WIDGET"]')) {
            runProcess(); // Rerun the process
        }
    });

    // Initial run on page load
    runProcess();

})();