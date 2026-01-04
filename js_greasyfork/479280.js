// ==UserScript==
// @name         NDE support MCM helper
// @namespace    http://mcm.amazon.com/
// @version      0.2
// @description  Create NDE support MCM
// @author       chengng@
// @match        https://mcm.amazon.com/cms/new?from_template=90e25523-0f97-4baa-8517-5b6c9922ddb5
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/479280/NDE%20support%20MCM%20helper.user.js
// @updateURL https://update.greasyfork.org/scripts/479280/NDE%20support%20MCM%20helper.meta.js
// ==/UserScript==

/*
REVISION HISTORY:
0.1 - 2023-11-08 - chengng@ - Initial setup for the helper
0.2 - 2024-01-30 - chengng@ - small adjustment to title detection
*/

// Define userinput1 and userinput2 variables outside of the callback
let userinput1;
let userinput2;
let userinput3;
let scriptExecuted = false; // Flag to control script execution
var popUpOpened = false;

// Function to extract content between square brackets
function extractContent(inputString, startChar, endChar, occurrence) {
    const regex = new RegExp(`\\${startChar}(.*?)\\${endChar}`, 'gi');
    const matches = inputString.match(regex);
    if (matches && matches.length >= occurrence) {
        return matches[occurrence - 1].slice(1, -1);
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
        inputField.value = inputField.value.replace(new RegExp(placeholder, "g"), replacement);
    }
}

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

// Call the function to select "Tier 2" in the 'tier' select element
selectOptionByValue('tier', 'Tier 2');

// Function to simulate typing with a delay between each character
function simulateTyping(inputElement, text) {
    const typingSpeed = 500;
    let currentIndex = 0;

    function typeNextCharacter() {
        if (currentIndex < text.length) {
            const char = text.charAt(currentIndex);
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

// Function to set and trigger the CTI selections
function setCTISelections() {
    $("#cti_category").val("InfraDelivery-Edge").trigger("change");

    observeDropdownChanges("cti_type", function () {
        setTimeout(function () {
            $("#cti_type").val(userinput1).trigger("change");

            observeDropdownChanges("cti_item", function () {
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

                setTimeout(function () {
                    $("#cti_item").val(itemValue).trigger("change");

                    observeDropdownChanges("cti_resolver_group", function () {
                        setTimeout(function () {
                            $("#cti_resolver_group").val("ID APAC Edge DCO Projects").trigger("change");
                        }, 2500);
                    });
                }, 2500);
            });
        }, 2500);
    });
}

// Function to observe dropdown changes
function observeDropdownChanges(dropdownId, callback) {
    const targetNode = document.getElementById(dropdownId);
    const config = { attributes: true, childList: true, subtree: true };

    const observer = new MutationObserver(function (mutationsList, observer) {
        for (let mutation of mutationsList) {
            if (mutation.type === 'childList') {
                callback();
                observer.disconnect();
                break;
            }
        }
    });

    observer.observe(targetNode, config);
}

// Read user inputs from the clipboard
navigator.clipboard.readText().then(function (clipboardText) {
        const clipboardLines = clipboardText.split('\n');
        userinput1 = clipboardLines[0] || '';
        const userinput4 = clipboardLines[1] || '';
        const userinput3 = clipboardLines[2] || '';
        const userinput7 = clipboardLines[3] || '';
        const NDEcutsheet = clipboardLines[5] || '';

        // Predefined values for fixed areas
        const userinput5 = `Deployment project of ${userinput3} at ${userinput1}`; 
        const userinput6 = "No"; 
        const userinput6a = "To be updated in MCM commment once provided by NDE";
        const userinput7a = "As per above NE MCM";
        const userinput8 = "N/A";
        const userinput9 = "To be updated in MCM commment once provided by NDE";
        const userinput10 = "See attached cutsheet";
        const userinput11 = "See attached cutsheet";
        const userinput12 = "Yes - TPVR is required for this mcm, as ID technician are required to perform cable patching/unpatching on live patch panels / devices / HBR racks.";
        const userinput13 = "TBD pending resource alignment, will update in MCM comment";
        const userinput14 = "TBD pending resource alignment, will update in MCM comment";
        const userinput14a = "Yes, visual audit completed";
        const userinput15a = "Yes, all devices and cables available onsite";
        const userinput16a = "Yes";
        const userinput16 = "See attached cutsheet";
        const userinput17 = "normal business hour for cable patching"; 
        const userinput17a = "Inside cage";
        const userinput18 = "Yes";
        const userinput18a = "Spare fibres available onsite without label, cabling vendor will apply label afterwards if replacement required";
        const userinput19 = "Yes" + (NDEcutsheet ? ` - ${NDEcutsheet}` : "");
        const userinput20 = "non-intrusive\nBefore the MCM starts, NDE will ensure all the traffic has been shifted to other network device.\nNo service will be affected";
        const userinput21 = "Yes";
        const userinput22 = "NDE support will be considered at least Tier 2 and possible Tier 1 depend on Support type according to https://w.amazon.com/bin/view/GlobalEdge/Documentation/MCM/";
        const userinput23 = "1) ID Edge will check if NE MCM is fully approved and is in progress\n2) ID Edge will place CM into progress.\n3) ID Edge will Identify rack location with 2STRIP(w/tpvr) and attach a rack visual indicator\n4) ID Edge will unpatch the exisiting connections with TPVR under the NDE instructions.\n5) ID Edge will patch the new connections with TPVR under the NDE instructions.\n6) Once work is complete ID Edge will check DCO Queue to ensure no tickets were cut.\n7) Once all work has been successfully completed, ID Edge will place the CM into completed status.";
        const userinput24 = "Impact could cause interface flapping which could cause customer impact";
        const userinput25 = "Fiber will be patched into NON-LIVE and/or LIVE racks which existing service might be jarred, bumped, cut, bent, or otherwise disrupted to the point of causing interface flapping which could cause customer impact."; 
        const userinput26 = "=== Rollback Procedure 1 ===\n\n\nIn the event that a live cable is disconnected (not included in this project, the team will immediately:\nreconnect the cable\nsuspend all the work in pod\ncheck with INFRA/EDGE Ops (depend on site ownership) oncall to confirm no sev2 TT is recieved\ncontact the NRE on-call (https://nretools.amazon.com/oncall/), direct manager, project NDE and NWTPM in the meanwhile.\nmay set up a conference bridge for all parties involved to work the issue.\nwalk back step by step to identify the issue.\ncontinue the work until the issue has been resolved and confirmed by INFRA/EDGE Ops (depend on site ownership) oncall, NRE and DCEO.\n\n\n\n=== Rollback Procedure 2 ===\n\nIn the event that a live cable is damaged, the team will immediately:\nsuspend all the work in pod\ncheck with INFRA/EDGE Ops (depend on site ownership) oncall to confirm no sev2 TT is recieved\ncontact the NRE on-call (https://nretools.amazon.com/oncall/), direct manager, project NDE and NWTPM in the meanwhile.\nmay set up a conference bridge for all parties involved to work the issue.\nwalk back step by step to identify the issue.\ncontinue the work until the issue has been resolved and confirmed by INFRA/EDGE Ops (depend on site ownership) oncall, NRE and DCEO.\nreplace the damaged cable with a new cable.\nreschedule the work if required.";

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

        // Set values in textareas by their IDs ==> this is for template info area
            setTextareaValue('templateVariables[{{01_site}}]', userinput1);
            setTextareaValue('templateVariables[{{02_fabric_or_service_name}}]', userinput2);
            setTextareaValue('templateVariables[{{03_project_name}}]', userinput3);
            setTextareaValue('templateVariables[{{04_FBN}}]', userinput4);
            setTextareaValue('templateVariables[{{05_justification_for_change_and_purpose_of_project}}]', userinput5);
            setTextareaValue('templateVariables[{{06_network_engineering_MCM_url}}]', userinput6a);
            setTextareaValue('templateVariables[{{07_alias_of_NE}}]', userinput7a);
            setTextareaValue('templateVariables[{{08_approved_cutsheet_MCM_URL}}]', userinput19);
            setTextareaValue('templateVariables[{{09_primary_ticket_URL}}]', userinput7);
            setTextareaValue('templateVariables[{{10_NARG_tickets_Link}}]', userinput9);
            setTextareaValue('templateVariables[{{11_is_two_person_verification_required_for_this_activity_if_yes_explain}}]', userinput12);
            setTextareaValue('templateVariables[{{12_alias_of_Performer}}]', userinput13);
            setTextareaValue('templateVariables[{{13_alias_of_Verifier}}]', userinput14);
            setTextareaValue('templateVariables[{{14_is_visual_audit_complete_to_ensure_devices_and_cabling_are_ready_for_NE_support}}]', userinput14a);
            setTextareaValue('templateVariables[{{15_is_all_required_equipment_and_cabling_onsite_and_accessible_to_ID}}]', userinput15a);
            setTextareaValue('templateVariables[{{16_are_hardware_spares_available_for_issue_resolution}}]', userinput16a);
            setTextareaValue('templateVariables[{{17_where_are_the_hardware_spares_physically_located}}]', userinput1);
            setTextareaValue('templateVariables[{{18_are_spare_fibers_labelled_and_available_for_issue_resolution}}]', userinput18a);
            setTextareaValue('templateVariables[{{20_patch_panels_and_locations_if_applicable}}]', userinput16);
            setTextareaValue('templateVariables[{{21_why_is_this_the_correct_time_and_day_to_complete_the_mcm}}]', userinput17);
            setTextareaValue('templateVariables[{{22_are_there_any_related_MCMs_that_must_be_completed_before_this_change_occurs}}]', userinput18);
            setTextareaValue('templateVariables[{{23_are_the_Cut_sheet_MCMs_in_a_fully_approved_state_if_yes_list_them_below_and_attach_them_in_related_items}}]', userinput19);
            setTextareaValue('templateVariables[{{24_if_this_MCM_is_intrusive_what_services_will_be_affected}}]', userinput20);
            setTextareaValue('templateVariables[{{25_have_we_segmented_this_change_into_small_enough_stages_to_minimize_the_blast_radius_accelerate_impact_detection_and_ease_rollback}}]', userinput21);
            setTextareaValue('templateVariables[{{26_what_is_the_justification_for_this_tier_level}}]', userinput22);
            setTextareaValue('templateVariables[{{27_list_every_step_that_you_will_take_during_your_activity}}]', userinput23);
            setTextareaValue('templateVariables[{{28_what_could_happen_if_this_change_causes_impact}}]', userinput24);
            setTextareaValue('templateVariables[{{29_where_are_the_most_likely_places_this_change_will_fail}}]', userinput25);
            setTextareaValue('templateVariables[{{30_describe_rollback_plan}}]', userinput26);

        // Replace MCM title area
        replacePlaceholderInInput('title', 'ID', 'ID EDGE');
});

// Call the function to set and trigger the CTI selections
setCTISelections();

    // Ensure the document is fully loaded
    $(document).ready(function() {
   
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

                setTimeout(function() {
                    if (dataCenterDiv.hasClass('chosen-container-active')) {
                        // Type the userinput1 value into the input field with simulated typing
                        const inputElement = dataCenterDiv.find('input[type="text"].default')[0];
                        simulateTyping(inputElement, userinput1);
                    } else {
                        console.log("Element is not active. Please check the dropdown.");
                    }
                }, 500); 
            }
        });
    });
;

// Open a popup after a delay
function openPopUpAfterDelay(url) {
    if (!popUpOpened) {
        popUpOpened = true;
        setTimeout(function () {
            window.open(url, 'newwindow', 'width=2400,height=1200');
        }, 5000);
    }
}

openPopUpAfterDelay('https://tavern.corp.amazon.com/happoshu#search');