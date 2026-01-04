// ==UserScript==
// @name         Happoshu hostname generator
// @namespace    https://tavern.corp.amazon.com/
// @version      0.8
// @description  Generate hostnames for MCM
// @author       chengng@
// @match        https://tavern.corp.amazon.com/happoshu*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/478770/Happoshu%20hostname%20generator.user.js
// @updateURL https://update.greasyfork.org/scripts/478770/Happoshu%20hostname%20generator.meta.js
// ==/UserScript==

/*
REVISION HISTORY:
0.1 - 2023-11-01 - chengng@ - Initial setup for the Happoshu
0.2 - 2023-11-06 - chengng@ - Now the hostname will display only once for all
0.3 - 2023-11-06 - chengng@ - Additional condition added for invalid input
0.4 - 2023-11-07 - chengng@ - Add happoshu setting recommendation to bypass the two regions issue
0.5 - 2023-11-07 - chengng@ - Small adjust for the wording
0.6 - 2023-11-07 - chengng@ - Update the happoshu setting again
0.7 - 2023-11-16 - chengng@ - BMN logic update
0.8 - 2023-11-17 - chengng@ - BMN logic fix
*/

(function() {
    'use strict';

    // Function to validate user input keywords
    function validateInput(input) {
        const validKeywords = ["fnc", "bwit", "bwie", "r53", "b16", "lci", "bmn", "dx", "optical"];
        const keywords = input.toLowerCase().split(' ');
        const invalidKeywords = keywords.filter(keyword => !validKeywords.includes(keyword));
        return {
            valid: invalidKeywords.length === 0,
            invalidKeywords: invalidKeywords
        };
    }

    // Function to prompt user for input until valid input is provided
    function promptForValidInput() {
        let userInput;
        let isValidInput = false;
        let invalidKeywords;

        while (!isValidInput) {
            userInput = prompt("Enter your input (choose from: fnc b16 bwit bwie r53 lci bmn dx optical):");

            if (!userInput) {
                // User canceled the prompt
                return null;
            }

            const validation = validateInput(userInput.toLowerCase()); // Convert input to lowercase for validation

            if (validation.valid) {
                isValidInput = true;
            } else {
                // Invalid keywords detected, display alert
                invalidKeywords = validation.invalidKeywords.join(', ');
                alert(`Invalid keywords: ${invalidKeywords}`);
            }
        }

        return userInput.toLowerCase(); // Convert user input to lowercase
    }

    // Read data from clipboard
    navigator.clipboard.readText().then(function(clipboardText) {
        const clipboardLines = clipboardText.split('\n');
        let userinput1 = clipboardLines[0];
        let userinput2 = clipboardLines[2];

        let userInput = promptForValidInput();

        if (!userInput) {
            // User canceled or provided invalid input
            return;
        }

        // Split user input into keywords
        let keywords = userInput.split(' ');

        // Initialize hostnames array
        let hostnames = [];

        // Generate hostnames based on user input
        let hasB16 = keywords.includes("b16");
        let hasBMN = keywords.includes("bmn");

        keywords.forEach(keyword => {
            switch (keyword) {
                case "fnc":
                    hostnames.push(
                        `${userinput1}-br-fnc-f1-b1-oob-r1`,
                        `${userinput1}-br-fnc-f1-b1-mgmt-sw1`,
                        `${userinput1}-br-fnc-f1-lul-mgmt-sw1`,
                        `${userinput1}-br-fnc-f1-b1-t2-r1`,
                        `${userinput1}-br-fnc-f1-b1-t2-r5`,
                        `${userinput1}-br-fnc-f1-b1-t1-r1`,
                        `${userinput1}-br-fnc-f1-b1-t1-r5`,
                        `${userinput1}-br-fnc-f1-b1-t1-r9`,
                        `${userinput1}-br-fnc-f1-b1-t1-r13`,
                        `${userinput1}-br-fnc-f1-b1-t2-r9`,
                        `${userinput1}-br-fnc-f1-b1-t2-r13`,
                        `${userinput1}-br-fnc-f1-lul-r1`,
                        `${userinput1}-br-eng-sw101`,
                        `${userinput1}-br-fnc-f1-b1-oob-r2`,
                        `${userinput1}-br-fnc-f1-b1-mgmt-sw2`,
                        `${userinput1}-br-fnc-br-eng-mgmt-sw1`,
                        `${userinput1}-br-fnc-f1-b1-t2-r2`,
                        `${userinput1}-br-fnc-f1-b1-t2-r6`,
                        `${userinput1}-br-fnc-f1-b1-t1-r2`,
                        `${userinput1}-br-fnc-f1-b1-t1-r6`,
                        `${userinput1}-br-fnc-f1-b1-t1-r10`,
                        `${userinput1}-br-fnc-f1-b1-t1-r14`,
                        `${userinput1}-br-fnc-f1-b1-t2-r10`,
                        `${userinput1}-br-fnc-f1-b1-t2-r14`,
                        `${userinput1}-br-fnc-f1-lul-r2`,
                        `${userinput1}-br-eng-sw102`,
                        `${userinput1}-br-fnc-f1-b1-oob-r3`,
                        `${userinput1}-br-fnc-f1-b1-mgmt-sw3`,
                        `${userinput1}-br-fnc-f1-b1-t2-r3`,
                        `${userinput1}-br-fnc-f1-b1-t2-r7`,
                        `${userinput1}-br-fnc-f1-b1-t1-r3`,
                        `${userinput1}-br-fnc-f1-b1-t1-r7`,
                        `${userinput1}-br-fnc-f1-b1-t1-r11`,
                        `${userinput1}-br-fnc-f1-b1-t1-r15`,
                        `${userinput1}-br-fnc-f1-b1-t2-r11`,
                        `${userinput1}-br-fnc-f1-b1-t2-r15`,
                        `${userinput1}-br-fnc-f1-lul-r3`,
                        `${userinput1}-br-eng-sw103`,
                        `${userinput1}-br-fnc-f1-b1-oob-r4`,
                        `${userinput1}-br-fnc-f1-b1-mgmt-sw4`,
                        `${userinput1}-br-fnc-f1-b1-t2-r4`,
                        `${userinput1}-br-fnc-f1-b1-t2-r8`,
                        `${userinput1}-br-fnc-f1-b1-t1-r4`,
                        `${userinput1}-br-fnc-f1-b1-t1-r8`,
                        `${userinput1}-br-fnc-f1-b1-t1-r12`,
                        `${userinput1}-br-fnc-f1-b1-t1-r16`,
                        `${userinput1}-br-fnc-f1-b1-t2-r12`,
                        `${userinput1}-br-fnc-f1-b1-t2-r16`,
                        `${userinput1}-br-fnc-f1-lul-r4`,
                        `${userinput1}-br-eng-sw104`
                    );
                    break;
                case "bwit":
                    hostnames.push(
                        `${userinput1}-br-fnc-f1-dos-oob-r1`,
                        `${userinput1}-br-fnc-f1-dos-mgmt-sw1`,
                        `${userinput1}-br-fnc-f1-dmt-sw1`,
                        `${userinput1}-br-fnc-f1-dos-r1`,
                        `${userinput1}-br-fnc-f1-dmt-sw2`,
                        `${userinput1}-br-fnc-f1-dos-r2`,
                        `${userinput1}-br-fnc-f1-dos-psc1`
                    );
                    break;
                case "b16":
                    // Handle "b16" separately below
                    break;
                case "bwie":
                    hostnames.push(
                        `${userinput1}-br-edg-dos-r1`,
                        `${userinput1}-br-edg-dos-r2`,
                        `${userinput1}-br-edg-dos-dmt-r1`,
                        `${userinput1}-br-edg-dos-dmt-r2`,
                        `${userinput1}-br-edg-dos-rack-acc-sw1`,
                        `${userinput1}-br-edg-dos-oob-r1`,
                        `${userinput1}-br-edg-dos-psc-r1`
                    );
                    break;
case "lci": {
    let lciNumber;
    do {
        lciNumber = prompt("Please enter the odd number LCI brick (example: 1, 3, 5, etc.):");
        var firstCluster = parseInt(lciNumber);
        var secondCluster = firstCluster + 1;
        if (!isNaN(firstCluster) && firstCluster % 2 === 1) {
            hostnames.push(
                `${userinput1}-br-cpu-c${firstCluster}-oob-r1`,
                `${userinput1}-br-cpu-c${firstCluster}-mgmt-sw1`,
                `${userinput1}-br-cpu-c${firstCluster}-acc-r2`,
                `${userinput1}-br-cpu-c${firstCluster}-acc-r1`,
                `${userinput1}-br-cpu-c${secondCluster}-oob-r1`,
                `${userinput1}-br-cpu-c${secondCluster}-mgmt-sw1`,
                `${userinput1}-br-cpu-c${secondCluster}-acc-r2`,
                `${userinput1}-br-cpu-c${secondCluster}-acc-r1`,
            );
        } else {
            alert("Invalid LCI number. Please enter the smallest odd number (1, 3, 5, etc.)");
        }
    } while (isNaN(firstCluster) || firstCluster % 2 === 0);
}
break;
                case "optical":
                    // Handle "optical" separately below
                    break;
                case "r53":
                    hostnames.push(
                        `${userinput1}-br-aws-dns-tor-r1`,
                        `${userinput1}-br-aws-dns-con-r1`,
                        `${userinput1}-br-aws-dns-rack-acc-sw1`,
                        `${userinput1}-br-aws-dns-oob-r1`
                    );
                    break;
        case "bmn":
            // If 'bmn' is combined with other keywords
            if (keywords.length > 1 && hasBMN) {
                hostnames.push(
                    `${userinput1}-br-mgt-con-r1`,
                    `${userinput1}-br-mgt-sw2`,
                    `${userinput1}-br-mgt-agg-r1`,
                    `${userinput1}-br-mgt-agg-r2`
                );
            } else {
                // If 'bmn' is the only keyword
                hostnames.push(
                    `${userinput1}-br-mgt-acc-v1`,
                    `${userinput1}-br-mgt-acc-v2`,
                    `${userinput1}-br-mgt-agg-r1`,
                    `${userinput1}-br-mgt-agg-r2`,
                    `${userinput1}-br-mgt-sw1`,
                    `${userinput1}-br-mgt-sw2`,
                    `${userinput1}-br-mgt-con-r1`
                );
            }
            break;
                case "dx":
                    // Handle "dx" separately below
                    break;
             }
        });

        // Handle "optical" keyword if it's present
        if (keywords.includes("optical")) {
            let ppNumber;
            do {
                ppNumber = prompt("Please enter the smaller PP number:\n[Example: enter 11 for PP11]");
                if (ppNumber !== null && /^\d+$/.test(ppNumber)) {
                    hostnames.push(
                        `${userinput1}-wdm-pp${ppNumber}x-s1`,
                        `${userinput1}-wdm-pp${ppNumber}y-s1`,
                        `${userinput1}-wdm-pp${ppNumber}-s2`,
                        `${userinput1}-wdm-pp${ppNumber}-s3`,
                        `${userinput1}-wdm-pp${ppNumber}-s4`,
                        `${userinput1}-wdm-pp${ppNumber}-s5`,
                        `${userinput1}-wdm-pp${parseInt(ppNumber) + 1}x-s1`,
                        `${userinput1}-wdm-pp${parseInt(ppNumber) + 1}y-s1`,
                        `${userinput1}-wdm-pp${parseInt(ppNumber) + 1}-s2`,
                        `${userinput1}-wdm-pp${parseInt(ppNumber) + 1}-s3`,
                        `${userinput1}-wdm-pp${parseInt(ppNumber) + 1}-s4`,
                        `${userinput1}-wdm-pp${parseInt(ppNumber) + 1}-s5`,
                        `${userinput1}-pp${ppNumber}-br-acc-sw1`,
                        `${userinput1}-pp${parseInt(ppNumber) + 1}-br-acc-sw1`
                    );
                } else {
                    alert("Invalid PP number. Please enter a valid number.");
                }
            } while (ppNumber === null || !/^\d+$/.test(ppNumber));
        }

if (keywords.includes("dx")) {
    let dxNumber;
    while (true) {
        dxNumber = prompt("Please enter the DX version from cutsheet:\n[Example: enter p1-v4 or p2-v5 etc.]");
        if (/^p[1-9]-v[1-9]$/i.test(dxNumber)) {
            break; // Exit the loop if a valid DX version is entered
        } else {
            alert("Invalid DX version, please enter a valid DX version.");
        }
    }

    let oobCorpNumber;
    while (true) {
        oobCorpNumber = prompt("Please enter the DX OOB corp number:");
        if (/^[1-9]\d*$/.test(oobCorpNumber)) {
            break; // Exit the loop if a valid number is entered
        } else {
            alert("Invalid DX OOB corp number. Please enter a valid number.");
        }
    }

    const AAA = determineAAA(userinput1);

    if (dxNumber !== null && /^p[1-9]-v[1-9]$/i.test(dxNumber) && /^[1-9]\d*$/.test(oobCorpNumber)) {
        hostnames.push(
            `${userinput1}-oob-corp-r${oobCorpNumber}`,
            `${userinput1}-br-acc-sw-IP`,
            `${userinput1}-vc-cas-spare`,
            `${userinput1}-vc-car-${AAA}-${dxNumber}-r1`,
            `${userinput1}-vc-car-${AAA}-${dxNumber}-r2`,
            `${userinput1}-vc-cas-${AAA}-${dxNumber}-r101`,
            `${userinput1}-vc-cas-${AAA}-${dxNumber}-r102`,
            `${userinput1}-vc-cas-${AAA}-${dxNumber}-r103`,
            `${userinput1}-vc-cas-${AAA}-${dxNumber}-r104`,
            `${userinput1}-vc-cas-${AAA}-${dxNumber}-r201`,
            `${userinput1}-vc-cas-${AAA}-${dxNumber}-r202`,
            `${userinput1}-vc-cas-${AAA}-${dxNumber}-r203`,
            `${userinput1}-vc-cas-${AAA}-${dxNumber}-r204`
        );
    }
}

// Function to determine AAA based on userinput1
function determineAAA(userInput1) {
    let AAA = '';
    const firstThreeLetters = userInput1.slice(0, 3);
    switch (firstThreeLetters) {
        case 'NRT':
        case 'KIX':
        case 'TPE':
            AAA = 'NRT';
            break;
        case 'BKK':
        case 'SIN':
        case 'KUL':
        case 'MNL':
        case 'HAN':
        case 'SGN':
        case 'MAA':
            AAA = 'SIN';
            break;
        case 'CBR':
        case 'SYD':
        case 'ADL':
        case 'AKL':
        case 'BNE':
        case 'MEL':
        case 'PER':
        case 'DBO':
            AAA = 'SYD';
            break;
        case 'CGK':
            AAA = 'CGK';
            break;
        case 'DEL':
        case 'BOM':
        case 'CCU':
        case 'HYD':
        case 'BLR':
        case 'PNQ':
            AAA = 'BOM';
            break;
        case 'HKG':
            AAA = 'HKG';
            break;
        default:
            break;
    }
    return AAA;
}



// Handle "b16" separately if it's present
if (hasB16) {
    let validPopIds = false;
    let popIds = [];

    while (!validPopIds) {
        // Prompt the user to manually enter PoP IDs
        let popInput = prompt("B16 hostname didn't detect, please manually put the PoP id.\nExample: P1 P2 P3 (please use space in between each PoP)");

        if (popInput) {
            // Extract PoP IDs using the regular expression
            popIds = popInput.toUpperCase().match(/P[1-9]/g);

            if (popIds) {
                validPopIds = true; // Set the flag to exit the loop
            } else {
                alert("Invalid input. Please provide PoP IDs in the correct format (e.g., P1 P2 P3).");
            }
        } else {
            // User canceled or entered an empty input, you can handle this case as needed.
            // For simplicity, we'll break the loop.
            break;
        }
    }

    if (validPopIds) {
        popIds.forEach(pNumber => {
            hostnames.push(
                `${userinput1}-br-cdn-${pNumber}-tor-r1`,
                `${userinput1}-br-cdn-${pNumber}-tor-r2`,
                `${userinput1}-br-cdn-${pNumber}-con-r1`,
                `${userinput1}-br-cdn-${pNumber}-con-r2`,
                `${userinput1}-br-cdn-${pNumber}-rack-acc-sw1`,
                `${userinput1}-br-cdn-${pNumber}-rack-acc-sw2`,
                `${userinput1}-br-cdn-${pNumber}-oob-r1`,
                `${userinput1}-br-cdn-${pNumber}-oob-r2`
            );
        });
    }
}


        // Convert generated hostnames to lowercase
        hostnames = hostnames.map(hostname => hostname.toLowerCase());

        // Create a floating small window to display hostnames and "Copy to Clipboard" button
        const hostnameWindow = document.createElement('div');
        hostnameWindow.style.position = 'fixed';
        hostnameWindow.style.top = '50%';
        hostnameWindow.style.left = '50%';
        hostnameWindow.style.transform = 'translate(-50%, -50%)';
        hostnameWindow.style.padding = '10px';
        hostnameWindow.style.background = 'white';
        hostnameWindow.style.border = '1px solid #ccc';
        hostnameWindow.style.borderRadius = '5px';
        hostnameWindow.style.zIndex = '9999';

        const hostnameList = document.createElement('ul');
        hostnameList.style.listStyle = 'none';
        hostnameList.style.padding = '0';

        // Add hostnames to the list
        hostnames.forEach(hostname => {
            const listItem = document.createElement('li');
            listItem.textContent = hostname;
            hostnameList.appendChild(listItem);
        });

     // Create a styled text line with 'strong' element for TURN OFF
    const styledText = document.createElement('p');
    styledText.textContent = '1. Please ';

    const turnOffText = document.createElement('strong');
    turnOffText.textContent = 'confirm ';

    const restOfMessage = document.createTextNode(' happoshu settings like below picture');

    // Append text nodes and strong element to the paragraph
    styledText.appendChild(turnOffText);
    styledText.appendChild(restOfMessage);

    // Append the styled text line above the image
    hostnameWindow.appendChild(styledText);

                // Create an image element with base64 encoding
        const base64String = `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`;
//        const base64String = `ABC`;
        const imageElement = document.createElement('img');
        imageElement.src = `data:image/png;base64,${base64String}`;
    imageElement.style.width = '500px'; // Adjust the size as needed
    imageElement.style.height = '35px';
    imageElement.style.marginTop = '5px';
    imageElement.style.marginBottom = '5px'; // Spacing below the image

       // Append the image element above the list
        hostnameWindow.appendChild(imageElement);



// Create a styled text line with 'strong' element for region
const styledText1 = document.createElement('p');
styledText1.textContent = '2. Please ';

const turnOffText1 = document.createElement('strong');
turnOffText1.textContent = 'manual select ';
turnOffText1.style.color = 'red'; // Set the color to red

const restOfMessage1 = document.createTextNode(' correct region');

// Append text nodes and strong element to the paragraph
styledText1.appendChild(turnOffText1);
styledText1.appendChild(restOfMessage1);

// Append the styled text line above the image
hostnameWindow.appendChild(styledText1);

        // Create an image element with base64 encoding
        const base64String1 = `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`;
//        const base64String1 = `ABC`;
        const imageElement1 = document.createElement('img');
        imageElement1.src = `data:image/png;base64,${base64String1}`;
    imageElement1.style.width = '200px'; // Adjust the size as needed
    imageElement1.style.height = 'auto';
    imageElement1.style.marginTop = '5px';
    imageElement1.style.marginBottom = '5px'; // Spacing below the image

   hostnameWindow.appendChild(imageElement1);

        // Create a styled text line with 'strong' element for region
const styledText2 = document.createElement('p');
styledText2.textContent = '3. Please ';

const turnOffText2 = document.createElement('strong');
turnOffText2.textContent = 'Verify Hostnames ';
turnOffText2.style.color = 'red'; // Set the color to red

const restOfMessage2 = document.createTextNode(' accuracy');

// Append text nodes and strong element to the paragraph
styledText2.appendChild(turnOffText2);
styledText2.appendChild(restOfMessage2);

// Append the styled text line above the image
        hostnameWindow.appendChild(styledText2);
        hostnameWindow.appendChild(hostnameList);

    const copyButton = document.createElement('button');
    copyButton.textContent = '4. Everything checked, copy for search!';
    copyButton.style.marginTop = '10px';
    copyButton.style.color = 'red'; // Apply red color to the button text

    copyButton.addEventListener('click', () => {
        const allHostnames = hostnames.join(', ');
        navigator.clipboard.writeText(allHostnames).then(function() {
            // Close the popup window after copying to clipboard
            document.body.removeChild(hostnameWindow);
            alert('Hostnames have been copied, please make sure you paste the markdown into MCM template info .');
        }).catch(function(error) {
            console.error('Failed to copy to clipboard:', error);
        });
    });

    // Append the copy button
    hostnameWindow.appendChild(copyButton);

    // Add the floating window to the body of the page
    document.body.appendChild(hostnameWindow);

        // Apply styles directly through JavaScript after adding to the DOM
    turnOffText.style.color = 'red';
    });
})();