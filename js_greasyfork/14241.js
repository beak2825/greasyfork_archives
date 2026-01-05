// ==UserScript==
// @name        Redwall - BarneysNY
// @namespace   Redwall - BarneysNY
// @include     https://www.barneys.com*
// @require     http://ajax.googleapis.com/ajax/libs/jquery/1.8.2/jquery.min.js
// @version     1.02
// @grant       GM_setValue
// @grant       GM_getValue
// @description Redwall's script
// @downloadURL https://update.greasyfork.org/scripts/14241/Redwall%20-%20BarneysNY.user.js
// @updateURL https://update.greasyfork.org/scripts/14241/Redwall%20-%20BarneysNY.meta.js
// ==/UserScript==

$(".pull-left > ul:nth-child(1) > li:nth-child(4)").after("<li id='settings' style='color: #fff'>Settings</li>");
$("#wrapper").append("<div id='popup_news' style='color: #fff; background-color: rgb(51, 51, 51); bottom: auto; border: 1px solid rgb(0, 0, 0); height: 30%; left: 182px; margin: 0px; max-height: 95%; max-width: 95%; opacity: 1; overflow: auto; padding: 0px; position: fixed; right: auto; top: 128px; width: 75%; z-index: 999; display: none;'>" + 
					"<input placeholder='First name' id='fname' style='width: 70%' type='text'><br><input id='lname' style='width: 70%' type='text' placeholder='Last name'> "+
					"<input placeholder='Mail' id='mail' style='width: 70%' type='text'><br><input id='phone' style='width: 70%' type='text' placeholder='Phone'> "+
					"<input placeholder='Address 1' id='addr1' style='width: 70%' type='text'><br><input id='addr2' style='width: 70%' type='text' placeholder='Address 2'> "+
					"<input placeholder='City' id='city' style='width: 70%' type='text'><br><input id='zip' style='width: 70%' type='text' placeholder='ZIP'> "+
					"<input placeholder='State (e.g NY)' id='state' style='width: 70%' type='text'><br><input id='holder' style='width: 70%' type='text' placeholder='Card holder'> "+
					"<input placeholder='Card number' id='nb' style='width: 70%' type='text'><br><input id='expm' style='width: 70%' type='text' placeholder='Expiration month'> "+
					"<input placeholder='Expiration year' id='expy' style='width: 70%' type='text'><br><input id='cvv' style='width: 70%' type='text' placeholder='CVV'> "+
					"<br><button id='saveSettings'>Save!</button> <button class='bitButton' id='closePopup'>Close</button></div>");

$("#settings").on("click", function() {
	$("#popup_news").css("display", "block");
});

$("#closePopup").on("click", function() {
	$("#popup_news").css("display", "none");
});

$("#saveSettings").on("click", function() {
	GM_setValue("firstname", $("#fname").val());
	GM_setValue("lastname", $("#lname").val());
	GM_setValue("mail", $("#mail").val());
	GM_setValue("phone", $("#phone").val());
	GM_setValue("addr1", $("#addr1").val());
	GM_setValue("addr2", $("#addr2").val());
	GM_setValue("city", $("#city").val());
	GM_setValue("zip", $("#zip").val());
	GM_setValue("state", $("#state").val());
	GM_setValue("holder", $("#holder").val());
	GM_setValue("nb", $("#nb").val());
	GM_setValue("expm", $("#expm").val());
	GM_setValue("expy", $("#expy").val());
	GM_setValue("cvv", $("#cvv").val());
	$("#popup_news").css("display", "none");
});

var firstname = GM_getValue("firstname", ""),
	lastname = GM_getValue("lastname", ""),
	mail = GM_getValue("mail", ""),
	phone = GM_getValue("phone", ""),
	address1 = GM_getValue("addr1", ""),
	address2 = GM_getValue("addr2", ""),
	city = GM_getValue("city", ""),
	zip = GM_getValue("zip", ""),
	state = GM_getValue("state", ""),
	holder = GM_getValue("holder", ""),
	nb = GM_getValue("nb", ""),
	expm = parseInt(GM_getValue("expm", "")),
	expy = parseInt(GM_getValue("expy", "")),
	cvv = GM_getValue("cvv", ""),
	unsubscribe = true,
	step1 = GM_getValue("step1", false),
	step2 = GM_getValue("step2", false),
	step3 = GM_getValue("step3", false);
	
	
	console.log(step1 + "-" + step2 + "-" + firstname);


	$("button.cart-checkout:nth-child(3)").on("click", function() {
		GM_setValue("step1", true);
	});


	if (step1) {
		$("#dwfrm_singleshipping_shippingAddress_addressFields_firstName").val(firstname);
		$("#dwfrm_singleshipping_shippingAddress_addressFields_lastName").val(lastname);
		$("#dwfrm_singleshipping_shippingAddress_addressFields_phone").val(phone);
		$("#dwfrm_singleshipping_shippingAddress_addressFields_address1").val(address1);
		$("#dwfrm_singleshipping_shippingAddress_addressFields_address2").val(address2);
		$("#dwfrm_singleshipping_shippingAddress_addressFields_city").val(city);
		$("#dwfrm_singleshipping_shippingAddress_addressFields_zip").val(zip);
		$("#dwfrm_singleshipping_shippingAddress_addressFields_states_state").val(state);
		GM_setValue("step2", true);
		GM_setValue("step1", false);
		$("button.btn-block").click();

	}
	
	if (step2) {
		$("#dwfrm_billing_paymentMethods_creditCard_owner").val(holder);
		$("#dwfrm_billing_paymentMethods_creditCard_type").val("Visa");
		$("#dwfrm_billing_paymentMethods_creditCard_number").val(nb);
		$("#dwfrm_billing_paymentMethods_creditCard_month").val(expm);
		$("#dwfrm_billing_paymentMethods_creditCard_year").val(expy);
		$("#dwfrm_billing_paymentMethods_creditCard_cvn").val(cvv);
		$("#dwfrm_billing_billingAddress_useAsShippingAddress").attr("checked", true);
		$("#dwfrm_billing_billingAddress_addressFields_firstName").val(firstname);
		$("#dwfrm_billing_billingAddress_addressFields_lastName").val(lastname);
		$("#dwfrm_billing_billingAddress_addressFields_phone").val(phone);
		$("#dwfrm_billing_billingAddress_addressFields_address1").val(address1);
		$("#dwfrm_billing_billingAddress_addressFields_address2").val(address2);
		$("#dwfrm_billing_billingAddress_addressFields_city").val(city);
		$("#dwfrm_billing_billingAddress_addressFields_zip").val(zip);
		$("#dwfrm_billing_billingAddress_addressFields_states_state").val(state);
		$("#dwfrm_billing_billingAddress_email_emailAddress").val(mail);
		if (unsubscribe) { $("#dwfrm_billing_billingAddress_addToEmailList").attr("checked", false); }
		GM_setValue("step2", false);
		GM_setValue("step3", true);
		$(".continue-cta > button:nth-child(1)").click();
	}
	
	if (step3) {
		GM_setValue("step3", false);
		$("button.btn-block").click();
	}
	
