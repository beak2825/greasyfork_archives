// ==UserScript==
// @name         Cable Patch test
// @namespace    http://mcm.amazon.com/
// @version      0.8
// @description  Cable Patch helper
// @author       chengng@
// @match        https://mcm.amazon.com/cms/new?from_template=7b61ac86-0baa-44af-b9f5-be930912b72d
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/475190/Cable%20Patch%20test.user.js
// @updateURL https://update.greasyfork.org/scripts/475190/Cable%20Patch%20test.meta.js
// ==/UserScript==

/*
REVISION HISTORY:
0.1 - 2023-09-13 - chengng@ - Initial setup for the helper
0.2 - 2023-09-19 - chengng@ - Remove approvers and Add Tier selection based on the MCM type
0.3 - 2023-09-19 - chengng@ - Update the approvers
0.4 - 2023-09-25 - chengng@ - Change title to ID EDGE and NDE cutsheet also auto-populated from primary ticket
0.5 - 2023-09-26 - chengng@ - CTI is now automated
0.6 - 2023-09-29 - chengng@ - Data Center selection added, Hostname added.
0.7 - 2023-09-29 - chengng@ - DX Hostnames added.
0.8 - 2023-10-25 - chengng@ - hostname modification
*/

// Define userinput1 and userinput2 variables outside of the callback
let userinput1;
let userinput2;
let userinput15;
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

    // Function to replace a placeholder in a textarea with a specific name
    function replacePlaceholderInTextarea(textareaName, placeholder, replacement) {
        const textarea = document.querySelector(`textarea[name="${textareaName}"]`);
        if (textarea) {
            const text = textarea.value;
            const regex = new RegExp(placeholder, "g");
            const newText = text.replace(regex, replacement);
            textarea.value = newText;
        }
    }

    // Function to replace a placeholder in an input field with a specific name
    function replacePlaceholderInInput(inputName, placeholder, replacement) {
        const inputField = document.querySelector(`input[name="${inputName}"]`);
        if (inputField) {
            inputField.value = inputField.value.replace(placeholder, replacement);
        }
    }

            // Function to click the "Delete" buttons
    function clickDeleteButtons() {
        var deleteButtons = document.querySelectorAll('a.delete-approver'); // Select all elements with class 'delete-approver'

        // Loop through the delete buttons and click them
        deleteButtons.forEach(function(button) {
            var dataApprover = button.getAttribute('data-approver');
            if (dataApprover === 'l3-cluster-leader' || dataApprover === 'l3-id-approval') {
                button.click();
            }
        });
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
        const userinput5 = `Deployment project of ${userinput3} at ${userinput1}`; // Predefined input for 05_justification_for_change_and_purpose_of_project
        const userinput6 = "No"; // Predefined input for 06_Is_this_MCM_a_continuation_of_a_previous_MCM_if_yes_list_them_below_and_attach_them_in_related_items
        const userinput8 = "N/A"; // Predefined input for 08_mobius_link
        const userinput9 = "N/A"; // Predefined input for 09_NARG_tickets_Link
        const userinput10 = "See attached cutsheet";
        const userinput11 = "See attached cutsheet";
        const userinput12 = "No"; // Predefined input for 12_is_two_person_verification_required_for_this_activity_if_yes_explain
        const userinput13 = "N/A"; // Predefined input for 13_alias_of_Performer
        const userinput14 = "N/A"; // Predefined input for 14_alias_of_Verifier
        const userinput16 = "See attached cutsheet";
        const userinput17 = "normal business hour for cable patching"; //Predefined input for 17_why_is_this_the_correct_time_and_day_to_complete_the_mcm
        const userinput18 = "Yes"; // Predefined input for 18_are_there_any_related_MCMs_that_must_be_completed_before_this_change_occurs
        const userinput19 = "Yes" + (NDEcutsheet ? ` - ${NDEcutsheet}` : "");
        const userinput20 = "non-intrusive"; // Predefined input for 20_if_this_MCM_is_intrusive_what_services_will_be_affected
        const userinput21 = "Day 1-3: EDGE POC and vendor to patch cable according to cutsheet and double check labeles and make sure it matches AWS standard;\nDay 4-5: Link validation and troubleshooting, removal of rubbish onsite at the end"; // Predefined input for 21_have_we_segmented_this_change_into_small_enough_stages_to_minimize_the_blast_radius_accelerate_impact_detection_and_ease_rollback
        const userinput22 = "Cable patching is Tier 3 according to https://w.amazon.com/bin/view/GlobalEdge/Documentation/MCM/"; // Predefined input for 22_what_is_the_justification_for_this_tier_level
        const userinput23 = "non-intrusive"; // Predefined input for 23_list_every_step_that_you_will_take_during_your_activity
        const userinput24 = "Impact could cause interface flapping which could cause customer impact"; // Predefined input for 24_what_could_happen_if_this_change_causes_impact
        const userinput25 = "Fiber will be patched into NON-LIVE and/or LIVE racks which existing service might be jarred, bumped, cut, bent, or otherwise disrupted to the point of causing interface flapping which could cause customer impact."; // Predefined input for 25_where_are_the_most_likely_places_this_change_will_fail
        const userinput26 = "1.) In the event that impact is detected by EDGE OPS oncall, EDGE Projects will immediately halt work.\n2.) Edge Projects will standby for directions provided by EDGE OPS oncall to assist in mitigation of impact.\n3.) EDGE Projects will perform said directed activities and inform EDGE OPS oncall of expected recovery.\n4.) EDGE Projects will then confirm recovery and re-evaluate if work can re-continue alongside EDGE OPS."; // Predefined input for 26_describe_rollback_plan

        // Define userinput2 based on userinput3 content
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

// Define hostnames based on userinput3 content
if (userinput3.toLowerCase().includes("fnc")) {
    userinput15 = [
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
        `${userinput1}-br-eng-sw101`
    ].join(', ');
} else if (userinput3.toLowerCase().match(/p[1-9]/g)) {
    const pNumbers = userinput3.toLowerCase().match(/p[1-9]/g);
    userinput15 = pNumbers.map(pNumber => [
        `${userinput1}-br-cdn-${pNumber}-tor-r1`,
        `${userinput1}-br-cdn-${pNumber}-tor-r2`,
        `${userinput1}-br-cdn-${pNumber}-con-r1`,
        `${userinput1}-br-cdn-${pNumber}-con-r2`,
        `${userinput1}-br-cdn-${pNumber}-rack-acc-sw1`,
        `${userinput1}-br-cdn-${pNumber}-rack-acc-sw2`,
        `${userinput1}-br-cdn-${pNumber}-oob-r1`,
        `${userinput1}-br-cdn-${pNumber}-oob-r2`
    ].join(', ')).join('\n');
} else if (userinput3.toLowerCase().includes("r53")) {
    userinput15 = [
        `${userinput1}-br-aws-dns-tor-r1`,
        `${userinput1}-br-aws-dns-con-r1`,
        `${userinput1}-br-aws-dns-rack-acc-sw1`,
        `${userinput1}-br-aws-dns-oob-r1`
    ].join(', ');
} else if (userinput3.toLowerCase().includes("bmn")) {
    userinput15 = [
        `${userinput1}-br-mgt-acc-v1`,
        `${userinput1}-br-mgt-acc-v2`,
        `${userinput1}-br-mgt-agg-r1`,
        `${userinput1}-br-mgt-agg-r2`,
        `${userinput1}-br-mgt-sw1`,
        `${userinput1}-br-mgt-sw2`,
        `${userinput1}-br-mgt-con-r1`
    ].join(', ');
} else if (userinput3.toLowerCase().includes("bwie")) {
    userinput15 = [
        `${userinput1}-br-edg-dos-r1`,
        `${userinput1}-br-edg-dos-r2`,
        `${userinput1}-br-edg-dos-dmt-r1`,
        `${userinput1}-br-edg-dos-dmt-r2`,
        `${userinput1}-br-edg-dos-rack-acc-sw1`,
        `${userinput1}-br-edg-dos-oob-r1`,
        `${userinput1}-br-edg-dos-psc-r1`
    ].join(', ');
} else if (userinput3.toLowerCase().includes("optical")) {
    const ppNumber = prompt("Please enter the smaller PP number:\n[Example: enter 11 for PP11]");
    if (ppNumber !== null && /^\d+$/.test(ppNumber)) {
        userinput15 = [
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
        ].join(', ');
    } else {
        userinput15 = "Invalid PP number provided.";
    }
} else if (userinput3.toLowerCase().includes("dx")) {
    const dxNumber = prompt("Please enter the DX version from cutsheet:\n[Example: enter p1-v4 or p2-v5 etc.]");
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
            break;
    }
    if (dxNumber !== null && /^p[1-9]-v[1-9]$/.test(dxNumber)) {
        userinput12 = [
            `${userinput1}-oob-corp-rX[depends on oob sequence]`,
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
        ].join(', ');
    } else {
        userinput12 = "Invalid DX version, please check your NDE cutsheet.";
    }
} else {
    userinput15 = "Please manually update";
}

console.log("userinput15:", userinput15);

        // Set values in textareas by their IDs ==> this is for template info area
            setTextareaValue('templateVariables[{{01_site}}]', userinput1);
            setTextareaValue('templateVariables[{{02_fabric_or_service_name}}]', userinput2);
            setTextareaValue('templateVariables[{{03_project_name}}]', userinput3);
            setTextareaValue('templateVariables[{{04_FBN}}]', userinput4);
            setTextareaValue('templateVariables[{{05_justification_for_change_and_purpose_of_project}}]', userinput5);
            setTextareaValue('templateVariables[{{06_Is_this_MCM_a_continuation_of_a_previous_MCM_if_yes_list_them_below_and_attach_them_in_related_items}}]', userinput6);
            setTextareaValue('templateVariables[{{07_primary_sim_URL}}]', userinput7);
            setTextareaValue('templateVariables[{{08_mobius_link}}]', userinput8);
            setTextareaValue('templateVariables[{{09_NARG_tickets_Link}}]', userinput9);
            setTextareaValue('templateVariables[{{10_number_of_affected_devices}}]', userinput10);
            setTextareaValue('templateVariables[{{11_number_of_connections_to_be_patched_or_validated}}]', userinput11);
            setTextareaValue('templateVariables[{{12_is_two_person_verification_required_for_this_activity_if_yes_explain}}]', userinput12);
            setTextareaValue('templateVariables[{{13_alias_of_Performer}}]', userinput13);
            setTextareaValue('templateVariables[{{14_alias_of_Verifier}}]', userinput14);
            setTextareaValue('templateVariables[{{15_list_all_hostnames_locations_production_status_and_if_in_scope_of_this_activity}}]', userinput15);
            setTextareaValue('templateVariables[{{16_patch_panels_and_locations_if_applicable}}]', userinput16);
            setTextareaValue('templateVariables[{{17_why_is_this_the_correct_time_and_day_to_complete_the_mcm}}]', userinput17);
            setTextareaValue('templateVariables[{{18_are_there_any_related_MCMs_that_must_be_completed_before_this_change_occurs}}]', userinput18);
            setTextareaValue('templateVariables[{{19_are_the_Cut_sheet_MCMs_in_a_fully_approved_state_if_yes_list_them_below_and_attach_them_in_related_items}}]', userinput19);
            setTextareaValue('templateVariables[{{20_if_this_MCM_is_intrusive_what_services_will_be_affected}}]', userinput20);
            setTextareaValue('templateVariables[{{21_have_we_segmented_this_change_into_small_enough_stages_to_minimize_the_blast_radius_accelerate_impact_detection_and_ease_rollback}}]', userinput21);
            setTextareaValue('templateVariables[{{22_what_is_the_justification_for_this_tier_level}}]', userinput22);
            setTextareaValue('templateVariables[{{23_list_every_step_that_you_will_take_during_your_activity}}]', userinput23);
            setTextareaValue('templateVariables[{{24_what_could_happen_if_this_change_causes_impact}}]', userinput24);
            setTextareaValue('templateVariables[{{25_where_are_the_most_likely_places_this_change_will_fail}}]', userinput25);
            setTextareaValue('templateVariables[{{26_describe_rollback_plan}}]', userinput26);

        // Replace placeholders with specific names in textareas  ==> this is for MCM description area
            replacePlaceholderInTextarea('description', '{{01_site}}', userinput1);
            replacePlaceholderInTextarea('description', '{{02_fabric_or_service_name}}', userinput2);
            replacePlaceholderInTextarea('description', '{{03_project_name}}', userinput3);
            replacePlaceholderInTextarea('description', '{{04_FBN}}', userinput4);
            replacePlaceholderInTextarea('description', '{{05_justification_for_change_and_purpose_of_project}}', userinput5);
            replacePlaceholderInTextarea('description', '{{06_Is_this_MCM_a_continuation_of_a_previous_MCM_if_yes_list_them_below_and_attach_them_in_related_items}}', userinput6);
            replacePlaceholderInTextarea('description', '{{07_primary_sim_URL}}', userinput7);
            replacePlaceholderInTextarea('description', '{{08_mobius_link}}', userinput8);
            replacePlaceholderInTextarea('description', '{{09_NARG_tickets_Link}}', userinput9);
            replacePlaceholderInTextarea('description', '{{10_number_of_affected_devices}}', userinput10);
            replacePlaceholderInTextarea('description', '{{11_number_of_connections_to_be_patched_or_validated}}', userinput11);
            replacePlaceholderInTextarea('description', '{{12_is_two_person_verification_required_for_this_activity_if_yes_explain}}', userinput12);
            replacePlaceholderInTextarea('description', '{{13_alias_of_Performer}}', userinput13);
            replacePlaceholderInTextarea('description', '{{14_alias_of_Verifier}}', userinput14);
            replacePlaceholderInTextarea('description', '{{15_list_all_hostnames_locations_production_status_and_if_in_scope_of_this_activity}}', userinput15);
            replacePlaceholderInTextarea('description', '{{16_patch_panels_and_locations_if_applicable}}', userinput16);
            replacePlaceholderInTextarea('description', '{{17_why_is_this_the_correct_time_and_day_to_complete_the_mcm}}', userinput17);
            replacePlaceholderInTextarea('description', '{{18_are_there_any_related_MCMs_that_must_be_completed_before_this_change_occurs}}', userinput18);
            replacePlaceholderInTextarea('description', '{{19_are_the_Cut_sheet_MCMs_in_a_fully_approved_state_if_yes_list_them_below_and_attach_them_in_related_items}}', userinput19);
            replacePlaceholderInTextarea('description', '{{20_if_this_MCM_is_intrusive_what_services_will_be_affected}}', userinput20);
            replacePlaceholderInTextarea('description', '{{21_have_we_segmented_this_change_into_small_enough_stages_to_minimize_the_blast_radius_accelerate_impact_detection_and_ease_rollback}}', userinput21);
            replacePlaceholderInTextarea('description', '{{22_what_is_the_justification_for_this_tier_level}}', userinput22);
            replacePlaceholderInTextarea('description', '{{23_list_every_step_that_you_will_take_during_your_activity}}', userinput23);
            replacePlaceholderInTextarea('description', '{{24_what_could_happen_if_this_change_causes_impact}}', userinput24);
            replacePlaceholderInTextarea('description', '{{25_where_are_the_most_likely_places_this_change_will_fail}}', userinput25);
            replacePlaceholderInTextarea('description', '{{26_describe_rollback_plan}}', userinput26);

        // Replace MCM title area
        replacePlaceholderInInput('title', 'ID', 'ID EDGE');
        replacePlaceholderInInput('title', '{{01_site}}', userinput1);
        replacePlaceholderInInput('title', '{{02_fabric_or_service_name}}', userinput2);
        replacePlaceholderInInput('title', '{{03_project_name}}', userinput3);
        replacePlaceholderInInput('title', '{{04_FBN}}', userinput4);

        // Display a final reminder alert
//        alert("Please double check the following areas before submitting\nA)Affected hostnames\nB)Adjust detailed onsite plan accordingly");
    });

            // Run the function when the page is fully loaded
    window.addEventListener('load', function() {
        clickDeleteButtons();
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

            // Log the clipboard text and userinput1 for debugging
            console.log("Clipboard text:", clipboardText);
            console.log("User input 1:", userinput1);

            // Find the specific <div> element by its class, title, and ID
            let dataCenterDiv = $('div.chosen-container.chosen-container-multi[title=""][id="data_center_chosen"]');

            // Trigger the click and input actions only if the script hasn't been executed and the div is found
            if (!scriptExecuted && dataCenterDiv.length > 0) {
                // Set the flag to prevent further execution
                scriptExecuted = true;

                // Trigger the click of the specific <div> element by its class, title, and ID
                dataCenterDiv.find('input[type="text"].default').click();

                // Log a message to indicate that the click event was triggered
                console.log("Input element click triggered.");

                // Wait for a short duration (e.g., 1000 milliseconds or 1 second) and check if the element becomes active
                setTimeout(function() {
                    if (dataCenterDiv.hasClass('chosen-container-active')) {
                        // Type the userinput1 value into the input field with simulated typing
                        const inputElement = dataCenterDiv.find('input[type="text"].default')[0];
                        simulateTyping(inputElement, userinput1);

                        console.log("Entered:", userinput1);
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

   // Call the function to set and trigger the CTI selections
 //   setCTISelections();


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