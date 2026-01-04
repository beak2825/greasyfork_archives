// ==UserScript==
// @name         Staff Admin Tools
// @namespace    http://torn.com/
// @version      0.4
// @description  Making TC Admin Panel easier since 2021
// @author       Sterling [1616063]
// @match        https://www.torn.com/admin/*
// @require      https://code.jquery.com/jquery-2.2.3.min.js
// @require      https://greasyfork.org/scripts/423931-jquery-filtertable/code/jqueryfilterTable.js
// @grant        GM.addStyle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/423189/Staff%20Admin%20Tools.user.js
// @updateURL https://update.greasyfork.org/scripts/423189/Staff%20Admin%20Tools.meta.js
// ==/UserScript==

//Staff Admin Tools Toggle - START
var toggleContainer = document.createElement ('div');
toggleContainer.innerHTML = '<label for="toggle">Toggle Staff Admin Tools: </label><input type="checkbox" id="toggle" checked>';
toggleContainer.setAttribute ('id', 'toggleContainer');

document.body.appendChild (toggleContainer);

GM.addStyle ( `
    #toggleContainer {
        position:               absolute;
        top:                    0;
        left:                   0;
        background:             transparent;
        z-index:                1100;
        color:                  black;
       text-align:              center;
    }`
            );

//Staff Admin Tools Toggle - END

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


function staffAdminToolsToggle() {
    if (checkboxValues.toggle == true) {
        console.log("Staff Admin Tools Enabled" + checkboxValues.toggle);
        GM.addStyle('input{margin-bottom: 15; !important}');
        GM.addStyle('center {white-space: pre-line;}');

    } else {

        console.log("Staff Admin Tools Disabled" + checkboxValues.toggle);
        GM.addStyle('input{margin-bottom: 0; !important}');
        GM.addStyle('center {white-space: normal;}');
    }
}

$("#toggle").on("change", function(e) {
    staffAdminToolsToggle();
})

staffAdminToolsToggle()

//Chatlog Filter - Start

GM.addStyle ('.filter-table .quick { margin-left: 0.5em; font-size: 0.8em; text-decoration: none; }')
GM.addStyle ('.fitler-table .quick:hover { text-decoration: underline; }')
GM.addStyle ('td.alt { background-color: #ffc; background-color: rgba(255, 255, 0, 0.2); }')

$('table.chatlog').filterTable();

//Chatlog Filter - End