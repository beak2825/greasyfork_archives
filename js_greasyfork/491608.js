// ==UserScript==
// @name         PDF Benefit Summary Extractor with Table and Debugging and Testing
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Extract and display benefit summaries from PDF in a table format with debugging panel and test cases
// @author       The Ghost
// @match        https://crm.tapnz.co.nz/aurora/loat-v2/client/*/*
// @grant        none
// @locale       en
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/491608/PDF%20Benefit%20Summary%20Extractor%20with%20Table%20and%20Debugging%20and%20Testing.user.js
// @updateURL https://update.greasyfork.org/scripts/491608/PDF%20Benefit%20Summary%20Extractor%20with%20Table%20and%20Debugging%20and%20Testing.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Static vars
    let shouldProceed = true;

    const benefitTypes = [
        "Life Cover",
        "Trauma Cover Accelerated",
        "Private Medical Cover",
        "Mortgage Repayment Cover",
        "Premium Cover",
        "Severe Trauma",
        "Moderate Trauma",
        "Income Cover"
    ];

    let testing = false;
    var clientNames = [];

    const observer = new MutationObserver((mutations, obs) => {
        const elements = document.querySelectorAll(`var[data-mergetag="PEOPLE_DEPENDANT_NAME"]`);
        const dependants = document.querySelectorAll(`var[data-mergetag="PEOPLE_NAME"]`);
        if (elements.length > 0 || dependants.length > 0) {
            // Elements found, extract names
            const dependantNames = extractNamesByMergeTag('PEOPLE_DEPENDANT_NAME');
            const peopleNames = extractNamesByMergeTag('PEOPLE_NAME');

            // Update the global variable
            clientNames = [...new Set([...dependantNames, ...peopleNames])];
            const errorMessage = document.getElementById('noClientNamesError');
            if (errorMessage) {
                errorMessage.parentNode.removeChild(errorMessage);
            }
            console.log(clientNames);

            // Optionally, disconnect the observer if you no longer need it
            obs.disconnect();
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });




    if (typeof pdfjsLib === 'undefined') {
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.11.338/pdf.min.js';
        script.onload = () => {
            pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.11.338/pdf.worker.min.js';
            console.log('PDF.js loaded.');
            // setupUI();
        };
        document.body.appendChild(script);
    } else {
        // await setupUI();
    }

    function alertAndHalt(message) {
        window.alert(message);
        shouldProceed = false; // This will prevent future actions
    }

    function runTests(extractedData) {
        let allTestsPassed = true;
        console.log("Running tests..")
        testCases.forEach((testCase) => {
            const extractedClientData = extractedData.find(data => data.clientName === testCase.clientName);
            if (!extractedClientData) {
                console.log(`No data extracted for ${testCase.clientName}.`);
                allTestsPassed = false;
                return;
            }

            const extractedDataString = JSON.stringify(extractedClientData.data.sort((a, b) => a.benefitName.localeCompare(b.benefitName)));
            const testCaseDataString = JSON.stringify(testCase.data.sort((a, b) => a.benefitName.localeCompare(b.benefitName)));

            if (extractedDataString !== testCaseDataString) {
                console.log(`Test failed for ${testCase.clientName}. Data does not match.`);
                allTestsPassed = false;
            } else {
                console.log(`Test passed for ${testCase.clientName}.`);
            }
        });

        if (allTestsPassed) {
            console.log("All tests passed.");
        } else {
            console.log("Some tests failed.");
        }
    }

    var intv = setInterval(function () {
        var elem = document.getElementById('addProposedInsuranceBtn');
        if (!elem) {
            return false; // Element not found, will try again
        }
        clearInterval(intv); // Element found, clear the interval
        setupUI(elem); // Now, pass the single found element to setupUI

        console.log(clientNames)
    }, 100);

    function extractNamesByMergeTag(mergeTag) {

        const elements = document.querySelectorAll(`var[data-mergetag="${mergeTag}"]`);
        return Array.from(elements)
          .map(el => el.textContent.trim())
      .filter(text => text != '');
    }


    function setupUI(element) {
        const existingButton = element; // Now correctly a single element

        let errorMessage = document.getElementById('noClientNamesError');
        if (!errorMessage) {
            errorMessage = document.createElement('p');
            errorMessage.id = 'noClientNamesError'; // Assign an ID for easy removal
            errorMessage.textContent = 'No client names found. Please use ctrl+f5 to reload if you want to upload the PDF.';
            errorMessage.style.color = 'red';
            existingButton.parentNode.insertBefore(errorMessage, existingButton.nextSibling);
        }

        if (!existingButton) {
            console.warn('The expected button element was not found.');
            return;
        }

        let infoContainer = document.getElementById('uploadInfoContainer');
        if (!infoContainer) {
            // Create a container for the upload button and additional information
            infoContainer = document.createElement('div');
            infoContainer.id = 'uploadInfoContainer';
            infoContainer.style.padding = '10px';
            infoContainer.style.marginTop = '10px';
            infoContainer.style.border = '1px solid #d3d3d3';
            infoContainer.style.borderRadius = '5px';
            infoContainer.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
            infoContainer.style.color = '#333';

            // Add descriptive text
            const headerText = "Automatic PDF data extraction and form filling tool."
            const header = document.createElement('h4');
            header.text = headerText;
            infoContainer.appendChild(header);
            const descriptions = [
                'Experimental Feature',
                // 'Not provided by TapNZ',
                'PARTNERSLIFE QUOTES ONLY',
                "Report any bugs to the ghost"
            ];
            descriptions.forEach(text => {
                const p = document.createElement('p');
                p.textContent = text;
                p.style.margin = '5px 0';
                infoContainer.appendChild(p);
            });

            // Create the file upload input
            const newButton = document.createElement('input');
            newButton.type = 'file';
            newButton.accept = '.pdf';
            newButton.className = existingButton.className; // Optional: Apply existing button's classes
            newButton.style.cssText = 'margin-top: 10px;' + existingButton.style.cssText; // Optional: Apply existing button's styles
            newButton.id = 'pdfUploadButton';
            newButton.addEventListener('change', handleFileUpload); // Ensure handleFileUpload is defined

            // Add the upload input to the container
            infoContainer.appendChild(newButton);

            // Insert the container after the existing button
            existingButton.parentNode.insertBefore(infoContainer, existingButton.nextSibling);
        } else {
            console.warn('Upload info container already exists.');
        }
    }


    async function handleFileUpload(event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = async (e) => {
                try {
                    const arrayBuffer = e.target.result;
                    console.log('getting all text')
                    const allText = await extractData(arrayBuffer);
                    const extractedData = processExtractedData(allText); // Adjust to return structured data
                    console.log('extracting data')
                    if (testing) {
                        runTests(extractedData); // Ensure this is the structured data arrayconst allNames = [...new Set([...dependantNames, ...peopleNames])];

                    }
                    await triggerFormFilling(extractedData);

                } catch (error) {
                    console.log(`Error processing PDF: ${error}`);
                }
            };
            reader.readAsArrayBuffer(file);
        }
    }

    async function extractData(arrayBuffer) {
        const pdfDoc = await pdfjsLib.getDocument(arrayBuffer).promise;
        let allText = '';
        let foundEnd = false;

        for (let pageNum = 1; pageNum <= pdfDoc.numPages && !foundEnd; pageNum++) {
            const page = await pdfDoc.getPage(pageNum);
            const textContent = await page.getTextContent();
            const pageText = textContent.items.map(item => item.str).join('\n');

            if (pageText.includes("Sum Insured Projections")) {
                allText += pageText.substring(0, pageText.indexOf("Sum Insured Projections"));
                foundEnd = true;
            } else {
                allText += pageText + '\n\n';
            }
        }
        return allText;
    }

    function findFallbackPremiumIndex(lines, startIndex) {
        // Start from startIndex, go back up to 10 lines
        for (let i = startIndex; i >= Math.max(startIndex - 15, 3); i--) {
            if (/\$\d+/.test(lines[i])) { // Regex to find a dollar sign followed by numbers
                return i; // Return the index of the first matching line
            }
        }
        return -1; // Return -1 if no match is found within the fallback range
    }

    function processExtractedData(allText) {
        // const lines = allText.split('\n');
        const lines = allText.split('\n').filter(line => {
            // Remove lines with dates. Matches two formats: dd/mm/yyyy or d/m/yyyy
            if (/\b\d{1,2}\/\d{1,2}\/\d{4}\b/.test(line)) return false;

            // Remove lines containing specific texts
            const patternsToRemove = [
                /partnerslife\.co\.nz/i, // Domain
                /\bAUDGES\b/i, // Specific keyword
                /\bDate of Illustration\b/i, // Specific phrase
                /0800 14 54 33/, // Phone number
                /\bExpense:/i, // Expense
                /M\/Campaign:/i, // Campaign
                /\bPL\w*/i // Starts with "PL" followed by any characters
            ];

            // If any pattern matches, return false to filter out the line
            return !patternsToRemove.some(pattern => pattern.test(line));
        });
        let currentName = '';
        let results = [];
        // console.log(lines)
        lines.forEach((line, index) => {
            const nameMatch = clientNames.find(client => line.includes(client));
            if (nameMatch) {
                currentName = nameMatch;
            } else {
                const benefitMatch = line.match(new RegExp(`^(${benefitTypes.join('|')})$`));
                if (benefitMatch) {
                    const benefitName = benefitMatch[1].trim();
                    let amount = '0';
                    let premium = '0';

                    if (lines[index + 2] && lines[index + 2].trim().startsWith("$")) {
                        amount = lines[index + 2].trim();
                    }

                    let nextBenefitIndex = lines.findIndex((l, i) => i > index && l.match(new RegExp(`^(${benefitTypes.join('|')})$`)));
                    let subTotalIndex = lines.findIndex((l, i) => i > index && l.includes(`Sub Total`));
                    let premiumIndex = Math.min(nextBenefitIndex !== -1 ? nextBenefitIndex : Infinity, subTotalIndex !== -1 ? subTotalIndex : Infinity);


                    if (premiumIndex > index && lines[premiumIndex - 2]) {
                        premium = lines[premiumIndex - 2].trim();
                    }
                    if (premium === '') {
                        console.log("Lookig for fallback")
                        const fallbackIndex = findFallbackPremiumIndex(lines, nextBenefitIndex);
                        if (fallbackIndex !== -1) {
                            // Fallback found, log the fallback "Premium" line
                            console.log(fallbackIndex + ": Fallback Premium: " + lines[fallbackIndex]);
                            premium = lines[fallbackIndex].trim();
                        }
                    }
                    console.log(premium)
                    console.log(results)
                    if (!results[currentName]) results[currentName] = [];
                    results[currentName].push({
                        type: benefitName,
                        amount: amount,
                        premium: premium
                    });
                }
            }
        });

        console.log(results);

        // Transform the results object to match the expected output format
        return Object.keys(results).map(clientName => ({
            clientName: clientName,
            benefits: results[clientName]
        }));

    }


    function formatResultsForTestCases(results) {
        const formattedResults = results.reduce((acc, curr) => {
            const { name, ...rest } = curr;
            if (!acc[name]) acc[name] = [];
            acc[name].push(rest);
            return acc;
        }, {});

        const testCaseFormat = Object.keys(formattedResults).map(clientName => ({
            clientName: clientName,
            data: formattedResults[clientName]
        }));

        // console.log(JSON.stringify(testCaseFormat, null, 2));
        return testCaseFormat
    }


    /// Browser Entering:

    // Define constants and mappings at the top for easy reference and modification.
    const testData = [
        {
            clientName: "Emma Test",
            benefits: [
                { type: "Life Cover", amount: "$500,000", premium: "25" },
                { type: "Private Medical Cover", amount: "$500 excess", premium: "36.22" }
            ]
        },
        {
            clientName: "Harry Test",
            benefits: [
                { type: "Life Cover", amount: "$250,000", premium: "20" },
                { type: "Income Cover", amount: "$3,000 per month", premium: "45" },
                { type: "Severe Trauma", amount: "$100,000", premium: "30" }
            ]
        },
        {
            clientName: "Ella Bakkum",
            benefits: [
                { type: "Mortgage Repayment Cover", amount: "$1,500 per month", premium: "50" },
                { type: "Premium Cover", amount: "0", premium: "15" },
                { type: "Moderate Trauma", amount: "$200,000", premium: "40" }
            ]
        }
    ];


    const benefitTypeMappings = {
        "Life Cover": "Life",
        "Private Medical Cover": "Medical Base Plan",
        "Mortgage Repayment Cover": "Mortgage",
        "Premium Cover": "Waiver of Premium",
        "Severe Trauma": "Severe Trauma",
        "Trauma Cover Accelerated": "TPD",
        "Moderate Trauma": "Moderate Trauma",
        "Income Cover": "Income"
    };

    // Function to simulate click events on elements.
    function simulateClick(element) {
        const event = new MouseEvent('click', { bubbles: true, cancelable: true });
        element.dispatchEvent(event);
    }

    function dispatchChangeEvent(element) {
        const mouseEvent = new MouseEvent('click', { bubbles: true, cancelable: true });
        const event = new Event('change', { bubbles: true, cancelable: true });
        element.dispatchEvent(event);
        const inputEvent = new Event('input', { bubbles: true, cancelable: false });

        element.dispatchEvent(inputEvent);
        element.dispatchEvent(mouseEvent);

    }

    // Wait for an element to become available within the DOM.
    async function waitForElement(selector, timeout = 30000) {
        const startTime = Date.now();

        function poll(resolve, reject) {
            const element = document.querySelector(selector);
            const elapsed = Date.now() - startTime;

            if (element) {
                resolve(element);
            } else if (elapsed < timeout) {
                setTimeout(() => poll(resolve, reject), 100); // Check every 100ms
            } else {
                reject(new Error(`Element ${selector} not found within ${timeout} milliseconds`));
            }
        }

        return new Promise(poll);
    }

    // Add a new row for entering benefits.
    async function addNewBenefitRow() {
        const addButton = await waitForElement("#addProductButton")
        if (addButton) simulateClick(addButton);
    }

    async function addNewClientRow() {
        const but = await waitForElement("#addProposedInsuranceBtn");
        if (but) simulateClick(but)
    }

    // Main function to fill in the form based on test data.

    // UPDATE: Correct the iteration and waiting mechanism for each client form submission
    async function fillInForms(data) {
        for (const client of data) {
            await addNewClientRow(); // Correct placement to wait for client row to be added
            await addNewClientBenefits(client);

            // Wait until the save button is clickable and then click it
            const saveBtn = await waitForElement('#saveButton', 5000); // Increase the timeout if necessary
            simulateClick(saveBtn);

            // Wait for the page or form to refresh and ready for the next input, adjust selector as necessary
            await new Promise(resolve => setTimeout(resolve, 5000)); // Wait for 5 seconds before proceeding to next client, adjust delay as needed
        }
    }


    async function addNewClientBenefits(client) {
        console.log(client.benefits.length);
        console.log(client.benefits);
        // For each client, add a new row and fill in the client name, provider, and benefits.
        for (let i = 0; i < client.benefits.length; i++) { // Use a standard loop to get access to the index
            const benefit = client.benefits[i];
            await addNewBenefitRow(); // Add a new row for the benefit.
            await fillInBenefitDetails(client.clientName, benefit, i); // Pass the index to fillInBenefitDetails
        }

    }


    async function fillInBenefitDetails(clientName, benefit, ind) {
        try {
            // Wait for the provider input to become available and set its value.
            await waitForElement("#provider");
            document.getElementById("provider").value = "Partners Life";

            // Trigger and wait for the life assured dropdown to be ready and interactable.
            if (clientName.length != 1) {
            const lifeAssuredDropdown = await waitForElement("#ddLifeAssured");
            lifeAssuredDropdown.value = "AddNew";
            dispatchChangeEvent(lifeAssuredDropdown);
            };

            console.log(`Inserting ${clientName} to #lifeAssured_${ind}`)
            const lifeAssuredSelect = await waitForElement(`#lifeAssured_${ind}`);
            let optionFound = false;
            // Find the option that contains the text matching 'clientName'
            const options = lifeAssuredSelect.querySelectorAll('option');
            console.log(options);
            for (const option of options) {
                console.log(option.textContent.trim());
                console.log(clientName)
                if (option.textContent.trim() === clientName) {
                    console.log("Found!")
                    console.log(option.textContent.trim());
                    console.log(clientName)

                    lifeAssuredSelect.value = option.value;
                    dispatchChangeEvent(lifeAssuredSelect);
                    optionFound = true;
                    // Exit the loop once the matching option is found and selected
                    break;
                }
            }

            if (!optionFound) {
                window.alert('Cannot find client. It must be an exact match to what is in the CRM.')
            }



            // Wait for the product selection to become available.
            const productSelect = await waitForElement(`#product_${ind}`);
            console.log(benefit.type)
            productSelect.value = benefitTypeMappings[benefit.type];
            productSelect.dispatchEvent(new Event('change', { bubbles: true }));

            // Set the amount and premiuQm.

            // Convert benefit amount and premium to integers, removing non-numeric characters except for decimal point
            const benefitAmount = benefit.amount.replace(/[^\d.]/g, '');
            // const premiumAmount = benefit.premium.replace(/[^\d.]/g, '');
            // Add extra logging for premiumAmount
            const premiumAmount = benefit.premium.replace(/[^\d.]/g, '');
            console.log(`Converted premiumAmount for ${clientName}, benefit ${benefit.type}: ${premiumAmount}`);

            const benefitSelect = await waitForElement(`#benefit_${ind}`);
            const premiumSelect = await waitForElement(`#premium_${ind}`);

            benefitSelect.value = benefitAmount;
            premiumSelect.value = premiumAmount;

            dispatchChangeEvent(benefitSelect);
            dispatchChangeEvent(premiumSelect);


            console.log(`Form filled for ${clientName}: ${benefit.type}`);

        } catch (error) {
            console.error("Error filling in benefit details:", error);
        }
    }

    // Helper function for delays
    function delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    function createLoadingOverlay() {
        const overlay = document.createElement('div');
        overlay.id = 'loadingOverlay';
        overlay.style.position = 'fixed';
        overlay.style.top = '0';
        overlay.style.left = '0';
        overlay.style.width = '100%';
        overlay.style.height = '100%';
        overlay.style.backgroundColor = 'rgba(0,0,0,0.5)';
        overlay.style.zIndex = '1000'; // Ensure it covers the whole page
        overlay.style.display = 'flex';
        overlay.style.justifyContent = 'center';
        overlay.style.alignItems = 'center';
        overlay.style.flexDirection = 'column';
        overlay.style.color = 'white';
        overlay.innerHTML = `
            <p>Filling fields, please wait...</p>
            <button id="exitOverlay" style="padding: 10px; margin-top: 20px;">Exit</button>
        `;

        document.body.appendChild(overlay);

        // Event listener for the Exit button
        document.getElementById('exitOverlay').addEventListener('click', function () {
            document.body.removeChild(overlay);
        });
    }

    function removeLoadingOverlay() {
        const overlay = document.getElementById('loadingOverlay');
        if (overlay) {
            document.body.removeChild(overlay);
        }
    }
    function triggerFormFilling(data) {
        createLoadingOverlay(); // Show loading overlay

        fillInForms(data).then(() => {
            removeLoadingOverlay(); // Remove overlay when done
            window.alert("Form filling process completed. Please verify the results manually.");
        }).catch(error => {
            removeLoadingOverlay(); // Ensure overlay is removed even on error
            console.error("Form filling process encountered an error:", error);
        });
    }

})();