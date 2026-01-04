// ==UserScript==
// @name         Device Build/Config Helper
// @namespace    http://mcm.amazon.com/
// @version      0.3
// @description  Help to fill the device build/config MCM template
// @author       chengng@
// @match        https://mcm.amazon.com/cms/new?from_template=0b3579e5-e2c5-4a19-9474-1e6f14e64aed
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/479215/Device%20BuildConfig%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/479215/Device%20BuildConfig%20Helper.meta.js
// ==/UserScript==

/*
REVISION HISTORY:
0.1 - 2023-09-13 - chengng@ - Initial setup for the helper
0.2 - 2023-11-08 - chengng@ - reduce the script size by removing the unnecessary parts
0.3 - 2024-01-30 - chengng@ - small adjustment to title detection
*/

// Define userinput1 and userinput2 variables outside of the callback
let userinput1;
let userinput2;
let userinput12;
let scriptExecuted = false; // Flag to control script execution


(function() {
    'use strict';

    // Function to extract content between square brackets
    function extractContent(inputString, startChar, endChar, occurrence) {
        const regex = new RegExp(`\\${startChar}(.*?)\\${endChar}`, 'gi'); // Case-insensitive regex
        const matches = inputString.match(regex);
        if (matches && matches.length >= occurrence) {
            return matches[occurrence - 1].slice(1, -1); // Remove the brackets
        }
        return '';
    }

    // Function to set the value of a textarea by its ID
    function setTextareaValue(id, value) {
        const textarea = document.getElementById(id);
        if (textarea) {
            textarea.value = value;
        }
    }


    // Function to replace a placeholder in an input field with a specific name
    function replacePlaceholderInInput(inputName, placeholder, replacement) {
        const inputField = document.querySelector(`input[name="${inputName}"]`);
        if (inputField) {
            inputField.value = inputField.value.replace(placeholder, replacement);
        }
    }

    // Read user inputs from the clipboard
    navigator.clipboard.readText().then(function(clipboardText) {
        const clipboardLines = clipboardText.split('\n');
        userinput1 = clipboardLines[0] || '';
        const userinput4 = clipboardLines[1] || '';
        const userinput3 = clipboardLines[2] || '';
        const userinput7 = clipboardLines[3] || '';
        const NDEcutsheet = clipboardLines[5] || '';

        // Define predefined values for userinputs 8 to 23
        const userinput5 = "build/configure";
        const userinput5a = `Build/configure devices for project of ${userinput3} at ${userinput1}`;
        const userinput6 = "No";
        const userinput8 = "N/A";
        const userinput9 = "See attached cutsheet";
        const userinput10 = "No";
        const userinput11 = "N/A";
        const userinput12a = "N/A";
        const userinput13 = "See attached cutsheet";
        const userinput14 = "Normal business hour";
        const userinput15 = "No";
        const userinput16 = "Yes" + (NDEcutsheet ? ` - ${NDEcutsheet}` : "");
        const userinput17 = "Non-intrusive";
        const userinput18 = "Yes";
        const userinput19 = "Device build/config/upgrade is Tier 3 as per https://w.amazon.com/bin/view/GlobalEdge/Documentation/MCM/";
        const userinput20 = "Day 1-3: Edge Projects POC will perform build/config of devices and/or upgrade mostly taken care by SwithBuilder, but manual upgrade might also be required\nDay 4-5: Troubleshooting when applicable\nDay 6: Removal of rubbish at the end";
        const userinput21 = "Impact could cause interface flapping which could cause customer impact";
        const userinput22 = "Fibers could be bumped, jarred, and bent during installations";
        const userinput23 = "1.) In the event that impact is detected by INFRA/EDGE Ops (depend on site ownership) oncall, EDGE Projects will immediately halt work.\n2.) Edge Projects will standby for directions provided by INFRA/EDGE Ops (depend on site ownership) oncall to assist in mitigation of impact.\n3.) EDGE Projects will perform said directed activities and inform INFRA/EDGE Ops (depend on site ownership) oncall of expected recovery.\n4.) EDGE Projects will then confirm recovery and re-evaluate if work can re-continue alongside INFRA/EDGE Ops (depend on site ownership)."; // Predefined input for 26_describe_rollback_plan

        // Define userinput2 based on userinput3 content
        if (userinput3.toLowerCase().includes("fnc") || userinput3.toLowerCase().includes("bwit") || userinput3.toLowerCase().includes("homestead") ||
            userinput3.toLowerCase().includes("bmn") || userinput3.toLowerCase().includes("ubq") || userinput3.toLowerCase().includes("ubiquity") || userinput3.toLowerCase().includes("optical")) {
            userinput2 = "border";
        } else if (userinput3.toLowerCase().includes("dx")) {
            userinput2 = "DX";
        } else if (userinput3.toLowerCase().includes("lci")) {
            userinput2 = "border";
        } else if (userinput3.toLowerCase().includes("p1") || userinput3.toLowerCase().includes("p2") || userinput3.toLowerCase().includes("p3") ||
            userinput3.toLowerCase().includes("p4") || userinput3.toLowerCase().includes("p5") || userinput3.toLowerCase().includes("p6") ||
            userinput3.toLowerCase().includes("p7") || userinput3.toLowerCase().includes("r2") || userinput3.toLowerCase().includes("p8") || userinput3.toLowerCase().includes("p9") ||
            userinput3.toLowerCase().includes("cf") || userinput3.toLowerCase().includes("r1") || userinput3.toLowerCase().includes("r53") || userinput3.toLowerCase().includes("bwie")) {
            userinput2 = "CF";
        } else {
            userinput2 = "other";
        }

// Define hostnames based on userinput3 content
if (userinput3.toLowerCase().includes("fnc")) {
    userinput12 = `${userinput1}-br-fnc-f1-b1-oob-r1
${userinput1}-br-fnc-f1-b1-mgmt-sw1
${userinput1}-br-fnc-f1-lul-mgmt-sw1
${userinput1}-br-fnc-f1-b1-t2-r1
${userinput1}-br-fnc-f1-b1-t2-r5
${userinput1}-br-fnc-f1-b1-t1-r1
${userinput1}-br-fnc-f1-b1-t1-r5
${userinput1}-br-fnc-f1-b1-t1-r9
${userinput1}-br-fnc-f1-b1-t1-r13
${userinput1}-br-fnc-f1-b1-t2-r9
${userinput1}-br-fnc-f1-b1-t2-r13
${userinput1}-br-fnc-f1-lul-r1
${userinput1}-br-eng-sw101`;
} else if (userinput3.toLowerCase().match(/p[1-9]/g)) {
    const pNumbers = userinput3.toLowerCase().match(/p[1-9]/g);
    const hostnames = pNumbers.map(pNumber => `${userinput1}-br-cdn-${pNumber}-tor-r1
${userinput1}-br-cdn-${pNumber}-tor-r2
${userinput1}-br-cdn-${pNumber}-con-r1
${userinput1}-br-cdn-${pNumber}-con-r2
${userinput1}-br-cdn-${pNumber}-rack-acc-sw1
${userinput1}-br-cdn-${pNumber}-rack-acc-sw2
${userinput1}-br-cdn-${pNumber}-oob-r1
${userinput1}-br-cdn-${pNumber}-oob-r2`).join('');
    userinput12 = hostnames;
} else if (userinput3.toLowerCase().includes("r53")) {
    userinput12 = `${userinput1}-br-aws-dns-tor-r1
${userinput1}-br-aws-dns-con-r1
${userinput1}-br-aws-dns-rack-acc-sw1
${userinput1}-br-aws-dns-oob-r1`;
} else if (userinput3.toLowerCase().includes("bmn")) {
    userinput12 = `${userinput1}-br-mgt-acc-v1
${userinput1}-br-mgt-acc-v2
${userinput1}-br-mgt-agg-r1
${userinput1}-br-mgt-agg-r2
${userinput1}-br-mgt-sw1
${userinput1}-br-mgt-sw2
${userinput1}-br-mgt-con-r1`;
} else if (userinput3.toLowerCase().includes("bwie")) {
    userinput12 = `${userinput1}-br-edg-dos-r1
${userinput1}-br-edg-dos-r2
${userinput1}-br-edg-dos-dmt-r1
${userinput1}-br-edg-dos-dmt-r2
${userinput1}-br-edg-dos-rack-acc-sw1
${userinput1}-br-edg-dos-oob-r1
${userinput1}-br-edg-dos-psc-r1`;
} else if (userinput3.toLowerCase().includes("optical")) {
    // Prompt the user for the PP number
const ppNumber = prompt("Please enter the smaller PP number:/n[Example: enter 11 for PP11]");
    // Check if the user provided a valid PP number
    if (ppNumber !== null && /^\d+$/.test(ppNumber)) {
        // Generate userinput12 based on the provided PP number
        userinput12 = `${userinput1}-wdm-pp${ppNumber}x-s1
${userinput1}-wdm-pp${ppNumber}y-s1
${userinput1}-wdm-pp${ppNumber}-s2
${userinput1}-wdm-pp${ppNumber}-s3
${userinput1}-wdm-pp${ppNumber}-s4
${userinput1}-wdm-pp${ppNumber}-s5
${userinput1}-wdm-pp${parseInt(ppNumber) + 1}x-s1
${userinput1}-wdm-pp${parseInt(ppNumber) + 1}y-s1
${userinput1}-wdm-pp${parseInt(ppNumber) + 1}-s2
${userinput1}-wdm-pp${parseInt(ppNumber) + 1}-s3
${userinput1}-wdm-pp${parseInt(ppNumber) + 1}-s4
${userinput1}-wdm-pp${parseInt(ppNumber) + 1}-s5
${userinput1}-pp${ppNumber}-br-acc-sw1
${userinput1}-pp${parseInt(ppNumber) + 1}-br-acc-sw1`;
    } else {
        // Handle the case where the user did not enter a valid PP number
        userinput12 = "Invalid PP number provided.";
    }
} else if (userinput3.toLowerCase().includes("dx")) {
    // Prompt the user for the DX number
    const dxNumber = prompt("Please enter the DX version from cutsheet:\n[Example: enter p1-v4 or p2-v5 etc.]");

    // Determine the value of AAA based on the first three letters of userinput1
    let AAA = '';
    const firstThreeLetters = userinput1.slice(0, 3);
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
        // Handle cases not listed above
        break;
    }

    // Check if the user provided a valid DX version
    if (dxNumber !== null && /^p[1-9]-v[1-9]$/.test(dxNumber)) {
        // Generate userinput12 based on the provided DX version and determined AAA value
        userinput12 = `${userinput1}-oob-corp-rX[depends on oob sequence]
${userinput1}-br-acc-sw-IP
${userinput1}-vc-cas-spare
${userinput1}-vc-car-${AAA}-${dxNumber}-r1
${userinput1}-vc-car-${AAA}-${dxNumber}-r2
${userinput1}-vc-cas-${AAA}-${dxNumber}-r101
${userinput1}-vc-cas-${AAA}-${dxNumber}-r102
${userinput1}-vc-cas-${AAA}-${dxNumber}-r103
${userinput1}-vc-cas-${AAA}-${dxNumber}-r104
${userinput1}-vc-cas-${AAA}-${dxNumber}-r201
${userinput1}-vc-cas-${AAA}-${dxNumber}-r202
${userinput1}-vc-cas-${AAA}-${dxNumber}-r203
${userinput1}-vc-cas-${AAA}-${dxNumber}-r204`;
    } else {
        // Handle the case where the user did not enter a valid DX version
        userinput12 = "Invalid DX version, please check your NDE cutsheet.";
    }
} else {
    userinput12 = "Please manually update";
}

        // Set values in textareas by their IDs ==> this is for template info area
        setTextareaValue('templateVariables[{{01_site}}]', userinput1);
        setTextareaValue('templateVariables[{{02_fabric_or_service_name}}]', userinput2);
        setTextareaValue('templateVariables[{{03_project_name}}]', userinput3);
        setTextareaValue('templateVariables[{{04_FBN}}]', userinput4);
        setTextareaValue('templateVariables[{{05_build_configure_or_upgrade}}]', userinput5);
        setTextareaValue('templateVariables[{{05_justification_for_change_and_purpose_of_project}}]', userinput5a);
        setTextareaValue('templateVariables[{{06_Is_this_MCM_a_continuation_of_a_previous_MCM_if_yes_list_them_below_and_attach_them_in_related_items}}]', userinput6);
        setTextareaValue('templateVariables[{{07_primary_sim_URL}}]', userinput7);
        setTextareaValue('templateVariables[{{08_NARG_tickets_Link}}]', userinput8);
        setTextareaValue('templateVariables[{{09_number_of_affected_devices}}]', userinput9);
        setTextareaValue('templateVariables[{{10_is_two_person_verification_required_for_this_activity_if_yes_explain}}]', userinput10);
        setTextareaValue('templateVariables[{{11_alias_of_Performer}}]', userinput11);
        setTextareaValue('templateVariables[{{12_alias_of_Verifier}}]', userinput12a);
        setTextareaValue('templateVariables[{{13_list_all_hostnames_locations_production_status_and_if_in_scope_of_this_activity}}]', userinput12);
        setTextareaValue('templateVariables[{{14_patch_panels_and_locations_if_applicable}}]', userinput13);
        setTextareaValue('templateVariables[{{15_why_is_this_the_correct_time_and_day_to_complete_the_mcm}}]', userinput14);
        setTextareaValue('templateVariables[{{16_are_there_any_related_MCMs_that_must_be_completed_before_this_change_occurs}}]', userinput15);
        setTextareaValue('templateVariables[{{17_are_the_Cut_sheet_MCMs_in_a_fully_approved_state_if_yes_list_them_below_and_attach_them_in_related_items}}]', userinput16);
        setTextareaValue('templateVariables[{{18_if_this_MCM_is_intrusive_what_services_will_be_affected}}]', userinput17);
        setTextareaValue('templateVariables[{{19_have_we_segmented_this_change_into_small_enough_stages_to_minimize_the_blast_radius_accelerate_impact_detection_and_ease_rollback}}]', userinput18);
        setTextareaValue('templateVariables[{{20_what_is_the_justification_for_this_tier_level}}]', userinput19);
        setTextareaValue('templateVariables[{{21_list_every_step_that_you_will_take_during_your_activity}}]', userinput20);
        setTextareaValue('templateVariables[{{22_what_could_happen_if_this_change_causes_impact}}]', userinput21);
        setTextareaValue('templateVariables[{{23_where_are_the_most_likely_places_this_change_will_fail}}]', userinput22);
        setTextareaValue('templateVariables[{{24_describe_rollback_plan}}]', userinput23);

        // Replace MCM title area
        replacePlaceholderInInput('title', 'ID', 'ID EDGE');
    });

    // Function to select an option by value in a select element by ID
    function selectOptionByValue(selectId, value) {
        const selectElement = document.getElementById(selectId);
        if (selectElement) {
            for (const option of selectElement.options) {
                if (option.value === value) {
                    option.selected = true;
                    break;
                }
            }
        }
    }

    // Call the function to select "Tier 3" in the 'tier' select element
    selectOptionByValue('tier', 'Tier 3');
})();

// Call the function to set and trigger the CTI selections
setCTISelections();

    // Function to simulate typing with a delay between each character
    function simulateTyping(inputElement, text) {
        const typingSpeed = 500; // Adjust the typing speed as needed (2 seconds per character)
        let currentIndex = 0;

        function typeNextCharacter() {
            if (currentIndex < text.length) {
                const char = text.charAt(currentIndex);

                // Create and dispatch keyboard events to simulate typing
                const keydownEvent = new KeyboardEvent('keydown', {
                    key: char,
                    keyCode: char.charCodeAt(0),
                    which: char.charCodeAt(0),
                });

                const keyupEvent = new KeyboardEvent('keyup', {
                    key: char,
                    keyCode: char.charCodeAt(0),
                    which: char.charCodeAt(0),
                });

                inputElement.dispatchEvent(keydownEvent);
                inputElement.value += char;
                inputElement.dispatchEvent(keyupEvent);

                currentIndex++;

                setTimeout(typeNextCharacter, typingSpeed);
            } else {
// After typing all characters, simulate hitting the Enter key
const enterKeyDownEvent = new KeyboardEvent('keydown', {
    key: 'Enter',
    keyCode: 13,
    which: 13,
});
inputElement.dispatchEvent(enterKeyDownEvent);

const enterKeyUpEvent = new KeyboardEvent('keyup', {
    key: 'Enter',
    keyCode: 13,
    which: 13,
});
inputElement.dispatchEvent(enterKeyUpEvent);
            }
        }

        typeNextCharacter();
    }

    // Ensure the document is fully loaded
    $(document).ready(function() {
        console.log("Script is running...");

        // Read user inputs from the clipboard
        navigator.clipboard.readText().then(function(clipboardText) {
            // Split clipboard text into lines
            const clipboardLines = clipboardText.split('\n');

            // Assign the first line to userinput1
            userinput1 = clipboardLines[0] || '';

            // Find the specific <div> element by its class, title, and ID
            let dataCenterDiv = $('div.chosen-container.chosen-container-multi[title=""][id="data_center_chosen"]');

            // Trigger the click and input actions only if the script hasn't been executed and the div is found
            if (!scriptExecuted && dataCenterDiv.length > 0) {
                // Set the flag to prevent further execution
                scriptExecuted = true;

                // Trigger the click of the specific <div> element by its class, title, and ID
                dataCenterDiv.find('input[type="text"].default').click();

                // Wait for a short duration (e.g., 1000 milliseconds or 1 second) and check if the element becomes active
                setTimeout(function() {
                    if (dataCenterDiv.hasClass('chosen-container-active')) {
                        // Type the userinput1 value into the input field with simulated typing
                        const inputElement = dataCenterDiv.find('input[type="text"].default')[0];
                        simulateTyping(inputElement, userinput1);
                    } else {
                        console.log("Element is not active. Please check the dropdown.");
                    }
                }, 500); // Adjust the delay as needed
            }
        });
    });
;

function setCTISelections() {
    // Set cti_category value
    $("#cti_category").val("InfraDelivery-Edge").trigger("change");

// Observe changes to cti_type dropdown
observeDropdownChanges("cti_type", function() {
    // Delay setting the cti_type value
    setTimeout(function() {
        $("#cti_type").val(userinput1).trigger("change");

        // Observe changes to cti_item dropdown
        observeDropdownChanges("cti_item", function() {
            let itemValue;
            switch (userinput2.toLowerCase()) {
                case "border":
                    itemValue = "Deployment- Border";
                    break;
                case "other":
                    itemValue = "Deployment- Other";
                    break;
                case "dx":
                    itemValue = "Deployment- DX";
                    break;
                case "cf":
                    itemValue = "Deployment- CF";
                    break;
            }

            // Delay setting the cti_item value
            setTimeout(function() {
                $("#cti_item").val(itemValue).trigger("change");

                // Observe changes to cti_resolver_group dropdown
                observeDropdownChanges("cti_resolver_group", function() {
                    // Delay setting the cti_resolver_group value
                    setTimeout(function() {
                        $("#cti_resolver_group").val("ID APAC Edge DCO Projects").trigger("change");
                    }, 2500); //  delay for cti_resolver_group
                });
            }, 2500); //  delay for cti_item
        });
    }, 2500); // delay for cti_type
});
}

function observeDropdownChanges(dropdownId, callback) {
    const targetNode = document.getElementById(dropdownId);
    const config = { attributes: true, childList: true, subtree: true };

    const observer = new MutationObserver(function(mutationsList, observer) {
        for(let mutation of mutationsList) {
            if (mutation.type === 'childList') {
                callback();
                observer.disconnect(); // Stop observing once the dropdown is populated
                break;
            }
        }
    });

    observer.observe(targetNode, config);
}