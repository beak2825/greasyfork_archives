// ==UserScript==
// @name         KAAUH Lab Super Suite - Verification, Alerts & Modern Counters22222
// @namespace    Violentmonkey Scripts
// @version      11.1
// @description  Merges verification buttons (F7/F8), dynamic alerts including a specific check for HbA1c, critical result reporting, and an advanced, flicker-free inline sample counter with a redesigned, modern visual interface.
// @match        *://his.kaauh.org/lab/*
// @grant        GM_addStyle
// @author       Hamad AlShegifi
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/535923/KAAUH%20Lab%20Super%20Suite%20-%20Verification%2C%20Alerts%20%20Modern%20Counters22222.user.js
// @updateURL https://update.greasyfork.org/scripts/535923/KAAUH%20Lab%20Super%20Suite%20-%20Verification%2C%20Alerts%20%20Modern%20Counters22222.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to apply styles to the main tabs for better visibility
    function applyFinalStyles() {
        // Select ALL of the tabs in the widget bar
        const allTabs = document.querySelectorAll('.content-area .widget-tabs > li > a');

        if (allTabs.length > 0) {
            allTabs.forEach(tabLink => {
                // Apply the key overflow and whitespace rules to each tab
                tabLink.style.setProperty('white-space', 'nowrap', 'important');
                tabLink.style.setProperty('overflow', 'visible', 'important');
                tabLink.style.setProperty('text-overflow', 'unset', 'important');

                // Apply the inline style to all spans inside the tab
                const spans = tabLink.querySelectorAll('span');
                spans.forEach(span => {
                    span.style.setProperty('display', 'inline', 'important');
                    span.style.setProperty('white-space', 'nowrap', 'important');
                });
            });

            // Separately, find all number spans and fix the spacing around the "/"
            const numberSpans = document.querySelectorAll('.pending-orders, .to-do, .today-orders, .total-orders');
            numberSpans.forEach(span => {
                if (span.textContent && span.textContent.includes('/')) {
                    const regex = /\s*\/\s*/g; // Regex to find slashes with optional surrounding whitespace
                    span.textContent = span.textContent.replace(regex, '/'); // Replace with just a slash
                }
            });
        }
    }

    // Debounce function to limit the rate at which a function can fire.
    function debounce(func, wait) {
        let timeout;
        return function(...args) {
            const context = this;
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(context, args), wait);
        };
    }

    // Create the debounced version of the style applier
    const debouncedStyleApplier = debounce(applyFinalStyles, 300);
    // Observe mutations in the DOM and apply styles when changes occur
    const styleObserver = new MutationObserver(debouncedStyleApplier);

    // Start observing the document body for child and subtree changes
    styleObserver.observe(document.body, { childList: true, subtree: true });
    // Apply styles once immediately on script load
    applyFinalStyles();
})();


// Main Userscript Logic (Alerts, F7/F8 buttons, Sample Counters etc.)
(function () {
    'use strict';

    // --- Injected CSS for the new counter design ---
    GM_addStyle(`
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(5px); }
            to   { opacity: 1; transform: translateY(0); }
        }

        /* Keyframes for the flashing red effect (from highlighter script) */
        @keyframes flash-red {
            0%, 100% { background-color: #e74c3c; border-color: #c0392b; color: #fff; }
            50% { background-color: #f1f3f5; border-color: #dee2e6; color: #5d6873; }
        }

        /* Icon for the main counter tag */
        .counter-icon {
            display: inline-block;
            width: 12px;
            height: 12px;
            border: 1.5px solid currentColor;
            border-top: none;
            border-radius: 0 0 4px 4px;
            position: relative;
            vertical-align: -2px;
        }
        .counter-icon::before { /* The rim */
            content: '';
            position: absolute;
            top: -2px;
            left: -2px;
            width: 14px;
            height: 2.5px;
            background-color: currentColor;
            border-radius: 1px;
        }

        /* A separate, robust style for the main counter tag */
        .main-counter-style {
            display: inline-flex;
            align-items: center;
            gap: 10px;
            animation: fadeIn 0.3s ease-out;
            box-shadow: 0 3px 6px rgba(0, 83, 153, 0.15), 0 2px 4px rgba(0, 114, 211, 0.1);
            border-radius: 18px;
            /* Modern gradient background */
            background: linear-gradient(145deg, #0072d3, #0088f8);
            color: #ffffff; /* White text for contrast */
            font-size: 17px;
            font-weight: 600;
            padding: 6px 8px 6px 14px;
            border: 1px solid rgba(255, 255, 255, 0.2); /* Subtle inner border */
            text-shadow: 0 1px 1px rgba(0,0,0,0.1); /* Slight text shadow for depth */
        }

        /* This style is for the smaller section tags */
        .sample-section-tag {
            display: inline-flex; align-items: center; background-color: #f1f3f5;
            border-radius: 16px; padding: 5px 6px 5px 10px; font-size: 14px;
            font-weight: 600; color: #5d6873; border: 1px solid #dee2e6;
            gap: 8px; animation: fadeIn 0.3s ease-out;
            box-shadow: 0 1px 2px rgba(0,0,0,0.05);
            transition: background-color 0.3s, border-color 0.3s, color 0.3s; /* Smooth transition */
        }

        /* Class to apply the flashing animation (from highlighter script) */
        .flashing-tag {
            animation: flash-red 1.2s infinite ease-in-out;
        }
        /* When flashing, force the inner badge to change color too (from highlighter script) */
        .flashing-tag .section-count-badge {
             color: #e74c3c !important;
             background-color: #fff !important;
        }

        /* Common styles for elements within the tags */
        .color-dot {
            width: 10px; height: 10px; border-radius: 50%;
        }
        .section-count-badge {
            background-color: #495057; color: #fff; border-radius: 10px;
            padding: 4px 9px; font-size: 15px; font-weight: 700;
            min-width: 18px; text-align: center;
            transition: background-color 0.3s, color 0.3s;
        }

        /* Style adjustment for the badge inside the NEW main counter */
        .main-counter-style .section-count-badge {
            background-color: rgba(0, 0, 0, 0.2); /* Darker, semi-transparent background */
            color: #fff;
            box-shadow: inset 0 1px 2px rgba(0,0,0,0.1);
        }

        /* Styles for the highlighter input container (from highlighter script) */
        .highlighter-container {
            display: flex;
            align-items: center;
            gap: 8px;
            margin-top: 5px;
            padding: 5px;
            animation: fadeIn 0.5s ease-out;
        }
    `);


    // Debounce function (copied here for local scope)
    function debounce(func, wait) {
        let timeout;
        return function(...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), wait);
        };
    }

    const CONFIG_MAIN = {
        URLS: {
            EDIT_PAGE_PREFIX: 'https://his.kaauh.org/lab/#/lab-orders/edit-lab-order/',
        },
        SELECTORS: {
            VERIFY1_BTN: '#custom-script-buttons button.verify1-btn',
            VERIFY2_BTN: '#custom-script-buttons button.verify2-btn',
            REPORT_CRITICAL_BTN: '#custom-script-buttons button.report-critical-btn',
            COMPLETE_TECH: 'button.dropdown-item[translateid="test-results.CompleteTechnicalVerification"]',
            COMPLETE_MED: 'button.dropdown-item[translateid="test-results.CompleteMedicalVerification"]',
            FINAL_VERIFY: 'button.btn-success.btn-sm.min-width[translateid="test-verification.Verify"]',
            NEXT_BTN: 'button#btnNext',
            UNCHECKED_BOX: 'span.ag-icon-checkbox-unchecked[unselectable="on"]',
            CHECKBOX_ROW: '.ag-row',
            TEST_DESC_CELL: '[col-id="TestDesc"]',
            ORDERED_STATUS_CELL: 'div[col-id="ResultStatus"]',
            TOAST: {
                CONTAINER: '#toast-container',
                CLOSE_BTN: 'button.toast-close-button',
                SUCCESS: '.toast-success',
            },
            SAMPLE_RECEIVE_MODAL: 'modal-container.show',
            ALL_TEST_ROWS_CENTER: '.ag-center-cols-container .ag-row',
            ALL_TEST_ROWS_PINNED: '.ag-pinned-left-cols-container .ag-row',
            TEST_RESULT_CELL_GENERAL: 'div[role="gridcell"][col-id="TestResult"] app-result-value-render div',
            TEST_UOM_CELL_GENERAL: 'div[col-id="UomValue"]',
            TEST_FLAG_CELL_GENERAL: 'div[role="gridcell"][col-id="LTFlag"] app-ref-high-low div span.critial-alret-indication',
        },
        CHECK_INTERVALS: {
            UNDEFINED_URL: 200,
            ORDERED_SCAN: 500,
            DISABLED_BTN_CHECK: 1000,
        },
        EXCLUDE_WORDS: [
            'culture', "gram's stain", 'stain', 'bacterial', 'fungal',
            'pcr', 'meningitis', 'mrsa', 'mid', 'stream', 'cryptococcus'
        ]
    };

    // State Variables
    let verify1Clicked = false;
    let verify2Clicked = false;
    let verify1Toggle = localStorage.getItem('verify1Toggle') === 'true';
    let verify2Toggle = localStorage.getItem('verify2Toggle') === 'true';
    let lastDisabledButtonAlertTime = 0;
    const DISABLED_ALERT_COOLDOWN = 30000;
    let isReportModalOpen = false; // For the "Report Critical Result" modal (manual one)
    let isAlertModalOpen = false; // For the automatic alert modal (createCustomAlert)
    const activeSampleCounterIntervals = new Map(); // For the colorful sample counter

    // --- Centralized logging functions ---
    const logDebugMain = msg => console.debug(`[LabScript Main] ${msg}`);
    const logAlertDebug = () => {}; // This line prevents [Alerts Scanner DEBUG] messages from appearing
    const logAlertError = msg => console.error(`[Alerts Scanner ERROR] ${msg}`);
    const SCRIPT_PREFIX_SAMPLES = "[Samples Counter]";
    const logCounterDebug = msg => console.debug(`${SCRIPT_PREFIX_SAMPLES} ${msg}`);
    const logCounterError = msg => console.error(`${SCRIPT_PREFIX_SAMPLES} ${msg}`);


    // --- START: Merged Modern Sample Counter & Highlighter ---

    /**
     * Generates a consistent, visually pleasing HSL color based on a string input.
     * @param {string} str The input string (e.g., 'CHEM', 'HEMA').
     * @returns {string} A CSS HSL color string.
     */
    function getColorForString(str) {
        let hash = 0;
        if (str.length === 0) return 'hsl(0, 0%, 50%)';
        for (let i = 0; i < str.length; i++) {
            hash = str.charCodeAt(i) + ((hash << 5) - hash);
            hash = hash & hash;
        }
        const hue = Math.abs(hash % 360);
        return `hsl(${hue}, 70%, 48%)`;
    }

    /**
     * Creates the main container and structure for the redesigned counter.
     * @param {string} id The unique ID for the counter element.
     * @returns {HTMLElement} The fully constructed counter wrapper element.
     */
    function createCounterElement(id) {
        const wrapper = document.createElement('div');
        wrapper.id = id;
        Object.assign(wrapper.style, {
            display: 'flex', alignItems: 'center', gap: '12px',
            width: '100%', padding: '5px 10px', marginRight: 'auto',
            animation: 'fadeIn 0.5s ease-out'
        });

        // The main counter gets a unique ID and its own style class
        const mainCountWrapper = document.createElement('div');
        mainCountWrapper.id = 'main-counter-tag-' + id; // Make ID unique per instance
        mainCountWrapper.className = 'main-counter-style';

        mainCountWrapper.innerHTML = `
            <span class="counter-icon"></span>
            <span>SAMPLES COUNT=</span>
            <span class="section-count-badge">0</span>`;
        wrapper.appendChild(mainCountWrapper);

        const sectionPanel = document.createElement('div');
        sectionPanel.id = 'section-panel-' + id; // Make ID unique per instance
        Object.assign(sectionPanel.style, {
            display: 'flex', flex: '1', alignItems: 'center',
            flexWrap: 'wrap', gap: '8px',
        });
        wrapper.appendChild(sectionPanel);

        return wrapper;
    }


    /**
     * Intelligently updates the counter to prevent flickering and triggers highlighter update.
     * @param {HTMLElement} modalElementForInputs The modal element containing the inputs.
     * @param {HTMLElement} counterElement The main counter element to update.
     * @param {string} inputSelector The CSS selector for finding sample inputs.
     */
    function updateSampleCounter(modalElementForInputs, counterElement, inputSelector) {
        const mainCountBadge = counterElement.querySelector('.main-counter-style .section-count-badge');
        if (!mainCountBadge || !modalElementForInputs || !document.body.contains(modalElementForInputs)) return;

        const inputs = modalElementForInputs.querySelectorAll(inputSelector);
        const count = inputs.length;
        mainCountBadge.textContent = count;

        const sectionPanel = counterElement.querySelector('[id^="section-panel-"]');
        if (!sectionPanel) return;

        const sectionCounts = {};
        inputs.forEach(input => {
            const sectionInput = input.closest('tr')?.querySelector('input[formcontrolname="TestSection"]');
            if (sectionInput?.value) {
                const sectionName = sectionInput.value.trim().toUpperCase();
                if (sectionName) {
                    sectionCounts[sectionName] = (sectionCounts[sectionName] || 0) + 1;
                }
            }
        });

        const sectionsOnPage = new Set();
        const sortedSections = Object.keys(sectionCounts).sort();

        // Update existing tags or create new ones
        for (const section of sortedSections) {
            sectionsOnPage.add(section);
            let tag = sectionPanel.querySelector(`.sample-section-tag[data-section="${section}"]`);
            if (tag) {
                tag.querySelector('.section-count-badge').textContent = sectionCounts[section];
            } else {
                tag = document.createElement('div');
                tag.className = 'sample-section-tag';
                tag.dataset.section = section;
                tag.innerHTML = `
                    <span class="color-dot" style="background-color: ${getColorForString(section)};"></span>
                    <span>${section}</span>
                    <span class="section-count-badge">${sectionCounts[section]}</span>`;
                sectionPanel.appendChild(tag);
            }
        }

        // Remove old tags that are no longer in the data
        sectionPanel.querySelectorAll('.sample-section-tag[data-section]').forEach(tag => {
            if (!sectionsOnPage.has(tag.dataset.section)) {
                tag.remove();
            }
        });

        // MERGED: Trigger a highlight check after updating counters
        document.dispatchEvent(new Event('update-highlight'));
    }

    /**
     * Sets up the highlighter input field and its event listener.
     */
    function setupHighlighterInput(receiverInput) {
        if (document.getElementById('section-highlighter-input')) return; // Already exists

        const container = document.createElement('div');
        container.className = 'highlighter-container';

        const label = document.createElement('label');
        label.textContent = 'LAB FILTER:';
        label.style.fontWeight = 'bold';

        const input = document.createElement('input');
        input.type = 'text';
        input.id = 'section-highlighter-input';
        input.placeholder = 'Type first 2 letters (e.g., CH)';
        input.className = 'form-control form-control-sm';
        input.style.flex = '1';

        container.appendChild(label);
        container.appendChild(input);

        // Insert the new container after the parent of the receiverStaffID input
        const receiverParentDiv = receiverInput.parentElement;
        if (receiverParentDiv) {
            receiverParentDiv.insertAdjacentElement('afterend', container);
        }

        // UPDATED highlighting logic
        const handleHighlight = () => {
            const inputText = input.value.trim().toUpperCase();
            const allTags = document.querySelectorAll('.sample-section-tag[data-section]');

            // Only proceed if input is at least 2 chars long
            const highlightPrefix = inputText.length >= 2 ? inputText.substring(0, 2) : null;

            allTags.forEach(tag => {
                const sectionName = tag.dataset.section;
                const sectionPrefix = sectionName.substring(0, 2);

                // If there's a valid prefix, flash tags that DON'T match.
                // Otherwise, remove flash from all tags.
                if (highlightPrefix && sectionPrefix !== highlightPrefix) {
                    tag.classList.add('flashing-tag');
                } else {
                    tag.classList.remove('flashing-tag');
                }
            });
        };

        input.addEventListener('input', handleHighlight);
        // Also listen for the custom event dispatched when counters update
        document.addEventListener('update-highlight', handleHighlight);
    }


    function setupSampleCounter(modalConfig) {
        const { buttonId, counterId, inputSelector, modalKeyElement, targetFooter, activeIntervalsMap } = modalConfig;
        if (targetFooter.querySelector('#' + counterId) || modalKeyElement.dataset.counterInitialized) return;

        logCounterDebug(`Creating counter for modal: ${counterId}`);
        const counter = createCounterElement(counterId);
        targetFooter.insertBefore(counter, targetFooter.firstChild);
        targetFooter.style.flexWrap = 'wrap';

        const modalElementForInputs = modalKeyElement.querySelector('.modal-body') || modalKeyElement;

        const interval = setInterval(() => {
            // Self-cleanup logic
            if (!document.body.contains(modalKeyElement) || !counter.isConnected) {
                logCounterDebug(`Interval for ${buttonId} (Counter ID: ${counterId}): Modal or counter removed. Cleaning up.`);
                clearInterval(interval);
                activeIntervalsMap.delete(modalKeyElement);
                if (counter.isConnected) {
                    counter.remove();
                }
                return;
            }
            updateSampleCounter(modalElementForInputs, counter, inputSelector);
        }, 500);

        activeIntervalsMap.set(modalKeyElement, { interval, counter });
        modalKeyElement.dataset.counterInitialized = 'true';
    }


    // --- END: Merged Modern Sample Counter & Highlighter ---


    const isCorrectPage = () => window.location.href.startsWith(CONFIG_MAIN.URLS.EDIT_PAGE_PREFIX);

    function showDisabledButtonAlert(message) {
        const now = Date.now();
        if (now - lastDisabledButtonAlertTime < DISABLED_ALERT_COOLDOWN) return;
        lastDisabledButtonAlertTime = now;

        const modalOverlay = document.createElement('div');
        modalOverlay.id = 'disabled-button-alert-overlay';
        Object.assign(modalOverlay.style, {
            position: 'fixed', top: '0', left: '0', width: '100vw', height: '100vh',
            backgroundColor: 'rgba(0, 0, 0, 0.7)', zIndex: '10000', display: 'flex',
            justifyContent: 'center', alignItems: 'center'
        });

        const modalBox = document.createElement('div');
        Object.assign(modalBox.style, {
            backgroundColor: '#fff', padding: '25px', borderRadius: '8px',
            boxShadow: '0 5px 15px rgba(0,0,0,0.3)', width: 'auto', maxWidth: '80%',
            textAlign: 'center', borderTop: '5px solid #f0ad4e'
        });

        const title = document.createElement('h3');
        title.textContent = 'Button Disabled';
        title.style.color = '#d9534f';
        title.style.marginTop = '0';
        modalBox.appendChild(title);

        const messageElem = document.createElement('p');
        messageElem.textContent = message;
        messageElem.style.fontSize = '16px';
        messageElem.style.marginBottom = '20px';
        modalBox.appendChild(messageElem);

        const okButton = document.createElement('button');
        okButton.textContent = 'OK';
        Object.assign(okButton.style, {
            padding: '8px 20px', borderRadius: '5px', backgroundColor: '#5cb85c',
            color: '#fff', border: 'none', cursor: 'pointer', fontSize: '16px'
        });
        okButton.onclick = () => document.body.removeChild(modalOverlay);
        modalBox.appendChild(okButton);

        modalOverlay.appendChild(modalBox);
        document.body.appendChild(modalOverlay);
        okButton.focus();
    }

    function addFontAwesome() {
        const styleId = 'local-fontawesome-style';
        if (document.getElementById(styleId)) return;

        const style = document.createElement('style');
        style.id = styleId;
        style.textContent = `
            @font-face {
              font-family: 'FontAwesome';
              src: url('https://his.kaauh.org/lab/fontawesome-webfont.af7ae505a9eed503f8b8.woff2?v=4.7.0') format('woff2');
              font-weight: normal;
              font-style: normal;
            }
            .fas {
              display: inline-block;
              font: normal normal normal 14px/1 FontAwesome;
              font-size: inherit;
              text-rendering: auto;
              -webkit-font-smoothing: antialiased;
              -moz-osx-font-smoothing: grayscale;
            }
            .fa-arrow-circle-left:before { content: "\\f0a8"; }
            .fa-exclamation-triangle:before { content: "\\f071"; }
            .fa-user:before { content: "\\f007"; }
            .fa-id-card:before { content: "\\f2c2"; }
            .fa-hospital-alt:before { content: "\\f0f8"; } /* Using fa-hospital-o from v4 */
            .fa-barcode:before { content: "\\f02a"; }
            .fa-file-signature:before { content: "\\f0f6"; } /* Using fa-file-text-o from v4 */
        `;
        const head = document.head || document.body;
        if (head) {
            head.appendChild(style);
        }
    }

    function createVerifyButton(label, className, onClick, id) {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = className;
        button.classList.add(id);
        button.innerText = label;
        const styles = {
            'font-family': 'Arial, sans-serif',
            'font-size': '14px',
            'font-weight': 'normal',
            'color': '#ffffff',
            'background-color': className.includes('success') ? '#28a745' : '#2594d9',
            'padding': '8px 16px',
            'border': 'none',
            'border-radius': '5px',
            'text-shadow': 'none',
            'cursor': 'pointer',
            'margin-right': '5px',
            'line-height': '1.5',
            'vertical-align': 'middle',
        };
        for (const [prop, value] of Object.entries(styles)) {
            button.style.setProperty(prop, value, 'important');
        }
        button.onclick = onClick;
        return button;
    }

    async function initiateManualCriticalReport() {
        logDebugMain("Manual critical report initiated. [Phase 1]");
        if (isReportModalOpen || document.getElementById('report-selection-modal-overlay')) {
            logDebugMain("Report selection modal already open. Aborting.");
            return;
        }

        logDebugMain("Collecting testsData... [Phase 2]");
        const testsData = collectAllTestsWithResults();
        if (testsData.length === 0) {
            showDisabledButtonAlert("No tests found on the page to report.");
            logDebugMain("No tests found. Aborting modal. [Phase 2.1]");
            return;
        }
        logDebugMain(`testsData collected: ${testsData.length} items. [Phase 2.2]`);

        logDebugMain("Introducing a small delay before fetching patient data for manual report... [Phase 2.5]");
        await new Promise(resolve => setTimeout(resolve, 300));

        try {
            logDebugMain("Attempting to get patient data... [Phase 3]");
            const patientInfoResult = await getPatientDataWithRetry({
                name: CONFIG_ALERTS.PATIENT_NAME_SELECTOR,
                mrn: CONFIG_ALERTS.PATIENT_MRN_SELECTOR,
                location: CONFIG_ALERTS.PATIENT_LOCATION_SELECTOR,
                barcode: CONFIG_ALERTS.SAMPLE_BARCODE_SELECTOR
            });
            logDebugMain(`Patient data received. Essential: ${patientInfoResult.allEssentialDataRetrieved}. Data: ${JSON.stringify(patientInfoResult.data)} [Phase 4]`);

            if (!patientInfoResult.allEssentialDataRetrieved) {
                logAlertError("Essential patient data could not be retrieved for manual report.");
            }

            const userIdElement = document.querySelector(CONFIG_ALERTS.USER_NAME_SELECTOR);
            const currentUserId = userIdElement ? userIdElement.textContent.trim() : 'N/A';
            logDebugMain(`User ID: ${currentUserId} [Phase 5]`);

            logDebugMain("Calling createReportSelectionModal... [Phase 6]");
            createReportSelectionModal(testsData, patientInfoResult.data, currentUserId);
            logDebugMain("createReportSelectionModal call finished. [Phase 7]");

        } catch (error) {
            logAlertError(`Error in initiateManualCriticalReport: ${error.message}`);
            console.error("Full error object in initiateManualCriticalReport:", error);
            alert("An error occurred while preparing the report. Please check the console for details.");
        }
    }

    function createReportCriticalResultButton() {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'btn btn-danger btn-sm report-critical-btn'; // btn-danger for red
        button.innerText = 'Report Critical Result';
        const styles = {
            'font-family': 'Arial, sans-serif', 'font-size': '14px', 'font-weight': 'normal',
            'color': '#ffffff',
            'background-color': '#dc3545', // Red color
            'padding': '8px 16px', 'border': 'none', 'border-radius': '5px',
            'text-shadow': 'none', 'cursor': 'pointer', 'margin-right': '10px',
            'line-height': '1.5', 'vertical-align': 'middle',
        };
        for (const [prop, value] of Object.entries(styles)) {
            button.style.setProperty(prop, value, 'important');
        }
        button.onclick = initiateManualCriticalReport;
        return button;
    }

    function createToggleIcon(id, isActive, onClick) {
        const icon = document.createElement('span');
        icon.id = id;
        icon.innerHTML = `<i class="fas fa-arrow-circle-left" style="color: ${isActive ? '#008000' : '#d1cfcf'}; font-size: 1.6em; vertical-align: middle;"></i>`;
        icon.style.cursor = 'pointer';
        icon.style.marginRight = '8px';
        icon.style.marginLeft = '1px';
        icon.title = "Go back automatically after this verification success toast is clicked";
        icon.onclick = onClick;
        return icon;
    }

    function handleVerifyToggle(type) {
        const toggle = type === 'verify1' ? !verify1Toggle : !verify2Toggle;
        localStorage.setItem(type + 'Toggle', toggle);
        const icon = document.querySelector(`#${type}Icon i`);
        if (icon) icon.style.setProperty('color', toggle ? '#008000' : '#d1cfcf', 'important');

        if (type === 'verify1') verify1Toggle = toggle;
        else verify2Toggle = toggle;
    }

    function addButtons() {
        if (document.getElementById('custom-script-buttons') || !isCorrectPage()) return;
        const nextButton = document.querySelector(CONFIG_MAIN.SELECTORS.NEXT_BTN);
        if (!nextButton || !nextButton.parentNode) {
            setTimeout(addButtons, 500);
            return;
        }

        const buttonDiv = document.createElement('div');
        buttonDiv.id = 'custom-script-buttons';
        buttonDiv.style.setProperty('display', 'inline-block', 'important');
        buttonDiv.style.setProperty('margin-left', '10px', 'important');
        buttonDiv.style.setProperty('vertical-align', 'middle', 'important');

        const verify1Button = createVerifyButton('VERIFY1 (F7)', 'btn btn-success btn-sm', () => {
            verify1Clicked = true; verify2Clicked = false;
            checkAllVisibleBoxesWithoutDuplicates();
            setTimeout(clickCompleteTechnicalVerificationButton, 500);
        }, 'verify1-btn');

        const verify2Button = createVerifyButton('VERIFY2 (F8)', 'btn btn-primary btn-sm', () => {
            verify2Clicked = true; verify1Clicked = false;
            checkAllVisibleBoxesWithoutDuplicates();
            setTimeout(clickCompleteMedicalVerificationButton, 500);
        }, 'verify2-btn');

        const reportCriticalButton = createReportCriticalResultButton();

        const verify1Icon = createToggleIcon('verify1Icon', verify1Toggle, () => handleVerifyToggle('verify1'));
        const verify2Icon = createToggleIcon('verify2Icon', verify2Toggle, () => handleVerifyToggle('verify2'));

        const credit = document.createElement('span');
        credit.textContent = "Modded by: Hamad AlShegifi";
        credit.style.cssText = `font-size: 11px !important; font-weight: bold !important; color: #e60000 !important; margin-left: 15px !important; border: 1px solid #e60000 !important; border-radius: 5px !important; padding: 3px 6px !important; background-color: #ffffff !important; vertical-align: middle !important;`;

        buttonDiv.append(verify1Button, verify1Icon, verify2Button, verify2Icon, reportCriticalButton );
        nextButton.parentNode.insertBefore(buttonDiv, nextButton.nextSibling);
        logDebugMain("Custom buttons added.");
    }

    function checkAllVisibleBoxesWithoutDuplicates() {
        const selectedTests = new Set();
        const boxes = document.querySelectorAll(CONFIG_MAIN.SELECTORS.UNCHECKED_BOX);
        boxes.forEach(box => {
            const row = box.closest(CONFIG_MAIN.SELECTORS.CHECKBOX_ROW);
            if (row && row.offsetParent !== null) { // Check if row is visible
                const testDescElement = row.querySelector(CONFIG_MAIN.SELECTORS.TEST_DESC_CELL);
                const descText = testDescElement?.textContent.trim().toLowerCase();
                if (descText) {
                    const isExcluded = CONFIG_MAIN.EXCLUDE_WORDS.some(word => descText.includes(word));
                    if (!selectedTests.has(descText) && !isExcluded) {
                        selectedTests.add(descText); box.click();
                    }
                }
            }
        });
        logDebugMain(`Checked ${selectedTests.size} unique, non-excluded, visible boxes.`);
    }

    const clickButton = (selector, callback) => {
        const btn = document.querySelector(selector);
        if (btn && !btn.disabled) {
            btn.click();
            if (callback) setTimeout(callback, 500);
            return true;
        } else if (btn && btn.disabled) {
            const buttonName = selector.includes('CompleteTechnicalVerification') ? 'Complete Technical Verification' :
                  selector.includes('CompleteMedicalVerification') ? 'Complete Medical Verification' :
                  selector.includes('Verify') ? 'Final Verify' : 'Button';
            showDisabledButtonAlert(`${buttonName} button is disabled. Please check if you have selected all required tests or if verification is already done.`);
        }
        return false;
    };

    const clickCompleteTechnicalVerificationButton = () => clickButton(CONFIG_MAIN.SELECTORS.COMPLETE_TECH, clickFinalVerifyButton);
    const clickCompleteMedicalVerificationButton = () => clickButton(CONFIG_MAIN.SELECTORS.COMPLETE_MED, clickFinalVerifyButton);
    const clickFinalVerifyButton = () => clickButton(CONFIG_MAIN.SELECTORS.FINAL_VERIFY);

    function checkForDisabledButtons() {
        // Proactive checks can be added here if needed
    }

    function checkUrlAndTriggerClickForUndefined() {
        if (window.location.href.endsWith('/undefined')) {
            const closeBtn = document.querySelector(`${CONFIG_MAIN.SELECTORS.TOAST.CONTAINER} ${CONFIG_MAIN.SELECTORS.TOAST.CLOSE_BTN}`);
            if (closeBtn) {
                logDebugMain("URL ends with /undefined, attempting to close toast.");
                closeBtn.click();
            }
        }
    }

    function monitorOrderedStatus() {
        if (!isCorrectPage()) return;
        const rows = document.querySelectorAll('div[role="row"]');
        let hasOrdered = false;
        rows.forEach(row => {
            if (row.offsetParent !== null) { // Check if row is visible
                const cell = row.querySelector(CONFIG_MAIN.SELECTORS.ORDERED_STATUS_CELL);
                if (cell?.textContent.includes('Ordered')) {
                    hasOrdered = true;
                }
            }
        });
        const btn = document.querySelector(CONFIG_MAIN.SELECTORS.VERIFY1_BTN);
        if (btn) {
            if (hasOrdered) {
                if (!btn.classList.contains('btn-warning')) {
                    btn.className = 'btn btn-warning verify1-btn'; btn.innerText = 'VERIFY1 (F7)'; // Class ensures ID for selector is maintained
                    btn.style.setProperty('background-color', '#fab641', 'important');
                    btn.style.setProperty('color', '#050505', 'important');
                    logDebugMain("Ordered status detected. VERIFY1 button changed to warning.");
                }
            } else {
                if (btn.classList.contains('btn-warning')) {
                    btn.className = 'btn btn-success btn-sm verify1-btn'; btn.innerText = 'VERIFY1 (F7)'; // Class ensures ID for selector is maintained
                    btn.style.setProperty('background-color', '#28a745', 'important');
                    btn.style.setProperty('color', '#ffffff', 'important');
                    logDebugMain("No ordered status. VERIFY1 button reverted to success.");
                }
            }
        }
    }
    // Debounced version of monitorOrderedStatus
    const debouncedMonitorOrderedStatus = debounce(monitorOrderedStatus, 400);


    const toastObserver = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            mutation.addedNodes.forEach(node => {
                if (node.nodeType === Node.ELEMENT_NODE) {
                    let successToast = node.matches(CONFIG_MAIN.SELECTORS.TOAST.SUCCESS) ? node : node.querySelector(CONFIG_MAIN.SELECTORS.TOAST.SUCCESS);
                    if (successToast) {
                        logDebugMain("Success toast detected.");
                        successToast.addEventListener('click', () => {
                            if ((verify1Clicked && verify1Toggle) || (verify2Clicked && verify2Toggle)) {
                                logDebugMain("Navigating back due to toast click and toggle state.");
                                window.history.back();
                            }
                            verify1Clicked = false; verify2Clicked = false;
                        }, { once: true });
                    }
                }
            });
        });
    });
    toastObserver.observe(document.body, { childList: true, subtree: true });

    document.addEventListener('keydown', e => {
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.tagName === 'SELECT') return;
        if (e.key === 'F7') { e.preventDefault(); document.querySelector(CONFIG_MAIN.SELECTORS.VERIFY1_BTN)?.click(); }
        else if (e.key === 'F8') { e.preventDefault(); document.querySelector(CONFIG_MAIN.SELECTORS.VERIFY2_BTN)?.click(); }
    });

    // --- Integrated Alerts Scanner Code ---
    if (typeof XLSX === 'undefined') {
        console.warn("[Alerts Scanner] SheetJS library (XLSX) not found. Local XLSX saving will not work.");
    }

    const CONFIG_ALERTS = {
        SCAN_INTERVAL: 500,
        FLASH_COLOR: "pink",
        FLASH_INTERVAL: 700,
        RESULT_CELL_SELECTOR: 'div[role="gridcell"][col-id="TestResult"] app-result-value-render div',
        UOM_CELL_SELECTOR: 'div[col-id="UomValue"]',
        CRITICAL_FLAG_SELECTOR: 'div[role="gridcell"][col-id="LTFlag"] app-ref-high-low div span.critial-alret-indication',
        TEST_DESC_PINNED_SELECTOR: '.ag-pinned-left-cols-container .ag-row div[col-id="TestDesc"]',
        NO_RESULT_MESSAGE: "NO-RESULT DETECTED!",
        DILUTION_MESSAGE: "DILUTION REQUIRED!",
        PATIENT_NAME_SELECTOR: 'div.patient-name-full',
        PATIENT_MRN_SELECTOR: 'div.mid.renal-demography span',
        PATIENT_LOCATION_SELECTOR: 'div.patient-info span[title]',
        USER_NAME_SELECTOR: 'div.profile-wrapper span.csi-dropdown-btn-text',
        SAMPLE_BARCODE_SELECTOR: '#barcode-display-box > div:nth-of-type(2)',
        LOCAL_SERVER_SAVE_URL: 'http://localhost:5000/save-alerts',
        CRITICAL_BACKGROUND_COLORS: [
            'rgb(255, 0, 0)', 'red', '#ff0000',
            'rgb(220, 53, 69)',
            'rgb(217, 83, 79)'
        ]
    };

    let isScanningActive = false;
    let issueScanIntervalId = null;

    const createModalButton = (text, styleType = 'primary') => {
        const button = document.createElement('button');
        button.textContent = text;
        Object.assign(button.style, {
            padding: '12px 24px', borderRadius: '8px', fontWeight: '600', fontSize: '15px',
            border: 'none', cursor: 'pointer',
            transition: 'background-color 0.2s ease, box-shadow 0.2s ease, transform 0.1s ease',
            marginLeft: '8px'
        });
        if (styleType === 'primary') {
            button.style.backgroundColor = '#007bff'; button.style.color = 'white';
            button.onmouseover = () => button.style.backgroundColor = '#0069d9';
            button.onmouseout = () => button.style.backgroundColor = '#007bff';
        } else if (styleType === 'success') {
            button.style.backgroundColor = '#28a745'; button.style.color = 'white';
            button.onmouseover = () => button.style.backgroundColor = '#218838';
            button.onmouseout = () => button.style.backgroundColor = '#28a745';
        } else {
            button.style.backgroundColor = '#6c757d'; button.style.color = 'white';
            button.onmouseover = () => button.style.backgroundColor = '#5a6268';
            button.onmouseout = () => button.style.backgroundColor = '#6c757d';
        }
        button.onmousedown = () => button.style.transform = 'scale(0.98)';
        button.onmouseup = () => button.style.transform = 'scale(1)';
        return button;
    };

    const createFormGroup = (label, inputId, placeholder, type = 'text') => {
        const formGroup = document.createElement('div');
        const formLabel = document.createElement('label');
        formLabel.textContent = label; formLabel.htmlFor = inputId;
        Object.assign(formLabel.style, { display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '6px', color: '#495057' });
        formGroup.appendChild(formLabel);
        const formInput = document.createElement('input');
        formInput.type = type; formInput.id = inputId; formInput.placeholder = placeholder;
        Object.assign(formInput.style, {
            width: '100%', padding: '12px', border: '1px solid #ced4da', borderRadius: '6px',
            fontSize: '14px', boxSizing: 'border-box',
            transition: 'border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out'
        });
        formInput.onfocus = () => { formInput.style.borderColor = '#80bdff'; formInput.style.boxShadow = '0 0 0 0.2rem rgba(0,123,255,.25)'; };
        formInput.onblur = () => { formInput.style.borderColor = '#ced4da'; formInput.style.boxShadow = 'none'; };
        formGroup.appendChild(formInput);
        return formGroup;
    };

    function applyFlashingEffect(row) {
        if (!row || row.dataset.flashing === 'true') return;
        row.dataset.flashing = 'true';
        const originalBg = row.style.backgroundColor || 'transparent';
        row.dataset.originalBg = originalBg;
        row.style.transition = "background-color 0.5s ease";
        let isPink = false;
        const intervalId = setInterval(() => {
            if (!document.body.contains(row) || row.dataset.flashing === 'false') {
                clearInterval(intervalId);
                row.style.transition = '';
                row.style.setProperty("background-color", row.dataset.originalBg || 'transparent', "important");
                delete row.dataset.flashing;
                delete row.dataset.originalBg;
                delete row.dataset.flashIntervalId;
                return;
            }
            isPink = !isPink;
            row.style.setProperty("background-color", isPink ? CONFIG_ALERTS.FLASH_COLOR : originalBg, "important");
        }, CONFIG_ALERTS.FLASH_INTERVAL);
        row.dataset.flashIntervalId = intervalId.toString();
    }

    function stopFlashingEffect(row) {
        if (row && row.dataset.flashing === 'true') {
            row.dataset.flashing = 'false';
            const intervalId = parseInt(row.dataset.flashIntervalId, 10);
            if (!isNaN(intervalId)) {
                clearInterval(intervalId);
            }
        }
    }

    function getNotificationSessionKey(type, identifier = 'general') {
        const safeIdentifier = String(identifier).replace(/[^a-zA-Z0-9_-]/g, '');
        return `labAlertNotified_${window.location.pathname}${window.location.hash}_${type}_${safeIdentifier}`;
    }

    function hasAlreadyNotified(type, identifier = 'general') {
        const key = getNotificationSessionKey(type, identifier);
        return sessionStorage.getItem(key) === 'true';
    }

    function setNotificationFlag(type, identifier = 'general') {
        const key = getNotificationSessionKey(type, identifier);
        logAlertDebug(`Setting notification flag for key: "${key}"`);
        sessionStorage.setItem(key, 'true');
    }

    function getNextEntryID() {
        const counterKey = 'labAlertEntryCounter';
        let currentID = parseInt(localStorage.getItem(counterKey), 10) || 0;
        currentID++;
        localStorage.setItem(counterKey, String(currentID));
        logAlertDebug(`Next Entry ID: ${currentID}`);
        return currentID;
    }

    async function sendAlertDataToServer(alertData) {
        logAlertDebug("Attempting to send data to local server.");
        if (!CONFIG_ALERTS.LOCAL_SERVER_SAVE_URL) {
            logAlertError("LOCAL_SERVER_SAVE_URL is not configured.");
            return false;
        }

        const isFromAutoAlertModal = document.getElementById('custom-alert-modal-overlay') && !document.getElementById('report-selection-modal-overlay');
        const isFromManualReportModal = document.getElementById('report-selection-modal-overlay');

        let notifiedPersonName, notifiedPersonTelExt, readBack, reportingUserId;

        if (isFromAutoAlertModal) {
            logAlertDebug("sendAlertDataToServer: Data sourced from Auto Alert Modal fields.");
            const notifiedPersonNameInput = document.getElementById('notifiedPersonNameInput');
            const notifiedPersonTelExtInput = document.getElementById('notifiedPersonTelExtInput');
            const readBackCheckbox = document.getElementById('readBackCheckbox');
            const userIdInput = document.getElementById('userIdInput');

            notifiedPersonName = notifiedPersonNameInput ? notifiedPersonNameInput.value : '';
            notifiedPersonTelExt = notifiedPersonTelExtInput ? notifiedPersonTelExtInput.value : '';
            readBack = readBackCheckbox ? readBackCheckbox.checked : false;
            reportingUserId = userIdInput ? userIdInput.value : (alertData.userId || 'N/A');
        } else if (isFromManualReportModal) {
            logAlertDebug("sendAlertDataToServer: Data sourced from Manual Report Modal payload fields.");
            notifiedPersonName = alertData.notifiedPersonName || '';
            notifiedPersonTelExt = alertData.notifiedPersonTelExt || '';
            readBack = alertData.readBack || false;
            reportingUserId = alertData.userName || 'N/A';
        } else {
            logAlertError("sendAlertDataToServer: Unknown modal source. Using direct alertData fields if available.");
            notifiedPersonName = alertData.notifiedPersonName || '';
            notifiedPersonTelExt = alertData.notifiedPersonTelExt || '';
            readBack = alertData.readBack || false;
            reportingUserId = alertData.userName || alertData.userId || 'N/A';
        }


        const now = new Date();
        const date = `${String(now.getDate()).padStart(2, '0')}/${String(now.getMonth() + 1).padStart(2, '0')}/${now.getFullYear()}`;
        const hours = now.getHours();
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const ampm = hours >= 12 ? 'pm' : 'am';
        const formattedHours = hours % 12 || 12;
        const time = `${formattedHours}:${minutes} ${ampm}`;
        const entryID = alertData.entryID || getNextEntryID();

        const dataToSend = {
            entryID: entryID,
            date: date,
            time: time,
            patientName: alertData.patientName || 'N/A',
            patientMRN: alertData.patientMRN || alertData.patientId || 'N/A',
            patientLocation: alertData.patientLocation || 'N/A',
            sampleBarcode: alertData.sampleBarcode || 'N/A',
            userName: reportingUserId,
            notifiedPersonName: notifiedPersonName,
            notifiedPersonTelExt: notifiedPersonTelExt,
            readBack: readBack,
            alerts: alertData.alerts ? alertData.alerts.map(alert => ({
                testName: alert.testName,
                result: alert.result,
                uom: alert.uom || '',
                flag: alert.flag,
                type: alert.type,
                comment: alert.comment || ''
            })) : (alertData.alertsToList ? alertData.alertsToList.map(alert => ({
                testName: alert.testName,
                result: alert.result,
                uom: alert.uom || '',
                flag: alert.flag,
                type: alert.type,
                comment: alert.comment || ''
            })) : [])
        };
        logAlertDebug("Data prepared for server:", JSON.stringify(dataToSend, null, 2));


        try {
            const response = await fetch(CONFIG_ALERTS.LOCAL_SERVER_SAVE_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dataToSend)
            });
            if (response.ok) {
                logAlertDebug("Data successfully sent to local server.");
                return true;
            } else {
                const errorText = await response.text();
                logAlertError(`Failed to send data to local server: ${response.status} ${response.statusText} - ${errorText}`);
                return false;
            }
        } catch (error) {
            logAlertError("Error sending data to local server:", error);
            return false;
        }
    }


    function closeAlertModalAction() {
        logAlertDebug("closeAlertModalAction triggered.");
        const overlay = document.getElementById('custom-alert-modal-overlay');
        if (overlay) {
            const modalContent = overlay.querySelector('#custom-alert-modal-content');
            if (modalContent && modalContent.dataset.alerts) {
                try {
                    const alertsToMark = JSON.parse(modalContent.dataset.alerts);
                    alertsToMark.forEach(alert => {
                        if (alert.type && alert.rowId) {
                            const parts = alert.rowId.split('_');
                            const type = parts[0];
                            const baseIdentifier = parts.slice(1).join('_');
                            setNotificationFlag(type, baseIdentifier);
                            logAlertDebug(`Marked alert as notified: Type=${type}, Identifier=${baseIdentifier} (from full key ${alert.rowId})`);
                        }
                    });
                } catch (e) {
                    console.error("Error parsing alerts data from modal dataset:", e);
                }
            }
            overlay.style.opacity = '0';
            if (modalContent) {
                modalContent.style.opacity = '0';
                modalContent.style.transform = 'translateY(-30px) scale(0.95)';
            }
            overlay.addEventListener('transitionend', () => {
                if (overlay.parentNode) {
                    overlay.parentNode.removeChild(overlay);
                }
                isAlertModalOpen = false;
                document.body.style.overflow = '';
                logAlertDebug("Alert modal overlay removed, isAlertModalOpen = false");
            }, { once: true });
            setTimeout(() => {
                if (overlay && overlay.parentNode) {
                    overlay.parentNode.removeChild(overlay);
                }
                if (isAlertModalOpen) {
                    isAlertModalOpen = false;
                    document.body.style.overflow = '';
                    logAlertDebug("Alert modal overlay removed by fallback, isAlertModalOpen = false");
                }
            }, 400);
        } else {
            isAlertModalOpen = false;
            document.body.style.overflow = '';
            logAlertDebug("closeAlertModalAction called but overlay not found, isAlertModalOpen = false");
        }
    }

    function createCustomAlert(alertData, alertsDisplayedInModal) {
        logAlertDebug(`Attempting to create alert modal. isAlertModalOpen: ${isAlertModalOpen}, Existing overlay: ${document.getElementById('custom-alert-modal-overlay')}`);
        if (document.getElementById('custom-alert-modal-overlay') || isAlertModalOpen) {
            logAlertDebug("Alert modal already open or overlay element exists. Aborting creation.");
            return;
        }
        isAlertModalOpen = true;
        logDebugMain("Alert modal creation initiated. isAlertModalOpen set to true.");

        const overlay = document.createElement('div');
        overlay.id = 'custom-alert-modal-overlay';
        Object.assign(overlay.style, {
            position: 'fixed', top: '0', left: '0', width: '100%', height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.65)', zIndex: '10001', display: 'flex',
            justifyContent: 'center', alignItems: 'center', opacity: '0',
            transition: 'opacity 0.3s ease-out', padding: '20px'
        });
        document.body.style.overflow = 'hidden';

        const modalBox = document.createElement('div');
        modalBox.id = 'custom-alert-modal-content';
        Object.assign(modalBox.style, {
            backgroundColor: '#ffffff', borderRadius: '12px',
            boxShadow: '0 16px 32px rgba(0, 0, 0, 0.1), 0 8px 16px rgba(0, 0, 0, 0.08)',
            width: 'calc(100% - 40px)', maxWidth: '1100px', maxHeight: '90vh',
            overflowY: 'auto', padding: '32px', position: 'relative',
            opacity: '0', transform: 'translateY(-20px) scale(0.98)',
            transition: 'opacity 0.3s ease-out, transform 0.3s ease-out',
            fontFamily: "'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif",
            color: '#343a40', display: 'flex', flexDirection: 'column', gap: '16px'
        });

        const closeButtonX = document.createElement('button');
        closeButtonX.innerHTML = '&times;';
        Object.assign(closeButtonX.style, {
            position: 'absolute', top: '18px', right: '18px', fontSize: '30px',
            lineHeight: '1', cursor: 'pointer', color: '#adb5bd', background: 'transparent',
            border: 'none', padding: '0', width: '30px', height: '30px',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
        });
        closeButtonX.onmouseover = () => closeButtonX.style.color = '#495057';
        closeButtonX.onmouseout = () => closeButtonX.style.color = '#adb5bd';
        closeButtonX.onclick = closeAlertModalAction;
        modalBox.appendChild(closeButtonX);

        const headerDiv = document.createElement('div');
        Object.assign(headerDiv.style, {
            display: 'flex', alignItems: 'center', gap: '12px',
            paddingBottom: '18px', borderBottom: '1px solid #dee2e6', marginBottom: '16px'
        });
        const alertIcon = document.createElement('i');
        alertIcon.className = 'fas fa-exclamation-triangle';
        let iconColor = '#17a2b8';
        let alertTitleText = 'Lab Alert Detected';

        if (alertData.overallSeverity === 'critical') {
            alertTitleText = 'Critical Lab Alert!'; iconColor = '#d9534f';
        } else if (alertData.overallSeverity === 'noresult') {
            alertTitleText = 'No Result Detected'; iconColor = '#ffc107';
        } else if (alertData.overallSeverity === 'greaterThan') {
            alertTitleText = 'Dilution Required'; iconColor = '#ffc107';
        }

        alertIcon.style.fontSize = '26px';
        alertIcon.style.color = iconColor;
        headerDiv.appendChild(alertIcon);
        const title = document.createElement('h2');
        title.textContent = alertTitleText;
        Object.assign(title.style, { fontSize: '26px', fontWeight: '600', color: iconColor, margin: '0' });
        headerDiv.appendChild(title);
        const dateTime = document.createElement('p');
        dateTime.id = 'currentDateTime';
        dateTime.textContent = new Date().toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' });
        Object.assign(dateTime.style, { fontSize: '14px', color: '#6c757d', margin: '0', marginLeft: 'auto' });
        headerDiv.appendChild(dateTime);
        modalBox.appendChild(headerDiv);

        const createInfoItem = (label, value, iconClass) => {
            if (!value) value = 'N/A';
            const itemDiv = document.createElement('div');
            Object.assign(itemDiv.style, {
                backgroundColor: '#f8f9fa', borderRadius: '8px', padding: '16px',
                border: '1px solid #e9ecef', boxShadow: '0 3px 6px rgba(0,0,0,0.06)',
                display: 'flex', flexDirection: 'column', gap: '10px'
            });
            const header = document.createElement('div');
            Object.assign(header.style, { display: 'flex', alignItems: 'center', gap: '12px', color: '#495057' });
            if (iconClass) {
                const iconElem = document.createElement('i');
                iconElem.className = `fas ${iconClass}`;
                Object.assign(iconElem.style, { fontSize: '1.4em', color: '#007bff' });
                header.appendChild(iconElem);
            }
            const labelElem = document.createElement('strong');
            labelElem.textContent = `${label}:`;
            labelElem.style.fontSize = '15px'; labelElem.style.fontWeight = '600';
            header.appendChild(labelElem);
            itemDiv.appendChild(header);
            const valueElem = document.createElement('span');
            valueElem.textContent = value;
            Object.assign(valueElem.style, {
                fontSize: '16px', color: '#212529', wordBreak: 'break-word',
                paddingLeft: iconClass ? '32px' : '0'
            });
            itemDiv.appendChild(valueElem);
            return itemDiv;
        };

        const allPatientInfoContainer = document.createElement('div');
        Object.assign(allPatientInfoContainer.style, {
            display: 'flex', flexDirection: 'column', gap: '18px',
            paddingBottom: '18px', borderBottom: '1px solid #dee2e6', marginBottom: '16px'
        });
        const pNameItem = createInfoItem('Patient Name', alertData.patientName, 'fa-user');
        if (pNameItem) allPatientInfoContainer.appendChild(pNameItem);
        const otherPatientInfoRow = document.createElement('div');
        Object.assign(otherPatientInfoRow.style, {
            display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '18px',
        });
        const pIdElem = createInfoItem('MRN', alertData.patientId, 'fa-id-card');
        if (pIdElem) otherPatientInfoRow.appendChild(pIdElem);
        const pLocElem = createInfoItem('Location', alertData.patientLocation, 'fa-hospital-alt');
        if (pLocElem) otherPatientInfoRow.appendChild(pLocElem);
        const pBarcodeElem = createInfoItem('Sample Barcode', alertData.sampleBarcode, 'fa-barcode');
        if (pBarcodeElem) otherPatientInfoRow.appendChild(pBarcodeElem);
        if (otherPatientInfoRow.hasChildNodes()) allPatientInfoContainer.appendChild(otherPatientInfoRow);
        if (allPatientInfoContainer.hasChildNodes()) modalBox.appendChild(allPatientInfoContainer);


        if (alertData.alertsToList && alertData.alertsToList.length > 0) {
            const alertsListTitle = document.createElement('h3');
            alertsListTitle.textContent = 'Alert Details:';
            Object.assign(alertsListTitle.style, { fontSize: '19px', fontWeight: '600', color: '#343a40', margin: '0 0 12px 0' });
            modalBox.appendChild(alertsListTitle);
            const alertsContainer = document.createElement('div');
            Object.assign(alertsContainer.style, {
                display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: '18px', padding: '5px 0'
            });
            alertData.alertsToList.forEach(alert => {
                const alertCard = document.createElement('div');
                let borderColorCard = '#6c757d', bgColorCard = '#f8f9fa';
                if (alert.type === 'critical') {
                    borderColorCard = alert.flag === 'CL' ? '#007bff' : (alert.flag === 'CH' ? '#dc3545' : '#d9534f');
                    bgColorCard = alert.flag === 'CL' ? '#e7f3ff' : (alert.flag === 'CH' ? '#f8d7da' : '#fdf7f7');
                } else if (alert.type === 'greaterThan') {
                    borderColorCard = '#ffc107'; bgColorCard = '#fff9e6';
                } else if (alert.type === 'noresult') {
                    borderColorCard = '#6c757d'; bgColorCard = '#f8f9fa';
                }
                Object.assign(alertCard.style, {
                    borderLeft: `6px solid ${borderColorCard}`, padding: '18px', borderRadius: '10px',
                    backgroundColor: bgColorCard, color: '#343a40', boxShadow: '0 5px 10px rgba(0,0,0,0.08)',
                    display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: '130px'
                });
                const testNameElem = document.createElement('p');
                testNameElem.innerHTML = `<strong style="font-size: 17px; color: #212529;">${alert.testName}</strong>`;
                testNameElem.style.margin = '0 0 10px 0';
                alertCard.appendChild(testNameElem);
                const resultElem = document.createElement('p');
                resultElem.textContent = `Result: ${alert.result || 'N/A'}${alert.uom ? ` ${alert.uom}` : ''}`;
                resultElem.style.margin = '0 0 10px 0'; resultElem.style.fontSize = '15px';
                alertCard.appendChild(resultElem);
                if (alert.flag) {
                    const flagElem = document.createElement('p');
                    let flagDescription = `Flag: ${alert.flag}`;
                    if (alert.flag === 'CL') flagDescription = 'Flag: CL (Critical Low)';
                    else if (alert.flag === 'CH') flagDescription = 'Flag: CH (Critical High)';
                    else if (alert.flag === 'BG_CRITICAL') flagDescription = 'Flag: Critical (Red Background)';
                    flagElem.textContent = flagDescription;
                    Object.assign(flagElem.style, { margin: '0', fontSize: '15px', fontWeight: '600', color: borderColorCard });
                    alertCard.appendChild(flagElem);
                }
                if (alert.comment) {
                    const commentElem = document.createElement('p');
                    commentElem.textContent = alert.comment;
                    Object.assign(commentElem.style, {
                        fontSize: '13px', fontStyle: 'italic', color: '#555',
                        marginTop: '8px', paddingTop: '8px', borderTop: '1px dashed #ccc'
                    });
                    alertCard.appendChild(commentElem);
                }
                alertsContainer.appendChild(alertCard);
            });
            modalBox.appendChild(alertsContainer);
        } else if (alertData.primaryMessage) {
            const primaryMessageElem = document.createElement('p');
            primaryMessageElem.textContent = alertData.primaryMessage;
            Object.assign(primaryMessageElem.style, { fontSize: '16px', fontWeight: '500', margin: '12px 0', color: '#555' });
            modalBox.appendChild(primaryMessageElem);
        }

        if (alertData.overallSeverity === 'critical') {
            const notifiedDetailsDiv = document.createElement('div');
            Object.assign(notifiedDetailsDiv.style, { marginTop: '24px', paddingTop: '20px', borderTop: '1px solid #dee2e6' });
            const h3 = document.createElement('h3');
            h3.textContent = 'Notification Details (Critical)';
            Object.assign(h3.style, { fontSize: '17px', fontWeight: '600', marginBottom: '16px', color: '#343a40' });
            notifiedDetailsDiv.appendChild(h3);
            const formGrid = document.createElement('div');
            Object.assign(formGrid.style, { display: 'grid', gridTemplateColumns: '1fr', gap: '14px' });

            const userIdGroup = createFormGroup('User ID', 'userIdInput', 'Enter your User ID');
            formGrid.appendChild(userIdGroup);
            const userIdInputElem = userIdGroup.querySelector('#userIdInput');
            if (userIdInputElem && alertData.userId && alertData.userId !== 'N/A') userIdInputElem.value = alertData.userId;

            formGrid.appendChild(createFormGroup('Notified Person Name', 'notifiedPersonNameInput', 'Name of person notified'));
            formGrid.appendChild(createFormGroup('Extension / Contact', 'notifiedPersonTelExtInput', 'Phone or extension'));

            const readBackGroup = document.createElement('div');
            Object.assign(readBackGroup.style, { display: 'flex', alignItems: 'center', marginTop: '10px' });
            const readBackCheckbox = document.createElement('input');
            readBackCheckbox.type = 'checkbox'; readBackCheckbox.id = 'readBackCheckbox';
            Object.assign(readBackCheckbox.style, { marginRight: '10px', height: '18px', width: '18px', cursor: 'pointer', accentColor: '#007bff' });
            const readBackLabel = document.createElement('label');
            readBackLabel.textContent = 'Read-Back Confirmed'; readBackLabel.htmlFor = 'readBackCheckbox';
            Object.assign(readBackLabel.style, { fontSize: '14px', fontWeight: '500', color: '#495057', cursor: 'pointer' });
            readBackGroup.appendChild(readBackCheckbox); readBackGroup.appendChild(readBackLabel);
            formGrid.appendChild(readBackGroup);
            notifiedDetailsDiv.appendChild(formGrid);
            modalBox.appendChild(notifiedDetailsDiv);
        }

        const buttonContainer = document.createElement('div');
        Object.assign(buttonContainer.style, {
            display: 'flex', justifyContent: 'flex-end', paddingTop: '24px',
            marginTop: 'auto',
            gap: '12px', borderTop: '1px solid #dee2e6'
        });

        if (alertData.overallSeverity === 'critical') {
            const sendErrorMsg = document.createElement('p');
            sendErrorMsg.id = 'autoAlertSendErrorMsg';
            Object.assign(sendErrorMsg.style, {
                color: 'red', fontSize: '13px', margin: '0 auto 0 0',
                flexGrow: 1, alignSelf: 'center'
            });
            buttonContainer.appendChild(sendErrorMsg);

            const submitReportButton = createModalButton('Submit Report', 'success');
            submitReportButton.onclick = async () => {
                logAlertDebug("Submit Report button clicked for auto-alert modal.");
                sendErrorMsg.textContent = '';
                const success = await sendAlertDataToServer(alertData);
                if (success) {
                    logAlertDebug("Auto-alert data sent successfully. Closing modal.");
                    closeAlertModalAction();
                } else {
                    logAlertDebug("Auto-alert data send failed. Modal remains open.");
                    sendErrorMsg.textContent = 'Failed to save. Check server or try again.';
                }
            };
            buttonContainer.appendChild(submitReportButton);

            const cancelButton = createModalButton('Cancel', 'secondary');
            cancelButton.onclick = closeAlertModalAction;
            buttonContainer.appendChild(cancelButton);

        } else {
            const okButton = createModalButton('OK', 'primary');
            okButton.onclick = closeAlertModalAction;
            buttonContainer.appendChild(okButton);
        }
        modalBox.appendChild(buttonContainer);
        modalBox.dataset.alerts = JSON.stringify(alertsDisplayedInModal.map(a => ({ type: a.type, rowId: a.rowId })));


        overlay.appendChild(modalBox);
        document.body.appendChild(overlay);

        setTimeout(() => {
            overlay.style.opacity = '1';
            modalBox.style.opacity = '1';
            modalBox.style.transform = 'translateY(0) scale(1)';
            logAlertDebug("Alert modal fade-in and animation triggered.");
        }, 10);

        overlay.addEventListener('click', (event) => {
            if (event.target === overlay) closeAlertModalAction();
        });
        const escapeKeyListener = (event) => {
            if (event.key === 'Escape' && document.body.contains(overlay)) {
                closeAlertModalAction();
                document.removeEventListener('keydown', escapeKeyListener);
            }
        };
        document.addEventListener('keydown', escapeKeyListener);
    }

    async function getPatientDataWithRetry(selectors, maxWaitTime = 2500, checkInterval = 100) {
        logAlertDebug(`getPatientDataWithRetry CALLED. Max wait: ${maxWaitTime}ms. Selectors: ${JSON.stringify(selectors)}`);
        const startTime = performance.now();
        let elapsedTime = 0;
        let patientData = { patientName: 'N/A', patientId: 'N/A', patientLocation: 'N/A', sampleBarcode: 'N/A' };
        let attempt = 0;

        while (elapsedTime < maxWaitTime) {
            attempt++;
            const nameEl = document.querySelector(selectors.name);
            const barcodeEl = document.querySelector(selectors.barcode);

            logAlertDebug(`[Attempt ${attempt}] Name Element (${selectors.name}): ${nameEl ? 'Found' : 'NOT Found'}`);
            if (nameEl) {
                patientData.patientName = nameEl.textContent.trim().replace(/\s+/g, ' ') || 'N/A (empty)';
            } else {
                patientData.patientName = 'N/A (selector failed)';
            }

            let mrnValue = 'N/A (MRN not found)';
            let mrnFoundByNewLogic = false;
            const potentialMrnContainers = document.querySelectorAll('div.mid');
            potentialMrnContainers.forEach(container => {
                if (mrnFoundByNewLogic) return;
                const h6Elements = container.querySelectorAll('h6');
                h6Elements.forEach(h6 => {
                    if (mrnFoundByNewLogic) return;
                    const h6Text = h6.textContent.trim().toUpperCase();
                    if (h6Text.includes('C.MRN') || h6Text.includes('H.MRN')) {
                        const mrnSpanElement = container.querySelector('span');
                        if (mrnSpanElement && mrnSpanElement.textContent.trim()) {
                            const currentMrn = mrnSpanElement.textContent.trim();
                            if (h6Text.includes('C.MRN')) {
                                mrnValue = currentMrn; mrnFoundByNewLogic = true;
                            } else if (h6Text.includes('H.MRN') && mrnValue === 'N/A (MRN not found)') {
                                mrnValue = currentMrn; mrnFoundByNewLogic = true;
                            }
                        }
                    }
                });
            });
            if (!mrnFoundByNewLogic) {
                const mrnElOriginal = document.querySelector(selectors.mrn);
                if (mrnElOriginal && mrnElOriginal.textContent.trim()) {
                    mrnValue = mrnElOriginal.textContent.trim();
                } else {
                    mrnValue = mrnElOriginal ? 'N/A (original empty)' : 'N/A (original selector failed)';
                }
            }
            patientData.patientId = mrnValue;


            let locElement = document.querySelector('div.patient-info span[title*="UNIT/"]');
            if (!locElement) {
                locElement = document.querySelector(selectors.location);
            }

            if (locElement) {
                const titleAttr = locElement.getAttribute('title');
                if (titleAttr && titleAttr.includes('UNIT/') && titleAttr.trim() !== '') {
                    patientData.patientLocation = titleAttr.trim().replace(/\s+/g, ' ');
                } else if (titleAttr && titleAttr.trim() !== '') {
                    patientData.patientLocation = titleAttr.trim().replace(/\s+/g, ' ');
                } else {
                    const clone = locElement.cloneNode(true);
                    const h6InLoc = clone.querySelector('h6');
                    if (h6InLoc) h6InLoc.remove();
                    let cleanedText = clone.textContent.trim().replace(/\s+/g, ' ');
                    cleanedText = cleanedText.replace(/^Bed\s*/i, '').trim();
                    patientData.patientLocation = cleanedText || 'N/A';
                }
                 if (patientData.patientLocation === '') patientData.patientLocation = 'N/A (empty string after processing)';
            } else {
                patientData.patientLocation = 'N/A (selector failed)';
            }


            if (barcodeEl) {
                patientData.sampleBarcode = barcodeEl.textContent.trim() || 'N/A (empty)';
            } else {
                patientData.sampleBarcode = 'N/A (selector failed)';
            }
            if (patientData.sampleBarcode === '') patientData.sampleBarcode = 'N/A (empty string)';


            const essentialPopulated = !patientData.patientName.startsWith('N/A') &&
                                       !patientData.patientId.startsWith('N/A') &&
                                       !patientData.patientLocation.startsWith('N/A');

            if (essentialPopulated) break;

            await new Promise(resolve => setTimeout(resolve, checkInterval));
            elapsedTime += checkInterval;
        }

        const allEssentialDataRetrieved = !patientData.patientName.startsWith('N/A') &&
                                          !patientData.patientId.startsWith('N/A') &&
                                          !patientData.patientLocation.startsWith('N/A');

        if (!allEssentialDataRetrieved) {
            logAlertError(`Essential patient data content NOT FULLY RETRIEVED after ${maxWaitTime}ms. Final state: ${JSON.stringify(patientData)}`);
        }

        const endTime = performance.now();
        logAlertDebug(`getPatientDataWithRetry finished in ${(endTime - startTime).toFixed(2)}ms. All essential: ${allEssentialDataRetrieved}. Final Data: ${JSON.stringify(patientData)}`);
        return { data: patientData, allEssentialDataRetrieved: allEssentialDataRetrieved };
    }


    async function checkForIssues() {
        const totalCheckStartTime = performance.now();
        logAlertDebug("checkForIssues started.");
        if (!isScanningActive || isAlertModalOpen || isReportModalOpen) {
            logAlertDebug(`checkForIssues aborted. isScanningActive: ${isScanningActive}, isAlertModalOpen: ${isAlertModalOpen}, isReportModalOpen: ${isReportModalOpen}`);
            return false;
        }

        const patientDataSelectors = {
            name: CONFIG_ALERTS.PATIENT_NAME_SELECTOR,
            mrn: CONFIG_ALERTS.PATIENT_MRN_SELECTOR,
            location: CONFIG_ALERTS.PATIENT_LOCATION_SELECTOR,
            barcode: CONFIG_ALERTS.SAMPLE_BARCODE_SELECTOR
        };
        const patientDataResult = await getPatientDataWithRetry(patientDataSelectors);
        const patientDataSource = patientDataResult.data;
        const allEssentialPatientDataAvailable = patientDataResult.allEssentialDataRetrieved;

        const patientName = patientDataSource.patientName;
        const patientId = patientDataSource.patientId;
        const patientLocation = patientDataSource.patientLocation;
        const sampleBarcode = patientDataSource.sampleBarcode;
        const userIdElement = document.querySelector(CONFIG_ALERTS.USER_NAME_SELECTOR);
        const currentUserId = userIdElement ? userIdElement.textContent.trim() : 'N/A';

        const centerRows = document.querySelectorAll('.ag-center-cols-container .ag-row');
        const pinnedRows = document.querySelectorAll('.ag-pinned-left-cols-container .ag-row');
        const potentialAlertsForAutoModal = [];

        centerRows.forEach((centerRow, index) => {
            const pinnedRow = pinnedRows[index];
            if (!centerRow || !pinnedRow || centerRow.offsetParent === null) return;

            const testDescElement = pinnedRow.querySelector('div[col-id="TestDesc"]');
            const testDesc = testDescElement?.textContent?.trim() || 'Unknown Test';
            const resultDiv = centerRow.querySelector(CONFIG_ALERTS.RESULT_CELL_SELECTOR);
            const flagSpan = centerRow.querySelector(CONFIG_ALERTS.CRITICAL_FLAG_SELECTOR);
            const uomCell = centerRow.querySelector(CONFIG_ALERTS.UOM_CELL_SELECTOR);
            const baseRowIdentifier = centerRow.getAttribute('row-id') || centerRow.getAttribute('row-index') || `scan_row_${index}`;
            const resultText = resultDiv?.textContent?.trim() || '';
            const uomText = uomCell?.textContent?.trim() || '';
            const normalizedResultText = resultText.toLowerCase().replace(/[- ]/g, '');
            const flagTextByIndicator = flagSpan?.textContent?.trim()?.toUpperCase() || '';

            let isCriticalByBackground = false;
            let effectiveFlagText = flagTextByIndicator;
            const resultCellElement = resultDiv ? resultDiv.closest('div[role="gridcell"][col-id="TestResult"]') : null;
            if (resultCellElement) {
                const bgColor = window.getComputedStyle(resultCellElement).backgroundColor;
                if (CONFIG_ALERTS.CRITICAL_BACKGROUND_COLORS.includes(bgColor.toLowerCase())) {
                    isCriticalByBackground = true;
                    if (!effectiveFlagText) effectiveFlagText = 'BG_CRITICAL';
                }
            }
            const isCriticalByFlag = (flagSpan && (flagTextByIndicator === "CL" || flagTextByIndicator === "CH"));
            const isCritical = isCriticalByFlag || isCriticalByBackground;

            const isNoResult = ["noresult", "noxresult", "xnoresult"].includes(normalizedResultText);
            const isDilution = resultText.includes(">");
            let alertType = null, alertMessage = "", alertComment = null;

            // --- NEW: Special check for Haemoglobin A1C (HbA1C) ---
            if (testDesc.toLowerCase().includes('haemoglobin a1c') || testDesc.toLowerCase().includes('hba1c')) {
                const resultValue = parseFloat(resultText);
                if (!isNaN(resultValue) && (resultValue < 4 || resultValue > 13)) {
                    alertType = "critical";
                    alertMessage = "High/Low HbA1c value detected!";
                    alertComment = "Please check and validate this result. Value is outside the 4-13 range.";
                }
            }
            // --- END: Special check ---

            if (isCritical && !alertType) { // Ensure we don't overwrite the new alert
                alertType = "critical";
                alertMessage = isCriticalByFlag ? `CRITICAL ${flagTextByIndicator === "CL" ? "LOW" : "HIGH"} RESULT!` : "CRITICAL RESULT (Visual Indicator)!";
            } else if (isNoResult && !alertType) {
                alertType = "noresult"; alertMessage = CONFIG_ALERTS.NO_RESULT_MESSAGE;
            } else if (isDilution && !alertType) {
                alertType = "greaterThan"; alertMessage = CONFIG_ALERTS.DILUTION_MESSAGE; alertComment = "Sample needs dilution";
            }

            if (alertType) {
                potentialAlertsForAutoModal.push({
                    rowElement: centerRow, type: alertType,
                    rowId: `${alertType}_${baseRowIdentifier}`,
                    baseIdentifier: baseRowIdentifier,
                    message: alertMessage, comment: alertComment, testName: testDesc,
                    result: resultText, uom: uomText, flag: effectiveFlagText,
                    alreadyNotified: hasAlreadyNotified(alertType, baseRowIdentifier)
                });
                applyFlashingEffect(centerRow); applyFlashingEffect(pinnedRow);
            } else {
                stopFlashingEffect(centerRow); stopFlashingEffect(pinnedRow);
            }
        });

        const newPotentialAlertsForAutoModalDisplay = potentialAlertsForAutoModal.filter(alert => !alert.alreadyNotified);

        if (newPotentialAlertsForAutoModalDisplay.length > 0 && !isAlertModalOpen && !document.getElementById('custom-alert-modal-overlay')) {
            if (!allEssentialPatientDataAvailable) {
                logAlertDebug("Potential new auto-alerts found, but essential patient data is incomplete. Deferring auto-alert modal display.");
            } else {
                const firstSignificantAlert = newPotentialAlertsForAutoModalDisplay.find(a => a.type === 'critical' || a.type === 'noresult' || a.type === 'greaterThan') ||
                                             newPotentialAlertsForAutoModalDisplay[0];
                const modalData = {
                    alertsToList: newPotentialAlertsForAutoModalDisplay.map(a => ({
                        testName: a.testName, result: a.result, uom: a.uom, flag: a.flag,
                        type: a.type, rowId: a.rowId, comment: a.comment
                    })),
                    overallSeverity: firstSignificantAlert.type,
                    primaryMessage: firstSignificantAlert.message,
                    patientName, patientId, patientLocation, sampleBarcode, userId: currentUserId
                };
                createCustomAlert(modalData, newPotentialAlertsForAutoModalDisplay);
                logAlertDebug("Auto-alerts shown for patient. Pausing scanner if configured.");
                if (window.stopAlertsScanner) window.stopAlertsScanner();
            }
        } else if (potentialAlertsForAutoModal.length === 0) {
            document.querySelectorAll('.ag-center-cols-container .ag-row[data-flashing="true"]').forEach(stopFlashingEffect);
            document.querySelectorAll('.ag-pinned-left-cols-container .ag-row[data-flashing="true"]').forEach(stopFlashingEffect);
        }

        return (newPotentialAlertsForAutoModalDisplay.length > 0 && !isAlertModalOpen && !document.getElementById('custom-alert-modal-overlay') && allEssentialPatientDataAvailable);
    }


    function collectAllTestsWithResults() {
        logDebugMain("Collecting all tests with results for reporting...");
        const collectedTests = [];
        const centerRows = document.querySelectorAll(CONFIG_MAIN.SELECTORS.ALL_TEST_ROWS_CENTER);
        const pinnedRows = document.querySelectorAll(CONFIG_MAIN.SELECTORS.ALL_TEST_ROWS_PINNED);

        centerRows.forEach((centerRow, index) => {
            const pinnedRow = pinnedRows[index];
            if (!centerRow || !pinnedRow || centerRow.offsetParent === null) return;

            const testDescElement = pinnedRow.querySelector(CONFIG_MAIN.SELECTORS.TEST_DESC_CELL);
            const testName = testDescElement?.textContent?.trim() || 'Unknown Test';

            const resultDiv = centerRow.querySelector(CONFIG_MAIN.SELECTORS.TEST_RESULT_CELL_GENERAL);
            const result = resultDiv?.textContent?.trim() || 'N/A';

            const uomCell = centerRow.querySelector(CONFIG_MAIN.SELECTORS.TEST_UOM_CELL_GENERAL);
            const uom = uomCell?.textContent?.trim() || '';

            const flagSpan = centerRow.querySelector(CONFIG_MAIN.SELECTORS.TEST_FLAG_CELL_GENERAL);
            const flag = flagSpan?.textContent?.trim()?.toUpperCase() || '';

            const rowId = centerRow.getAttribute('row-id') || centerRow.getAttribute('row-index') || `test_report_row_${index}`;

            collectedTests.push({
                id: rowId,
                testName,
                result,
                uom,
                flag,
                selected: false
            });
        });
        logDebugMain(`Collected ${collectedTests.length} tests for reporting.`);
        return collectedTests;
    }

    function createReportSelectionModal(testsToDisplay, patientData, currentUserId) {
        logDebugMain(`--- createReportSelectionModal CALLED ---. isReportModalOpen: ${isReportModalOpen}. tests: ${testsToDisplay.length}.`);
        if (document.getElementById('report-selection-modal-overlay') || isReportModalOpen) {
            logDebugMain("Report selection modal already open or overlay element exists. Aborting."); return;
        }
        isReportModalOpen = true;
        logDebugMain("Report selection modal is now being created. isReportModalOpen = true.");

        const overlay = document.createElement('div');
        overlay.id = 'report-selection-modal-overlay';
        Object.assign(overlay.style, {
            position: 'fixed', top: '0', left: '0', width: '100%', height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.65)', zIndex: '10002', display: 'flex',
            justifyContent: 'center', alignItems: 'center', opacity: '0',
            transition: 'opacity 0.3s ease-out', padding: '20px'
        });
        document.body.style.overflow = 'hidden';

        const modalBox = document.createElement('div');
        modalBox.id = 'report-selection-modal-content';
        Object.assign(modalBox.style, {
            backgroundColor: '#ffffff', borderRadius: '12px',
            boxShadow: '0 16px 32px rgba(0,0,0,0.1), 0 8px 16px rgba(0,0,0,0.08)',
            width: 'calc(100% - 40px)', maxWidth: '1000px', maxHeight: '90vh',
            overflowY: 'auto', padding: '32px', position: 'relative', opacity: '0',
            transform: 'translateY(-20px) scale(0.98)',
            transition: 'opacity 0.3s ease-out, transform 0.3s ease-out',
            fontFamily: "'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif",
            color: '#343a40', display: 'flex', flexDirection: 'column', gap: '16px'
        });

        const closeButtonX = document.createElement('button');
        closeButtonX.innerHTML = '&times;';
        Object.assign(closeButtonX.style, {
            position: 'absolute', top: '18px', right: '18px', fontSize: '30px', lineHeight: '1',
            cursor: 'pointer', color: '#adb5bd', background: 'transparent', border: 'none',
            padding: '0', width: '30px', height: '30px', display: 'flex',
            alignItems: 'center', justifyContent: 'center'
        });
        closeButtonX.onmouseover = () => closeButtonX.style.color = '#495057';
        closeButtonX.onmouseout = () => closeButtonX.style.color = '#adb5bd';
        closeButtonX.onclick = closeReportSelectionModalAction;
        modalBox.appendChild(closeButtonX);

        const headerDiv = document.createElement('div');
        Object.assign(headerDiv.style, {
            display: 'flex', alignItems: 'center', gap: '12px', paddingBottom: '18px',
            borderBottom: '1px solid #dee2e6', marginBottom: '16px'
        });
        const reportIcon = document.createElement('i');
        reportIcon.className = 'fas fa-file-signature';
        reportIcon.style.fontSize = '26px'; reportIcon.style.color = '#17a2b8';
        headerDiv.appendChild(reportIcon);
        const title = document.createElement('h2');
        title.textContent = 'Report Critical Test Results';
        Object.assign(title.style, { fontSize: '26px', fontWeight: '600', color: '#17a2b8', margin: '0' });
        headerDiv.appendChild(title);
        modalBox.appendChild(headerDiv);

        const createInfoItemLocal = (label, value, iconClass) => {
            if (!value) value = 'N/A';
            const itemDiv = document.createElement('div');
            Object.assign(itemDiv.style, {
                backgroundColor: '#f8f9fa', borderRadius: '8px', padding: '12px 16px',
                border: '1px solid #e9ecef', boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                display: 'flex', flexDirection: 'column', gap: '8px'
            });
            const header = document.createElement('div');
            Object.assign(header.style, { display: 'flex', alignItems: 'center', gap: '10px', color: '#495057' });
            if (iconClass) {
                const iconElem = document.createElement('i');
                iconElem.className = `fas ${iconClass}`;
                Object.assign(iconElem.style, { fontSize: '1.2em', color: '#007bff', width: '20px', textAlign: 'center' });
                header.appendChild(iconElem);
            }
            const labelElem = document.createElement('strong');
            labelElem.textContent = `${label}:`;
            labelElem.style.fontSize = '14px'; labelElem.style.fontWeight = '600';
            header.appendChild(labelElem);
            itemDiv.appendChild(header);
            const valueElem = document.createElement('span');
            valueElem.textContent = value;
            Object.assign(valueElem.style, {
                fontSize: '15px', color: '#212529', wordBreak: 'break-word',
                paddingLeft: iconClass ? '30px' : '0'
            });
            itemDiv.appendChild(valueElem);
            return itemDiv;
        };

        const pDataForModal = patientData || {};
        const patientInfoContainer = document.createElement('div');
        Object.assign(patientInfoContainer.style, {
            display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '12px', paddingBottom: '18px', borderBottom: '1px solid #dee2e6', marginBottom: '16px'
        });
        patientInfoContainer.appendChild(createInfoItemLocal('Patient Name', pDataForModal.patientName, 'fa-user'));
        patientInfoContainer.appendChild(createInfoItemLocal('MRN', pDataForModal.patientId, 'fa-id-card'));
        patientInfoContainer.appendChild(createInfoItemLocal('Location', pDataForModal.patientLocation, 'fa-hospital-alt'));
        patientInfoContainer.appendChild(createInfoItemLocal('Sample Barcode', pDataForModal.sampleBarcode, 'fa-barcode'));
        modalBox.appendChild(patientInfoContainer);


        const testsListTitle = document.createElement('h3');
        testsListTitle.textContent = 'Select Tests to Include in Report:';
        Object.assign(testsListTitle.style, { fontSize: '19px', fontWeight: '600', color: '#343a40', margin: '0 0 12px 0' });
        modalBox.appendChild(testsListTitle);

        const testsContainer = document.createElement('div');
        testsContainer.id = 'report-tests-selection-container';
        Object.assign(testsContainer.style, {
            maxHeight: '300px', overflowY: 'auto', border: '1px solid #dee2e6',
            borderRadius: '8px', padding: '10px', marginBottom: '16px'
        });

        testsToDisplay.forEach(test => {
            const testItemDiv = document.createElement('div');
            testItemDiv.style.cssText = 'display: flex; align-items: center; padding: 10px 8px; border-bottom: 1px solid #e9ecef; gap: 10px; transition: background-color 0.2s;';
            const isCriticalTest = test.flag && (test.flag === 'CH' || test.flag === 'CL' || test.flag.includes('CRITICAL'));
            testItemDiv.onmouseover = () => testItemDiv.style.backgroundColor = '#f8f9fa';
            testItemDiv.onmouseout = () => testItemDiv.style.backgroundColor = isCriticalTest ? 'rgba(255, 0, 0, 0.05)' : 'transparent';
            if (isCriticalTest) {
                 testItemDiv.style.backgroundColor = 'rgba(255, 0, 0, 0.05)';
            }


            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox'; checkbox.id = `report_cb_${test.id}`;
            checkbox.checked = test.selected;
            checkbox.onchange = () => { test.selected = checkbox.checked; };
            Object.assign(checkbox.style, { marginRight: '5px', transform: 'scale(1.2)', cursor: 'pointer', accentColor: '#007bff' });

            const label = document.createElement('label');
            label.htmlFor = `report_cb_${test.id}`;
            label.style.cursor = 'pointer'; label.style.flexGrow = '1'; label.style.fontSize = '14px';
            let labelText = `<strong style="color: #333;">${test.testName}</strong>: ${test.result || 'N/A'}`;
            if (test.uom) labelText += ` ${test.uom}`;
            if (test.flag) labelText += ` <span style="color: ${test.flag === 'CL' ? '#007bff' : (test.flag === 'CH' ? '#dc3545' : '#d9534f')}; font-weight: bold;">(${test.flag})</span>`;
            label.innerHTML = labelText;

            testItemDiv.appendChild(checkbox);
            testItemDiv.appendChild(label);
            testsContainer.appendChild(testItemDiv);
        });
        modalBox.appendChild(testsContainer);

        const reportDetailsDiv = document.createElement('div');
        Object.assign(reportDetailsDiv.style, { marginTop: '10px', paddingTop: '16px', borderTop: '1px solid #dee2e6' });
        const detailsTitle = document.createElement('h4');
        detailsTitle.textContent = 'Reporting Details (If Applicable)';
        Object.assign(detailsTitle.style, { fontSize: '16px', fontWeight: '600', marginBottom: '12px', color: '#343a40' });
        reportDetailsDiv.appendChild(detailsTitle);

        const formGrid = document.createElement('div');
        Object.assign(formGrid.style, { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px' });
        const userIdGroup = createFormGroup('Your User ID', 'reportUserIdInput', 'Your system User ID');
        const userIdInputElem = userIdGroup.querySelector('#reportUserIdInput');
        if (userIdInputElem && currentUserId && currentUserId !== 'N/A') userIdInputElem.value = currentUserId;
        formGrid.appendChild(userIdGroup);
        formGrid.appendChild(createFormGroup('Notified Person (Name)', 'reportNotifiedPersonNameInput', 'Person contacted'));
        formGrid.appendChild(createFormGroup('Extension / Contact Info', 'reportNotifiedPersonTelExtInput', 'Phone or extension'));
        const readBackGroup = document.createElement('div');
        Object.assign(readBackGroup.style, { display: 'flex', alignItems: 'center', marginTop: '10px', gridColumn: '1 / -1' });
        const readBackCheckbox = document.createElement('input');
        readBackCheckbox.type = 'checkbox'; readBackCheckbox.id = 'reportReadBackCheckbox';
        Object.assign(readBackCheckbox.style, { marginRight: '10px', height: '18px', width: '18px', cursor: 'pointer', accentColor: '#007bff'});
        const readBackLabel = document.createElement('label');
        readBackLabel.textContent = 'Read-Back Confirmed'; readBackLabel.htmlFor = 'reportReadBackCheckbox';
        Object.assign(readBackLabel.style, { fontSize: '14px', fontWeight: '500', color: '#495057', cursor: 'pointer' });
        readBackGroup.appendChild(readBackCheckbox); readBackGroup.appendChild(readBackLabel);
        formGrid.appendChild(readBackGroup);
        reportDetailsDiv.appendChild(formGrid);
        modalBox.appendChild(reportDetailsDiv);

        const buttonContainer = document.createElement('div');
        Object.assign(buttonContainer.style, {
            display: 'flex', justifyContent: 'flex-end', paddingTop: '24px',
            marginTop: 'auto', gap: '12px', borderTop: '1px solid #dee2e6'
        });
        const submitReportButton = createModalButton('Submit Report', 'success');
        submitReportButton.onclick = async () => {
            const selectedTests = testsToDisplay.filter(t => t.selected);
            if (selectedTests.length === 0) {
                alert("Please select at least one test to report."); return;
            }
            const reportedUserId = document.getElementById('reportUserIdInput')?.value || currentUserId;
            const notifiedPerson = document.getElementById('reportNotifiedPersonNameInput')?.value || '';
            const notifiedContact = document.getElementById('reportNotifiedPersonTelExtInput')?.value || '';
            const readBackConfirmed = document.getElementById('reportReadBackCheckbox')?.checked || false;
            const pDataForPayload = patientData || {};

            const reportDataPayload = {
                entryID: getNextEntryID(),
                date: new Date().toLocaleDateString('en-GB'),
                time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }),
                patientName: pDataForPayload.patientName || 'N/A',
                patientMRN: pDataForPayload.patientId || 'N/A',
                patientLocation: pDataForPayload.patientLocation || 'N/A',
                sampleBarcode: pDataForPayload.sampleBarcode || 'N/A',
                userName: reportedUserId,
                notifiedPersonName: notifiedPerson,
                notifiedPersonTelExt: notifiedContact,
                readBack: readBackConfirmed,
                alerts: selectedTests.map(st => ({
                    testName: st.testName,
                    result: st.result,
                    uom: st.uom,
                    flag: st.flag,
                    type: 'user_reported_critical',
                    comment: 'Manually selected by user for critical reporting.'
                })),
            };
            logDebugMain("Manual Report Payload:", JSON.stringify(reportDataPayload, null, 2));
            const serverSuccess = await sendAlertDataToServer(reportDataPayload);
            if (serverSuccess) {
                alert("Critical results reported successfully and saved to server.");
                closeReportSelectionModalAction();
            } else {
                alert("Critical results logged to console. FAILED to save to server. Please ensure the local server is running or check console for errors.");
            }
        };
        buttonContainer.appendChild(submitReportButton);
        const cancelButton = createModalButton('Cancel', 'secondary');
        cancelButton.onclick = closeReportSelectionModalAction;
        buttonContainer.appendChild(cancelButton);
        modalBox.appendChild(buttonContainer);

        overlay.appendChild(modalBox); document.body.appendChild(overlay);
        setTimeout(() => {
            overlay.style.opacity = '1';
            modalBox.style.opacity = '1'; modalBox.style.transform = 'translateY(0) scale(1)';
        }, 10);
        overlay.addEventListener('click', (event) => { if (event.target === overlay) closeReportSelectionModalAction(); });
        const escapeKeyListenerReport = (event) => {
            if (event.key === 'Escape' && document.body.contains(overlay)) {
                closeReportSelectionModalAction(); document.removeEventListener('keydown', escapeKeyListenerReport);
            }
        };
        document.addEventListener('keydown', escapeKeyListenerReport);
    }

    function closeReportSelectionModalAction() {
        logDebugMain("closeReportSelectionModalAction triggered.");
        const overlay = document.getElementById('report-selection-modal-overlay');
        if (overlay) {
            overlay.style.opacity = '0';
            const modalContent = overlay.querySelector('#report-selection-modal-content');
            if (modalContent) { modalContent.style.opacity = '0'; modalContent.style.transform = 'translateY(-30px) scale(0.95)'; }
            overlay.addEventListener('transitionend', () => {
                if (overlay.parentNode) {
                    overlay.parentNode.removeChild(overlay);
                }
                isReportModalOpen = false;
                document.body.style.overflow = ''; logDebugMain("Report selection modal overlay removed.");
            }, { once: true });
             setTimeout(() => {
                if (overlay && overlay.parentNode) {
                    overlay.parentNode.removeChild(overlay);
                }
                if(isReportModalOpen) {
                    isReportModalOpen = false; document.body.style.overflow = '';
                }
            }, 400);
        } else {
            isReportModalOpen = false;
            document.body.style.overflow = '';
        }
    }


    function startAlertsScannerInternal() {
        logAlertDebug("startAlertsScannerInternal called.");
        if (isScanningActive && issueScanIntervalId === null) {
            logAlertDebug("Alert Scanner starting/resuming...");
            checkForIssues();
            issueScanIntervalId = setInterval(checkForIssues, CONFIG_ALERTS.SCAN_INTERVAL);
        } else if (!isScanningActive && issueScanIntervalId === null) {
             logAlertDebug("Alert Scanner starting fresh (isScanningActive was false)...");
             isScanningActive = true;
             checkForIssues();
             issueScanIntervalId = setInterval(checkForIssues, CONFIG_ALERTS.SCAN_INTERVAL);
        }
    }

    function stopAlertsScannerInternal() {
        logAlertDebug("stopAlertsScannerInternal called (pause behavior).");
        if (issueScanIntervalId !== null) {
            clearInterval(issueScanIntervalId);
            issueScanIntervalId = null;
        }
    }

    window.startAlertsScanner = startAlertsScannerInternal;
    window.stopAlertsScanner = stopAlertsScannerInternal;

    let previousObservedUrl = window.location.href;
    const pageUrlObserver = new MutationObserver(() => {
        const newObservedUrl = window.location.href;
        if (newObservedUrl !== previousObservedUrl) {
            logDebugMain(`URL changed from: ${previousObservedUrl} to: ${newObservedUrl}.`);
            const wasOnEditPage = previousObservedUrl.startsWith(CONFIG_MAIN.URLS.EDIT_PAGE_PREFIX);
            const nowOnEditPage = newObservedUrl.startsWith(CONFIG_MAIN.URLS.EDIT_PAGE_PREFIX);

            if (wasOnEditPage && !nowOnEditPage) {
                logDebugMain("Navigated AWAY from edit page. Stopping scanner, clearing flags, removing UI.");
                isScanningActive = false;
                if (window.stopAlertsScanner) window.stopAlertsScanner();
                try {
                    const oldUrlObject = new URL(previousObservedUrl, window.location.origin);
                    const oldPageKeyPrefix = `labAlertNotified_${oldUrlObject.pathname}${oldUrlObject.hash}_`;
                    Object.keys(sessionStorage)
                        .filter(key => key.startsWith(oldPageKeyPrefix))
                        .forEach(key => {
                            logAlertDebug(`Removing sessionStorage key: ${key}`);
                            sessionStorage.removeItem(key);
                        });
                } catch (e) { logAlertError(`Error processing old URL for flag clearing: ${e}`);}
                const customButtons = document.getElementById('custom-script-buttons'); if (customButtons) customButtons.remove();
                const alertOverlay = document.getElementById('custom-alert-modal-overlay'); if (alertOverlay) alertOverlay.remove(); isAlertModalOpen = false;
                const reportOverlay = document.getElementById('report-selection-modal-overlay'); if (reportOverlay) reportOverlay.remove(); isReportModalOpen = false;
                document.body.style.overflow = '';
            }

            if (nowOnEditPage) {
                logDebugMain("Navigated TO an edit page. Resetting states, (re)starting scanner, adding UI.");
                isAlertModalOpen = false; isReportModalOpen = false;
                const existingAlertOverlay = document.getElementById('custom-alert-modal-overlay'); if (existingAlertOverlay) existingAlertOverlay.remove();
                const existingReportOverlay = document.getElementById('report-selection-modal-overlay'); if (existingReportOverlay) existingReportOverlay.remove();
                document.body.style.overflow = '';

                if (!isScanningActive) { isScanningActive = true; }
                setTimeout(() => {
                    if (window.startAlertsScanner) window.startAlertsScanner();
                    addButtons();
                    addFontAwesome();
                    monitorOrderedStatus(); // Initial check on new page
                }, 700);
            } else {
                const customButtons = document.getElementById('custom-script-buttons'); if (customButtons) customButtons.remove();
                if (isScanningActive) {
                    isScanningActive = false;
                    if (window.stopAlertsScanner) window.stopAlertsScanner();
                }
            }
            previousObservedUrl = newObservedUrl;
        } else { // URL hasn't changed, but mutations occurred.
            const stillOnEditPage = newObservedUrl.startsWith(CONFIG_MAIN.URLS.EDIT_PAGE_PREFIX);
            if (stillOnEditPage) {
                if (!document.getElementById('custom-script-buttons')) {
                    addButtons(); // Re-add buttons if missing
                }
                addFontAwesome(); // Ensure FontAwesome is still there
                debouncedMonitorOrderedStatus();

                if (isScanningActive && issueScanIntervalId === null && window.startAlertsScanner) {
                    window.startAlertsScanner();
                }
                else if (!isScanningActive && window.startAlertsScanner) {
                    isScanningActive = true; window.startAlertsScanner();
                }
            }
        }

        // --- INTEGRATED: Sample Counter & Highlighter Modal Detection ---
        const modalConfigs = [
            {
                btnSelector: 'button#btnclose-smplcollection',
                config: {
                    buttonId: 'btnclose-smplcollection',
                    counterId: 'inline-counter-smplcollection',
                    inputSelector: 'tbody[formarrayname="TubeTypeList"] input[formcontrolname="PatientID"]',
                }
            },
            {
                btnSelector: 'button#closebtn-smplrecieve',
                config: {
                   buttonId: 'closebtn-smplrecieve',
                   counterId: 'inline-counter-smplrecieve',
                   inputSelector: 'td input[formcontrolname="PatientID"]',
                }
            }
        ];

        modalConfigs.forEach(({ btnSelector, config }) => {
            const button = document.querySelector(btnSelector);
            if (button) {
                const modalKeyElement = button.closest('.modal');
                if (modalKeyElement && !modalKeyElement.dataset.counterInitialized) {
                    const targetFooter = button.closest('.modal-footer');
                    if (targetFooter) {
                        logCounterDebug(`Found potential modal for '${config.buttonId}'.`);
                        setupSampleCounter({
                            ...config,
                            modalKeyElement: modalKeyElement,
                            targetFooter: targetFooter,
                            activeIntervalsMap: activeSampleCounterIntervals
                        });
                    }
                }
            }
        });

        // MERGED: Check for the receiverStaffID input to add our highlighter
        const receiverInput = document.querySelector('input#receiverStaffID');
        if (receiverInput) {
            setupHighlighterInput(receiverInput);
        }


        // Cleanup for closed/removed sample counter modals
        activeSampleCounterIntervals.forEach((data, modalElemKey) => {
            const modalStillPresent = document.body.contains(modalElemKey);
            const modalVisible = modalStillPresent && (modalElemKey.classList.contains('show') || (modalElemKey.style.display && modalElemKey.style.display !== 'none') || (!modalElemKey.style.display && modalElemKey.offsetParent !== null));

            if (!modalStillPresent || !modalVisible) {
                logCounterDebug(`Fallback Cleanup: Modal for counter ID ${data.counterId || data.counter.id} no longer present/visible.`);
                clearInterval(data.interval);
                const counterElem = data.counter || document.getElementById(data.counterId);
                if (counterElem && counterElem.isConnected) {
                    counterElem.remove();
                }
                activeSampleCounterIntervals.delete(modalElemKey);
            }
        });
        // --- END: Integrated Detection Logic ---

    });
    pageUrlObserver.observe(document.body, { childList: true, subtree: true });

    // --- Initial setup on script load ---
    if (isCorrectPage()) {
        isScanningActive = true;
        setTimeout(() => {
            if (window.startAlertsScanner) window.startAlertsScanner();
            addFontAwesome();
            addButtons();
            monitorOrderedStatus(); // Initial check
        }, 700);
    } else {
        isScanningActive = false;
    }

    setInterval(checkUrlAndTriggerClickForUndefined, CONFIG_MAIN.CHECK_INTERVALS.UNDEFINED_URL);
    setInterval(checkForDisabledButtons, CONFIG_MAIN.CHECK_INTERVALS.DISABLED_BTN_CHECK);

})();