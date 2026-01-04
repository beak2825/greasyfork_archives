// ==UserScript==
// @name         Dolphin Unit Tests - Apply Failure Reason to All
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Adds a button to apply a failure reason to all failed test cases
// @author       You
// @match        https://dolphin-unit-test.vercel.app/*
// @match        http://dolphin-unit-test.vercel.app/*
// @match        https://*.dolphin-unit-test.vercel.app/*
// @match        http://*.dolphin-unit-test.vercel.app/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/528583/Dolphin%20Unit%20Tests%20-%20Apply%20Failure%20Reason%20to%20All.user.js
// @updateURL https://update.greasyfork.org/scripts/528583/Dolphin%20Unit%20Tests%20-%20Apply%20Failure%20Reason%20to%20All.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Add a style element for our custom styles
    const style = document.createElement('style');
    style.textContent = `
        .apply-to-all-button {
            display: block;
            width: fit-content;
            padding: 6px 12px;
            margin-top: 8px;
            background-color: #8b5cf6;
            color: white;
            border: none;
            border-radius: 4px;
            font-size: 0.875rem;
            cursor: pointer;
            transition: background-color 0.2s;
        }

        .apply-to-all-button:hover {
            background-color: #7c3aed;
        }

        .apply-to-all-status {
            position: fixed;
            top: 16px;
            right: 16px;
            z-index: 1000;
            padding: 10px 16px;
            border-radius: 4px;
            color: white;
            font-size: 0.875rem;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
    `;
    document.head.appendChild(style);

    /**
     * Adds "Apply to all" buttons to expanded test cases
     */
    function addApplyToAllButton() {
        console.log("Attempting to add 'Apply to all' button");

        // First make sure we can locate the test cases section on the page
        const testCasesContainer = document.querySelector('.mt-8 .bg-gray-900.border.border-gray-800.rounded-lg');
        if (!testCasesContainer) {
            console.log("Test cases container not found, retrying in 1 second");
            setTimeout(addApplyToAllButton, 1000);
            return;
        }

        // Find all test case containers
        const testCases = document.querySelectorAll('.bg-gray-800.rounded-lg');

        if (testCases.length === 0) {
            // If no test cases found, try again later
            console.log("No test cases found, retrying in 1 second");
            setTimeout(addApplyToAllButton, 1000);
            return;
        }

        console.log(`Found ${testCases.length} test cases`);

        // Check if the first test case is expanded
        let expandedTestCase = document.querySelector('.bg-gray-800.rounded-lg .p-4.border-t');

        // If no test case is expanded, try to expand the first one
        if (!expandedTestCase) {
            console.log("No expanded test case found, attempting to expand the first one");

            // Click on any "Expand All" button if it exists
            const expandAllButton = Array.from(document.querySelectorAll('button'))
                .find(button => button.textContent.includes('Expand All'));

            if (expandAllButton) {
                console.log("Found 'Expand All' button, clicking it");
                expandAllButton.click();
                setTimeout(() => {
                    addApplyToAllButton();
                }, 500);
                return;
            }

            // Otherwise try to expand the first test case
            const firstTestCase = testCases[0];
            const expandButton = firstTestCase.querySelector('button span[style*="transform"]');
            if (expandButton && expandButton.closest('button')) {
                console.log("Found expand button for first test case, clicking it");
                expandButton.closest('button').click();
                // Wait for the expansion to complete
                setTimeout(() => {
                    addApplyToAllButton();
                }, 500);
                return;
            } else {
                console.log("Could not find expand button, retrying in 1 second");
                setTimeout(addApplyToAllButton, 1000);
                return;
            }
        }

        console.log("Found expanded test case(s)");

        // Check each test case for its failure reason section and add buttons as needed
        document.querySelectorAll('.bg-gray-800.rounded-lg .p-4.border-t').forEach((testCaseSection, index) => {
            // Skip if we already added a button to this section
            if (testCaseSection.querySelector('.apply-to-all-button')) {
                return;
            }

            // Find elements with text "Failure Reason"
            const elements = Array.from(testCaseSection.querySelectorAll('*'));
            let failureReasonContainer = null;

            for (const el of elements) {
                if (el.textContent === 'Failure Reason') {
                    failureReasonContainer = el.parentElement;
                    break;
                }
            }

            if (!failureReasonContainer) {
                // Try to find it by looking at all divs with the common class
                const candidateDivs = testCaseSection.querySelectorAll('.text-sm.font-medium.text-gray-400.mb-1');
                for (const div of candidateDivs) {
                    if (div.textContent.includes('Failure')) {
                        failureReasonContainer = div.parentElement;
                        break;
                    }
                }
            }

            if (!failureReasonContainer) {
                console.log(`Could not find failure reason container in test case ${index+1}`);
                return;
            }

            // Find the select element for failure reason
            const failureReasonSelect = failureReasonContainer.querySelector('select');
            if (!failureReasonSelect) {
                console.log(`Could not find failure reason select in test case ${index+1}`);
                return;
            }

            // Add the "Apply to all" button
            const applyButton = document.createElement('button');
            applyButton.textContent = 'Apply to all failed testcases';
            applyButton.className = 'apply-to-all-button';
            applyButton.id = `apply-button-test-${index+1}`;

            // Insert the button after the select element initially
            failureReasonSelect.parentElement.insertBefore(applyButton, failureReasonSelect.nextSibling);

            console.log(`Added button to test case ${index+1}`);

            // Add event listener to the select to move the button when "other" is selected
            failureReasonSelect.addEventListener('change', () => {
                // If "other" is selected, wait for textarea to be added and move button below it
                if (failureReasonSelect.value === 'other') {
                    console.log(`"Other" selected for test case ${index+1}, moving button`);

                    // Wait for textarea to be added by React
                    setTimeout(() => {
                        const textarea = findTextareaInSection(failureReasonContainer, testCaseSection);
                        if (textarea) {
                            // Move button after the textarea or its parent container
                            const textareaContainer = textarea.closest('div');
                            if (textareaContainer && textareaContainer !== failureReasonContainer) {
                                textareaContainer.appendChild(applyButton);
                            } else {
                                // If no container, insert after textarea directly
                                textarea.parentElement.insertBefore(applyButton, textarea.nextSibling);
                            }
                            console.log(`Moved button below textarea for test case ${index+1}`);
                        }
                    }, 200);
                } else {
                    // For any other reason, move button back below the select
                    failureReasonSelect.parentElement.insertBefore(applyButton, failureReasonSelect.nextSibling);
                    console.log(`Moved button back below select for test case ${index+1}`);
                }
            });

            // Add event listener to the button
            applyButton.addEventListener('click', () => {
                const selectedReason = failureReasonSelect.value;
                if (!selectedReason) {
                    alert('Please select a failure reason first');
                    return;
                }

                // If "Other" is selected, get the explanation text
                let explanationText = '';
                if (selectedReason === 'other') {
                    const explanationTextarea = findTextareaInSection(failureReasonContainer, testCaseSection);
                    if (!explanationTextarea) {
                        alert('Could not find explanation textarea');
                        return;
                    }

                    explanationText = explanationTextarea.value;
                    if (!explanationText.trim()) {
                        alert('Please provide an explanation for "Other"');
                        return;
                    }
                }

                // Apply the same failure reason to all test cases
                applyToAllTestCases(selectedReason, explanationText);
            });
        });

        // Helper function to find textarea in various locations
        function findTextareaInSection(container, section) {
            // First look in the container
            let textarea = container.querySelector('textarea');

            // If not found, look in the container's children
            if (!textarea) {
                const childDivs = container.querySelectorAll('div');
                for (const div of childDivs) {
                    const found = div.querySelector('textarea');
                    if (found) {
                        textarea = found;
                        break;
                    }
                }
            }

            // If still not found, try to find in the whole section
            if (!textarea) {
                textarea = section.querySelector('textarea');
            }

            return textarea;
        }

        // Add a global "Apply to All" button at the top of the test cases section
        if (!document.querySelector('#global-apply-button')) {
            const testHeader = document.querySelector('.flex.items-center.justify-between.mb-4');

            if (testHeader) {
                const globalButton = document.createElement('button');
                globalButton.id = 'global-apply-button';
                globalButton.textContent = 'Apply Failure Reason to All Tests';
                globalButton.className = 'apply-to-all-button';
                globalButton.style.marginLeft = '16px';

                // Insert at the top
                testHeader.appendChild(globalButton);

                // Event listener for the global button
                globalButton.addEventListener('click', () => {
                    showGlobalApplyDialog();
                });
            }
        }
    }

    /**
     * Shows a dialog for selecting the failure reason to apply to all tests
     */
    function showGlobalApplyDialog() {
        // Create a floating UI for selecting the reason
        const floatingUI = document.createElement('div');
        floatingUI.style.position = 'fixed';
        floatingUI.style.top = '50%';
        floatingUI.style.left = '50%';
        floatingUI.style.transform = 'translate(-50%, -50%)';
        floatingUI.style.padding = '20px';
        floatingUI.style.backgroundColor = '#1f2937';
        floatingUI.style.borderRadius = '8px';
        floatingUI.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.3)';
        floatingUI.style.zIndex = '1000';
        floatingUI.style.minWidth = '300px';

        floatingUI.innerHTML = `
            <h3 style="margin-top: 0; color: white; font-size: 1rem; font-weight: 600; margin-bottom: 16px;">Apply to All Test Cases</h3>
            <div style="margin-bottom: 12px;">
                <label style="display: block; margin-bottom: 4px; color: #9ca3af; font-size: 0.875rem;">Failure Reason</label>
                <select id="global-reason-select" style="width: 100%; background-color: #374151; border: 1px solid #4b5563; color: white; padding: 8px; border-radius: 4px;">
                    <option value="">Select a reason</option>
                    <option value="compilation_error">Compilation Error</option>
                    <option value="runtime_error">Runtime Error</option>
                    <option value="timeout">Time Limit Exceeded</option>
                    <option value="formatting">Output Formatting</option>
                    <option value="segmentation_fault">Segmentation Fault</option>
                    <option value="memory_limit">Memory Limit Exceeded</option>
                    <option value="wrong_answer">Wrong Answer</option>
                    <option value="other">Other</option>
                </select>
            </div>
            <div id="explanation-container" style="margin-bottom: 16px; display: none;">
                <label style="display: block; margin-bottom: 4px; color: #9ca3af; font-size: 0.875rem;">Explanation</label>
                <textarea id="global-explanation" style="width: 100%; background-color: #374151; border: 1px solid #4b5563; color: white; padding: 8px; border-radius: 4px; min-height: 60px;"></textarea>
            </div>
            <div style="display: flex; justify-content: flex-end; gap: 8px;">
                <button id="cancel-button" style="padding: 6px 12px; background-color: #4b5563; color: white; border: none; border-radius: 4px; cursor: pointer;">Cancel</button>
                <button id="apply-button" style="padding: 6px 12px; background-color: #8b5cf6; color: white; border: none; border-radius: 4px; cursor: pointer;">Apply to All</button>
            </div>
        `;

        document.body.appendChild(floatingUI);

        // Show/hide explanation field based on selection
        const reasonSelect = document.getElementById('global-reason-select');
        const explanationContainer = document.getElementById('explanation-container');

        reasonSelect.addEventListener('change', () => {
            explanationContainer.style.display = reasonSelect.value === 'other' ? 'block' : 'none';
        });

        // Cancel button closes the UI
        document.getElementById('cancel-button').addEventListener('click', () => {
            floatingUI.remove();
        });

        // Apply button applies to all
        document.getElementById('apply-button').addEventListener('click', () => {
            const reason = reasonSelect.value;
            if (!reason) {
                alert('Please select a failure reason');
                return;
            }

            let explanation = '';
            if (reason === 'other') {
                explanation = document.getElementById('global-explanation').value;
                if (!explanation.trim()) {
                    alert('Please provide an explanation for "Other"');
                    return;
                }
            }

            floatingUI.remove();
            applyToAllTestCases(reason, explanation);
        });
    }

    /**
     * Applies a failure reason and explanation to all test cases
     * @param {string} reason - The failure reason to apply
     * @param {string} explanation - The explanation text for "Other" reason
     */
    function applyToAllTestCases(reason, explanation) {
        console.log(`Applying reason "${reason}" to all test cases`);

        // Create a status message at the top of the page
        const statusMessage = document.createElement('div');
        statusMessage.className = 'apply-to-all-status';
        statusMessage.style.backgroundColor = '#2563eb';
        statusMessage.textContent = 'Applying to all test cases...';
        document.body.appendChild(statusMessage);

        // Click the "Expand All" button first if it exists
        const expandAllButton = Array.from(document.querySelectorAll('button'))
            .find(button => button.textContent.includes('Expand All'));

        if (expandAllButton) {
            console.log("Found 'Expand All' button, clicking it");
            expandAllButton.click();

            // Give some time for all tests to expand
            setTimeout(() => {
                processAllTestCases();
            }, 1000);
        } else {
            // If no Expand All button, try to expand each test manually
            expandAllTestCases().then(() => {
                processAllTestCases();
            });
        }

        function processAllTestCases() {
            console.log("Processing all test cases");
            statusMessage.textContent = 'Applying reason to each test case...';

            // Find all test cases, whether they're expanded or not
            const testCases = document.querySelectorAll('.bg-gray-800.rounded-lg');
            console.log(`Found ${testCases.length} test cases`);

            let pendingCount = testCases.length;
            let appliedCount = 0;

            // Process test cases in batches to avoid UI freezing
            function processBatch(startIndex, batchSize) {
                console.log(`Processing batch from ${startIndex} to ${startIndex + batchSize - 1}`);

                // Update status
                statusMessage.textContent = `Applying to tests ${startIndex + 1}-${Math.min(startIndex + batchSize, testCases.length)}...`;

                for (let i = startIndex; i < Math.min(startIndex + batchSize, testCases.length); i++) {
                    const testCase = testCases[i];

                    // First check if this test case is already expanded
                    let failureReasonSection = testCase.querySelector('.p-4.border-t');

                    // If not expanded, expand it first
                    if (!failureReasonSection) {
                        const expandButton = testCase.querySelector('button span[style*="transform"]');
                        if (expandButton && expandButton.closest('button')) {
                            expandButton.closest('button').click();
                            // Wait a bit for expansion
                            setTimeout(() => {
                                // Try again after expansion
                                failureReasonSection = testCase.querySelector('.p-4.border-t');
                                if (failureReasonSection) {
                                    if (processTestCase(failureReasonSection, i, reason, explanation)) {
                                        appliedCount++;
                                    }
                                    checkCompletion();
                                }
                            }, 100);
                        }
                    } else {
                        if (processTestCase(failureReasonSection, i, reason, explanation)) {
                            appliedCount++;
                        }
                        checkCompletion();
                    }
                }

                // Process next batch if needed
                if (startIndex + batchSize < testCases.length) {
                    setTimeout(() => {
                        processBatch(startIndex + batchSize, batchSize);
                    }, 200);
                }
            }

            function checkCompletion() {
                pendingCount--;
                if (pendingCount <= 0) {
                    finishProcessing();
                }
            }

            function finishProcessing() {
                // Final status message
                statusMessage.textContent = `Applied "${reason}" to ${appliedCount} test cases.`;
                statusMessage.style.backgroundColor = '#10b981';

                // Remove the status message after a few seconds
                setTimeout(() => {
                    statusMessage.remove();
                }, 5000);

                console.log(`Applied to ${appliedCount} test cases`);
            }

            // Start processing in batches of 10
            processBatch(0, 10);
        }
    }

    /**
     * Processes a single test case
     * @param {Element} failureReasonSection - The test case section element
     * @param {number} index - The index of the test case
     * @param {string} reason - The failure reason to apply
     * @param {string} explanation - The explanation text for "Other" reason
     * @returns {boolean} - Whether the processing was successful
     */
    function processTestCase(failureReasonSection, index, reason, explanation) {
        console.log(`Processing test case ${index+1}`);

        // Find the failure reason elements
        const divs = failureReasonSection.querySelectorAll('div');
        let failureReasonContainer = null;

        // First try to find by text content
        for (const div of divs) {
            if (div.textContent && div.textContent.includes('Failure Reason')) {
                failureReasonContainer = div;
                break;
            }
        }

        // If not found, try to find by class and position
        if (!failureReasonContainer) {
            const possibleContainers = failureReasonSection.querySelectorAll('.mt-4, div:has(select)');
            if (possibleContainers.length > 0) {
                // Usually the last container with a select is the failure reason
                for (let i = possibleContainers.length - 1; i >= 0; i--) {
                    if (possibleContainers[i].querySelector('select')) {
                        failureReasonContainer = possibleContainers[i];
                        break;
                    }
                }
            }
        }

        if (!failureReasonContainer) {
            console.log(`No failure reason container in test case ${index+1}`);
            return false;
        }

        // Find the select element for failure reason
        const failureReasonSelect = failureReasonContainer.querySelector('select');
        if (!failureReasonSelect) {
            console.log(`No failure reason select in test case ${index+1}`);
            return false;
        }

        console.log(`Setting reason "${reason}" for test case ${index+1}`);

        // We'll process this in a multi-step sequence
        function setReasonAndExplanation() {
            // Step 1: Always set to "other" first to trigger the textarea to appear
            console.log(`Step 1: Setting to "other" for test case ${index+1}`);
            failureReasonSelect.value = "other";
            failureReasonSelect.dispatchEvent(new Event('change', { bubbles: true }));
            failureReasonSelect.dispatchEvent(new Event('input', { bubbles: true }));

            // Wait longer for React to render the textarea
            setTimeout(() => {
                // Step 2: Find and set the explanation text
                console.log(`Step 2: Finding textarea for test case ${index+1}`);
                let explanationTextarea = findTextarea();

                if (explanationTextarea) {
                    console.log(`Step 2: Found textarea for test case ${index+1}, setting explanation`);
                    // Set the explanation in multiple ways to ensure it sticks
                    setTextareaValue(explanationTextarea, explanation);

                    // Step 3: Wait and then set the final reason if needed
                    setTimeout(() => {
                        if (reason !== "other") {
                            console.log(`Step 3: Setting final reason "${reason}" for test case ${index+1}`);
                            failureReasonSelect.value = reason;
                            failureReasonSelect.dispatchEvent(new Event('change', { bubbles: true }));
                            failureReasonSelect.dispatchEvent(new Event('input', { bubbles: true }));
                        } else {
                            console.log(`Step 3: Final reason is already "other" for test case ${index+1}`);
                        }
                    }, 300);
                } else {
                    console.log(`Step 2: Could not find textarea for test case ${index+1}`);
                    // If we couldn't find the textarea but need to set a different reason
                    if (reason !== "other") {
                        setTimeout(() => {
                            failureReasonSelect.value = reason;
                            failureReasonSelect.dispatchEvent(new Event('change', { bubbles: true }));
                            failureReasonSelect.dispatchEvent(new Event('input', { bubbles: true }));
                        }, 300);
                    }
                }
            }, 400); // Increased wait time
        }

        // Helper function to find the textarea in various places
        function findTextarea() {
            // Try to find the textarea (it might be directly in the container or in a child div)
            let textarea = failureReasonContainer.querySelector('textarea');

            // If not found directly, try to find in children
            if (!textarea) {
                const childDivs = failureReasonContainer.querySelectorAll('div');
                for (const div of childDivs) {
                    const found = div.querySelector('textarea');
                    if (found) {
                        textarea = found;
                        break;
                    }
                }
            }

            // If still not found, try to find in the whole test case section
            if (!textarea) {
                textarea = failureReasonSection.querySelector('textarea');
            }

            // If still not found, try to find anywhere in the test case
            if (!textarea) {
                const testCase = failureReasonSection.closest('.bg-gray-800.rounded-lg');
                if (testCase) {
                    textarea = testCase.querySelector('textarea');
                }
            }

            return textarea;
        }

        // Helper function to set textarea value in multiple ways
        function setTextareaValue(textarea, value) {
            // Method 1: Direct assignment
            textarea.value = value;

            // Method 2: Dispatch events
            textarea.dispatchEvent(new Event('input', { bubbles: true }));
            textarea.dispatchEvent(new Event('change', { bubbles: true }));

            // Method 3: Define property directly
            Object.defineProperty(textarea, 'value', {
                value: value,
                writable: true
            });

            // Method 4: Set via DOM level 2 property
            textarea.setAttribute('value', value);

            // Method 5: Simulate user typing
            const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
                window.HTMLTextAreaElement.prototype, 'value'
            ).set;

            if (nativeInputValueSetter) {
                nativeInputValueSetter.call(textarea, value);
            }

            // Dispatch more events to ensure React picks up the change
            textarea.dispatchEvent(new Event('input', { bubbles: true }));
            textarea.dispatchEvent(new Event('change', { bubbles: true }));

            // Verify the value was set
            if (textarea.value !== value) {
                console.log(`Warning: Failed to set textarea value for test case ${index+1}`);
            }
        }

        // Start the process
        setReasonAndExplanation();

        return true;
    }

    /**
     * Expands all test cases
     * @returns {Promise} - A promise that resolves when all test cases are expanded
     */
    function expandAllTestCases() {
        return new Promise(resolve => {
            console.log("Attempting to expand all test cases");

            // Click the "Expand All" button if it exists
            const expandAllButton = Array.from(document.querySelectorAll('button'))
                .find(button => button.textContent && button.textContent.includes('Expand All'));

            if (expandAllButton) {
                console.log("Found 'Expand All' button, clicking it");
                expandAllButton.click();
                // Wait a bit for the expansion to complete
                setTimeout(resolve, 1000);
            } else {
                console.log("No 'Expand All' button found, expanding tests individually");
                // Manually expand each test case
                const testCases = document.querySelectorAll('.bg-gray-800.rounded-lg');
                console.log(`Found ${testCases.length} test cases to expand`);
                let expandedCount = 0;

                // We'll expand in batches to avoid UI freezing
                function expandBatch(startIndex, batchSize) {
                    for (let i = startIndex; i < Math.min(startIndex + batchSize, testCases.length); i++) {
                        const testCase = testCases[i];
                        const expandButton = testCase.querySelector('button span[style*="transform"]');
                        const isExpanded = expandButton && expandButton.style.transform && expandButton.style.transform.includes('rotate(90deg)');

                        if (expandButton && !isExpanded) {
                            expandButton.closest('button').click();
                            expandedCount++;
                        }
                    }

                    // Process next batch if needed
                    if (startIndex + batchSize < testCases.length) {
                        setTimeout(() => {
                            expandBatch(startIndex + batchSize, batchSize);
                        }, 100);
                    } else {
                        // All batches processed
                        console.log(`Expanded ${expandedCount} test cases`);
                        setTimeout(resolve, expandedCount > 0 ? 1000 : 0);
                    }
                }

                // Start expanding in batches of 5
                expandBatch(0, 5);
            }
        });
    }

    /**
     * Initializes the extension
     */
    function init() {
        console.log("Initializing Dolphin Unit Tests extension");

        // Try to find the "Test Solution" button and add our functionality below it
        const testSolutionButton = document.querySelector('button.w-full.bg-purple-600');
        if (testSolutionButton) {
            console.log("Found 'Test Solution' button, adding our button below it");

            // Create a "Apply to All Tests" button right after the Test Solution button
            const applyAllButton = document.createElement('button');
            applyAllButton.textContent = 'Apply Failure Reason to All Tests';
            applyAllButton.className = 'w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-md mt-2 transition-colors duration-200';

            // Place it after the Test Solution button
            testSolutionButton.insertAdjacentElement('afterend', applyAllButton);

            // Add event listener
            applyAllButton.addEventListener('click', showGlobalApplyDialog);
        }

        // Add a floating button that's always visible (as a backup)
        const floatingButton = document.createElement('button');
        floatingButton.textContent = 'Apply Failure Reason';
        floatingButton.className = 'apply-to-all-button';
        floatingButton.style.position = 'fixed';
        floatingButton.style.bottom = '20px';
        floatingButton.style.right = '20px';
        floatingButton.style.zIndex = '9999';
        floatingButton.style.padding = '10px 16px';
        floatingButton.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.3)';

        floatingButton.addEventListener('click', showGlobalApplyDialog);

        document.body.appendChild(floatingButton);
        console.log("Added floating button");

        // Add a MutationObserver to detect when test cases are loaded
        const observer = new MutationObserver((mutations) => {
            for (const mutation of mutations) {
                if (mutation.addedNodes.length) {
                    // Check if test cases have been added to the DOM
                    if (document.querySelector('.bg-gray-800.rounded-lg')) {
                        console.log("Detected test cases via MutationObserver");
                        // Automatically add our buttons to the test cases
                        setTimeout(() => {
                            addApplyToAllButton();
                        }, 1000);
                        break;
                    }
                }
            }
        });

        observer.observe(document.body, { childList: true, subtree: true });

        // Also try to add the button directly to test cases in case they are already loaded
        setTimeout(addApplyToAllButton, 1000);
        setTimeout(addApplyToAllButton, 3000); // Extra fallback attempt
    }

    // Initialize when the page is loaded
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();