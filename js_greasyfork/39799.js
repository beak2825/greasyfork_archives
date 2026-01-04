// ==UserScript==
// @name        GSX Customer AutoFill
// @author      Jonathan von Kelaita
// @namespace   http://localhost
// @description Auto fill customer's details in GSX
// @include     https://gsx*.apple.com/WebApp/*
// @version     2.43
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_xmlhttpRequest
// @require http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/39799/GSX%20Customer%20AutoFill.user.js
// @updateURL https://update.greasyfork.org/scripts/39799/GSX%20Customer%20AutoFill.meta.js
// ==/UserScript==
// Automatically fill out customer's details in GSX

// Get all DOM elements
var firstname = document.getElementById('firstname');
var lastname = document.getElementById('lastname');
var company = document.getElementById('company');
var phone = document.getElementById('phone');
var email = document.getElementById('email');
var address1 = document.getElementById('address1');
var address2 = document.getElementById('address2');
var address3 = document.getElementById('address3');
var city = document.getElementById('city');
var recTime = document.getElementById('recTime');
var dateRec = document.getElementById('calendar');

var stateListForNtf = document.getElementById('stateListForNtf');

var zipcode = document.getElementById('zipcode');
var countryListForNtf = document.getElementById('countryListForNtf');
var calendar = document.getElementById('calendar'); // DD/MM/YY
//var recTime = document.getElementById('recTime'); // HH:MM (AM/PM)

var pageContainer = document.getElementById('toolbar');

// Create container for label and input field
var divContainer = document.createElement('div');

// Create label
var lbl = document.createElement('label');
var t = document.createTextNode('Auto Fill');
lbl.appendChild(t);

// Style label as block element
lbl.style.marginBottom = "10px";
lbl.style.display = "block";

// Create and style input field for job number
var job = document.createElement('input');
job.id = "job";
job.value = "";
job.style = "size: 100%; text-align: center; height: 17px; margin: 0 5px 5px 5px; border: none; border-radius: 5px; padding: 5px;";
job.placeholder = "Job #";


// Append label and input field to its containing div element and style it so it is located towards the top right of the page
divContainer.appendChild(lbl);
divContainer.appendChild(job);
divContainer.style.position = "relative";
divContainer.style.display = "inline-block";
divContainer.style.top = "130px";
divContainer.style.float = "right";
divContainer.style.marginRight = "1%";
divContainer.style.background = "#ccffdd";
divContainer.style.borderRadius = "10px";
divContainer.style.padding = "5px";

pageContainer.appendChild(divContainer);

lbl.id = 'autofill';

// Label styling
document.getElementById('autofill').style = 'display: block; font-size: 14px; width: 100%; margin-bottom: 4px; text-align: center;';

// Listen for keypresses on the input field
job.addEventListener("keydown", function(e) {
    // if user presses ENTER key
    if(e.keyCode == "13") {
        // Prevent the default page action from happening
        e.preventDefault();
        // Load all of the job details from Data Robot and fill out the web form
        loadDetails(job.value);
    }
});

// When the input field has focus, remove the outline and placeholder value
job.addEventListener("focus", function() {
    this.style.outline = "none";
    this.placeholder = "";
});

// When the input field loses focus, set the placeholder to "Job #"
job.addEventListener("focusout", function() {
    this.placeholder = "Job #";
});

function tConvert (time) {
    // Check correct time format and split into components
    time = time.toString().match (/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [time];

    if (time.length > 1) { // If time format correct
        time = time.slice (1); // Remove full string match value
        time[5] = +time[0] < 12 ? ' AM' : ' PM'; // Set AM/PM
        time[0] = +time[0] % 12 || 12; // Adjust hours
    }
    return time.join (''); // return adjusted time or original string
}

function loadDetails(jobNumber) {
    // Get the JSON data from Data Robot for the selected job number
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
        // PUT SERIAL IN GSX BIG SEARCH BOX
        var search_field = document.getElementById("search_GSX_input");
        search_field.value = fixSerial(details.serial);
    }
    catch(err) {
        console.log(err.message);
    }

    try {
        // PUT SERIAL IN GSX SMALL SEARCH BOX (TOP RIGHT)
        search_field = document.getElementById("global_search");
        search_field.value = fixSerial(details.serial);
    }
    catch(err) {
        console.log(err.message);
    }

    var reqDate = details.requestdate;
    reqDate = reqDate.split(" ");

    var recDate = reqDate[0];
    var timeRec = tConvert(reqDate[1].slice(0, -3));

    var arrD = recDate.split("-");

    // Store the book-in date in an object
    var dateObj = {
        year: arrD[0].slice(-2),
        month: arrD[1],
        day: arrD[2]
    };

    // Fill in the form!
    firstname.value = details.first;
    lastname.value = details.last;
    company.value = details.company;
    phone.value = details.phone;
    email.value = details.email;
    address1.value = details.address1;
    address2.value = details.address2;
    city.value = details.suburb;
    recTime.value = timeRec;

    dateRec.value = dateObj.day + "/" + dateObj.month + "/" + dateObj.year;

    stateListForNtf.value = details.state;

    zipcode.value = details.postcode.slice(0,4);
}