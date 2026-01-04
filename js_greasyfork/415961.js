// ==UserScript==
// @name        GSX Power Search
// @author       Jonathan von Kelaita
// @namespace   http://localhost
// @description Search devices in GSX using Pronto Job number!
// @include     *gsx*.apple.com*
// @version     1.4
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/415961/GSX%20Power%20Search.user.js
// @updateURL https://update.greasyfork.org/scripts/415961/GSX%20Power%20Search.meta.js
// ==/UserScript==


// const BOX_COLOUR = "#CAFF8A"; // MINDARO
const BOX_COLOUR = "#222222"; // Grey
const REFRESH_RATE = 666;

var mainSearch = document.getElementById("home-search__textbox");
var searchBarHeader = document.getElementById("searchBarHeader");
var scriptActivation = setInterval(scriptRefresh, REFRESH_RATE);

function scriptRefresh () {
    if (typeof(mainSearch) !== "undefined") {
        getSearchBox("main");
        powerSearch(mainSearch);
    }
    if (typeof(searchBarHeader) !== "undefined") {
        getSearchBox("header");
        powerSearch(searchBarHeader);
    }
}

function getSearchBox (searchBox) {
    if(searchBox == "main") {
        try {
            mainSearch = document.getElementById("home-search__textbox");
            if(mainSearch !== null) {
                mainSearch.style.backgroundColor = BOX_COLOUR;
            }
        }
        catch(err) {
            console.log(err.message);
        }
    } else if(searchBox == "header" && searchBox !== null) {
        try {
            searchBarHeader = document.getElementById("searchBarHeader");
            if (searchBarHeader !== null) {
                searchBarHeader.style.backgroundColor = BOX_COLOUR;
            }
        }
        catch(err) {
            console.log(err.message);
        }
    }
}


function powerSearch (searchBox) {
    if (searchBox !== null) {
        searchBox.onkeypress = function(e){
            if (!e) e = window.event;
            var keyCode = e.keyCode || e.which;
            if (keyCode === 13){
                e.preventDefault();
                // Enter pressed
                // Check if the search box contains a pronto job number (6 digits long integer)
                if (searchBox.value.length === 6 && !isNaN(searchBox.value)) {
                    // if the search field contains a 6 digit number, then we treat it as a valid Pronto job number to load the serial from
                    loadDetails(searchBox, searchBox.value);
                } else {
                    // if it does not look like a valid Pronto job number, we treat it as a serial number and remove the leading 'S' if there is one
                    loadProductPage(fixSerial(searchBox.value), searchBox);
                }
            }
        };
    }
}

function fixSerial(serial) {
    // remove the leading 'S' from the serial number (if there is one)
    if (serial[0].toUpperCase() == "S") {
        return serial.slice(1);
    } else {
        return serial;
    }
}

function loadDetails(searchBox, jobNumber) {
    // Get the JSON data from Data Robot for the selected job number
    GM_xmlhttpRequest({
        method: 'GET',
        url: 'http://datarobot.compnow.com.au/magi/interface/lib/getJobDetailsdr.php?jobNumber=' + jobNumber,
        onload: function (response) {
            try {
                // Parse the JSON and extract the serial number
                getSerial(searchBox, response);
            }
            catch(err) {
                console.log(err.message);
            }
        }
    });
}

function getSerial(searchBox, response) {
    var details;
    var serial;
    // Parse the JSON and store the results in the details variable
    details = JSON.parse(response.responseText)[0];
    try {
        // Remove leading 'S' from serial
        serial = fixSerial(details.serial);
        // Load the product page for the current serial
        loadProductPage(serial, searchBox);
    }
    catch(err) {
        console.log(err.message);
    }
}

function loadProductPage(serial, searchBox) {
    if (serial != "N/A") {
        var URL = "https://gsx2.apple.com/product-details/";
        URL = URL + serial;
        window.open(URL, "_self");
    } else {
        searchBox.value = "N/A"
    }
}