// ==UserScript==
// @name         Generate Launchpad Bug Links from tags
// @namespace    http://anthonywong.net/
// @version      1.4
// @description  Parse tags, create buttons for originate-from bug links and JIRA links
// @match        https://bugs.launchpad.net/*/+bug/*
// @grant        none
// @license      GPLv2
// @downloadURL https://update.greasyfork.org/scripts/533120/Generate%20Launchpad%20Bug%20Links%20from%20tags.user.js
// @updateURL https://update.greasyfork.org/scripts/533120/Generate%20Launchpad%20Bug%20Links%20from%20tags.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Locate the <span id="tag-list"> element
    const tagsElement = document.querySelector('#tag-list');

    if (tagsElement) {
        // Extract the tags as text
        const tagsText = tagsElement.textContent;

        // Find all "originate-from-XXXX" patterns
        const originateMatches = tagsText.match(/originate-from-(\d+)/g);

        // Find all "jira-$JIRA_TICKET" patterns
        const jiraMatches = tagsText.match(/jira-([a-zA-Z0-9\-]+)/g);

        // Create a container for the buttons
        const buttonContainer = document.createElement("div");
        buttonContainer.style.marginTop = "10px";

        // Process originate-from tags
        if (originateMatches) {
            originateMatches.forEach((tag) => {
                const bugNumber = tag.replace("originate-from-", "");

                // Create a button
                const button = document.createElement("button");
                button.textContent = `Go to Bug ${bugNumber}`;
                button.style.marginRight = "5px";
                button.style.padding = "5px 10px";

                // Set up the button click event
                button.addEventListener("click", () => {
                    const bugUrl = `https://bugs.launchpad.net/ubuntu/+bug/${bugNumber}`;
                    window.open(bugUrl, "_blank");
                });

                // Add the button to the container
                buttonContainer.appendChild(button);
            });
        }

        // Process JIRA tags
        if (jiraMatches) {
            jiraMatches.forEach((tag) => {
                const jiraTicket = tag.replace("jira-", "").toUpperCase();

                // Create a button
                const button = document.createElement("button");
                button.textContent = `Go to JIRA ${jiraTicket}`;
                button.style.marginRight = "5px";
                button.style.padding = "5px 10px";

                // Set up the button click event
                button.addEventListener("click", () => {
                    const jiraUrl = `https://warthogs.atlassian.net/browse/${jiraTicket}`;
                    window.open(jiraUrl, "_blank");
                });

                // Add the button to the container
                buttonContainer.appendChild(button);
            });
        }

        // Append the container below the tags element
        if (buttonContainer.childNodes.length > 0) {
            tagsElement.parentNode.appendChild(buttonContainer);
        }
    }
})();
