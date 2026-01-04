// ==UserScript==
// @name         gonz x supreme
// @version      1.3.6
// @description  Autofills Billing, Select Size and Clicks thru to Cart
// @author       gonz
// @include      http://www.supremenewyork.com/*
// @include      https://www.supremenewyork.com/*
// @include      https://www.supremenewyork.com/checkout
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_xmlhttpRequest
// @grant        GM_openInTab
// @grant        GM_setClipboard
// @require      http://code.jquery.com/jquery-latest.min.js
// @namespace    https://greasyfork.org/users/18630
// @downloadURL https://update.greasyfork.org/scripts/39288/gonz%20x%20supreme.user.js
// @updateURL https://update.greasyfork.org/scripts/39288/gonz%20x%20supreme.meta.js
// ==/UserScript==


////////////////////////////////////////////////////////////////////////
// ENTER DETAILS IF YOU WOULD LIKE TO SAVE A DEFAULT BILLING INFO.
////////////////////////////////////////////////////////////////////////

var useDefaultProfile = true;
var profileName = "DEFAULT";
var usrName = "First Last";
var usrEmail = "email@icloud.com";
var usrAddress = "555  5th Av";
var usrAddress2 = "";
var usrPhone = "9165555555";
var usrCity = "Sacramento";
var usrState = "CA";
var usrZip = "95822";
var usrCountry = "USA";
var usrCcNum = "1111222233334444";
var usrCcMonth = "04";
var usrCcYear = "2020";
var usrCcCode = "666";

////////////////////////////////////////////////////////////////////////
// DO NOT CHANGE ANYTHING BELOW
////////////////////////////////////////////////////////////////////////





/* USER INPUT PAGE */
if (window.location.toString() === "https://www.supremenewyork.com/about") {

    document.title = "gonz x supreme";
    document.getElementById('wrap').innerHTML = "";
    document.getElementById('nav-main').innerHTML = "";
    var table = document.createElement('table');
    document.getElementById('wrap').appendChild(table);

    headline = document.createElement("h1");
    headline.innerHTML = "ENTER BILLING INFORMATION BELOW";
    headline.style.color = '#ff0000';
    headline.style.fontSize = '48';
    headline.style.textAlign = 'center';
    headline.style.textDecoration = "underline";
    headline.style.marginBottom = "0px";
    document.getElementsByTagName('table')[0].innerHTML = "";
    document.getElementsByTagName('table')[0].appendChild(headline);
    document.getElementsByTagName('table')[0].style.border = "thin solid #ff0000";
    document.getElementsByTagName('table')[0].style.height = "100%";

    var whites = document.createElement('div');
    document.getElementsByTagName('table')[0].appendChild(whites);
    whites.style.textAlign = 'center';
    whites.style.marginBottom = "0px";

    var nameField = document.createElement("input");
    nameField.setAttribute("type", "text");
    nameField.setAttribute("id", "name");
    nameField.style.height = "15px";
    nameField.style.width = "200px";
    nameField.style.margin = "5px";
    nameField.style.background = "#FFFFFF";
    nameField.style.color = 'rgb(50, 79, 23)';
    nameField.style.fontWeight = "bold";
    nameField.style.border = "thin solid #ff0000";
    nameField.placeholder = "First Last";
    whites.appendChild(nameField);

    var emailField = document.createElement("input");
    emailField.setAttribute("type", "text");
    emailField.setAttribute("id", "email");
    emailField.style.height = "15px";
    emailField.style.width = "200px";
    emailField.style.margin = "5px";
    emailField.style.background = "#FFFFFF";
    emailField.style.color = 'rgb(50, 79, 23)';
    emailField.style.fontWeight = "bold";
    emailField.style.border = "thin solid #ff0000";
    emailField.placeholder = "supreme@supremenyc.com";
    whites.appendChild(emailField);

    var addyField = document.createElement("input");
    addyField.setAttribute("type", "text");
    addyField.setAttribute("id", "addy");
    addyField.style.height = "15px";
    addyField.style.width = "150px";
    addyField.style.margin = "5px";
    addyField.style.background = "#FFFFFF";
    addyField.style.color = 'rgb(50, 79, 23)';
    addyField.style.fontWeight = "bold";
    addyField.style.border = "thin solid #ff0000";
    addyField.placeholder = "439 North Fairfax Ave";
    linebreak = document.createElement("br");
    whites.appendChild(linebreak);
    whites.appendChild(addyField);

    var addy2Field = document.createElement("input");
    addy2Field.setAttribute("type", "text");
    addy2Field.setAttribute("id", "addy2");
    addy2Field.style.height = "15px";
    addy2Field.style.width = "150px";
    addy2Field.style.margin = "5px";
    addy2Field.style.background = "#FFFFFF";
    addy2Field.style.color = 'rgb(50, 79, 23)';
    addy2Field.style.fontWeight = "bold";
    addy2Field.style.border = "thin solid #ff0000";
    addy2Field.placeholder = "Apartment";
    whites.appendChild(addy2Field);

    var phoneField = document.createElement("input");
    phoneField.setAttribute("type", "text");
    phoneField.setAttribute("id", "phone");
    phoneField.style.height = "15px";
    phoneField.style.width = "75px";
    phoneField.style.margin = "5px";
    phoneField.style.background = "#FFFFFF";
    phoneField.style.color = 'rgb(50, 79, 23)';
    phoneField.style.fontWeight = "bold";
    phoneField.style.border = "thin solid #ff0000";
    linebreak9 = document.createElement("br");
    phoneField.placeholder = "3236556205";
    whites.appendChild(linebreak9);
    whites.appendChild(phoneField);

    var cityField = document.createElement("input");
    cityField.setAttribute("type", "text");
    cityField.setAttribute("id", "city");
    cityField.style.height = "15px";
    cityField.style.width = "165px";
    cityField.style.margin = "5px";
    cityField.style.background = "#FFFFFF";
    cityField.style.color = 'rgb(50, 79, 23)';
    cityField.style.fontWeight = "bold";
    cityField.style.border = "thin solid #ff0000";
    cityField.placeholder = "Los Angeles";
    linebreak2 = document.createElement("br");
    whites.appendChild(linebreak2);
    whites.appendChild(cityField);

    var stateField = document.createElement("input");
    stateField.setAttribute("type", "text");
    stateField.setAttribute("id", "state");
    stateField.style.height = "15px";
    stateField.style.width = "65px";
    stateField.style.margin = "5px";
    stateField.style.background = "#FFFFFF";
    stateField.style.color = 'rgb(50, 79, 23)';
    stateField.style.fontWeight = "bold";
    stateField.style.border = "thin solid #ff0000";
    stateField.placeholder = "CA";
    whites.appendChild(stateField);

    var zipField = document.createElement("input");
    zipField.setAttribute("type", "text");
    zipField.setAttribute("id", "zip");
    zipField.style.height = "15px";
    zipField.style.width = "65px";
    zipField.style.margin = "5px";
    zipField.style.background = "#FFFFFF";
    zipField.style.color = 'rgb(50, 79, 23)';
    zipField.style.fontWeight = "bold";
    zipField.style.border = "thin solid #ff0000";
    zipField.placeholder = "90036";
    whites.appendChild(zipField);

    var countryField = document.createElement("input");
    countryField.setAttribute("type", "text");
    countryField.setAttribute("id", "country");
    countryField.style.height = "15px";
    countryField.style.width = "110px";
    countryField.style.margin = "5px";
    countryField.style.background = "#FFFFFF";
    countryField.style.color = 'rgb(50, 79, 23)';
    countryField.style.fontWeight = "bold";
    countryField.style.border = "thin solid #ff0000";
    countryField.placeholder = "USA";
    whites.appendChild(countryField);

    var ccNumField = document.createElement("input");
    ccNumField.setAttribute("type", "text");
    ccNumField.setAttribute("id", "cc_num");
    ccNumField.style.height = "15px";
    ccNumField.style.width = "120PX";
    ccNumField.style.margin = "5px";
    ccNumField.style.background = "#FFFFFF";
    ccNumField.style.color = 'rgb(50, 79, 23)';
    ccNumField.style.fontWeight = "bold";
    ccNumField.style.border = "thin solid #ff0000";
    ccNumField.placeholder = "1111222233334444";
    whites.appendChild(ccNumField);

    var ccExpMonthField = document.createElement("input");
    ccExpMonthField.setAttribute("type", "text");
    ccExpMonthField.setAttribute("id", "cc_exp_month");
    ccExpMonthField.style.height = "15px";
    ccExpMonthField.style.width = "25PX";
    ccExpMonthField.style.margin = "5px";
    ccExpMonthField.style.background = "#FFFFFF";
    ccExpMonthField.style.color = 'rgb(50, 79, 23)';
    ccExpMonthField.style.fontWeight = "bold";
    ccExpMonthField.style.border = "thin solid #ff0000";
    ccExpMonthField.placeholder = "04";
    whites.appendChild(ccExpMonthField);

    var ccExpYearField = document.createElement("input");
    ccExpYearField.setAttribute("type", "text");
    ccExpYearField.setAttribute("id", "cc_exp_year");
    ccExpYearField.style.height = "15px";
    ccExpYearField.style.width = "35PX";
    ccExpYearField.style.margin = "5px";
    ccExpYearField.style.background = "#FFFFFF";
    ccExpYearField.style.color = 'rgb(50, 79, 23)';
    ccExpYearField.style.fontWeight = "bold";
    ccExpYearField.style.border = "thin solid #ff0000";
    ccExpYearField.placeholder = "2020";
    whites.appendChild(ccExpYearField);

    var ccCCV = document.createElement("input");
    ccCCV.setAttribute("type", "text");
    ccCCV.setAttribute("id", "cc_ccv");
    ccCCV.style.height = "15px";
    ccCCV.style.width = "35PX";
    ccCCV.style.margin = "5px";
    ccCCV.style.background = "#FFFFFF";
    ccCCV.style.color = 'rgb(50, 79, 23)';
    ccCCV.style.fontWeight = "bold";
    ccCCV.style.border = "thin solid #ff0000";
    ccCCV.placeholder = "666";
    whites.appendChild(ccCCV);

    var addBillButton = document.createElement('input');
    addBillButton.type = "button";
    addBillButton.id = "add_billing";
    addBillButton.value = "ADD BILLING";
    addBillButton.style.height ="20px";
    addBillButton.style.width ="100px";
    addBillButton.style.margin = "5px";
    addBillButton.style.marginTop = "0px";
    linebreak_aBB = document.createElement("br");
    whites.appendChild(linebreak_aBB);
    whites.appendChild(addBillButton);
    addBillButton.style.background = "#FFFFFF";
    addBillButton.style.color = 'rgb(255, 0, 0)';
    addBillButton.style.fontWeight = 'bold';
    addBillButton.style.border = "thin solid #ff0000";

    var inputName = [];
    var inputEmail = [];
    var inputAddy = [];
    var inputAddy2 = [];
    var inputPhone = [];
    var inputZip = [];
    var inputCity = [];
    var inputState = [];
    var inputCountry = [];
    var inputCCNum = [];
    var inputExpMonth = [];
    var inputExpYear = [];
    var inputCCV = [];
    var j=0;

    var billList = document.createElement("li");
    billList.id = "bill_list";
    whites.appendChild(billList);

    addBillButton.onclick = function() {
        if ( $('#name').val().length !== 0 &&
            $('#email').val().length !== 0 &&
            $('#addy').val().length !== 0 &&
            $('#phone').val().length !== 0 &&
            $('#zip').val().length !== 0 &&
            $('#city').val().length !== 0 &&
            $('#state').val().length !== 0 &&
            $('#cc_num').val().length !== 0 &&
            $('#cc_exp_month').val().length !== 0 &&
            $('#cc_exp_year').val().length !== 0 &&
            $('#cc_ccv').val().length !== 0 &&
            $('#country').val().length !== 0 ) {

            inputName[j] = $('#name').val();
            inputEmail[j] = $('#email').val();
            inputAddy[j] = $('#addy').val();
            inputAddy2[j] = $('#addy2').val();
            inputPhone[j] = $('#phone').val();
            inputZip[j] = $('#zip').val();
            inputCity[j] = $('#city').val();
            inputState[j] = $('#state').val();
            inputCountry[j] = $('#country').val();
            inputCCNum[j] = $('#cc_num').val();
            inputExpMonth[j] = $('#cc_exp_month').val();
            inputExpYear[j] = $('#cc_exp_year').val();
            inputCCV[j] = $('#cc_ccv').val();

            var ul = document.getElementById("bill_list");
            var li = document.createElement("li");
            var lastFive = inputCCNum[j].substr(inputCCNum[j].length - 4);
            var billingName = inputName[j] + " " + lastFive;
            li.appendChild(document.createTextNode(billingName));
            ul.appendChild(li);
            GM_setValue("billingName", billingName);

            $('#name').val("");
            $('#email').val("");
            $('#addy').val("");
            $('#addy2').val("");
            $('#phone').val("");
            $('#zip').val("");
            $('#city').val("");
            $('#state').val("");
            $('#country').val("");
            $('#cc_num').val("");
            $('#cc_exp_month').val("");
            $('#cc_exp_year').val("");
            $('#cc_ccv').val("");
            $("#add_billing").prop("disabled",true);
            $("#add_billing").val("BILLING ADDED");

            j++;

        } else {
            alert("YOU DID NOT ENTER COMPLETE BILLING DETAILS");
        }
    };

    var typeField = document.createElement("select");
    typeField.setAttribute("id", "type");
    typeField.style.height = "20px";
    typeField.style.width = "120px";
    typeField.style.margin = "5px";
    typeField.style.background = "#FFFFFF";
    typeField.style.color = "rgb(50, 79, 23)";
    typeField.style.border = "thin solid #ff0000";
    linebreak7 = document.createElement("br");
    whites.appendChild(linebreak7);
    whites.appendChild(typeField);
    typeField.style["margin-left"] = "275px";

    var optionDisplay2 = document.createElement("option");
    optionDisplay2.text = "Select Type";
    typeField.add(optionDisplay2);
    var optionJacket = document.createElement("option");
    optionJacket.value = "jackets";
    optionJacket.text = "Jackets";
    typeField.add(optionJacket);
    var optionShirts = document.createElement("option");
    optionShirts.value = "shirts";
    optionShirts.text = "Shirts";
    typeField.add(optionShirts);
    var optionTops_Sweaters = document.createElement("option");
    optionTops_Sweaters.value = "tops_sweaters";
    optionTops_Sweaters.text = "Tops/Sweaters";
    typeField.add(optionTops_Sweaters);
    var optionSweatshirts = document.createElement("option");
    optionSweatshirts.value = "sweatshirts";
    optionSweatshirts.text = "Sweatshirts";
    typeField.add(optionSweatshirts);
    var optionPants = document.createElement("option");
    optionPants.value = "pants";
    optionPants.text = "Pants";
    typeField.add(optionPants);
    var optionShorts = document.createElement("option");
    optionShorts.value = "shorts";
    optionShorts.text = "Shorts";
    typeField.add(optionShorts);
    var optionTshirts = document.createElement("option");
    optionTshirts.value = "t-shirts";
    optionTshirts.text = "T-shirts";
    typeField.add(optionTshirts);
    var optionHats = document.createElement("option");
    optionHats.value = "hats";
    optionHats.text = "Hats";
    typeField.add(optionHats);
    var optionBags = document.createElement("option");
    optionBags.value = "bags";
    optionBags.text = "Bags";
    typeField.add(optionBags);
    var optionAccessories = document.createElement("option");
    optionAccessories.value = "accessories";
    optionAccessories.text = "Accessories";
    typeField.add(optionAccessories);
    var optionShoes = document.createElement("option");
    optionShoes.value = "shoes";
    optionShoes.text = "Shoes";
    typeField.add(optionShoes);
    var optionSkate = document.createElement("option");
    optionSkate.value = "skate";
    optionSkate.text = "Skate";
    typeField.add(optionSkate);

    var sizeField = document.createElement("input");
    sizeField.setAttribute("type", "text");
    sizeField.setAttribute("id", "size");
    sizeField.style.height = "15px";
    sizeField.style.width = "100PX";
    sizeField.style.margin = "5px";
    sizeField.style.background = "#FFFFFF";
    sizeField.style.color = 'rgb(50, 79, 23)';
    sizeField.style.fontWeight = "bold";
    sizeField.style.border = "thin solid #ff0000";
    sizeField.placeholder = "Item Size";
    whites.appendChild(sizeField);

    var keyField = document.createElement("input");
    keyField.setAttribute("type", "text");
    keyField.setAttribute("id", "key");
    keyField.style.height = "15px";
    keyField.style.width = "200PX";
    keyField.style.margin = "5px";
    keyField.style.background = "#FFFFFF";
    keyField.style.color = 'rgb(50, 79, 23)';
    keyField.style.fontWeight = "bold";
    keyField.style.border = "thin solid #ff0000";
    keyField.placeholder = "Item Name";
    whites.appendChild(keyField);

    var colorField = document.createElement("input");
    colorField.setAttribute("type", "text");
    colorField.setAttribute("id", "color");
    colorField.style.height = "15px";
    colorField.style.width = "100PX";
    colorField.style.margin = "5px";
    colorField.style.background = "#FFFFFF";
    colorField.style.color = 'rgb(50, 79, 23)';
    colorField.style.fontWeight = "bold";
    colorField.style.border = "thin solid #ff0000";
    colorField.placeholder = "Item Color";
    whites.appendChild(colorField);

    var addItemButton = document.createElement('input');
    addItemButton.type = "button";
    addItemButton.id = "add_item";
    addItemButton.value = "ADD ITEM";
    addItemButton.style.height ="20px";
    addItemButton.style.width ="75px";
    addItemButton.style.margin = "5px";
    addItemButton.style.marginTop = "0px";
    whites.appendChild(addItemButton);
    addItemButton.style.background = "#FFFFFF";
    addItemButton.style.color = 'rgb(255, 0, 0)';
    addItemButton.style.fontWeight = 'bold';
    addItemButton.style.border = "thin solid #ff0000";

    var inputType= [];
    var inputSize= [];
    var inputKey= [];
    var inputColor= [];
    var i=0;
    var refreshRate;

    var itemList = document.createElement("li");
    itemList.id = "item_list";
    whites.appendChild(itemList);

    addItemButton.onclick = function() {

        if ( $('#type').val() !== "Select Type" &&
            $('#size').val().length !== 0 &&
            $('#key').val().length !== 0 &&
            $('#color').val().length !== 0 )
        {

            inputType[i] = $('#type').val();
            inputSize[i] = $('#size').val();
            inputKey[i] = $('#key').val();
            inputColor[i] = $('#color').val();

            $('#type').val("Select Type");
            $('#size').val("");
            $('#key').val("");
            $('#color').val("");


            var ul = document.getElementById("item_list");
            var li = document.createElement("li");
            var itemDetail = inputType[i] + " " + inputSize[i] + " " + inputKey[i] + " " + inputColor[i];
            li.appendChild(document.createTextNode(itemDetail));
            ul.appendChild(li);

            i++;
        } else {
            alert("YOU DID NOT ENTER COMPLETE ITEM DETAILS");
        }
    };

    var refreshOption = document.createElement("select");
    refreshOption.setAttribute("id", "ref");
    refreshOption.style.height = "20px";
    refreshOption.style.width = "120px";
    refreshOption.style.margin = "5px";
    refreshOption.style.background = "#FFFFFF";
    refreshOption.style.color = "rgb(50, 79, 23)";
    refreshOption.style.border = "thin solid #ff0000";
    linebreak8 = document.createElement("br");
    whites.appendChild(linebreak8);
    whites.appendChild(refreshOption);
    refreshOption.style["margin-left"] = "275px";
    var optionNo = document.createElement("option");
    optionNo.text = "No";
    refreshOption.add(optionNo);
    var optionYes = document.createElement("option");
    optionYes.text = "Yes";
    refreshOption.add(optionYes);

    var a = 0;
    $('#ref').on('change',function(){
        if( $(this).val()==="Yes"){
            a++;
            if (a == 1) {
                $('#refresh').before("REFRESH RATE (1000 = 1s)");
            }
            $("#refresh").show();
        } else{
            $("#refresh").hide();
        }
    });

    var submitField = document.createElement("input");
    submitField.setAttribute("type", "text");
    submitField.setAttribute("id", "refresh");
    submitField.style.height = "15px";
    submitField.style.width = "50PX";
    submitField.style.margin = "5px";
    submitField.style.background = "#FFFFFF";
    submitField.style.color = 'rgb(50, 79, 23)';
    submitField.style.fontWeight = "bold";
    submitField.style.border = "thin solid #ff0000";
    submitField.placeholder = "1000";
    whites.appendChild(submitField);

    var submitOption = document.createElement("select");
    submitOption.setAttribute("id", "sub");
    submitOption.style.height = "20px";
    submitOption.style.width = "120px";
    submitOption.style.margin = "5px";
    submitOption.style.background = "#FFFFFF";
    submitOption.style.color = "rgb(50, 79, 23)";
    submitOption.style.border = "thin solid #ff0000";
    linebreak8 = document.createElement("br");
    whites.appendChild(linebreak9);
    whites.appendChild(submitOption);
    submitOption.style["margin-left"] = "275px";
    var optionNo2 = document.createElement("option");
    optionNo2.text = "No";
    submitOption.add(optionNo2);
    var optionYes2 = document.createElement("option");
    optionYes2.text = "Yes";
    submitOption.add(optionYes2);

    var saveButton = document.createElement('input');
    saveButton.type = "button";
    saveButton.id = "save";
    saveButton.value = "SAVE";
    saveButton.style.height ="30px";
    saveButton.style.width ="120px";
    saveButton.style.margin = "5px";
    saveButton.style.marginTop = "0px";
    linebreak4 = document.createElement("br");
    linebreak5 = document.createElement("br");
    linebreak6 = document.createElement("br");
    whites.appendChild(linebreak4);
    whites.appendChild(linebreak5);
    whites.appendChild(linebreak6);
    whites.appendChild(saveButton);
    saveButton.style.background = "#FFFFFF";
    saveButton.style.color = 'rgb(255, 0, 0)';
    saveButton.style.fontWeight = 'bold';
    saveButton.style.border = "thin solid #ff0000";
    saveButton.onclick = function() {

        if  ( j === 0) {
            alert("YOU DID NOT ENTER ANY BILLING INFO");
        } else if ( i === 0 ) {
            alert("YOU DID NOT ENTER ANY ITEMS");
        } else {
            GM_setValue('inputName', JSON.stringify(inputName));
            GM_setValue('inputEmail', JSON.stringify(inputEmail));
            GM_setValue('inputAddy', JSON.stringify(inputAddy));
            GM_setValue('inputAddy2', JSON.stringify(inputAddy2));
            GM_setValue('inputPhone', JSON.stringify(inputPhone));
            GM_setValue('inputZip', JSON.stringify(inputZip));
            GM_setValue('inputCity', JSON.stringify(inputCity));
            GM_setValue('inputState', JSON.stringify(inputState));
            GM_setValue('inputCountry', JSON.stringify(inputCountry));
            GM_setValue('inputCCNum', JSON.stringify(inputCCNum));
            GM_setValue('inputExpMonth', JSON.stringify(inputExpMonth));
            GM_setValue('inputExpYear', JSON.stringify(inputExpYear));
            GM_setValue('inputCCV', JSON.stringify(inputCCV));
            GM_setValue("numBills", j);

            GM_setValue("keyType", JSON.stringify(inputType));
            GM_setValue("keySize", JSON.stringify(inputSize));
            GM_setValue("keyWord", JSON.stringify(inputKey));
            GM_setValue("keyColor", JSON.stringify(inputColor));
            GM_setValue("numElems", i);

            GM_setValue("count", 0);

            var refreshing = $("#ref :selected").text();
            var submitOption = $("#sub :selected").text();

            if ( refreshing === "No" ) {
                console.log("ref not enabled");
                GM_setValue("toRefresh", JSON.stringify(false));
            } else {
                refreshRate = $('#refresh').val();
                console.log(refreshRate);
                GM_setValue("refreshRate", JSON.stringify(refreshRate));
                GM_setValue("toRefresh", JSON.stringify(true));
            }

            if ( submitOption === "No" ) {
                console.log("submit not enabled");
                GM_setValue("submit", JSON.stringify(false));
            } else {
                console.log("submit enabled");
                GM_setValue("submit", JSON.stringify(true));
            }


            $("#nav").append("INFORMATION SAVED! CLICK START TO BEGIN");
            $("#save").prop("disabled",true);

        }
    };

    var startButton = document.createElement('input');
    startButton.type = "button";
    startButton.id = "start";
    startButton.value = "START";
    startButton.style.height ="30px";
    startButton.style.width ="120px";
    startButton.style.margin = "5px";
    startButton.style.marginTop = "0px";
    whites.appendChild(startButton);
    startButton.style.background = "#FFFFFF";
    startButton.style.color = 'rgb(255, 0, 0)';
    startButton.style.fontWeight = 'bold';
    startButton.style.border = "thin solid #ff0000";
    startButton.onclick = function() {
        var path = JSON.parse(GM_getValue("keyType"));
        var working = true;
        //var millis = new Date().getTime();
        //console.log(millis);


        GM_setValue("working", working);
        //GM_setValue("timer", millis);
        $("#nav").append("<br>TASK STARTED!</br>");
        window.open('/shop/all/' + path[0]);
    };

    var dummyButton = document.createElement('input');
    dummyButton.type = "button";
    dummyButton.id = "test";
    dummyButton.value = "TEST";
    dummyButton.style.height ="30px";
    dummyButton.style.width ="120px";
    dummyButton.style.margin = "5px";
    dummyButton.style.marginTop = "0px";
    whites.appendChild(dummyButton);
    dummyButton.style.background = "#FFFFFF";
    dummyButton.style.color = 'rgb(255, 0, 0)';
    dummyButton.style.fontWeight = 'bold';
    dummyButton.style.border = "thin solid #ff0000";
    dummyButton.onclick = function() {
        $('#name').val("Mr Burns");
        $('#email').val("burnit@gmail.com");
        $('#addy').val("420 Its Lit Way");
        $('#addy2').val("");
        $('#phone').val("5555555555");
        $('#zip').val("55555");
        $('#city').val("Springfield");
        $('#state').val("IL");
        $('#country').val("USA");
        $('#cc_num').val("1111222233334444");
        $('#cc_exp_month').val("04");
        $('#cc_exp_year').val("2020");
        $('#cc_ccv').val("666");
        $('#type').val("accessories");
        $('#size').val("Large");
        $('#key').val("Supreme®/Hanes® Tagless Tees (3 Pack)");
        $('#color').val("Black");
        $('#ref').val("No");
    };

    function deleteAll(){
        var nuke = confirm('**WARNING** \n\nThis will delete all of your saved information.\n\nAre you sure you want to do this?');
        if (nuke === true){
            GM_deleteValue("inputName");
            GM_deleteValue("inputEmail");
            GM_deleteValue("inputAddy");
            GM_deleteValue("inputAddy2");
            GM_deleteValue("inputPhone");
            GM_deleteValue("inputZip");
            GM_deleteValue("inputCity");
            GM_deleteValue("inputState");
            GM_deleteValue("inputCountry");
            GM_deleteValue("inputCCNum");
            GM_deleteValue("inputExpMonth");
            GM_deleteValue("inputExpYear");
            GM_deleteValue("inputCCV");
            GM_deleteValue("keyType");
            GM_deleteValue("keySize");
            GM_deleteValue("keyWord");
            GM_deleteValue("keyColor");
            GM_deleteValue("numElems");
            GM_deleteValue("numBills");
            GM_deleteValue("count");
            $('input[type="text"]').val("");
            location.reload();
        }
    }

    var deleter = document.createElement("input");
    deleter.type = "button";
    deleter.value = "CLEAR DATA";
    deleter.style.height ="30px";
    deleter.style.width ="120px";
    deleter.style.margin = "5px";
    deleter.style.marginTop = "0px";
    whites.appendChild(deleter);
    deleter.style.background = "#FFFFFF";
    deleter.style.color = 'rgb(255, 0, 0)';
    deleter.style.fontWeight = 'bold';
    deleter.style.border = "thin solid #ff0000";
    deleter.addEventListener("click", deleteAll, false);

    $('#name').before("NAME");
    $('#email').before("EMAIL");
    $('#addy').before("ADDRESS");
    $('#addy2').before("ADDRESS 2");
    $('#zip').before("ZIP CODE");
    $('#phone').before("PHONE");
    $('#city').before("CITY");
    $('#state').before("STATE");
    $('#country').before("COUNTRY");
    $('#cc_num').before("CREDIT CARD NUMBER");
    $('#cc_exp_month').before("EXP. MONTH");
    $('#cc_exp_year').before("EXP. YEAR");
    $('#cc_ccv').before("SECURITY CODE ");
    $('#type').before("CATEGORY");
    $('#size').before("SIZE");
    $('#key').before("KEYWORD");
    $('#color').before("COLOR");
    $('#ref').before("AUTO REFRESH?");
    $('#sub').before("SUBMIT PAYMENT?");
    $('#saveButton').text("SAVE");
    $("#wrap").height(600);
    $("#refresh").hide();

    if (useDefaultProfile) {
        var savedButton = document.createElement('input');
        savedButton.type = "button";
        savedButton.id = "saved";
        savedButton.value = profileName;
        savedButton.style.height ="30px";
        savedButton.style.width ="120px";
        savedButton.style.margin = "5px";
        savedButton.style.marginTop = "0px";
        whites.appendChild(savedButton);
        savedButton.style.background = "#FFFFFF";
        savedButton.style.color = 'rgb(255, 0, 0)';
        savedButton.style.fontWeight = 'bold';
        savedButton.style.border = "thin solid #ff0000";
        savedButton.onclick = function() {
            $('#name').val(usrName);
            $('#email').val(usrEmail);
            $('#addy').val(usrAddress);
            $('#addy2').val(usrAddress2);
            $('#phone').val(usrPhone);
            $('#zip').val(usrZip);
            $('#city').val(usrCity);
            $('#state').val(usrState);
            $('#country').val(usrCountry);
            $('#cc_num').val(usrCcNum);
            $('#cc_exp_month').val(usrCcMonth);
            $('#cc_exp_year').val(usrCcYear);
            $('#cc_ccv').val(usrCcCode);
        };
    }
}

/* SEARCHES FOR ITEMS */
if (window.location.href.indexOf("shop") > 1 && $('#container').length && $('#nav-categories').length) {

    var arrWord = JSON.parse(GM_getValue("keyWord"));
    var arrColor = JSON.parse(GM_getValue("keyColor"));
    var count = GM_getValue("count");
    var counter = $('h1 > a').length;
    var found = false;
    var toRefresh = JSON.parse(GM_getValue("toRefresh"));
    var run = GM_getValue("working");

    arrWord = arrWord[count];
    arrColor = arrColor[count];

    for (var i=0; i < counter; i++) {
        var itemName = $('h1:eq('+i+') > a').text();
        itemName = itemName.replace(/[\uE000-\uF8FF]/g, '');
        itemName = itemName.replace(/[\uE000-\uF8FF]/g, '');

        if (itemName.toLowerCase().indexOf(arrWord.toLowerCase()) >= 0) {
            var j = i-1;
            if ( $('p:eq('+j+') > a').text().toLowerCase() == arrColor.toLowerCase()) {
                console.log('found item');
                found = true;
                $('p:eq('+j+') > a')[0].click();
            }
        }
    }


    if (toRefresh && run) {
        var refresh = JSON.parse(GM_getValue("refreshRate"));
        if (!found) {
            setTimeout(function() { location.reload(); }, refresh);
        }
    }
}

/* CARTS ITEMS */
$(document).on('ready page:change', function() {

    var run = GM_getValue("working");

    if ( $( "#details" ).length && run) {
        cartSize();
        var millis = new Date().getTime();
        console.log(millis);
        GM_setValue("timer", millis);
    }

    function cartSize() {
        var size = JSON.parse(GM_getValue("keySize"));
        var count = GM_getValue("count");
        var num = GM_getValue("numElems");
        var path = JSON.parse(GM_getValue("keyType"));
        size = size[count];
        path = path[count+1];

        $( "#container option" ).filter(function() {
            return $.trim( $(this).text().toLowerCase() ) == size.toLowerCase();
        }).attr('selected','selected');
        $( "#container input" ).click();
        count = count+1;

        function contOrCheckout() {
            if ( count < num) {
                GM_setValue("count", count);
                setTimeout(function() { window.location = '/shop/all/' + path; }, 250);
            } else {
                setTimeout(function() {
                    GM_setValue("count", count);
                    $('#cart > a:eq(1)')[0].click();
                }, 250);
            }
        }

        setTimeout(function() {
            if ( $('#cart').is(":hidden")) {
                console.log('no cart present');
                if ( $(".button.remove").length < 1 ) {
                    $( "#container input" ).click();
                    contOrCheckout();
                }
            } else {
                console.log('cart present');
                contOrCheckout();
            }
        }, 500);
    }
});

/* CHECKOUT PAGE */
if (window.location.toString() === "https://www.supremenewyork.com/checkout") {

    var c_name = JSON.parse(GM_getValue("inputName"));
    var c_email = JSON.parse(GM_getValue("inputEmail"));
    var c_addy = JSON.parse(GM_getValue("inputAddy"));
    var c_addy2 = JSON.parse(GM_getValue("inputAddy2"));
    var c_phone = JSON.parse(GM_getValue("inputPhone"));
    var c_zip = JSON.parse(GM_getValue("inputZip"));
    var c_city = JSON.parse(GM_getValue("inputCity"));
    var c_state = JSON.parse(GM_getValue("inputState"));
    var c_country = JSON.parse(GM_getValue("inputCountry"));
    var c_ccnum = JSON.parse(GM_getValue("inputCCNum"));
    var c_ccmonth = JSON.parse(GM_getValue("inputExpMonth"));
    var c_ccyear = JSON.parse(GM_getValue("inputExpYear"));
    var c_ccccv = JSON.parse(GM_getValue("inputCCV"));
    var num = GM_getValue("numBills");
    var k = 0;
    var timer = JSON.parse(GM_getValue("timer"));
    var millis = new Date().getTime();
    var time = millis - timer;
    var submit = JSON.parse(GM_getValue("submit"));
    var run = GM_getValue("working");

    //$('.iCheck-helper').click();
    $('p input').click();

    GM_setValue("working", false);

    if ( $("#cart-address .errors").length && run) {
        $('#cart-address div:eq(1) input').val( c_name[k] );
        $('#cart-address div:eq(2) input').val( c_email[k] );
        $('#cart-address div:eq(3) input').val( c_phone[k] );
    } else if (run) {
        billing();
    }

    if (submit) {
        if ( time >= 2000 ) {
            $('input.button').click();
        } else {
            var delay = 2000 - time;
            setTimeout(function() { $('input.button').click(); }, delay);
        }
    }

    function billing() {
        $('#cart-address div:eq(0) input').val( c_name[k] );
        $('#cart-address div:eq(1) input').val( c_email[k] );
        $('#cart-address div:eq(2) input').val( c_phone[k] );
        $('#cart-address div:eq(3) div:eq(0) input').val( c_addy[k] );
        $('#cart-address div:eq(3) div:eq(1) input').val(  c_addy2[k] );
        $('#cart-address div:eq(6) div:eq(0) input').val( c_zip[k] );
        $('#cart-address div:eq(6) div:eq(1) input').val( c_city[k] );
        $('#cart-address div:eq(6) div:eq(2) select').val( c_state[k] );
        $("#card_details input:eq(0)").focus();
        $("#card_details input:eq(0)").val( c_ccnum[k] );
        $("#card_details input:eq(1)").val( c_ccccv[k] );
        $('#card_details select:eq(0)').val( c_ccmonth[k] );
        $('#card_details select:eq(1)').val( c_ccyear[k] );
        $("#card_details input:eq(0)").focus();
        $("#card_details input:eq(1)").focus();
    }
}