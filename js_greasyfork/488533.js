// ==UserScript==
// @name         Keka Log Duration by Jp
// @namespace    http://tampermonkey.net/
// @version      1.7
// @description  try to take over the world
// @author       You
// @match        https://ezeetechnosys.keka.com/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=keka.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/488533/Keka%20Log%20Duration%20by%20Jp.user.js
// @updateURL https://update.greasyfork.org/scripts/488533/Keka%20Log%20Duration%20by%20Jp.meta.js
// ==/UserScript==

(function () {
    'use strict';

    function calculateTotalDuration(durationsArray) {
        let totalHours = 0;
        let totalMinutes = 0;

        durationsArray.forEach(durationStr => {
            if (durationStr) {
                const [hours, minutes] = durationStr.match(/\d+/g).map(Number);
                totalHours += hours;
                totalMinutes += minutes;
            }
        });

        // Add overflow from minutes to hours
        totalHours += Math.floor(totalMinutes / 60);
        totalMinutes = totalMinutes % 60;

        // Format the total duration string
        const totalDurationStr = `${totalHours} Hr ${totalMinutes} Min`;

        return totalDurationStr;
    }

    function calculateDuration(startTimeSpan, endTimeSpan) {
        const startTimeStr = startTimeSpan.textContent.trim();
        const endTimeStr = endTimeSpan.textContent.trim();

        // If end time is empty, use current time
        const endTime = endTimeStr !== "MISSING" ? endTimeStr : new Date().toLocaleTimeString('en-US', { hour12: true });

        // Parse time strings into Date objects
        const startTime = new Date(`2023-12-27 ${startTimeStr}`); // Assuming today's date
        const endTimeDate = new Date(`2023-12-27 ${endTime}`);

        // Calculate duration in milliseconds
        const durationMillis = endTimeDate.getTime() - startTime.getTime();

        // Convert milliseconds to hours and minutes
        const durationHours = Math.floor(durationMillis / (3600 * 1000));
        const durationMinutes = Math.floor((durationMillis % (3600 * 1000)) / (60 * 1000));

        // Formatted duration string
        const durationStr = `${durationHours} Hr ${durationMinutes} Min`;

        return durationStr;
    }

    function watchForModals() {
        const modals = document.querySelectorAll('body > modal-container > div.modal-dialog.small-modal > div > attendance-adjustment-request > div.modal-body > form > div.mt-20 > div > div:nth-child(2) > div');
        console.log("Modals", modals);

        modals.forEach(modal => {
            const durations = [];
            let N = 1;
            let lastDurationDisplaySpan = null;

            while (true) {
                // Construct XPath expressions
                const startTimeSpanXPath = `/html/body/modal-container/div[2]/div/attendance-adjustment-request/div[2]/form/div[2]/div/div[2]/div/div/div[${N}]/div[1]/div[2]/span[2]`;
                const endTimeSpanXPath = `/html/body/modal-container/div[2]/div/attendance-adjustment-request/div[2]/form/div[2]/div/div[2]/div/div/div[${N}]/div[1]/div[3]/span[2]`;

                // Fetch elements
                const startTimeSpan = document.evaluate(startTimeSpanXPath, modal, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
                const endTimeSpan = document.evaluate(endTimeSpanXPath, modal, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;

                if (!startTimeSpan || !endTimeSpan) {
                    // No more durations
                    break;
                }

                // Calculate duration
                const durationStr = calculateDuration(startTimeSpan, endTimeSpan);

                // Store durationStr
                durations.push(durationStr);

                // Create or update the duration display span
                const durationDisplaySpan = document.querySelector(`body > modal-container > div.modal-dialog.small-modal > div > attendance-adjustment-request > div.modal-body > form > div.mt-20 > div > div:nth-child(2) > div > div > div:nth-child(${N}) > div.d-flex.align-items-center.ng-untouched.ng-pristine.ng-valid > div.d-flex.align-items-center.ml-10`);

                if (durationDisplaySpan) {
                    // Check if duration span already exists
                    let existingDurationSpan = durationDisplaySpan.querySelector(`.duration-span-${N}`);
                    if (!existingDurationSpan) {
                        // Create duration span
                        existingDurationSpan = document.createElement('span');
                        existingDurationSpan.classList.add(`duration-span-${N}`);
                        existingDurationSpan.style.fontWeight = 'bold';
                        existingDurationSpan.style.paddingLeft = '17px';
                        existingDurationSpan.style.color = 'darkred';
                        durationDisplaySpan.insertAdjacentElement('afterend', existingDurationSpan);
                    }
                    existingDurationSpan.textContent = durationStr;

                    // Keep track of the last valid durationDisplaySpan
                    lastDurationDisplaySpan = durationDisplaySpan;
                } else {
                    console.warn(`durationDisplaySpan not found for N = ${N}`);
                }

                N++;
            }

            // Decrement N to point to the last valid index
            N--;

            // Only display total duration if more than one duration exists
            if (durations.length > 1 && lastDurationDisplaySpan) {
                const totalDurationStr = calculateTotalDuration(durations);

                // Display total duration
                const totalDurationDisplaySpanSelector = `body > modal-container > div.modal-dialog.small-modal > div > attendance-adjustment-request > div.modal-body > form > div.mt-20 > div > div:nth-child(2) > div > div > div:nth-child(${N + 1}) > div.d-flex.align-items-center.ng-untouched.ng-pristine.ng-valid`;
                let totalDurationDisplaySpan = document.querySelector(totalDurationDisplaySpanSelector);

                // If the element doesn't exist, create it
                if (!totalDurationDisplaySpan) {
                    totalDurationDisplaySpan = document.createElement('div');
                    totalDurationDisplaySpan.classList.add('d-flex', 'align-items-center', 'ng-untouched', 'ng-pristine', 'ng-valid');
                    const parentElementSelector = `body > modal-container > div.modal-dialog.small-modal > div > attendance-adjustment-request > div.modal-body > form > div.mt-20 > div > div:nth-child(2) > div > div`;
                    const parentElement = document.querySelector(parentElementSelector);
                    if (parentElement) {
                        parentElement.appendChild(totalDurationDisplaySpan);
                    } else {
                        console.warn('Parent element for total duration not found.');
                    }
                }

                // Check for existing total duration span:
                let existingTotalDurationSpan = totalDurationDisplaySpan.querySelector('.total-duration-span');
                if (!existingTotalDurationSpan) {
                    existingTotalDurationSpan = document.createElement('span');
                    existingTotalDurationSpan.classList.add('total-duration-span');
                    existingTotalDurationSpan.style.fontWeight = 'bold';
                    existingTotalDurationSpan.style.color = '#0600ff';
                    existingTotalDurationSpan.style.float = 'right';
                    existingTotalDurationSpan.style.padding = '5px';
                    existingTotalDurationSpan.style.marginLeft = '375px'; // Adjusted as per your script
                    existingTotalDurationSpan.style.background = 'lightblue';
                    existingTotalDurationSpan.style.borderRadius = '5px';
                    existingTotalDurationSpan.style.borderTop = '3px solid #888';

                    totalDurationDisplaySpan.appendChild(existingTotalDurationSpan);
                }
                existingTotalDurationSpan.textContent = totalDurationStr;
            } else {
                console.warn('No durations found or only one duration present. Total duration will not be displayed.');
            }

            // Add morphing text effect
            addMorphingTextEffect();
        });
    }

    function addMorphingTextEffect() {
        const parentDivs = document.querySelectorAll('div.mb-30.ng-untouched.ng-pristine.ng-valid');
        if (parentDivs.length > 1) {
            // Targeting the second div as per your requirement
            const targetDiv = parentDivs[1];
            const pElement = targetDiv.querySelector('p.text-large'); // Assuming the span is the one you've added
            if (!pElement) {
                console.warn('p.text-large element not found.');
                return;
            }
            let spanElement = pElement.querySelector('.morphing-text-span');

            if (!spanElement) {
                spanElement = document.createElement('span');
                spanElement.classList.add('morphing-text-span');
                // Starting the text update process
                spanElement.style.fontWeight = 'bold';
                spanElement.style.color = 'rgb(0, 123, 255)';
                spanElement.style.padding = '5px';
                spanElement.style.borderRadius = '5px';
                spanElement.style.fontSize = '16px';
                spanElement.style.marginLeft = '262px';
                pElement.appendChild(spanElement);
            }

            // Texts array for the morphing effect
            const texts = ["Log Duration", "    By @Jaydeep😶"];
            let textIndex = 0;

            // Function to update the text with a morphing effect
            function updateText() {
                const nextText = texts[textIndex % texts.length];
                textIndex++;

                // Applying a fade-out effect
                spanElement.style.opacity = '0';
                spanElement.style.transition = 'opacity 0.5s ease-out';

                // After fade-out, change the text and fade it back in
                setTimeout(() => {
                    spanElement.textContent = nextText;

                    // Applying blur during transition
                    spanElement.style.filter = 'blur(2px)';
                    spanElement.style.opacity = '1';
                    spanElement.style.transition = 'opacity 0.5s ease-in, filter 0.5s ease';

                    // Removing blur after a moment
                    setTimeout(() => {
                        spanElement.style.filter = 'none';
                    }, 500); // Match the transition time
                }, 500); // Wait for the fade-out to complete
            }

            // Initialize the text content
            spanElement.textContent = texts[textIndex % texts.length];
            textIndex++;

            // Start the interval for morphing text
            setInterval(updateText, 2000);
        }
    }

    const observer = new MutationObserver(mutations => {
        console.log("Observing.....");
        const modalTriggerElements = document.querySelectorAll('employee-attendance-list-view .attendance-logs-row');
        modalTriggerElements.forEach(element => {
            element.addEventListener('click', watchForModals);
        });
    });

    observer.observe(document.body, { childList: true, subtree: false });

})();
