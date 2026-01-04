// ==UserScript==
// @name         EzMug Beta
// @namespace    http://torn.com/
// @version      1.2
// @description  Making mugging easier since 2021
// @author       Sterling [1616063]
// @match        https://www.torn.com/loader.php?sid=attack&*
// @grant        GM.addStyle
// @downloadURL https://update.greasyfork.org/scripts/423281/EzMug%20Beta.user.js
// @updateURL https://update.greasyfork.org/scripts/423281/EzMug%20Beta.meta.js
// ==/UserScript==

//EzMug toggle container - Start

var toggleContainer = document.createElement ('div');
toggleContainer.innerHTML = '<label for="toggle">Toggle EzMug: </label><input type="checkbox" id="toggle" checked>';
toggleContainer.setAttribute ('id', 'toggleContainer');

document.body.appendChild (toggleContainer);

GM.addStyle ( `
    #toggleContainer {
        position:               absolute;
        top:                    0;
        left:                   0;
        font-size:              15px;
        background:             transparent;
        border:                 1px outset white;
        margin:                 5px;
        opacity:                0.9;
        z-index:                1100;
        padding:                5px 15px;
        color:                  white;
    }`
            );

//EzMug toggle container - End


//Weapon toggle radio container - Start

var weaponContainer = document.createElement ('div');

weaponContainer.innerHTML = '<input type="radio" id="togglePrimary" name="weaponToggle" value="togglePrimary" checked> <label for="togglePrimary">Primary</label><br><input type="radio" id="toggleSecondary" name="weaponToggle" value="toggleSecondary"> <label for="toggleSecondary">Secondary</label><br><input type="radio" id="toggleMelee" name="weaponToggle" value="toggleMelee"> <label for="toggleMelee">Melee</label>';
weaponContainer.setAttribute ('id', 'weaponContainer');

document.body.appendChild (weaponContainer);

GM.addStyle ( `
    #weaponContainer {
        position:               absolute;
        top:                    80px;
        left:                   0px;
        font-size:              15px;
        background:             transparent;
        border:                 1px outset white;
        margin:                 5px;
        opacity:                0.9;
        z-index:                1100;
        padding:                5px 15px;
        color:                  white;
    }`
            );

//Weapon toggle radio container - End


//Set and Get Toggle Checkbox Values - Start

var checkboxValues = JSON.parse(localStorage.getItem('checkboxValues')) || {},
    $checkboxes = $("#toggleContainer :checkbox");

$checkboxes.on("change", function(){
    $checkboxes.each(function(){
        checkboxValues[this.id] = this.checked;
    });

    localStorage.setItem("checkboxValues", JSON.stringify(checkboxValues));
});
$.each(checkboxValues, function(key, value) {
    $("#" + key).prop('checked', value);
});

//Set and Get Toggle Checkbox Values - End

//Set and Get Weapon Values - Start

var radioValues = JSON.parse(localStorage.getItem('radioValues')) || {},
    $radioboxes = $("#weaponContainer :radio");

$radioboxes.on("change", function(){
    $radioboxes.each(function(){
        radioValues[this.id] = this.checked;
    });

    localStorage.setItem("radioValues", JSON.stringify(radioValues));
});

$.each(radioValues, function(key, value) {
    $("#" + key).prop('checked', value);
});

//Set and Get Weapon Values - End


function weaponToggle() {
    var selectedVal = "";
    var selected = $("input[type='radio'][name='weaponToggle']:checked");
    selectedVal = selected.val();

    if (checkboxValues.toggle == false) {
        console.log("ezMug is disabled")
        GM.addStyle ( `.btn___1sDeX.torn-btn.btn___3Upzo{position: static; left: 0px; bottom: 0px; z-index: -1;}`);

    } else if (selectedVal == "togglePrimary" && checkboxValues.toggle == true) {
        console.log("Primary selected & ezMug is enabled")
        GM.addStyle ( `.btn___1sDeX.torn-btn.btn___3Upzo{position: absolute; left: -150px; bottom: 385px; z-index: 5;}`);

    } else if (selectedVal == "toggleSecondary" && checkboxValues.toggle == true) {
        console.log("Secondary selected & ezMug is enabled")
        GM.addStyle ( `.btn___1sDeX.torn-btn.btn___3Upzo{position: absolute; left: -150px; bottom: 290px; z-index: 5;}`);

    } else if(selectedVal == "toggleMelee" && checkboxValues.toggle == true) {
        console.log("Melee selected & ezMug is enabled")
        GM.addStyle ( `.btn___1sDeX.torn-btn.btn___3Upzo{position: absolute; left: -150px; bottom: 195px; z-index: 5;}}`);
    }
}

function ezMugToggle() {
    if (checkboxValues.toggle == true) {
        GM.addStyle ( `#weaponContainer{display: inline;}`);
        GM.addStyle ( `.colored___2Post{background:rgba(0,0,0,0.0)!important;}`);
        console.log("ezMugEnabled" +  checkboxValues.toggle);

    } else {

        GM.addStyle ( `#weaponContainer{display: none;}`);
        GM.addStyle ( `.colored___2Post{background: linear-gradient( 180deg ,hsla(0,0%,100%,.65),rgba(215,230,172,.5))!important;}`);
        console.log("ezMugDisabled" + checkboxValues.toggle);
    }
}


$("#toggle").on("change", function(e) {
    weaponToggle();
    ezMugToggle();
})

$('input[type=radio][name=weaponToggle]').change(function() {
    weaponToggle();
    ezMugToggle();
})

ezMugToggle();
weaponToggle();

