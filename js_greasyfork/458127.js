// ==UserScript==
// @name         ADO Build & Deploy - Run Pipeline+
// @namespace    http://tampermonkey.net/
// @version      1.0.2
// @description  Add useful options for Build & Deploy pipeline in Azure DevOps
// @author       Victor Ros
// @match        https://*.visualstudio.com/*/_build?definitionId=3237*
// @match        https://dev.azure.com/*/*/_build?definitionId=3237*
// @match        https://*.visualstudio.com/*/_build?definitionId=3333*
// @match        https://dev.azure.com/*/*/_build?definitionId=3333*
// @match        https://*.visualstudio.com/*/_build?definitionId=4569*
// @match        https://dev.azure.com/*/*/_build?definitionId=4569*
// @match        https://*.visualstudio.com/*/_build?definitionId=5712*
// @match        https://dev.azure.com/*/*/_build?definitionId=5712*
// @icon         https://www.google.com/s2/favicons?domain=azure.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/458127/ADO%20Build%20%20Deploy%20-%20Run%20Pipeline%2B.user.js
// @updateURL https://update.greasyfork.org/scripts/458127/ADO%20Build%20%20Deploy%20-%20Run%20Pipeline%2B.meta.js
// ==/UserScript==

(async function() {
    "use strict";

    const log = console.log;

    // Constants
    const PREFIX_LOG = "[ADO Build & Deploy - Run Pipeline+]";
    const TEXT = {
        "fr": {
            buttonAllServices: "Tous les services"
        },
        "en": {
            buttonAllServices: "All services"
        }
    };
    const LANGUAGE = getLanguage();
    const RUN_PIPELINE_SELECTOR = "__bolt-run-pipeline-command";
    const POPUP_SELECTOR = ".bolt-panel-callout-content";
    const PARAMETERS_SELECTOR = ".padding-horizontal-20.rhythm-vertical-16 > .flex-noshrink";
    const BRANCHES_DROPDOWN_INPUT_SELECTOR = ".version-dropdown > input";
    const BUTTON_ID = "deploy-all-service-button";

    /**
     * Returns navigator's language.
     * @returns {string} Language. Default "en".
     */
    function getLanguage() {
        // Get language from navigator variable
        let language = (
            typeof navigator === "object" &&
            navigator.language &&
            navigator.language.split("-").shift()
        );

        // If not text found, set "en" as default
        if (typeof TEXT[language] === "undefined") {
            language = "en";
        }

        return language;
    }

    /**
     * Wait for the appearance of the HTML elements with the selector.
     * @param {string} _selector - The selector
     * @param {object} options - Options
     * @param {string} options.name - Selector name (Default to _selector value)
     * @param {number} options.maxRetry - Number of retry (Default to 0)
     * @param {number} options.timeout - Time to wait before retrying (Default to 1 sec)
     * @returns {Promise<void>} Empty promise.
     * @async
     */
    async function waitFor(_selector, {name = _selector, maxRetry = 0, timeout = 1000} = {}) {
        const result = document.querySelectorAll(_selector);
        if (result.length > 0) {
            log(`${PREFIX_LOG} ${name} found (${result.length})`);
            return;
        } else if (maxRetry > 0) {
            log(`${PREFIX_LOG} Wait for ${name} (Remaining retries: ${--maxRetry})`);

            await new Promise((_resolve, _reject) => {
                setTimeout(async () => {
                    try {
                        await waitFor(_selector, {name, maxRetry, timeout});
                        _resolve();
                    } catch (_err) {
                        _reject(_err);
                    }
                }, timeout);
            });
        } else {
            throw new Error(`Cannot find elements with selector: ${_selector}`);
        }
    }

    /**
     * Get services HTML elements from Run Pipeline popup.
     * @returns {void} Nothing.
     */
    function getServiceElements() {
        const popup = document.querySelector(POPUP_SELECTOR);
        const elements = popup.querySelectorAll(PARAMETERS_SELECTOR);
        const svcElements = [];
        let firstServiceFound = false;
        // Ignore all parameters until "events-service" parameter
        elements.forEach((_elt, _idx) => {
            if (_elt.innerHTML.includes("events-service")) {
                firstServiceFound = true;
            }
            if (firstServiceFound) {
                svcElements.push(_elt);
            }
        });
        if (svcElements.length === 0) {
            log(`${PREFIX_LOG} Something went wrong while retrieving service elements.`);
        }
        return svcElements;
    }

    /**
     * Add a button to select/unselect all services.
     * Recreate the HTML button.
     * @returns {HTMLElement} Button "All services".
     */
    function createButtonAllServices(_svcElements) {
        const firstSvcElement = _svcElements[0];
        const buttonAllServices = firstSvcElement.cloneNode(true);
        // Unselect by default
        buttonAllServices.setAttribute("aria-checked", false);
        buttonAllServices.classList.remove("checked");
        // Override id from div child
        const divChild = buttonAllServices.querySelector(".bolt-checkbox-label");
        divChild.setAttribute("id", BUTTON_ID);
        divChild.innerHTML = TEXT[LANGUAGE].buttonAllServices;

        // Add click event listener
        buttonAllServices.addEventListener("click", (_event) => {
            _event.stopPropagation();
            _event.preventDefault();

            const oldChecked = buttonAllServices.getAttribute("aria-checked") === "true";
            const newChecked = !oldChecked;
            const action = newChecked === true ? "add" : "remove";

            // Update aria-checked
            buttonAllServices.setAttribute("aria-checked", newChecked);
            buttonAllServices.classList[action]("checked");

            // Get services' parameters elements and all parameters elements
            const svcElements = getServiceElements();
            for (let svcElt of svcElements) {
                const svcChecked = svcElt.getAttribute("aria-checked") === "true";
                // Button is checked but service is not, or button is unchecked and service is.
                if (newChecked && !svcChecked || !newChecked && svcChecked) {
                    svcElt.click();
                }
            }

            buttonAllServices.focus();
        });

        // Add div element before first service element
        firstSvcElement.insertAdjacentElement("beforebegin", buttonAllServices);

        return buttonAllServices;
    }

    async function run() {
        log(`${PREFIX_LOG} Init...`);

        // Search by ID Run Pipeline button
        const buttonRunPipeline = document.getElementById(RUN_PIPELINE_SELECTOR);
        if (typeof buttonRunPipeline === "undefined") {
            log(`${PREFIX_LOG} Cannot find Run pipeline button`);
            return;
        } else {
            log(`${PREFIX_LOG} Found Run pipeline button`, buttonRunPipeline);
        }

        buttonRunPipeline.addEventListener("click", async () => {
            try {
                // Wait 5 sec max for parameters elements to be present in Run Pipeline popup
                await waitFor(PARAMETERS_SELECTOR, {name: "Services parameters", maxRetry: 10, timeout: 500});

                // Get services' parameters elements and all parameters elements
                const svcElements = getServiceElements();

                // Add div element before first service element
                const buttonAllServices = createButtonAllServices(svcElements);

                log(`${PREFIX_LOG} Added button "${TEXT[LANGUAGE].buttonAllServices}"`);
            } catch (_err) {
                log(`${PREFIX_LOG} ${_err.stack}`);
            }
        });

        log(`${PREFIX_LOG} Finished!`);
    }

    // Events
    window.addEventListener("load", run);
    window.removeEventListener("unload", run);
})();
