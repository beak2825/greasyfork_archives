// ==UserScript==
// @name         Auto Refresh in OpenSearch Discover
// @description  This script adds a toggle button for auto refreshing data in OpenSearch Discover
// @version      2025-04-11
// @author       Busung Kim
// @match        https://laas-rprod-tokyo-ccs1-cn-dashboards.line-ves.com/**
// @icon         https://www.google.com/s2/favicons?sz=64&domain=line-ves.com
// @grant        none
// @license MIT
// @namespace https://greasyfork.org/users/1192532
// @downloadURL https://update.greasyfork.org/scripts/532499/Auto%20Refresh%20in%20OpenSearch%20Discover.user.js
// @updateURL https://update.greasyfork.org/scripts/532499/Auto%20Refresh%20in%20OpenSearch%20Discover.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const breadcrumbClassName = '.euiBreadcrumbs.euiHeaderBreadcrumbs.euiBreadcrumbs--truncate';
    const refreshIntervalMs = 5_000;
    let intervalId = null;

    function addAutoRefreshElement() {
        const newElement = document.createElement('div');
        newElement.className = 'euiFlexItem euiDescribedFormGroup__fields euiDescribedFormGroup__fieldPadding--xsmall';
        newElement.innerHTML = `
    <div class="euiSwitch">
      <button id="button-id-placeholder" aria-checked="false" class="euiSwitch__button" role="switch" type="button" aria-label="Modify columns when changing index patterns" aria-labelledby="label-id-placeholder">
        <span class="euiSwitch__body">
          <span class="euiSwitch__thumb"></span>
          <span class="euiSwitch__track">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" class="euiIcon euiIcon--medium euiSwitch__icon" focusable="false" role="img" aria-hidden="true">
              <path d="M7.293 8 3.146 3.854a.5.5 0 1 1 .708-.708L8 7.293l4.146-4.147a.5.5 0 0 1 .708.708L8.707 8l4.147 4.146a.5.5 0 0 1-.708.708L8 8.707l-4.146 4.147a.5.5 0 0 1-.708-.708L7.293 8Z"></path>
            </svg>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" class="euiIcon euiIcon--medium euiSwitch__icon euiSwitch__icon--checked" focusable="false" role="img" aria-hidden="true">
              <path fill-rule="evenodd" d="M6.5 12a.502.502 0 0 1-.354-.146l-4-4a.502.502 0 0 1 .708-.708L6.5 10.793l6.646-6.647a.502.502 0 0 1 .708.708l-7 7A.502.502 0 0 1 6.5 12">
              </path>
            </svg>
          </span>
        </span>
      </button>
      <span class="euiSwitch__label" id="label-id-placeholder">Auto Refresh</span>
    </div>
  `;
        newElement.style.marginLeft = 'auto';

        function generateUUID() {
            return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
                const r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
                return v.toString(16);
            });
        }

        const newUUID = generateUUID();
        const button = newElement.querySelector('.euiSwitch__button');
        button.id = newUUID;
        const span = newElement.querySelector('.euiSwitch__label');
        span.id = `${newUUID}-label`;

        const breadcrumbElement = document.querySelector(breadcrumbClassName);
        breadcrumbElement.appendChild(newElement);

        function refresh() {
            const refreshButton = document.getElementsByClassName('euiButton euiButton--primary euiButton--fill euiSuperUpdateButton')[0];
            refreshButton.click()
        }

        function toggleAriaChecked() {
            const currentValue = button.getAttribute('aria-checked');
            const newValue = currentValue === 'true' ? 'false' : 'true';
            button.setAttribute('aria-checked', newValue);

            if (newValue === 'true') {
                intervalId = setInterval(function() {
                    refresh();
                }, refreshIntervalMs);
            } else {
                clearInterval(intervalId);
            }
        }

        // Add click event listeners to both the button and the span
        button.addEventListener('click', toggleAriaChecked);
        span.addEventListener('click', toggleAriaChecked);
    }

    const observer = new MutationObserver((mutations, observer) => {
        // Check if the desired elements are present
        if (document.querySelector(breadcrumbClassName)) {
            addAutoRefreshElement();
            observer.disconnect();
        }
    });

    // Start observing the document for changes
    observer.observe(document, { childList: true, subtree: true });
})();