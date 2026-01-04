// ==UserScript==
// @name         Mission Control Templates
// @namespace    http://tampermonkey.net/
// @version      1.01
// @description  Adds SMS and Email templates to live screen
// @author       Dylan N.
// @include      *admin.zeelo.co*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/521122/Mission%20Control%20Templates.user.js
// @updateURL https://update.greasyfork.org/scripts/521122/Mission%20Control%20Templates.meta.js
// ==/UserScript==

(function () {
    'use strict';

    console.log("Tampermonkey script is running!");

    let insertedTemplate = null; // Track the current template inserted
    let warningElement = null; // Store the warning element

    function simulateInput(element, content) {
        const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
            Object.getPrototypeOf(element),
            'value'
        ).set;
        nativeInputValueSetter.call(element, content);

        // Simulate events to trigger React/Angular updates
        ['input', 'change'].forEach(eventType => {
            const event = new Event(eventType, { bubbles: true });
            element.dispatchEvent(event);
        });

        element.focus();
    }

    function showWarning(textarea, show) {
        if (!warningElement) {
            warningElement = document.createElement('div');
            warningElement.style.color = 'red';
            warningElement.style.marginTop = '10px';
            warningElement.style.fontSize = '14px';
            warningElement.innerText = "Please modify the placeholders before sending!";
            textarea.parentNode.insertBefore(warningElement, textarea.nextSibling);
        }
        warningElement.style.display = show ? 'block' : 'none';
    }

    function parseTime() {
        const serviceTimeElement = document.querySelector(
            'div[data-testid="zeelo_live__journey_vehicles[0]__arrival_departure_times__start_time__service_timezone"]'
        );
        const localTimeElement = document.querySelector(
            'div[data-testid="zeelo_live__journey_vehicles[0]__arrival_departure_times__start_time__local_timezone"]'
        );

        if (serviceTimeElement) {
            const rawServiceTime = serviceTimeElement.innerText.trim();
            const serviceTimeMatch = rawServiceTime.match(/\b\d{2}:\d{2}\b/);
            if (serviceTimeMatch) {
                return serviceTimeMatch[0];
            }
        }

        if (localTimeElement) {
            const rawLocalTime = localTimeElement.innerText.trim();
            const localTimeMatch = rawLocalTime.match(/^\d{2}:\d{2}/);
            return localTimeMatch ? localTimeMatch[0] : "TBD";
        }

        return "TBD";
    }

    function populateSubject() {
        const subjectField = document.querySelector('input[name="subject"]');
        const headingElement = document.querySelector('.HeadingSStyles__HeadingS-sc-ygvmge-0.dJdLwL');

        if (subjectField && headingElement) {
            const headingText = headingElement.innerText.trim();
            const time = parseTime();

            const subjectContent = `Delay to ${time} ${headingText}`;
            simulateInput(subjectField, subjectContent);
            console.log(`Subject populated with: ${subjectContent}`);
        }
    }

    function clearPreviousButtons() {
        const existingContainer = document.getElementById("template-section");
        if (existingContainer) {
            existingContainer.remove();
        }
    }

    function addTemplateButtons(textarea) {
        clearPreviousButtons(); // Ensure no duplicate buttons are added

        const container = document.createElement('div');
        container.id = "template-section";
        container.style.marginTop = '20px';
        container.style.display = 'flex';
        container.style.flexWrap = 'wrap';
        container.style.gap = '10px';

        const header = document.createElement('h3');
        header.innerText = "Templates";
        header.style.color = '#333';
        header.style.fontSize = '14px';
        header.style.marginBottom = '10px';
        header.style.width = '100%';
        container.appendChild(header);

        const templates = [
            // SMS Templates
            { name: "Minor Delay", content: "There is currently a minor delay to your trip. Please check the Zeelo app for the latest tracking updates. Thank you. Zeelo", editCheck: false },
            { name: "General Lateness", content: "Please note there is a delay of approximately X minutes on your trip. Please ensure you remain at your pick-up location during this time. Thank you. Zeelo", editCheck: true },
            { name: "Major Lateness", content: "Please note there is a significant delay on your trip. Please ensure you remain at your pick-up location during this time. Thank you. Zeelo", editCheck: false },
            { name: "Taxis", content: "Unfortunately, the original vehicle for today is no longer available. We’re arranging alternative transport for you. Please standby. Thank you. Zeelo", editCheck: false },
            { name: "Vehicle Change", content: "Hi, please note that there's been a vehicle change on your Zeelo trip. The new vehicle registration is [INPUT VEHICLE REG], which is a [COLOUR/VEHICLE TYPE]. Thank you. Zeelo", editCheck: true },
            { name: "New Driver", content: "Hi, we tried calling you as this is one of your first trips with us. Please call us back via the 'Report' button in your Zeelo Driver App. Thank you. Zeelo", editCheck: false },
            { name: "Timestamps", content: "Please ensure you mark off your arrivals/departures on the app. Thank you. Zeelo", editCheck: false },
            { name: "No Tracking", content: "Please switch on your location services in your mobile settings so we may track you in case of any delays. Thank you. Zeelo", editCheck: false },
            { name: "Frozen Tracking", content: "Please ensure the Zeelo app is open and on the screen to ensure live tracking is available. Thank you. Zeelo", editCheck: false },
            { name: "Restart Job", content: "We have restarted your upcoming job, please refresh the driver app for the trip to come up again. Thank you. Zeelo", editCheck: false },
            { name: "Job Not Finished", content: "Please ensure you complete the job on the app when you arrive at your final destination. Thank you. Zeelo", editCheck: false },
            // Delay to Client Templates
            {
                name: "Delay to Client (BOOKABLE)",
                content: `Please note we are running behind schedule on today’s trip.
There is an estimated delay of X minutes due to X (ONLY INSERT REASON IF KNOWN). We will notify you of any ETA changes.
Please see attached for the list of impacted riders.`,
                editCheck: true
            },
            {
                name: "Delay to Client (JUST BOARD)",
                content: `There is an estimated delay of X minutes due to X (ONLY INSERT REASON IF KNOWN).
We will notify you of any ETA changes.`,
                editCheck: true
            }
        ];

        templates.forEach(template => {
            const button = document.createElement('button');
            button.innerText = template.name;
            button.title = template.content; // Tooltip on hover
            button.style.padding = '5px 10px';
            button.style.backgroundColor = '#ccc';
            button.style.color = '#333';
            button.style.borderRadius = '5px';
            button.style.border = '1px solid #999';
            button.style.cursor = 'pointer';

            button.onclick = () => {
                simulateInput(textarea, template.content.trim());
                insertedTemplate = template.content;
                populateSubject();
                showWarning(textarea, template.editCheck);
                console.log(`Inserted: ${template.content}`);
            };

            container.appendChild(button);
        });

        textarea.parentNode.insertBefore(container, textarea.nextSibling);
    }

    const observer = new MutationObserver(() => {
        const textarea = document.querySelector('textarea[placeholder="Type your message here"]');
        if (textarea && !document.getElementById("template-section")) {
            addTemplateButtons(textarea);
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });
})();
