// ==UserScript==
// @name         [Ned] CSA Quick Link
// @namespace    localhost
// @version      2.1
// @description  CSA Quick Link
// @author       Ned (Ned@Autoloop.com)
// @include      *csa.autoloop.us/Customer/Edit/*
// @grant        none
// @icon         
// @downloadURL https://update.greasyfork.org/scripts/16135/%5BNed%5D%20CSA%20Quick%20Link.user.js
// @updateURL https://update.greasyfork.org/scripts/16135/%5BNed%5D%20CSA%20Quick%20Link.meta.js
// ==/UserScript==

//Add Button
$('.nav-list-horizontal').append('<a class="btn" id="tsdCopy"> Quick Address Copy</a>');

$('#tsdCopy').click (function () {
	var name = $('#Customer_CompanyName').val();
	var street = $('#Customer_Address').val();
	var city = $('#Customer_City').val();
	var state = $('#Customer_TerritoryId option:selected').text();
	var zip = $('#Customer_Zip').val();

	//var id = $('input[id*="_LoopCompanyId"]').val()

	//location.hash = "#addCustomerEmployeeRow";
	prompt("Quick Address\n\nMade by: Ned (Ned@Autoloop.com)", street+', '+city+', '+state+', '+zip);
	//Removed Dealer name 8/27/15

	//Update Title Window
	document.title = name;
});
