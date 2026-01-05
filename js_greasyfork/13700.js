// ==UserScript==
// @name        Redwall
// @namespace   Redwall 
// @include     *supremenewyork.com*
// @require     http://ajax.googleapis.com/ajax/libs/jquery/1.8.2/jquery.min.js
// @version     2.4
// @grant       GM_setValue
// @grant       GM_getValue
// @description Redwall userscript
// @downloadURL https://update.greasyfork.org/scripts/13700/Redwall.user.js
// @updateURL https://update.greasyfork.org/scripts/13700/Redwall.meta.js
// ==/UserScript==

if (location.href.match(/shop/i)) {

	$("head").append("<style>#settingsBox input { width: 500px; margin-bottom: 6px; } #settingsBox { position: absolute; left: 40%; top: 20%; border: 1px solid black; background-color: #fff; text-align: center; }</style>");
	$("body").append("<div id='settingsBox' style='display:none;'><input style='margin-top: 15px;' id='name' placeholder='name' value='"+GM_getValue("name", "Type your name here")+"'><br><input id='mail' placeholder='email' value='"+GM_getValue("mail", "Type your mail here")+"'><br><input id='phone' placeholder='phone' value='"+GM_getValue("phone", "Type your phone number here")+"'><br><input id='add1' placeholder='address 1' value='"+GM_getValue("address1", "Type the first sentence of your address here")+"'><br><input id='add2' placeholder='address 2' value='"+GM_getValue("address2", "Type the first sentence of your address here")+"'><br><input id='add3' placeholder='address 3' value='"+GM_getValue("address3", "Type the first sentence of your address here")+"'><br>Type of card : <select id='cardtype' style='width: 300px;'><option value='visa'>Visa<option value='american_express'>American Express<option value='master'>Mastercard</select><br><input id='city' placeholder='city' value='"+GM_getValue("city", "Type your city here")+"'><br><input id='zip' placeholder='zip' value='"+GM_getValue("zip", "Type your ZIP here")+"'><br><input id='state' placeholder='state' value='"+GM_getValue("state", "Type your state here")+"'><br><input id='nb' placeholder='cc number' value='"+GM_getValue("nb", "Type your CC number here")+"'><br><input id='expm' placeholder='expiration month' value='"+GM_getValue("expm", "05")+"'><br><input id='expy' placeholder='expiration year' value='"+GM_getValue("expy", "2015")+"'><br><input id='cvv' placeholder='CVV' value='"+GM_getValue("cvv", "Type your CVV here")+"'><br>Autopay : <input id='autopay' type='checkbox'><br><button id='savesettings' style='margin-bottom: 15px;'>Save</button></div>");
	
	if (GM_getValue("autopay", false) === true) {
		$("#autopay").attr("checked", "checked");
	}
	
	$("#cardtype").val(GM_getValue("cardtype", "master"));
	
	$(".logo > a:nth-child(1)").after('<span id="settingsUsc">Change your credentials</span>');
	$("#settingsUsc").on("click", function() {
		$("#settingsBox").attr("style", "display: default;");
	});

	$("#savesettings").on("click", function() {
		GM_setValue("name", $("#name").val());
		GM_setValue("mail", $("#mail").val());
		GM_setValue("phone", $("#phone").val());
		GM_setValue("address1", $("#add1").val());
		GM_setValue("address2", $("#add2").val());
		GM_setValue("address3", $("#add3").val());
		GM_setValue("cardtype", $("#cardtype").val());
		GM_setValue("city", $("#city").val());
		GM_setValue("zip", $("#zip").val());
		GM_setValue("state", $("#state").val());
		GM_setValue("nb", $("#nb").val());
		GM_setValue("expm", $("#expm").val());
		GM_setValue("expy", $("#expy").val());
		GM_setValue("cvv", $("#cvv").val());
		if ($("#autopay").attr("checked")) {
			GM_setValue("autopay", true);
		} else {
			GM_setValue("autopay", false);			
		}
		$("#settingsBox").attr("style", "display: none;");
	});

} else {
	
	var name = GM_getValue("name", "Type your name here"),
		mail = GM_getValue("mail", "Type your mail here"),
		phone = GM_getValue("phone", "Type your phone number here"),
		address1 = GM_getValue("address1", "Type the first sentence of your address here"),
		address2 = GM_getValue("address2", "Type the first sentence of your address here"),
		address3 = GM_getValue("address3", "Type the first sentence of your address here"),
		cardtype = GM_getValue("cardtype", "master"), 
		city = GM_getValue("city", "Type your city here"),
		zip = GM_getValue("zip", "Type your ZIP here"),
		state = GM_getValue("state", "Type your state here"),
		nb = GM_getValue("nb", "Type your CC number here"),
		expm = GM_getValue("expm", "05"), 
		expy = GM_getValue("expy", "2015"),
		cvv = GM_getValue("cvv", "Type your CVV here"),
		autopay = GM_getValue("autopay", false);

    $(document).ready(function() {
	$("#order_billing_name").val(name);
	$("#order_email").val(mail);
	$("#order_tel").val(phone);
	$("#bo").val(address1);
	$("#oba3").val(address2);
	$("#order_billing_address_3").val(address3);
	$("#credit_card_type").val(cardtype);
	$("#order_billing_city").val(city);
	$("#order_billing_zip").val(zip);
	$("#order_billing_state").val(state);
	$("#cnb").val(nb);
	$("#credit_card_month").val(expm);
	$("#credit_card_year").val(expy);
	$("#vval").val(cvv);
	$("#order_terms").attr("checked", "checked");
    document.querySelectorAll("ins")[1].click();
    console.log("fired");
    $(".icheckbox_minimal").toggleClass("checked");
	if (autopay) { $("input.button").click(); }
    });
}