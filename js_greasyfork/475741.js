// ==UserScript==
// @name         PCF and MCM helper
// @namespace    http://approval.amazon.com/
// @version      0.3
// @description  Create PCF and relate MCM tickets
// @author       chengng@
// @match        https://approvals.amazon.com/template/createApproval/66539
// @match        https://playbook2.amazon.com/project/*
// @match        https://approvals.amazon.com/approval/edit/*
// @match        https://mcm.amazon.com/cms/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/475741/PCF%20and%20MCM%20helper.user.js
// @updateURL https://update.greasyfork.org/scripts/475741/PCF%20and%20MCM%20helper.meta.js
// ==/UserScript==

/*
REVISION HISTORY:
0.1 - 2023-09-20 - chengng@ - Initial setup for the PCF helper
0.2 - 2023-09-20 - chengng@ - change name and integrated with Notify helper
0.3 - 2023-09-24 - chengng@ - Related items will now add primary sim, playbook and NDE cutsheet
*/

(function() {
    'use strict';

    // Function to add a value and click the "Add" button for also notify
    function addValueAndClickNTF(value) {
        const inputField = document.getElementById('add_to_also_notify');
        const addButton = document.getElementById('add_to_also_notify_button');

        if (inputField && addButton) {
            inputField.value = value;
            addButton.click();
        }
    }

    // Function to add SNS Topic and click the corresponding button
    function addSnsTopicAndClickNTF(buttonId, inputId, value) {
        var addButton = document.getElementById(buttonId);
        var inputField = document.getElementById(inputId);

        if (addButton && inputField && !inputField.value) {
            inputField.value = value;
            addButton.click();
        }
    }

     // Determine which site we're on
    const currentURL = window.location.href;

if (currentURL.includes('https://approvals.amazon.com/template/createApproval/66539')) {
    // Only execute the function for PCF
    window.addEventListener('load', function () {
        setTimeout(function () {
            updateInputFieldPCF();
            insertIntoTablePCF();
            addTableToIframePCF();
        }, 2000);
    });

    } else if (currentURL.includes('https://playbook2.amazon.com/project/')) {
        window.addEventListener('load', function () {
            setTimeout(async function () {
                await findAndDisplayContent();
                window.location.href = 'https://approvals.amazon.com/template/createApproval/66539';
            }, 2000);
        });
    } else if (currentURL.includes('https://mcm.amazon.com/cms/')) {
        window.addEventListener('load', function () {
            setTimeout(function () {
                // Move the status check and other relevant logic here
                var statusHeader = document.getElementById('cm_status_header');
                if (statusHeader) {
                    var statusText = statusHeader.textContent.trim();
                    if (statusText === 'Draft') {
                        // Add state and approver transition topics
                        addSnsTopicAndClickNTF('add_state-notification_button', 'add_state_transition_topics', 'arn:aws:sns:us-east-1:398090684421:apac-edge-projects-mcm-notifications');
                        addSnsTopicAndClickNTF('add_approver-notification_button', 'add_approver_transition_topics', 'arn:aws:sns:us-east-1:398090684421:apac-edge-projects-mcm-notifications');

                        // Add the "also notify" entries only if the status is Draft
                        addValueAndClickNTF("apac-edge-projects");
                        setTimeout(() => {
                            addValueAndClickNTF("global-edge-dco");
                        }, 1000); // Wait for 1 second before adding the next value

                        // additional logic for mcm.amazon.com - Line 3
                        const dropdownLine3 = document.querySelector('#add_related_item_type'); // Select the dropdown for Line 3
                        if (dropdownLine3) {
                            dropdownLine3.value = "SIM"; // Set the dropdown value for Line 3 to "SIM"
                        }

                        const inputForLine3 = document.querySelector('#add_related_item_inputs > input'); // Select the input field for Line 3
                        if (inputForLine3) {
                            navigator.clipboard.readText().then(function (clipboardText) {
                                const lines = clipboardText.split('\n');
                                if (lines.length >= 4) {
                                    const line3Last10 = lines[3].slice(-10);
                                    inputForLine3.value = line3Last10; // Populate the input field for Line 3
                                }
                            });
                        }

                        const addButtonLine3 = document.querySelector('#add_related_item'); // Select the "Add" button for Line 3
                        if (addButtonLine3) {
                            setTimeout(() => {
                                addButtonLine3.click(); // Click the "Add" button for Line 3 after a delay

                                // additional logic for mcm.amazon.com - Line 4
                                const dropdownLine4 = document.querySelector('#add_related_item_type'); // Select the dropdown for Line 4
                                if (dropdownLine4) {
                                    dropdownLine4.value = "Playbook Project"; // Set the dropdown value for Line 4 to "Playbook Project"
                                }

                                const inputForLine4 = document.querySelector('#add_related_item_inputs > input'); // Select the input field for Line 4
                                if (inputForLine4) {
                                    navigator.clipboard.readText().then(function (clipboardText) {
                                        const lines = clipboardText.split('\n');
                                        if (lines.length >= 5) {
                                            const line4Last6 = lines[4].slice(-6);
                                            inputForLine4.value = line4Last6; // Populate the input field for Line 4
                                        }
                                    });
                                }

                                const addButtonLine4 = document.querySelector('#add_related_item'); // Select the "Add" button for Line 4
                                if (addButtonLine4) {
                                    setTimeout(() => {
                                        addButtonLine4.click(); // Click the "Add" button for Line 4 after a delay

                                        // additional logic for mcm.amazon.com - Line 5
                                        const dropdownLine5 = document.querySelector('#add_related_item_type'); // Select the dropdown for Line 5
                                        if (dropdownLine5) {
                                            dropdownLine5.value = "MCM"; // Set the dropdown value for Line 5 to "MCM"
                                        }

                                        const inputForLine5 = document.querySelector('#add_related_item_inputs > input'); // Select the input field for Line 5
                                        if (inputForLine5) {
                                            navigator.clipboard.readText().then(function (clipboardText) {
                                                const lines = clipboardText.split('\n');
                                                if (lines.length >= 6) {
                                                    const line5Last12 = lines[5].slice(-12);
                                                    inputForLine5.value = line5Last12; // Populate the input field for Line 5
                                                }
                                            });
                                        }

                                        const addButtonLine5 = document.querySelector('#add_related_item'); // Select the "Add" button for Line 5
                                        if (addButtonLine5) {
                                            setTimeout(() => {
                                                addButtonLine5.click(); // Click the "Add" button for Line 5 after a delay
                                            }, 1000); // 1-second delay before adding Line 5
                                        }
                                    }, 1000); // 1-second delay before adding Line 4
                                }
                            }, 1000); // 1-second delay before adding Line 3
                        }
                    }
                }
            });
        });
    }




    // Function to update input field for PCF
    function updateInputFieldPCF() {
        // Store the existing content
        navigator.clipboard.readText().then(function(clipboardText) {
            console.log("Clipboard text read successfully.");

            const clipboardLines = clipboardText.split('\n');
            const userinput1 = clipboardLines[0] || '';
            const userinput4 = clipboardLines[1] || '';
            const userinput3 = clipboardLines[2] || '';
            const userinput7 = clipboardLines[3] || '';
            const PBLink = clipboardLines[4] || '';
            const NDECutsheet = clipboardLines[5] || '';
            const RSPCLink = clipboardLines[7] || '';
            const CblIstLink = clipboardLines[8] || '';
            const CblPatLink = clipboardLines[9] || '';
            const MobiusLink = clipboardLines[10] || '';
            const DCEOLink = clipboardLines[11] || '';
            const POdetail = clipboardLines[12] || '';

            // Create a 3rd value based on userinput1
            const firstThreeLetters = userinput1.slice(0, 3);
            const lastTwoLetters = userinput1.slice(-2);
            const thirdValue = `Shared With Me/APAC/${firstThreeLetters}/${lastTwoLetters}/`;

            // Define userinput2 based on userinput3 content
            let userinput2;
            if (userinput3.toLowerCase().includes("fnc") || userinput3.toLowerCase().includes("bwit") || userinput3.toLowerCase().includes("homestead") ||
                userinput3.toLowerCase().includes("bmn") || userinput3.toLowerCase().includes("ubiquity") || userinput3.toLowerCase().includes("optical")) {
                userinput2 = "border";
            } else if (userinput3.toLowerCase().includes("dx")) {
                userinput2 = "DX";
            } else if (userinput3.toLowerCase().includes("lci")) {
                userinput2 = "border"; // Define userinput2 as "border" for LCI
            } else if (userinput3.toLowerCase().includes("p1") || userinput3.toLowerCase().includes("p2") || userinput3.toLowerCase().includes("p3") ||
                userinput3.toLowerCase().includes("p4") || userinput3.toLowerCase().includes("p5") || userinput3.toLowerCase().includes("p6") ||
                userinput3.toLowerCase().includes("p7") || userinput3.toLowerCase().includes("p8") || userinput3.toLowerCase().includes("p9") ||
                userinput3.toLowerCase().includes("cf") || userinput3.toLowerCase().includes("r53") || userinput3.toLowerCase().includes("bwie")) {
                userinput2 = "CF";
            } else {
                userinput2 = "other";
            }

            // Update the title field
            const titleInput = document.getElementById('txtTitle');
            if (titleInput) {
                titleInput.value = `[APAC-Edge][PCF]<${userinput1}><${userinput2}><${userinput3}> - Project Completion Form by Edge Team`;
            }

            addTableToIframePCF(userinput7, userinput4, thirdValue, NDECutsheet, RSPCLink, CblIstLink, CblPatLink, MobiusLink, DCEOLink, POdetail, userinput1, userinput2, userinput3);

        }).catch(function(err) {
            console.error("Could not read clipboard:", err);
        });
    }

function insertIntoTablePCF(iframeDocument, userinput, index, userinput1 = null, userinput2 = null, userinput3 = null) {
    const allTDs = iframeDocument.querySelectorAll('td');
    const specialIndices = [28, 32, 36, 40, 44, 52, 56, 60, 68, 76, 88, 92, 96, 100, 108, 112, 120, 128, 136, 144, 156, 164, 172, 180, 184, 192, 200, 208, 216, 224, 232, 240, 248, 252, 260, 264, 268, 272]; // These are all those cells need to change to "Done"

    if (allTDs && allTDs[index]) {
        const targetTD = allTDs[index];
        if (specialIndices.includes(index)) {
            let textElement = targetTD.querySelector('pre');
            if (textElement) {
                textElement.textContent = "Done";
                if ((index === 224 || index === 216) && userinput1 && userinput3) {
                    let additionalURL = '';
                    let lowerCaseUserInput3 = userinput3.toLowerCase();
                    if (lowerCaseUserInput3.includes('dx')) {
                        additionalURL = `https://tavern.corp.amazon.com/happoshu?all_sources=true&partial_match=true&all_devices_in_rack=true&show_deleted=false&device_names=${userinput1}-vc-c`;
                    } else if (lowerCaseUserInput3.includes('bwie')) {
                        additionalURL = `https://tavern.corp.amazon.com/happoshu?all_sources=true&partial_match=true&all_devices_in_rack=true&show_deleted=false&device_names=${userinput1}-br-edg`;
                    } else if (lowerCaseUserInput3.includes('fnc') || lowerCaseUserInput3.includes('bwit')) {
                        additionalURL = `https://tavern.corp.amazon.com/happoshu?all_sources=true&partial_match=true&all_devices_in_rack=true&show_deleted=false&device_names=${userinput1}-br-fnc`;
                    } else if (['p1', 'p2', 'p3', 'p4', 'p5', 'p6', 'p7', 'p8', 'p9', 'cf', 'r53', 'bwie'].some(sub => lowerCaseUserInput3.includes(sub))) {
                        additionalURL = `https://tavern.corp.amazon.com/happoshu?all_sources=true&partial_match=true&all_devices_in_rack=true&show_deleted=false&device_names=${userinput1}-br-cdn`;
                    } else if (lowerCaseUserInput3.includes('lci')) {
                        additionalURL = `https://tavern.corp.amazon.com/happoshu?all_sources=true&partial_match=true&all_devices_in_rack=true&show_deleted=false&device_names=${userinput1}-br-cpu`;
                    } else if (lowerCaseUserInput3.includes('r53')) {
                        additionalURL = `https://tavern.corp.amazon.com/happoshu?all_sources=true&partial_match=true&all_devices_in_rack=true&show_deleted=false&device_names=${userinput1}-br-aws`;
                    }
                    if (additionalURL) {
                        textElement.textContent = `Done, ${additionalURL}`;
                    }
                }

                // Special handling for index 208
                if (index === 208) {
                    const additionalURL = `https://infrastructure.amazon.com/automation/locationBrowser.cgi`;
                    textElement.textContent = `Done, ${additionalURL}`; // Changed to "Done, additionalURL"
                }

                // Special handling for index 232
                if (index === 232 && userinput1) {
                    const firstThree = userinput1.slice(0, 3);
                    const lastTwo = userinput1.slice(-2);
                    textElement.textContent = `Done, /Amazon WorkDocs Drive/Shared With Me/APAC/${firstThree}/${lastTwo}/1. As Built/3. Rack Elevations`;
                }

                // Special handling for index 268
                if (index === 268 && userinput1) {
                    const additionalURL = `https://w.amazon.com/bin/view/APAC_Edge/${userinput1}`;
                    textElement.textContent = `Done, ${additionalURL}`; // Changed to "Done, additionalURL"
                }

                // Special handling for index 272
                if (index === 272 && userinput1) {
                    const additionalURL = `https://mobility.amazon.com/part/bin?search_type=site&search_string=${userinput1}&max_rows=50&query=GO`;
                    textElement.textContent = `Done, ${additionalURL}`; // Changed to "Done, additionalURL"
                }
            }
        } else {
            const pElement = document.createElement("p");
            pElement.textContent = userinput;
            targetTD.appendChild(pElement);
        }
    }

    // Copy the entire content of the iframe to the clipboard
    const iframeContent = iframeDocument.body.innerHTML;
    navigator.clipboard.writeText(iframeContent)
        .then(() => {
            console.log("Content of the iframe copied to clipboard after updating <td> element.");

            // Trigger a click event on the "Source" button within the CKEditor toolbar
            const toolbarSpan = iframeDocument.getElementById("cke_5708_toolbox");
            if (toolbarSpan) {
                const sourceButton = toolbarSpan.querySelector("[aria-labelledby='cke_5717']");
                if (sourceButton) {
                    sourceButton.click();
                    console.log("Clicked the 'Source' button within CKEditor.");
                } else {
                    console.error("Source button not found within the CKEditor toolbar.");
                }
            } else {
                console.error("CKEditor toolbar span element not found within the iframe.");
            }

        })
        .catch((error) => {
            console.error("Failed to copy iframe content to clipboard:", error);
        });
}


    // Function to update input field for PCF
    function addTableToIframePCF(userinput7, userinput4, thirdValue, NDECutsheet, RSPCLink, CblIstLink, CblPatLink, MobiusLink, DCEOLink, POdetail, userinput1, userinput2, userinput3) {
        const iframe = document.querySelector('.cke_wysiwyg_frame');
        if (!iframe) {
            console.error("iframe not found");
            return;
        }

        const iframeDocument = iframe.contentDocument || iframe.contentWindow.document;

        // Check if CblIstLink and CblPatLink have different values
        const combineCblLinks = CblIstLink !== CblPatLink;

        insertIntoTablePCF(iframeDocument, userinput7, 1); // 0-based index for the 2nd <td>
        insertIntoTablePCF(iframeDocument, userinput4, 3); // 0-based index for the 4th <td>
        insertIntoTablePCF(iframeDocument, NDECutsheet, 5);
        insertIntoTablePCF(iframeDocument, RSPCLink, 7);
        insertIntoTablePCF(iframeDocument, DCEOLink, 9);

        if (combineCblLinks) {
            // Combine CblIstLink and CblPatLink if they have different values
            const combinedCblLinks = CblIstLink + ' & ' + CblPatLink;
            insertIntoTablePCF(iframeDocument, combinedCblLinks, 11);
        } else {
            // Use only CblIstLink if CblIstLink and CblPatLink are the same
            insertIntoTablePCF(iframeDocument, CblIstLink, 11);
        }

        insertIntoTablePCF(iframeDocument, thirdValue, 15);
        // insertIntoTablePCF(iframeDocument, MobiusLink, 19);
        insertIntoTablePCF(iframeDocument, POdetail, 17);
        // For the special indices
        [28, 32, 36, 40, 44, 52, 56, 60, 68, 76, 88, 92, 96, 100, 108, 112, 120, 128, 136, 144, 156, 164, 172, 180, 184, 192, 200, 208, 216, 224, 232, 240, 248, 252, 260, 264, 268, 272].forEach(index => {
            insertIntoTablePCF(iframeDocument, null, index, userinput1, userinput2, userinput3);
        });
    }

    // Function to find and display the content
    async function findAndDisplayContent() {
        // Find all <pb-markdown> elements
        const pbElements = document.querySelectorAll('pb-markdown');
        // Variable to hold the target element
        let targetPbElement = null;

        pbElements.forEach((el) => {
            if (el.getAttribute('[data]') === 'vm.project.description') {
                targetPbElement = el;
            }
        });

        if (targetPbElement) {
            // Find all <p> tags inside this <pb-markdown> element
            const pElements = targetPbElement.querySelectorAll('p');
            let contentToAppend = '';

            // Combine all <p> contents into one string
            let allContent = '';
            pElements.forEach(p => {
                allContent += ' ' + (p.textContent || p.innerText);
            });

            const sections = [
                {start: "Cut-sheet MCM(s):", end: "RSPC TT(s):"},
                {start: "RSPC TT(s):", end: "Cabling MCM(s):"},
                {start: "Cabling MCM(s):", end: "Live Device patching MCM:"},
                {start: "Live Device patching MCM:", end: "Mobius Link:"},
                {start: "Mobius Link:", end: "Rack install MCM (A/B Flip test):"},
                {start: "Rack install MCM (A/B Flip test):", end: "List POs received as part of the project:"},
                {start: "List POs received as part of the project:", end: "MCM DCO hand-off approval:"},
            ];

            for (const {start, end} of sections) {
                const startIndex = allContent.indexOf(start);
                const endIndex = allContent.indexOf(end);

                if (startIndex !== -1 && endIndex !== -1) {
                    const sectionContent = allContent.substring(startIndex + start.length, endIndex);

        if (start === "List POs received as part of the project:") {
            // Extract everything for this specific section and normalize newline characters
            const singleLineContent = sectionContent.replace(/\n/g, ' ').trim();
            contentToAppend += singleLineContent + '\n';
        } else {
            // For other sections, extract based on the https:// condition
            const urls = sectionContent.match(/https:\/\/\S+/g);
            if (urls && urls.length > 0) {
                contentToAppend += urls.join(' & ') + '\n';
            } else {
                contentToAppend += 'Nothing detected, PLEASE CHECK!\n';
            }
        }
    }
}
        try {
            const clipboardData = await navigator.clipboard.readText();
            const newClipboardData = clipboardData + '\n' + contentToAppend;
            await navigator.clipboard.writeText(newClipboardData);
        } catch (err) {
            console.error("Failed to access clipboard:", err);
        }
    }
}
})();