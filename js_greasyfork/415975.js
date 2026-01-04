// ==UserScript==
// @name         Diagnostics Job Lookup
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Look up serial number by Pronto job number
// @author       Jonathan von Kelaita
// @match        https://diagnostics.apple.com/static/projects/aide/pages/main/index.html
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_xmlhttpRequest
// @require http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/415975/Diagnostics%20Job%20Lookup.user.js
// @updateURL https://update.greasyfork.org/scripts/415975/Diagnostics%20Job%20Lookup.meta.js
// ==/UserScript==

var toolBar;
var searchBox;
var divContainer;
var serialField;

function sleep (ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

window.addEventListener('load', async function() {
    console.log("LOADED");
    while (typeof(toolBar) === "undefined") {
        await sleep(1000);
        toolBar = document.getElementsByClassName("toolbar")[0];
    }

    createElements();

}, false);


function createElements() {
    divContainer = document.createElement("div"); // Create div to house the autofill textbox
    searchBox = document.createElement("input"); // Create search box
    searchBox.padding = "20px 0 0 0";
    searchBox.lineHeight = "10px";
    divContainer.appendChild(searchBox);
    divContainer.id = "divContainer";
    divContainer.style.display = "inline-block";
    toolBar.children[0].appendChild(divContainer);
    // Append label and input field to its containing div element and style it so it is located towards the top right of the page
    divContainer.style.position = "absolute";
    divContainer.style.display = "inline-block";
    divContainer.style.float = "right";
    divContainer.style.margin = "10px 0 0 50px";
    divContainer.style.padding = "3px 2px";
    divContainer.style.background = "#ccffdd";
    divContainer.style.borderRadius = "4px";
    divContainer.height = "99%";
    divContainer.style.zIndex = "999999"; // make sure it's on top of everything else

    // serialField = document.getElementsByClassName("serial-number-imei-meid-field")[0];

    addEventListeners();
}


function addEventListeners(){
    searchBox.addEventListener("keydown", function(e) {
        // if user presses ENTER key
        if(e.keyCode == "13") {
            // Prevent the default page action from happening
            e.preventDefault();
            // Load all of the searchBox details from Data Robot and fill out the web form
            console.log("searchBox.value = " + searchBox.value);
            loadDetails(searchBox.value);
        }
    });

    // When the input field has focus, remove the outline and placeholder value
    searchBox.addEventListener("focus", function() {
        this.style.outline = "none";
        this.placeholder = "";
    });

    // When the input field loses focus, set the placeholder to "searchBox #"
    searchBox.addEventListener("focusout", function() {
        this.placeholder = "Job #";
    });
}



function loadDetails(jobNumber) {
    // Get the JSON data from Data Robot for the selected searchBox number
    GM_xmlhttpRequest({
        method: 'GET',
        url: 'http://datarobot.compnow.com.au/magi/interface/lib/getJobDetailsdr.php?jobNumber=' + jobNumber,
        onload: function (response) {
            try {
                // Parse the JSON and fill the form
                receivedDetails(response);
            }
            catch(err) {
                console.log(err.message);
            }
        }
    });

}

function fixSerial(serial) {
    if (serial[0].toUpperCase() == "S") {
        return serial.slice(1);
    } else {
        return serial;
    }
}

function receivedDetails(response) {
    var details;
    // Parse the JSON and store the results in the details variable
    details = JSON.parse(response.responseText)[0];
    // console.log(details.serial);

    try {
        // PUT SERIAL IN SERIAL FIELD
        serialField = document.getElementsByClassName("serial-number-imei-meid-field")[0];
        serialField.value = fixSerial(details.serial);
        searchBox.value = fixSerial(details.serial);
    }
    catch(err) {
        console.log(err.message);
        searchBox.value = fixSerial(details.serial);
    }
}