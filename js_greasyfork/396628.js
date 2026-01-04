// ==UserScript==
// @name         Network Case Autofill
// @namespace    http://tampermonkey.net/
// @version      1.75
// @description  Autofills common fields when creating network cases
// @author       You
// @match        https://zayo.my.salesforce.com/500/e?ent=Case&nooverride=1&RecordType=01260000000DZlJ*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/396628/Network%20Case%20Autofill.user.js
// @updateURL https://update.greasyfork.org/scripts/396628/Network%20Case%20Autofill.meta.js
// ==/UserScript==

(function() {
    'use strict';


    var elementAssignments = [ //"elementID", "value" //These values will be assigned later
        "cas7", "Isolation and Repair", //Status
        "00N60000001iwkW", "NCC Investigating", //Sub Status
        "00N60000002dDo0", "North America", //Continent
        "cas11", "NCC", //Case Origin
        "00N60000002AGjT", "ZG", //Business Unit
        "00N60000002DNPX", "Wavelengths", //Product Group
        "00N60000002f9G1", "No", //Multi Site Outage
        "cas15", "Zayo is currently investigating a network event between NULL and NULL. All necessary resources to resolve this outage as quickly as possible have been engaged.", //Description
        "00N60000001iwjn", "No", // Fiber To the Tower
        "00N60000001iwjy", "Yes", //Linear
        "00N60000001iwkC", "Wave", //Network Layer
        "00N60000001iwkB", "No", //Network Alarm Detected
        "00N60000001iwjY", "None", //Alarm Type
        "00N60000001iwjt", "Zayo" //Legacy Network
    ];

    var incalculableRequiredElements = [ //elementID's that need to be filled out by the user, but cannot be calculated or done automatically. //These will be highlighted for the user later
        "00N60000001iwjs", // Initial Down Time
        "00N600000033bYf", // Ops Region
        "cas14", // Subject
        "cas15", //Description
        "CF00N60000001iwk8", // Location
        "CF00N0z000003OVVk", // Network Facility
        "00N60000001iwjy", //Linear
        "00N60000001iwkC", //Network Layer
        "00N60000001iwkB", // Network Alarm Detected
        "00N60000001iwjY", //Alarm Type
        "00N60000001iwkB", // Alarm Type
        "00N0z000003DmjW", // Impact
        "00N0z000003DmjV", // Impact Symptom
        "00N60000003JZFp", // Event Description
        "00N60000003JZFq", // Event Network Layer Severity
        "00N60000003JZFs" // Event Severity Detail Info
    ];

    var sectionsToHide = [ //Sections that are not required and just take up space //These will be hidden entirely from the user later
        "head_3_ep", // RFO Info
        "head_6_ep", // Cloud Support Information
        "head_7_ep", // Root Cause
        "head_8_ep", // Fiber Impact
        "head_11_ep", // Critical Dates
        "head_12_ep", // Repair Action
        "head_13_ep", // Decomp
        "head_14_ep", // Key Performance Indicators
        "head_15_ep" // System Information
        ];

    var fieldsToHide = [ //Elements that are not required and just take up space //These will be made semi-opaque later
        "Case Origin",
        "Escalated",
        "Escalated To",
        "Case Currency",
        "Auto Close Date Time",
        "Continent",
        "Business Unit",
        "Splice Order",
        "In Progress Date/Time",
        "Legacy TTN",
        "Contact Name",
        "Closure Summary",
        "Closure Summary Last Modified By",
        "Event SLA"
    ];

    var inputsToWiden = [ //Elements that are too small to type in //These will be widened later
        "cas14", // Subject
        "cas15", // Description
        "00N60000001iwjl", // Facility Id
        "00N60000001iwji", // Equipment TID
        "00N60000001iwjm", // Fiber Id
        "00N60000001iwkD", // Other Alarm Type
        "00N60000002e10T", // Opening Comments
        "cas16", // Internal Comments
        "00N60000002Gdxt", // Closure Summary
        "00N60000003JZFp" // Event Description
    ];

    //Create "AutoFill" button and define its function
    var btn = document.createElement("input");
    btn.type = "button";
    btn.name = "AutoFill";
    btn.value = "AutoFill";
    btn.onclick = function (){

        // Assign all of the assignable items from var elementAssignments
        const e = new Event("change");
        var element;
        for (var i = 0; i < elementAssignments.length; i++){ //Iterate through each item in elementAssignments
            if(isEven(i)){ //For every evenly indexed item (elementId) in the array (including zero), assign the value
                element = $(elementAssignments[i]);
                element.value = elementAssignments[i+1];
                element.dispatchEvent(e);
            };
        };

        //Highlight in Pink/Red all of the unassignable ("incalculable") items
        for (i = 0; i < incalculableRequiredElements.length; i++){
            $(incalculableRequiredElements[i]).style.backgroundColor = "pink";
        };

        //Hide all of the useless sections identified from var sectionsToHide
        for (i = 0; i < sectionsToHide.length; i++){
            hideElement($(sectionsToHide[i]));
            hideElement($(sectionsToHide[i]).nextElementSibling);
        };

        //Hide all of the mostly-useless fields identified by var "fieldsToHide"
        //First we have to search for the fields, then we have to hide them. The fields do not all have unique elementIDs that we can use to reference them, but they are all part of a table data cell ("<td>"), so we just search through them
        var allTDs = document.getElementsByTagName("td"); //Store all elements with tag "<td>"
        var TDsToHide = [];
        for (i = 0; i < allTDs.length; i++){//Iterate through all TDs
            for (var j = 0; j < fieldsToHide.length; j++){ //Iterate through all fields we want to hide
                if (allTDs[i].innerText.length < 50 && allTDs[i].innerText.search(fieldsToHide[j]) >= 0){ //If we find a match for the header identified by var fieldsToHide, do something about it
                    allTDs[i].style.opacity = "45%"; //Set the header's opacity
                    allTDs[i+1].style.opacity = "45%"; //Set the actual field's opacity
                };
            };
        };

        //Widen all of the input fields identified by var "inputsToWiden"
        for (i = 0; i < inputsToWiden.length; i++){
            $(inputsToWiden[i]).style.width = "80%";
        };


        //Oddly Specific things I wanted to change
        $("CF00N60000001j0kk").value = $("userNav").innerText; //Update "Interal Request Contact" to the user opening the case
        $("cas14").style.width = "100%"; //Set the "Subject" input box's width to Max


        //Helper functions
        function hideElement (element){
            element.style.visibility = "collapse";
            element.style.margin = 0;
            element.style.padding = 0;
            element.style.border = 0;
            element.style.width = 0;
            element.style.height = 0;
        };
        function isEven(number) {
            if(number & 1){ //If the last binary digit is a 1, then the number is odd
                return null;
            }else{
                return true;
            };
        };
        function $ (id){
            return document.getElementById(id);
        };
    };


    //Add button to page
    document.getElementById("topButtonRow").appendChild(btn);
})();