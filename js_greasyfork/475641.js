// ==UserScript==
// @name         Update Notify section
// @namespace    http://mcm.amazon.com
// @version      0.1
// @description  Used to add the nofity section
// @author       chengng@
// @match        https://mcm.amazon.com/cms/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/475641/Update%20Notify%20section.user.js
// @updateURL https://update.greasyfork.org/scripts/475641/Update%20Notify%20section.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to add SNS Topic and click the corresponding button
    function addSnsTopicAndClick(buttonId, inputId, value) {
        var addButton = document.getElementById(buttonId);
        var inputField = document.getElementById(inputId);

        if (addButton && inputField && !inputField.value) {
            inputField.value = value;
            addButton.click();
        }
    }

    // Check if the status is either Draft or Pending Approval
    var statusHeader = document.getElementById('cm_status_header');
    if (statusHeader) {
        var statusText = statusHeader.textContent.trim();
        if (statusText === 'Draft') {
            // Check and add state transition topic
            var stateInput = document.getElementById('add_state_transition_topics');
            if (stateInput) {
                addSnsTopicAndClick('add_state-notification_button', 'add_state_transition_topics', 'arn:aws:sns:us-east-1:398090684421:apac-edge-projects-mcm-notifications');
            }

            // Check and add approver transition topic
            var approverInput = document.getElementById('add_approver_transition_topics');
            if (approverInput) {
                addSnsTopicAndClick('add_approver-notification_button', 'add_approver_transition_topics', 'arn:aws:sns:us-east-1:398090684421:apac-edge-projects-mcm-notifications');
            }

            // Function to add a value and click the "Add" button for also notify
            function addValueAndClick(value) {
                const inputField = document.getElementById('add_to_also_notify');
                const addButton = document.getElementById('add_to_also_notify_button');

                if (inputField && addButton) {
                    inputField.value = value;
                    addButton.click();
                }
            }

            // Add values "apac-edge-projects" and "global-edge-dco" for also notify
            addValueAndClick("apac-edge-projects");
            setTimeout(() => {
                addValueAndClick("global-edge-dco");
            }, 1000); // Wait for 1 second before adding the next value
        }
    }
})();