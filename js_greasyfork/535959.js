// ==UserScript==
// @name         Lumos LaunchDarkly Request
// @namespace    https://github.com/ecklf
// @version      1.0
// @description  Adds a button to create a Lumos Launchdarkly 24h Request
// @author       ecklf
// @icon         https://app.lumosidentity.com/favicon.ico
// @match        https://app.lumosidentity.com/*
// @match        https://app.lumosidentity.com/
// @grant        GM_notification
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/535959/Lumos%20LaunchDarkly%20Request.user.js
// @updateURL https://update.greasyfork.org/scripts/535959/Lumos%20LaunchDarkly%20Request.meta.js
// ==/UserScript==

(function () {
  'use strict';

  function addButton() {
    let button = document.createElement('button');
    button.setAttribute('id', 'copyButton');
    button.innerHTML = 'Request LaunchDarkly';
    GM_addStyle(`
        #copyButton {
            position: fixed;
            bottom: 3%;
            right: 3%;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            border-radius: 0.5rem;
            --tw-bg-opacity: 1;
            background-color: rgb(15 23 42 / var(--tw-bg-opacity));
            padding-top: 0.75rem;
            padding-bottom: 0.75rem;
            padding-left: 1rem;
            padding-right: 1rem;
            font-size: 0.875rem;
            line-height: 1.25rem;
            font-weight: 600;
            --tw-text-opacity: 1;
            color: rgb(255 255 255 / var(--tw-text-opacity));
            cursor: pointer;
            z-index: 99;
        }
        #copyButton:hover {
            --tw-bg-opacity: 1;
            background-color: rgb(51 65 85 / var(--tw-bg-opacity));
        }
    `);

    button.onclick = () => {
      // Fetch CSRF token from local storage
      const csrfToken = localStorage.getItem('X-CSRF-Token');
      // Fetch targetUserId from local storage and parse it as a number
      const targetUserId = localStorage.getItem('ajs_user_id');

      fetch(
        'https://b.app.lumosidentity.com/graphql?op=mutation_CreateSupportRequests',
        {
          headers: {
            accept: '*/*',
            'accept-language': 'en-US,en;q=0.9',
            'content-type': 'application/json',
            priority: 'u=1, i',
            'sec-ch-ua':
              '"Chromium";v="134", "Not:A-Brand";v="24", "Google Chrome";v="134"',
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-platform': '"macOS"',
            'sec-fetch-dest': 'empty',
            'sec-fetch-mode': 'cors',
            'sec-fetch-site': 'same-site',
            traceparent:
              '00-00000000000000006f4d8e5908f34649-397aa790caae2968-01',
            'x-csrf-token': csrfToken,
            'x-datadog-origin': 'rum',
            'x-datadog-parent-id': '4141807047638133096',
            'x-datadog-sampling-priority': '1',
            'x-datadog-trace-id': '8020223024470115913',
          },
          referrer:
            'https://app.lumosidentity.com/app_store?domainAppId=1233889&permissionIds=378932',
          referrerPolicy: 'no-referrer-when-downgrade',
          body: JSON.stringify({
            operationName: 'CreateSupportRequests',
            variables: {
              appGroupRequestConfigIds: ['378932'],
              customIntakeFieldResponses: [],
              domainAppId: '1233889',
              expiration: 86400,
              note: 'flags',
              requestType: 'ACCESS',
              targetUserId: JSON.parse(targetUserId),
            },
            query: `mutation CreateSupportRequests($domainAppId: ID!, $targetUserId: ID!, $requestType: SupportRequestType!, $note: String, $expiration: Int, $appGroupRequestConfigIds: [String], $itsmEventTicketId: ID, $parentId: ID, $customIntakeFieldResponses: [CreateCustomIntakeFieldResponseInput]) {
                    createSupportRequests(
                        requestData: {domainAppId: $domainAppId, targetUserId: $targetUserId, requestType: $requestType, note: $note, expiration: $expiration, appGroupRequestConfigIds: $appGroupRequestConfigIds, itsmEventTicketId: $itsmEventTicketId, parentId: $parentId, customIntakeFieldResponses: $customIntakeFieldResponses}
                    ) {
                        ok
                        errorMsg
                        isSoleApprover
                        supportRequests {
                            id
                            domainApp {
                                id
                                hasPendingRequests
                                __typename
                            }
                            __typename
                        }
                        __typename
                    }
                }`,
          }),
          method: 'POST',
          mode: 'cors',
          credentials: 'include',
        },
      )
        .then((response) => response.json())
        .then((data) => {
          console.log('Success:', data);
          GM.notification({
            text: `Lumos`,
            title: 'Request Success',
          });
        })
        .catch((error) => {
          console.error('Error:', error);
          GM.notification({
            text: `Lumos`,
            title: 'Request Failed',
          });
        });
    };
    document.body.appendChild(button);
  }
  addButton();
})();