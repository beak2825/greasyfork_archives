// ==UserScript==
// @name        HF currencyConverter()
// @namespace   HF
// @description Add a currency converter to HF.
// @include     http://www.hackforums.net/*
// @require     http://ajax.googleapis.com/ajax/libs/jquery/1.8.2/jquery.min.js
// @version     1.01
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_deleteValue
// @grant       GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/11049/HF%20currencyConverter%28%29.user.js
// @updateURL https://update.greasyfork.org/scripts/11049/HF%20currencyConverter%28%29.meta.js
// ==/UserScript==

$('#header > .menu > ul').append('<li id="menu_rates"><a class="navButton" href="#" onClick="startConvert()">Currency Converter</a></li>');
$("body").append("<div id='popup_rates' style='background-color: #333333; bottom: auto; border: 1px solid rgb(0, 0, 0); height: 30%; left: 182px; margin: 0px; max-height: 95%; max-width: 95%; opacity: 1; overflow: auto; padding: 0px; position: fixed; right: auto; top: 128px; width: 75%; z-index: 999; display: none;'><h4>USD : </h4><input type='text' placeholder='Loading...' oninput='convert_to_omc_btc()' id='usd'></input><br /><h4>OMC : </h4><input placeholder='Loading...' type='text' oninput='convert_to_usd_btc()' id='omc'></input><br /><h4>BTC : </h4><input placeholder='Loading...' type='text' oninput='convert_to_omc_usd()' id='btc'></input><br /><br /><button class='bitButton' onclick='addToPost()'>Add values to my post</button> <button class='bitButton' onclick='closePopup()'>Close</button></div>")

function startConvert() {
	var omc, btc;
	GM_xmlhttpRequest({
        method: "GET",
        url: "http://hashg.xyz/OMC-Rates/api.php?ref=hguscript",
        onload: function(response) {
			var responseText = response.responseText;
			var splittedResponse = responseText.split(":");
			btcAPI = splittedResponse[0];
			omcAPI = splittedResponse[1];
			$("#btc, #omc, #usd").attr('placeholder', '');
       }
    });
	var left = $("#menu_rates").position().left;
	var top = $("#menu_rates").position().top;
	$("#popup_rates").css('display', 'block');
	
	function convert_to_usd_btc() {
		var omc = document.getElementById("omc").value;
		var usd = omc * omcAPI;
		var btc = usd / btcAPI;
		document.getElementById("usd").value = usd;
		document.getElementById("btc").value = btc;  
	}
	exportFunction(convert_to_usd_btc, unsafeWindow, {defineAs: "convert_to_usd_btc"});

	function convert_to_omc_btc() {
		var usd = document.getElementById("usd").value;
		var omc = usd / omcAPI;
		var btc = usd / btcAPI;
		document.getElementById("omc").value = omc;
		document.getElementById("btc").value = btc;  
	}
	exportFunction(convert_to_omc_btc, unsafeWindow, {defineAs: "convert_to_omc_btc"});
		  
	function convert_to_omc_usd() {
		var btc = document.getElementById("btc").value;
		var usd = btc * btcAPI;
		var omc = usd / omcAPI;
		document.getElementById("usd").value = usd;
		document.getElementById("omc").value = omc;
	}
	exportFunction(convert_to_omc_usd, unsafeWindow, {defineAs: "convert_to_omc_usd"});

	function closePopup() {
		$("#popup_rates").css('display', 'none');
	}
	exportFunction(closePopup, unsafeWindow, {defineAs: "closePopup"});
	
	function addToPost() {
		var prevMessage = $("#message").val();
		$("#message").val(prevMessage + "\nUSD : $" + document.getElementById("usd").value + "\nOMC : " + document.getElementById("omc").value + "\nBTC : " + document.getElementById("btc").value);
	}
	exportFunction(addToPost, unsafeWindow, {defineAs: "addToPost"});

}
exportFunction(startConvert, unsafeWindow, {defineAs: "startConvert"});