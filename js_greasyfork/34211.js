// ==UserScript==
// @name          dx_mage_to_usps
// @namespace     ClaremontDesign
// @description	  Pass Magento's order shipping address to USPS Click-N-Ship
// @author        Dennes B Abing <dennes.b.abing@gmail.com>
// @homepage      http://claremontdesign.com
// @include       https://www.filamtri.com/index.php/admin/sales_order_shipment/*
// @include       https://www.filamtri.com/index.php/admin/sales_order_shipment/*
// @match         https://www.filamtri.com/index.php/admin/sales_order_shipment/*
// @match         https://www.filamtri.com/index.php/admin/sales_order_shipment/*
// @version 0.0.3
// @downloadURL https://update.greasyfork.org/scripts/34211/dx_mage_to_usps.user.js
// @updateURL https://update.greasyfork.org/scripts/34211/dx_mage_to_usps.meta.js
// ==/UserScript==

var GM_JQ = document.createElement('script');
GM_JQ.src = 'https://ajax.googleapis.com/ajax/libs/jquery/1.3.2/jquery.js';
GM_JQ.type = 'text/javascript';
document.getElementsByTagName('head')[0].appendChild(GM_JQ);
function GM_wait() {
    if(typeof unsafeWindow.jQuery == 'undefined') {
	window.setTimeout(GM_wait,100);
    } else {
	$ = unsafeWindow.jQuery;
	passToUSPSClickNShip();
    }
}
GM_wait();
var usStates = {
    "Alabama":"AL|5", "Alaska":"AK|4", "American Samoa":"AS|8", "Arizona":"AZ|9", "Arkansas":"AR|7",
    "California":"CA|10", "Colorado":"CO|11", "Connecticut":"CT|12", "Delaware":"DE|14", "District of Columbia":"DC|13",
    "Federated States of Micronesia":"FM|16", "Florida":"FL|15", "Georgia":"GA|17", "Guam":"GU|18", "Hawaii":"HI|19",
    "Idaho":"ID|21", "Illinois":"IL|22", "Indiana":"IN|23", "Iowa":"IA|20", "Kansas":"KS|24",
    "Kentucky":"KY|25", "Louisiana":"LA|26", "Maine":"ME|29", "Marshall Islands":"MH|30", "Maryland":"MD|28",
    "Massachusetts":"MA|27", "Michigan":"MI|31", "Minnesota":"MN|32", "Mississippi":"MS|35", "Missouri":"MO|33",
    "Montana":"MT|36", "Nebraska":"NE|39", "Nevada":"NV|43", "New Hampshire":"NH|40", "New Jersey":"NJ|41",
    "New Mexico":"NM|42", "New York":"NY|44", "North Carolina":"NC|37", "North Dakota":"ND|38", "Northern Mariana Islands":"MP|34",
    "Ohio":"OH|45", "Oklahoma":"OK|46", "Oregon":"OR|47", "Palau":"PW|50", "Pennsylvania":"PA|48",
    "Puerto Rico":"PR|49", "Rhode Island":"RI|51", "South Carolina":"SC|52", "South Dakota":"SD|53", "Tennessee":"TN|54",
    "Texas":"TX|55", "Utah":"UT|56", "Vermont":"VT|59", "Virgin Islands":"VI|58", "Virginia":"VA|57",
    "Washington":"WA|60", "West Virginia":"WV|63", "Wisconsin":"WI|61", "Wyoming":"WY|63"};
function getStateValue(state) {
    var stateAbbr = usStates[state];
    stateAbbr = stateAbbr.split("|");
	if(stateAbbr.length == 2 && stateAbbr[1] !== undefined)
	{
		return parseInt(stateAbbr[1]);
	}
}
function getReceiverEmailAddress() {
    return $(".box-right a[href*=mailto:]").text();
}

function getRawAddress() {
    raw = null;
    $(".box-right address").each(function(i) {
	    raw = $(this).text();
	});
    return raw;
}
function passToUSPSClickNShip() {
    var zipcode="",city="",companyName="",addressOne="",addressTwo="",deliveryCountry="", firstName='',lastName='',middleName='',postalCodeName="",stateName="",state="",pounds="",ouces="",pkgValueAmt="";
    var emailAddress = getReceiverEmailAddress();
    var unprocessedAddress = getRawAddress();
    var addressLines = unprocessedAddress.split("\n");
    var country = addressLines[7].replace(/^\s*|\s*$/g,'');
    var cityStateZip = addressLines[6].split(", ");
    if (country == "United States") {
        deliveryCountry = 840;
        postalCodeName = "Zipcode";
        stateName = cityStateZip[1].replace(/^\s*|\s*$/g,'');
        state = getStateValue(stateName);

    } else if (country == "Canada") {
        deliveryCountry = 124;
        postalCodeName = "PostalCode";
        stateName = "province";
        state = cityStateZip[1].replace(/^\s*|\s*$/g,'');
    } else {
        alert("Shipping to " + country + " is not supported.");
    }
    var fullName = addressLines[0].replace(/^\s*|\s*$/g,'').replace(/\s/g,' ');
    var fullNameSplit = fullName.split(' ');
    firstName = fullNameSplit[0] !== undefined ? fullNameSplit[0] : '';
    lastName = fullNameSplit.length == 3 ? fullNameSplit[2] : (fullNameSplit[1] !== undefined ? fullNameSplit[1] : '');
    middleName = fullNameSplit.length == 3 ? fullNameSplit[1] : '';
     companyName = '';//addressLines[2].replace(/^\s*|\s*$/g,'').replace(/\s/g,' ');
    addressOne = addressLines[2].replace(/^\s*|\s*$/g,'').replace(/\s/g,' ');
    addressTwo = '';//addressLines[4].replace(/^\s*|\s*$/g,'').replace(/\s/g,' ');
    city = cityStateZip[0].replace(/^\s*|\s*$/g,'').replace(/\s/g,' ');
    zipcode = cityStateZip[2].replace(/^\s*|\s*$/g,'').replace(/\s/g,' ');

    //console.log(addressLines);
    //console.log(fullName);
    //console.log(fullNameSplit);
    console.log('FirstName: ' + firstName);
    console.log('MiddleName: ' + middleName);
    console.log('LastName: ' + lastName);
    console.log('AddressOne: ' + addressOne);
    console.log('AddressTwo: ' + addressTwo);
    console.log('City: ' + city);
    console.log('ZipCode: ' + zipcode);
    console.log('StateName: ' + stateName);
    console.log('StateCode: ' + state);

    var clickUrl = "https://cns.usps.com/labelInformation.shtml?deliveryAddressCountryId=" + deliveryCountry +
        "&deliveryAddressFirstName="+ firstName +
        "&deliveryAddressMiddleInit="+ middleName +
        "&deliveryAddressLastName="+ lastName +
        "&deliveryAddressCompany="+ companyName +
        "&deliveryAddressLine1Addr="+ addressOne +
        "&deliveryAddressLine2Addr=" + addressTwo +
        "&deliveryAddressCityName=" + city +
        "&pounds=" + pounds +
        "&ounces=" + ouces +
        "&pkgValueAmt=" + pkgValueAmt  +
        "&deliveryAddressPostalCode=" + zipcode +
        "&deliveryAddressStateName=" + stateName +
        "&deliveryAddressStateCode=" + state +
        "&deliveryEmail=" + emailAddress +
        "&emailNotification=true&shipFromZipCode=same";
    var btn = '<button type="button" target="_blank" onclick="window.open(\''+clickUrl+'\', true)" title="Click-N-Ship"><span><span>USPS Click-N-Ship</span></span></button>';
    $('.form-buttons').append(btn);
}