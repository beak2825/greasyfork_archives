// ==UserScript==
// @name         Purolator Improvements
// @namespace    http://tampermonkey.net/
// @version      2.0.2
// @description  Allows you to paste the building code
// @author       You
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net
// @grant        GM_setValue
// @grant        GM_getValue
// @match        *eshiponline.purolator.com/*
// @match        *goaprod.service-now.com/*
// @match        *https://snow-goa.fujitsu.ca:9443/*
// @require      https://code.jquery.com/jquery-3.6.4.min.js
// @run-at  document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/482058/Purolator%20Improvements.user.js
// @updateURL https://update.greasyfork.org/scripts/482058/Purolator%20Improvements.meta.js
// ==/UserScript==

const $ = window.jQuery;
const pageURL = window.location.href;

const testMode = false;

function GetLast9Digits(PastedNum) {
    // For +1 at the start
    let numOnlyStr = '';
    let retStr;

    for (const char of PastedNum) { //First get rid of all the '-' and '()' and ' ' in between numbers.
        if (char >= '0' && char <= '9') {
            numOnlyStr += char;
        }
    }
    if (numOnlyStr.length > 10) {
        retStr = numOnlyStr.substring(numOnlyStr.length - 10, numOnlyStr.length);
    }
    else {
        return numOnlyStr;
    }

    return retStr;
}

function GetShippedName(SFstring) {
    if (pageURL == "https://eshiponline.purolator.com/ShipOnline/shipment/shipment.aspx") {
        let br_index = SFstring.search("<br>");
        SFstring = SFstring.substring(br_index + 4);

        br_index = SFstring.search("<br>");
        SFstring = SFstring.substring(br_index + 4);

        br_index = SFstring.search("<br>");
        SFstring = SFstring.substring(0, br_index);
        GM_setValue("clientName", SFstring);
    }
}
function GetShippedNameNoParam() {
    let ShippedFromInfo = $('#ctl00_CPPC_FrAd_lblViewAddressViewMode').html();
    GetShippedName(ShippedFromInfo);
}

function getGovEmailFromName(name) {
    const spaceInd = name.search(" ");
    const firstName = name.substring(0, spaceInd);
    const lastName = name.substring(spaceInd + 1);
    const govEmail = firstName + "." + lastName + "@gov.ab.ca";
    return govEmail;
}

function formatYYYY_MM_DD(date) {
    const month = date.getMonth();
    //console.log("month is "+Number(month)+" Number(month) + 1 is "+Number(month + 1) );
    const monthNum = Number(month + 1);
    return date.getFullYear() + "-" + monthNum + "-" + date.getDate();
}

function substBefore(str, strToSearchFor) {
    if (str.indexOf(strToSearchFor) >= 0) { //Condition if strToSearchFor is contained, to make sure it doesn't return an empty string.
        const tempStr = str; //substring seemed to be altering it, so changed the code
        const retVal = str.substring(0, str.indexOf(strToSearchFor));
        str = tempStr
        return retVal;
    }
    else {
        return str;
    }
}

function substAfter(str, strToSearchFor) {
    const tempStr = str;
    const retVal = str.substring(str.search(strToSearchFor)+1, str.length);
    str = tempStr;
    return retVal;
}

function substNthOfXUtil(i, str, strToSearchFor) {
    str = substAfter(str, strToSearchFor);
    if (i >= 2) {
        str = substNthOfXUtil(i - 1, str, strToSearchFor);
    }
    return str;
}

//Finds the Nth item between the searched-for characters. With a space, this would be the nth word. n must be 2 or greater.
function substNthOfX(n, str, strToSearchFor) {
    if (n < 2) {
        console.log("Error: Param1 of substNthOfX must be 2 or greater.");
    }
    let tempStr = str;
    return substBefore(substNthOfXUtil(n - 1, tempStr, strToSearchFor), strToSearchFor);
}

function convertPhoneNumber() {
    let PastedNumber = $('#newphonebox').val()
    const Last10Digits = GetLast9Digits(PastedNumber);
    //const Last9Digits = PastedNumber;
    const AreaCodeDigits = Last10Digits.substring(0,3);
    const FullNumberDigits = Last10Digits.substring(3,10);

    const AreaCodeId = '#ctl00_CPPC_ToAd_txtPhoneArea';
    const FullNumberId = '#ctl00_CPPC_ToAd_txtPhone';
    $(AreaCodeId).val(AreaCodeDigits);
    $(FullNumberId).val(FullNumberDigits);
    if (testMode) {
        console.log("PastedNumber is "+PastedNumber);
        console.log("Last10Digits is "+Last10Digits);
        console.log("AreaCodeDigits is "+AreaCodeDigits);
        console.log("FullNumberDigits is "+FullNumberDigits);
        console.log("AreaCodeId is "+AreaCodeId);
        console.log("FullNumberId is "+FullNumberId);
    }
}

function getFirstNumOfStr(str) {
    let retStr = "";
    for (const ch of str) {
        if (ch >= '0' && ch <= '9') {
            retStr += ch;
        }
        else if (retStr != "") {
            break;
        }
    }
    return retStr;
}
if (testMode) {
    console.log("getFirstNumOfStr('7th floor') is "+getFirstNumOfStr('7th floor'));
    console.log("getFirstNumOfStr('17th floor') is "+getFirstNumOfStr('17th floor'));
    console.log("getFirstNumOfStr('floor 17th 7s') is "+getFirstNumOfStr('floor 17th 7s'));
}

$(window).bind("load", function () {
    const CompanyNameBox = $('#ctl00_CPPC_ToAd_txtName');
    CompanyNameBox.val('Government of Alberta');
    const ReceiverBox = $('#ctl00_CPPC_ctl00_txtReceiver');
    ReceiverBox.val('4393037');

    const NewPhoneBox = '</br><input name="newphonebox" type="text" maxlength="25" id="newphonebox" class="TextBox ui-autocomplete-input" onchange="ToAd_UserChangeAddressLocation();" size="30" autocomplete="off">';
    const FillPhoneNumLink = '<a id="convertphonelink" tabindex="-1" class="FieldTextLink" title="Convert Phone #">Convert Number</a>';
    $('#ctl00_CPPC_ToAd_lblPhone').append(NewPhoneBox);
    $('#ctl00_CPPC_ToAd_lblPhone').append(FillPhoneNumLink);
    $('#ctl00_CPPC_ToAd_lblExt').remove();
    $('#ctl00_CPPC_ToAd_txtExt').remove();
    $('#MainContent_ddBuildingCode').append(NewPhoneBox);

    //$('#EmailtableGrid').
    //$('#ctl00_CPPC_notificationsGridControl_NotificationDetailPanel>.FieldTextLink').css('color', 'green');
    //$('a[href="javascript:LocalAddRow();"]').click();
    let ShippedFromInfo = $('#ctl00_CPPC_FrAd_lblViewAddressViewMode').html();
    GetShippedName(ShippedFromInfo);
    let ShippedFromName = GM_getValue("clientName");
    const govAbEmail = getGovEmailFromName(ShippedFromName);

    LocalAddRow();
    $('#edit_Email_text_control_2').val(govAbEmail);
    $('#edit_name_text_control_2').val(ShippedFromName);
    $('#edit_delivery_check_control_2').attr("checked", true);

    let EditButton2 = '<a href="javascript:emailAddorModifyNotification();" class="FieldTextLink"><span id="ctl00_CPPC_notificationsControl_notificationReadOnlyControlOS_lblAddModifyEmailEdit" class="StaticText">Edit</span></a>';

    let parentOfEditButton = $('a[href="javascript:emailAddorModifyNotification();"]').parent();
    parentOfEditButton.prepend(EditButton2);

    //$('#emailNotiEdit').removeAttr("href");

    $('a[href="javascript:emailAddorModifyNotification();"]').click(function() {
        let ShippedFromInfo = $('#ctl00_CPPC_FrAd_lblViewAddressViewMode').html();
        GetShippedName(ShippedFromInfo);
    });

});

$(document).on('click', '#convertphonelink', function() {
    convertPhoneNumber();
});

setInterval(GetShippedNameNoParam, 300);


//**The weight and piece count auto-filler**
const weightLink = '&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&nbsp <a id="calcweightlink" tabindex="-1" class="FieldTextLink" title="Get Weight and Piece Count"  href="#" onclick="return false;">Calculate Weight</a>';
const pieceNumForm = $('#ctl00_CPPC_txtPiece');
const totalWeightForm = $('#ctl00_CPPC_txtWeight');
let totalWeight;
let weightItemVal;
let totalPieces;

$('#ctl00_CPPC_ddlUnit').parent().parent().append(weightLink);

$('#calcweightlink').click( function() {
    totalWeight = 0;
    totalPieces = 1;
    for (let i = 0; i < 9; i++) {
        weightItemVal = $('#cell_weight_'+String(i)).text();
        totalWeight += Number(weightItemVal);
        if (testMode) {
            console.log("i="+i+" and totalWeight="+totalWeight);
            console.log("#cell_weight_'+String(i) is #cell_weight_"+String(i));
        }
        if (weightItemVal != "") {
            totalPieces += 1;
        }
    }
    weightItemVal = $('#editCellWeight').val();
    totalWeight += Number(weightItemVal);

    pieceNumForm.val(totalPieces);
    totalWeightForm.val(totalWeight);
});

const nameForm = $("#ctl00_CPPC_ToAd_txtAttention");
let email;

nameForm.change(function() {
    email = getGovEmailFromName(nameForm.val());
    $('#ctl00_CPPC_ToAd_txtEmail').val(email);
});

const addStoredButton = '<a id="addStoredButton" tabindex="-1" class="FieldTextLink" title="Load info from Service-Now"  href="#" onclick="return false;">Add Stored</a>';

const returnButton = '&nbsp; <a id="compReturnButton" tabindex="-1" class="FieldTextLink" title=" Boxes from Client to Compugen"  href="#" onclick="return false;">Return Shipment </a>';
const shipDateForm = $('#ctl00_CPPC_ServiceDate_txtDate');
const trackRefForm = $('#ctl00_CPPC_ctl01_txtTracking');
let currentDate;
let shipmentDate;

$('#ctl00_CPPC_ToAd_lnkClearLongMode').remove();
$('#ctl00_CPPC_ToAd_anchorOutlook').parent().append(addStoredButton);

$('#ctl00_CPPC_ToAd_anchorOutlook').parent().append(returnButton);

$('#compReturnButton').click(function() {
    $('#ctl00_CPPC_ToAd_txtName').val("Compugen");
    $('#ctl00_CPPC_ToAd_txtDepartment').val("Sales");
    $('#ctl00_CPPC_ToAd_txtAttention').val("Compugen Calgary");
    $('#ctl00_CPPC_ToAd_ddlCountry').val("CA");
    $('#ctl00_CPPC_ToAd_txtPostalZipCode').val("T1Y 7G4");
    $('#ctl00_CPPC_ToAd_txtCity').val("CALGARY");
    $('#ctl00_CPPC_ToAd_ddlProvince').val("AB");
    $('#ctl00_CPPC_ToAd_txtStreetNumber').val("2256");
    $('#ctl00_CPPC_ToAd_txtStreetName').val("29");
    $('#ctl00_CPPC_ToAd_ddlStreetType').val("ST");
    $('#ctl00_CPPC_ToAd_ddlDirection').val("NE");
    $('#ctl00_CPPC_ToAd_txtSuite').val("90");
    $('#ctl00_CPPC_ToAd_txtPhoneArea').val("403");
    $('#ctl00_CPPC_ToAd_txtPhone').val("5714400");

    $('#ctl00_CPPC_ctl00_rdoReceiver').prop('checked', true);

    shipmentDate = new Date();
    shipmentDate.setDate(shipmentDate.getDate()  + 2);

    if (shipmentDate.getDay() == 0 || shipmentDate.getDay() == 6) {
        shipmentDate.setDate(shipmentDate.getDate()  + 2);
    }

    shipDateForm.val(formatYYYY_MM_DD(shipmentDate));

    trackRefForm.val(GM_getValue("trackRef", null));
});

$('#ctl00_CPPC_btnNext').click(function() {
    GM_setValue("trackRef", trackRefForm.val());
});

//--Loading info from Service-Now--

//-Gets the full name, department, and phone number-

const storeButtonSc = '<button class="form_action_button header  action_context btn btn-default" style="white-space: nowrap" id="sysverb_store" href="#" onclick="return false;">Store</button>';

const updateButton = $('#sysverb_update');
const storeButton = $('#sysverb_store');

updateButton.parent().prepend(storeButtonSc);

$(document).on('click', '#sysverb_store', function() { //A way to access HTML elements added dynamically, this way is required in this case.
    //Need to have it not overwrite the location info, and vice versa.
    if ($('#sys_readonly\\.sys_user\\.first_name').val() != undefined) {
        const firstName = $('#sys_readonly\\.sys_user\\.first_name').val(); //Will not work unless the two \\ are placed before the '.' in attribute names.
        const lastName = $('#sys_readonly\\.sys_user\\.last_name').val();
        const department = $('#sys_user\\.u_organization_label').val();
        const phoneNumber = $('#sys_readonly\\.sys_user\\.phone').val();
        const fullName = firstName + " " + lastName;
        GM_setValue("fullName", fullName);
        GM_setValue("phoneNumber", phoneNumber);
        GM_setValue("department", department);
        if (testMode) {
            console.log("firstName is "+firstName);
            console.log("department is "+department);
            console.log("phoneNumber is "+phoneNumber);
            console.log("fulName is "+fullName);
        }
    }
    else if ($('#sys_readonly\\.cmn_location\\.name').val() != undefined) {
        const bldgName = $('#sys_readonly\\.cmn_location\\.name').val();
        const bldgStreet = $('#sys_readonly\\.cmn_location\\.street').val();
        const bldgZipCode = $('#sys_readonly\\.cmn_location\\.zip').val();
        const bldgNum = $('#sys_readonly\\.cmn_location\\.u_building').val();
        const city = $('#sys_readonly\\.cmn_location\\.city').val();

        const cityFormatted = city.toUpperCase(); //Changes the entire string to uppercase letters
        const streetName = substBefore(bldgStreet, '\n').toUpperCase(); //The substring before the first newline character
        let buildName = substBefore(bldgName, '(');
        buildName = buildName.substring(0, buildName.length - 1); //removes the last ' ' character

        GM_setValue("city", cityFormatted);
        GM_setValue("bldgName", buildName);
        GM_setValue("streetName", streetName);
        GM_setValue("bldgZipCode", bldgZipCode);
        GM_setValue("bldgNum", bldgNum);

        if (testMode) {
            console.log("bldgNum is "+bldgNum);
            console.log("city is "+city);
            console.log("bldgName is "+bldgName);
            console.log("bldgStreet is "+bldgStreet);
            console.log("bldgZipCode is "+bldgZipCode);
            console.log("cityFormatted is "+cityFormatted);
            console.log("streetName is "+streetName);
            console.log("buildName is "+buildName);
        }
    }
    if ($('#sys_display\\.sc_task\\.request_item').val() != undefined) {
        const ritmNumber = $('#sys_display\\.sc_task\\.request_item').val();
        GM_setValue("incRitm", ritmNumber);
        if (testMode) {
            console.log("ritmNumber is "+ritmNumber);
        }
    }
    else if ($('#sys_readonly\\.incident\\.number').val() != undefined) {
        const incNumber = $('#sys_readonly\\.incident\\.number').val();
        GM_setValue("incRitm", incNumber);
        if (testMode) {
            console.log("incNumber is "+incNumber);
        }
    }
    //const floorNumDescr = $('div').filter(function() {return $(this).html() == 'Please enter the location where this equipment will be found in the building above.';}).parent().parent().children().last().val();
    const floorInfoDescr = $('div').filter(function() {return $(this).html() == 'Please enter the location where this equipment will be found in the building above.';});
    const floorNumDescr = $('div').filter(function() {return $(this).html() == 'Floor, direction [NW], and/or cubicle/office number';});


    let floorText, floorNum;
    if (floorInfoDescr != undefined) {
        floorText = floorInfoDescr.parent().parent().children().last().val();
        if (testMode) {
            console.log("floorInfoDescr is "+floorInfoDescr);
        }
    }
    if (floorText == undefined) {
        floorText = floorNumDescr.parent().parent().children().last().val();
        if (testMode) {
            console.log("floorText is "+floorText);
        }
    }

    if (floorText.substring(0,4).toLowerCase() == "main") {
        floorText = "1";
    }

    floorNum = getFirstNumOfStr(floorText); //For when the office number is given instead, will work for 3-digit ones.
    if (floorNum >= 100 && floorNum <= 999) {
        floorNum = Math.floor(floorNum / 100);
    }
    GM_setValue("floor", floorNum);
    if (testMode) {
        console.log("floorText is "+floorText);
        console.log("floorNum is "+floorNum);
    }
});


// Purolator "Add Stored" Button
$('#addStoredButton').click(function() {
    const fullName = GM_getValue("fullName");
    nameForm.val(fullName); //"Attention To"
    $('#ctl00_CPPC_ToAd_txtDepartment').val(GM_getValue("department")); //"Department"
    $('#ctl00_CPPC_ToAd_txtPostalZipCode').val(GM_getValue("bldgZipCode")); //"Postal Code"
    $('#ctl00_CPPC_ToAd_txtAddress2').val(GM_getValue("bldgName")); //"Address 2"
    $('#newphonebox').val(GM_getValue("phoneNumber")); //"Phone Number"
    convertPhoneNumber();
    const govEmail = getGovEmailFromName(fullName); //Converts a capitalized first & last name to a gov.ab.ca email.
    $('#ctl00_CPPC_ToAd_txtEmail').val(govEmail); //"E-mail Address"
    $('#ctl00_CPPC_ctl01_txtTracking').val(GM_getValue("incRitm")); //"Tracking Reference"
    const city = GM_getValue("city");
    $('#ctl00_CPPC_ToAd_txtCity').val(city);
    const streetText = GM_getValue("streetName");
    const firstPartOfAddr = substBefore(streetText, ' ');
    $('#ctl00_CPPC_ToAd_txtStreetNumber').val(firstPartOfAddr);

    let streetName = substNthOfX(2, streetText, ' '); //Gets the second word in a string of 2 or more words.
    let streetType;
    if (testMode) {
        console.log("prev streetName is "+streetName);
    }
    if (streetName == '-') { //handling when there is a '-' between the streetnumber and streetname.
        streetName = substNthOfX(3, streetText, ' '); //Same as 2ndOfX
        streetType = substNthOfX(4, streetText, ' '); //Same as 2ndOfX
    }
    else {
        streetType = substNthOfX(3, streetText, ' ');
    }
    streetType = streetType.toLowerCase();
    if (testMode) {
        console.log("streetText is "+streetText);
        console.log("new streetName is "+streetName);
        console.log("streetType is "+streetType);
        console.log('GM_getValue("bldgName") is '+GM_getValue("bldgName"));
        console.log('GM_getValue("phoneNumber") is '+GM_getValue("phoneNumber"));
        console.log("firstPartOfAddr is "+firstPartOfAddr);
    }
    $('#ctl00_CPPC_ToAd_txtStreetName').val(streetName);
    const typeForm = $('#ctl00_CPPC_ToAd_ddlStreetType'); //For the street type dropdown

    if (streetType == "avenue") {
        typeForm.val("AVE");
    }
    else if (streetType == "street") {
        typeForm.val("ST");
    }
    else if (streetType == "road") {
        typeForm.val("RD");
    }

    const directionForm = $('#ctl00_CPPC_ToAd_ddlDirection'); //Since the Direction is always NW in Edmonton.
    if (city == "EDMONTON") {
        directionForm.val("NW");
    }

    $('#ctl00_CPPC_ToAd_txtFloorNo').val(GM_getValue("floor"));
});

//SNOW Add Stored Button
//For some reason you can't make a library or header file without hosting it yourself.
//sn is the prefix for SNOW
//const snStoredButtonSc = '<input type="submit" name="ctl00$MainContent$btnUpdate" value="Update" id="storedButton" disabled="disabled" class="aspNetDisabled">';
//const snStoredButtonSc = '<input type="submit" name="ctl00$MainContent$btnClr" value="Clear" id="MainContent_btnClr" tabindex="4"><input type="submit" name="ctl00$MainContent$btnUpdate" value="Update" id="storedButton" disabled="disabled" class="aspNetDisabled"></input>';
//const snUpdateButton = $('#MainContent_btnUpdate');
const snClearButton = $('#MainContent_btnClr');
//snClearButton.removeAttr("type");

snClearButton.val("Add Stored");

//snUpdateButton.parent.prepend(snStoredButtonSc);
console.log("Purolator Improvements Script Run");

$(document).on('click', '#MainContent_btnClr', function(e) {
    e.preventDefault();
    const snUserButton = $('#MainContent_txtUser');
    const snItsmButton = $('#MainContent_txtITSMNo');
    const snBldgCodeBox = $('#buildCodeTextBox');
    const snBldgCodeDropdown = $('#MainContent_ddBuildingCode');
    snUserButton.val(GM_getValue("fullName"));
    snItsmButton.val(GM_getValue("incRitm"));
    snBldgCodeBox.val(GM_getValue("bldgNum"));

    let buildCodeTextVal = snBldgCodeBox.val();
    if (buildCodeTextVal[buildCodeTextVal.length - 1] == ' ') {
        buildCodeTextVal = buildCodeTextVal.substring(0, buildCodeTextVal.length - 1);
    }

    $('#MainContent_txtFloor').val(GM_getValue("floor"));

    let valueFromCode = $('option').filter(function () {return $(this).html() == buildCodeTextVal;}).val()
    snBldgCodeDropdown.val(valueFromCode);
    __doPostBack('ctl00$MainContent$ddBuildingCode','');

    let ministryTextVal = GM_getValue("department");
    valueFromCode = $('option').filter(function () {return $(this).html() == ministryTextVal;}).val()
    $('#MainContent_ddMinistry').val(valueFromCode);
    __doPostBack('ctl00$MainContent$ddMinistry','');
    if (testMode) {
    console.log("ministryTextVal is "+ministryTextVal);
    console.log("valueFromCode is "+valueFromCode);
    }
});