// ==UserScript==
// @name         Hubspot - Mark ticket as spam button
// @namespace    http://tampermonkey.net/
// @version      2024-05-01
// @description  Adds a button in the top right corner of Hubspot tickets, which sets the category to 'spam' and also marks the conversation to spam
// @author       You
// @match        https://app.hubspot.com/contacts/4114147/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=hubspot.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/493911/Hubspot%20-%20Mark%20ticket%20as%20spam%20button.user.js
// @updateURL https://update.greasyfork.org/scripts/493911/Hubspot%20-%20Mark%20ticket%20as%20spam%20button.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function getCookie(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
    }
    var apiKey = getCookie("hubspotapi-csrf");

    function createSpamButton() {
        if (!window.location.href.includes("/record")) {
            return;
        }
        // Check for an existing button
        var spamBtnID = "spamButton";
        if (document.getElementById(spamBtnID)) {
            return;
        }

        var button = document.createElement('button');
        button.id = 'spamButton';
        button.textContent = 'Mark Spam';
        button.style.position = 'fixed';
        button.style.top = '50px';
        button.style.right = '20px';
        button.style.zIndex = '99999999';
        document.body.appendChild(button);
        console.log("addedBTN");
        button.addEventListener('click', async function() {
            var button = document.getElementById(spamBtnID);
            button.textContent = "...";
            var ticketURL = window.location.href;
            var recordId = ticketURL.split('/')[ticketURL.split('/').length - 1];
            var categorizationResponse = await fetch("https://app.hubspot.com/api/graphql/crm?portalId=4114147&clienttimeout=180000&hs_static_app=crm-records-ui&hs_static_app_version=1.57932", {
                "headers": {
                    "accept": "application/json, text/javascript, */*; q=0.01",
                    "accept-language": "en-US,en;q=0.9,de;q=0.8",
                    "content-type": "application/json",
                    "sec-fetch-dest": "empty",
                    "sec-fetch-mode": "cors",
                    "sec-fetch-site": "same-origin",
                    "x-hubspot-csrf-hubspotapi": apiKey,
                    "x-properties-source": "CRM_UI"
                },
                "referrer": ticketURL,
                "referrerPolicy": "strict-origin-when-cross-origin",
                "body": "[{\"operationName\":\"UpdateCrmObjectProperties\",\"variables\":{\"propertyUpdatesInput\":{\"objectType\":\"0-5\",\"objectId\":\"" + recordId + "\",\"properties\":[{\"name\":\"product_domain\",\"value\":\"Other\"},{\"name\":\"ticket_type\",\"value\":\"Spam\"}]}},\"query\":\"mutation UpdateCrmObjectProperties($propertyUpdatesInput: UpdateCrmObjectPropertiesInput!) {\\n  updateResponse: updateCrmObjectProperties(input: $propertyUpdatesInput) {\\n    updatedObject {\\n      id\\n      allProperties {\\n        id\\n        name\\n        value\\n        __typename\\n      }\\n      ...TicketFields\\n      ...DealFields\\n      ...BasicCrmObjectFields\\n      __typename\\n    }\\n    userErrorsExpanded {\\n      code\\n      message\\n      ... on UniquePropertyValueConflictMutationError {\\n        propertyName\\n        __typename\\n      }\\n      __typename\\n    }\\n    __typename\\n  }\\n}\\n\\nfragment TicketFields on CrmObject {\\n  id\\n  ... on Ticket {\\n    defaultProperties {\\n      subject {\\n        id\\n        value\\n        __typename\\n      }\\n      time_to_close {\\n        id\\n        value\\n        __typename\\n      }\\n      hubspot_owner_id {\\n        id\\n        value\\n        __typename\\n      }\\n      closed_date {\\n        id\\n        value\\n        __typename\\n      }\\n      __typename\\n    }\\n    pipelineInfo {\\n      currentStage {\\n        stageId\\n        __typename\\n      }\\n      pipeline {\\n        pipelineId\\n        stages {\\n          label\\n          displayOrder\\n          stageId\\n          __typename\\n        }\\n        __typename\\n      }\\n      __typename\\n    }\\n    __typename\\n  }\\n  __typename\\n}\\n\\nfragment DealFields on CrmObject {\\n  id\\n  ... on Deal {\\n    defaultProperties {\\n      dealname {\\n        id\\n        value\\n        __typename\\n      }\\n      deal_currency_code {\\n        id\\n        value\\n        __typename\\n      }\\n      __typename\\n    }\\n    pipelineInfo {\\n      currentStage {\\n        stageId\\n        __typename\\n      }\\n      pipeline {\\n        pipelineId\\n        stages {\\n          label\\n          displayOrder\\n          stageId\\n          __typename\\n        }\\n        __typename\\n      }\\n      __typename\\n    }\\n    __typename\\n  }\\n  __typename\\n}\\n\\nfragment BasicCrmObjectFields on CrmObject {\\n  id\\n  ... on BasicCrmObject {\\n    allProperties {\\n      id\\n      name\\n      value\\n      __typename\\n    }\\n    __typename\\n  }\\n  __typename\\n}\\n\"}]",
                "method": "POST",
                "mode": "cors",
                "credentials": "include"
            });

            if (!categorizationResponse.ok) {
                button.textContent = "Error (F12 for details)";
                console.error(categorizationResponse);
                return;
            }

            var conversationURL = document.querySelector('[data-test-id="conversation-chicklet"] a').href;
            var conversationID = conversationURL.split('/')[conversationURL.split('/').length - 1];
            var spamResponse = await fetch("https://app.hubspot.com/api/messages/v2/filtering/status/" + conversationID + "?portalId=4114147&clienttimeout=14000&hs_static_app=conversations-inbox-ui&hs_static_app_version=1.58357", {
                "headers": {
                    "accept": "application/json, text/javascript, */*; q=0.01",
                    "accept-language": "en-US,en;q=0.9,de;q=0.8",
                    "content-type": "application/json",
                    "sec-fetch-dest": "empty",
                    "sec-fetch-mode": "cors",
                    "sec-fetch-site": "same-origin",
                    "x-hubspot-csrf-hubspotapi": apiKey
                },
                "referrer": "https://app.hubspot.com/live-messages/4114147/inbox/" + conversationID,
                "referrerPolicy": "strict-origin-when-cross-origin",
                "body": "{\"filtered\":true,\"filteringType\":\"SPAM\",\"contactDeletion\":false}",
                "method": "POST",
                "mode": "cors",
                "credentials": "include"
            });

            if (!spamResponse.ok) {
                button.textContent = "Error (F12 for details)";
                console.error(spamResponse);
            } else {
                button.textContent = "Success!";
            }
        });
    }

    function setSpam() {

    }

    let lastUrl = location.href;
    new MutationObserver(() => {
        const url = location.href;
        if (url !== lastUrl) {
            lastUrl = url;
            window.addEventListener('load', function() {
                createSpamButton();
            });
            createSpamButton();
        }
    }).observe(document, {subtree: true, childList: true});

    window.addEventListener('load', function() {
        createSpamButton();
    });
})();