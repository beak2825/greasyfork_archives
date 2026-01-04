// ==UserScript==
// @name         Faction Logs Copy
// @namespace    Torn/Faction Logs Copy
// @version      0.0.2
// @description  Copy faction rebalancing logs
// @author       Ikkakujuu [3240812]
// @match        https://www.torn.com/factions.php?step=your*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/523954/Faction%20Logs%20Copy.user.js
// @updateURL https://update.greasyfork.org/scripts/523954/Faction%20Logs%20Copy.meta.js
// ==/UserScript==

// Change Log:
// 0.0.1 Added faction logs copy function

var buttonName = "COPY LOGS";
var hiddenTag = "tt-hidden";

//Adds a button to trigger the calls.
(function () {
    'use strict';

    const addCopyEventsButton = () => {
        const wrapper = document.querySelector(".newsHeader___rFk7I"); // Locate the wrapper
        if (!wrapper) {
            console.warn("Wrapper not found. Cannot add button.");
            return;
        }

        // Check if the button already exists
        if (document.querySelector("#copyEventsButton")) {
            console.log("Button already exists. Skipping creation.");
            return;
        }

        // Create a container for the button and input
        const container = document.createElement("div");
        container.style.display = "flex";
        container.style.alignItems = "center";
        container.style.marginBottom = "8px";

        // Create number input
        const input = document.createElement("input");
        input.type = "number";
        input.min = "1";
        input.value = "10"; // Default value
        input.id = "logCountInput";
        input.style.width = "50px";
        input.style.marginRight = "8px";

        // Create the "COPY EVENTS" button
        const button = document.createElement("button");
        button.textContent = buttonName;
        button.className = "torn-btn";
        button.id = "copyEventsButton";

        // Add click event listener
        button.addEventListener("click", () => {
            const logCount = parseInt(input.value, 10) || 5;
            copyEvents(logCount);
        });

        // Append input and button to the container
        container.appendChild(input);
        container.appendChild(button);

        // Determine placement location
        const parent = wrapper.parentElement;

        if (parent) {
            // Insert the container before the `wrapper`
            parent.insertBefore(container, wrapper);
            console.log("Button added successfully.");
        } else {
            console.warn("No suitable parent found. Adding to document body.");
            document.body.appendChild(container);
        }
    };


    // Copy the specified number of events
    const copyEvents = async (count) => {
        const events = document.querySelectorAll(".listItem___qQf5B");
        if (events.length === 0) {
            console.warn("No events found.");
            return;
        }

        const copyTexts = Array.from(events)
            .slice(0, count) // Limit to the specified number of events
            .reverse() // Reverse the order of the events
            .map((event) => {
                const timeElement = event.querySelector(".dateTime___Zo1k4");
                const descriptionElement = event.querySelector(".message___RSW3S");

                const timeMatch = timeElement?.innerText.match(/(\d{2}:\d{2}:\d{2})/);
                const dateMatch = timeElement?.innerText.match(/(\d{2}\/\d{2}\/\d{2})/);

                const time = timeMatch ? timeMatch[1] : "No time";
                const date = dateMatch ? dateMatch[1] : "No date";
                const description = descriptionElement?.innerText || "No description";

                return `${time} - ${date} ${description}`;
            });

        const finalText = copyTexts.join("\n");
        try {
            await navigator.clipboard.writeText(finalText);
            console.log("Copied to clipboard:\n", finalText);
        } catch (err) {
            console.error("Failed to copy to clipboard:", err);
            alert("Unable to copy to clipboard. Please check console for details.");
        }
    };

    // Observe the document for dynamic changes
    const observer = new MutationObserver(() => {
        addCopyEventsButton();
    });

    observer.observe(document.body, { childList: true, subtree: true });
    addCopyEventsButton(); // Initial call
})();