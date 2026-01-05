// ==UserScript==
// @name                HF Module Loader
// @author              Hash G.
// @namespace           HF
// @description         Add tons of modules (aka userscripts) to hackforums.net
// @include             *hackforums.net*
// @require             http://ajax.googleapis.com/ajax/libs/jquery/1.8.2/jquery.min.js
// @version             0.1
// @grant               GM_getValue
// @grant               GM_setValue
// @grant               GM_deleteValue
// @grant               GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/13251/HF%20Module%20Loader.user.js
// @updateURL https://update.greasyfork.org/scripts/13251/HF%20Module%20Loader.meta.js
// ==/UserScript==

// ==TODO==
// -> Hide HF banner + text script
// -> Fast Preview
// -> Smiley in quick reply 
// -> Add USCI in USC NP
// -> Separate evey postbit button to be enabled
// -> Release this shit to stop spamming the web section

var customText = [];
var customTextTitle = [];
var sendFor = [];
var modulesEnabled = [];
var signature = GM_getValue('autoSignature', '');
for (i=1; i<6; i++) {
    customText[i] = GM_getValue('customText['+i+']', '');
    sendFor[i] = GM_getValue('sendFor['+i+']', false);
    customTextTitle[i] = GM_getValue('customTextTitle['+i+']', 'Title ' + i);
}
for (i=0; i<6; i++) {
    modulesEnabled[i] = GM_getValue('modulesEnabled['+i+']', true);
}

// Add buttons in the header
$('#header > .menu > ul').append('<li><a class="navButton" href="hfmlsettings.php">HFML Settings</a></li>');

// Currency converter button & window
if (modulesEnabled[2]) {
	$('#header > .menu > ul').append('<li id="menu_rates"><a class="navButton" href="#" onClick="startConvert()">Currency Converter</a></li>');
	$("body").append("<div id='popup_rates' style='background-color: #333333; bottom: auto; border: 1px solid rgb(0, 0, 0); height: 30%; left: 182px; margin: 0px; max-height: 95%; max-width: 95%; opacity: 1; overflow: auto; padding: 0px; position: fixed; right: auto; top: 128px; width: 75%; z-index: 999; display: none;'><h4>USD : </h4><input type='text' placeholder='Loading...' oninput='convert_to_omc_btc()' id='usd'></input><br /><h4>OMC : </h4><input placeholder='Loading...' type='text' oninput='convert_to_usd_btc()' id='omc'></input><br /><h4>BTC : </h4><input placeholder='Loading...' type='text' oninput='convert_to_omc_usd()' id='btc'></input><br /><br /><button class='bitButton' onclick='addToPost()'>Add values to my post</button> <button class='bitButton' onclick='closePopup()'>Close</button></div>")
}


function saveModulesSettings() {
	if ($("#checkTrustscanEnable").is(':checked')) { GM_setValue('modulesEnabled[0]', true); } else { GM_setValue('modulesEnabled[0]', false); }
	if ($("#checkReplacerEnable").is(':checked')) { GM_setValue('modulesEnabled[1]', true); } else { GM_setValue('modulesEnabled[1]', false); }
	if ($("#checkCCEnable").is(':checked')) { GM_setValue('modulesEnabled[2]', true); } else { GM_setValue('modulesEnabled[2]', false); }
	if ($("#checkSelectCodeEnable").is(':checked')) { GM_setValue('modulesEnabled[3]', true); } else { GM_setValue('modulesEnabled[3]', false); }
	if ($("#checkAutoSigEnable").is(':checked')) { GM_setValue('modulesEnabled[4]', true); } else { GM_setValue('modulesEnabled[4]', false); }
	if ($("#checkDDEnable").is(':checked')) { GM_setValue('modulesEnabled[5]', true); } else { GM_setValue('modulesEnabled[5]', false); }
	$("#saveModulesSettings").html("Changes saved successfully. To save again, you can click here.");
} exportFunction(saveModulesSettings, unsafeWindow, {defineAs: "saveModulesSettings"});


// Trustscan button
function showTrustscanButton() {
	$("table[id^='post_']").each(function(i) {
		var uid = $(this).find('a[title="Find all posts by this user"]').attr("href").substr(31);
		$(this).find(".author_buttons.float_left").append(' <a href="http://www.hackforums.net/trustscan.php?uid='+uid+'" title="Trust Scan of this user" class="bitButton" target="_blank" rel="nofollow">Trust Scan</a> ')
	});
} exportFunction(showTrustscanButton, unsafeWindow, {defineAs: "showTrustscanButton"});


// Rate functions
function showRateButton() {
	var pos_rep_button = [];
	$("body").append("<div id='popups_reputation'></div>");
	
	$("table[id^='post_']").each(function(i) {
		var uid = $(this).find('a[title="Find all posts by this user"]').attr("href").substr(31);
		$(this).find(".author_buttons.float_left").append(' <span class="bitButton"><a href="javascript:MyBB.reputation('+uid+');" title="Rate this user" rel="nofollow">Rate </a><span class="reputation_positive rate_button_hgusc" data-rate-i = '+i+'>v</span></span> ')
		pos_rep_button[i] = $(this).find(".rate_button_hgusc").position();
		$("#popups_reputation").append('<div id="popup_rep_'+i+'" class="popup_menu" style="display: none; position: absolute; z-index: 100; top: '+ parseInt(pos_rep_button[i].top) +'px; left: '+ parseInt(pos_rep_button[i].left) +'px; visibility: visible;"><div class="popup_item_container"><span onclick="quickRep(\'positive\', '+uid+')" class="popup_item" style="color: #27E900 !important; font-weight: bold;">Positive</span></div><div class="popup_item_container"><span onclick="quickRep(\'negative\', '+uid+')" class="popup_item" style="color: #CC3333 !important; font-weight: bold;">Negative</span></div></div>');
	});

	$(".rate_button_hgusc").on("click", function() {
		var i = $(this).attr("data-rate-i");
		$("#popup_rep_"+i).css("display", "initial");
	});	
} exportFunction(showRateButton, unsafeWindow, {defineAs: "showRateButton"});

function quickRep(type, uid) {
	if (type == "positive") {
		console.log("Positive");
		
		// GM_xmlhttpRequest({
			// method: "POST",
			// url: "http://hackforums.net/reputation.php",
			// data: "&my_post_key=61e6b2b0116978b80dfe15a0510bfc48&action=do_add&uid=1279471&reputation=3&comments=Very%20HQ%20member",
			// onload: function(response) {
				// alert(response.responseText);
			// }
		// });
		
		
	} else if (type == "negative") {
		
	}

} exportFunction(quickRep, unsafeWindow, {defineAs: "quickRep"});


// DD button
function showDealDisputeButton() {
	$("table[id^='post_']").each(function(i) {
		var uid = $(this).find('a[title="Find all posts by this user"]').attr("href").substr(31);
		$(this).find(".author_buttons.float_left").append(' <a href="http://www.hackforums.net/disputedb.php?useruid='+uid+'&ref=hguscript" title="Deal Disputes of this user" class="bitButton" target="_blank" rel="nofollow">Deal Disputes</a>')
	});
} exportFunction(showDealDisputeButton, unsafeWindow, {defineAs: "showDealDisputeButton"});


// Auto Sig functions 
function saveAutoSigSettings() {
	GM_setValue('autoSignature', document.getElementById('signature').value);
	$("#submitAutoSig").html("Changes saved successfully. To save again, you can click here.");
} exportFunction(saveAutoSigSettings, unsafeWindow, {defineAs: "saveAutoSigSettings"});
function autoSignature() {
	$('#quick_reply_submit').on("click", function () {
		prevMessage = document.getElementById("message").value;
		document.getElementById("message").value = prevMessage + '\n\n' + signature;
	});
} exportFunction(autoSignature, unsafeWindow, {defineAs: "autoSignature"});


// Insert Text functions
function saveSettings() {
	for (i=1;i<6;i++) {
		if (document.getElementById('customText'+i).value.length >= 25 || document.getElementById('customText' + i).value.length === 0) { 
			GM_setValue('customText['+i+']', document.getElementById('customText'+i).value);
			GM_setValue('customTextTitle['+i+']',    document.getElementById('customTextTitle'+i).value);
			if (document.getElementById('checkSendAuto' + i).checked) {
				GM_setValue('sendFor['+i+']', true);
			} else {
				GM_setValue('sendFor['+i+']', false);
			}
		document.getElementById('submitReplacer').innerHTML = "Changes saved successfully. To save again, you can click here.";
		} else { alert('You don\'t have more than 25 characters in the field #'+i+'. Please correct and submit again.'); }
    }
} exportFunction(saveSettings, unsafeWindow, {defineAs: "saveSettings"});
function insertText(i) {
	var prevMessage = document.getElementById("message").value;
	document.getElementById('message').value = prevMessage + customText[i];
	    if (sendFor[i]) { document.getElementById('quick_reply_submit').click() }
} exportFunction(insertText, unsafeWindow, {defineAs: "insertText"});
function addInsertTextButtons() {
	var buttonsHTML = "<div style='padding-top: 10px;'>";
    if (customTextTitle[1] !== "") { buttonsHTML += "<a title='Custom Text #1' onClick='insertText(1)' class='button'>"+customTextTitle[1]+"</a> "; }
    if (customTextTitle[2] !== "") { buttonsHTML += "<a title='Custom Text #2' onClick='insertText(2)' class='button'>"+customTextTitle[2]+"</a> "; }
    if (customTextTitle[3] !== "") { buttonsHTML += "<a title='Custom Text #3' onClick='insertText(3)' class='button'>"+customTextTitle[3]+"</a> "; }
    if (customTextTitle[4] !== "") { buttonsHTML += "<a title='Custom Text #4' onClick='insertText(4)' class='button'>"+customTextTitle[4]+"</a> "; }
    if (customTextTitle[5] !== "") { buttonsHTML += "<a title='Custom Text #5' onClick='insertText(5)' class='button'>"+customTextTitle[5]+"</a> "; }
    buttonsHTML += "</div>";
    $('input.button:nth-child(2)').after(buttonsHTML);
} exportFunction(addInsertTextButtons, unsafeWindow, {defineAs: "addInsertTextButtons"});


// Select code functions 
function addSelectCodeButton() {
	if ($('code').length > 0) {
		$('code').each(function(i) { 
			$(this).attr('id', 'codeBlock'+(i+1));
			$(this).after('<a class="button" onClick="selectCode('+(i+1)+')">Select code</a>');
		});
	}
} exportFunction(addSelectCodeButton, unsafeWindow, {defineAs: "addSelectCodeButton"});
function selectCode(number) {
    var text = document.getElementById("codeBlock" + number), range, selection;    
    if (document.body.createTextRange) {
        range = document.body.createTextRange();
        range.moveToElementText(text);
        range.select();
		GM_setClipboard(text);
    } else if (window.getSelection) {
        selection = window.getSelection();        
        range = document.createRange();
        range.selectNodeContents(text);
        selection.removeAllRanges();
        selection.addRange(range);
		GM_setClipboard(text);
    }
} exportFunction(selectCode, unsafeWindow, {defineAs: "selectCode"});


// Currency Converter functions
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
	function convert_to_omc_btc() {
		var usd = document.getElementById("usd").value;
		var omc = usd / omcAPI;
		var btc = usd / btcAPI;
		document.getElementById("omc").value = omc;
		document.getElementById("btc").value = btc;  
	} 
	function convert_to_omc_usd() {
		var btc = document.getElementById("btc").value;
		var usd = btc * btcAPI;
		var omc = usd / omcAPI;
		document.getElementById("usd").value = usd;
		document.getElementById("omc").value = omc;
	}
	function closePopup() {
		$("#popup_rates").css('display', 'none');
	}
	function addToPost() {
		var prevMessage = $("#message").val();
		$("#message").val(prevMessage + "\nUSD : $" + document.getElementById("usd").value + "\nOMC : " + document.getElementById("omc").value + "\nBTC : " + document.getElementById("btc").value);
	}
	exportFunction(convert_to_usd_btc, unsafeWindow, {defineAs: "convert_to_usd_btc"});
	exportFunction(convert_to_omc_usd, unsafeWindow, {defineAs: "convert_to_omc_usd"});
	exportFunction(convert_to_omc_btc, unsafeWindow, {defineAs: "convert_to_omc_btc"});
	exportFunction(closePopup, unsafeWindow, {defineAs: "closePopup"});
	exportFunction(addToPost, unsafeWindow, {defineAs: "addToPost"});
} exportFunction(startConvert, unsafeWindow, {defineAs: "startConvert"});



if (document.URL.indexOf("hfmlsettings.php") >= 0) {
	
	// Base template
	$('body').empty();
	$('head').append('<title>Hack Forums</title><meta http-equiv="Content-Type" content="text/html; charset=UTF-8"><meta http-equiv="Content-Script-Type" content="text/javascript"><script type="text/javascript" src="/jscripts/prototype.js?ver=1603"></script><script type="text/javascript" src="/jscripts/general.js?ver=1603"></script><script type="text/javascript" src="/jscripts/popup_menu.js?ver=1600"></script><link type="text/css" rel="stylesheet" href="/cache/themes/theme5/global.css">');
	$('title').html('HF Modules loader settings - Made by Hash G.');
	$("body").append('<div id="container"><hr class="hidden"><div id="content"><br><div class="navigation"><a href="http://www.hackforums.net/index.php">Hack Forums / </a><span class="active">HFML Settings</span></div><br><div class="quick_keys"> <table border="0" cellspacing="1" cellpadding="4" class="tborder"><tbody><tr><td colspan="7" class="thead" align="center"><strong>Thanks you for installing my script!</strong></td></tr></tbody></table><br />');

	
	// Enable/disable modules + check the checkbox if enabled
	$('#content').append("<table class='tborder' cellspacing='1' cellpadding='4' border='0'><tbody><tr><td class='thead' colspan='2'><strong align='center'> Enable or disable modules <button class='button' id='saveModulesSettings' onclick='saveModulesSettings()'>Save</button></strong></td></tr><tr><td class='trow1' width='5%' align='center'><input id='checkTrustscanEnable' type='checkbox'></td><td class='trow1' width='35%'><label for='checkTrustscanEnable'>Trustscan button</label></td><td class='trow1'> This will add a trustscan button on each user's post. Note that trustscan is Ub3r only. <a target='_blank' href='http://i.imgur.com/6KWpppu.png'>Preview</a>.</td></tr><tr><td class='trow1' width='5%' align='center'><input id='checkDDEnable' type='checkbox'></td><td class='trow1' width='35%'><label for='checkDDEnable'>Deal Dispute button</td><td class='trow1'> This will add a deal disputes button on each user's post. <a target='_blank' href='http://i.imgur.com/6KWpppu.png'>Preview</a>.</td></tr></tr><tr><td class='trow1' width='5%' align='center'><input id='checkReplacerEnable' type='checkbox'></td><td class='trow1' width='35%'><label for='checkReplacerEnable'>Replacer</label></input></td><td class='trow1'> This will allow you to insert quickly a text in your post and even send it automatically. </td></tr><tr><td class='trow1' width='5%' align='center'><input id='checkCCEnable' type='checkbox'></td><td class='trow1' width='35%'><label for='checkCCEnable'>Currency converter</label></td><td class='trow1'> This will add a currency converter button at the menu of every page. It allows the following conversion : BTC<->OMC<->USD. This is currently broken.</td></tr><tr><td class='trow1' width='5%' align='center'><input id='checkSelectCodeEnable' type='checkbox'></td><td class='trow1' width='35%'><label for='checkSelectCodeEnable'>Select code</label></td><td class='trow1'> This will add a button after each [code] tag to select it. Then you'll just have to Ctrl+V to copy it. <a href='http://i.imgur.com/35mPqWS.png' target='_blank'>Preview</a>.</td></tr><tr><td class='trow1' width='5%' align='center'><input id='checkAutoSigEnable' type='checkbox'></td><td class='trow1' width='35%'><label for='checkAutoSigEnable'>Auto Signature</label></td><td class='trow1'> With this your signature will be automatically inserted when you click on \"Post reply\". </td></tr></tr></label></input></tbody></table><br />");
	if (modulesEnabled[0] == true) { $("#checkTrustscanEnable").attr('checked', 'checked'); }
	if (modulesEnabled[1] == true) { $("#checkReplacerEnable").attr('checked', 'checked'); }
	if (modulesEnabled[2] == true) { $("#checkCCEnable").attr('checked', 'checked'); }
	if (modulesEnabled[3] == true) { $("#checkSelectCodeEnable").attr('checked', 'checked'); }
	if (modulesEnabled[4] == true) { $("#checkAutoSigEnable").attr('checked', 'checked'); }
	if (modulesEnabled[5] == true) { $("#checkDDEnable").attr('checked', 'checked'); }
	
	
	// Insert Text settings
	$('#content').append("<br /><table class='tborder' cellspacing='1' cellpadding='4' border='0'><tbody><tr><td class='thead' colspan='2'><strong> HF Replacer : Settings <button class='button' onclick='saveSettings()'><span id='submitReplacer'>Save</span></button></strong></td></tr> <tr><td class='trow1'>Title 1 : <input type='text' id='customTextTitle1' value='"+customTextTitle[1]+"'></input></td><td class='trow1'> Text 1: <textarea style='height:25px;' cols='30' id='customText1'>"+customText[1]+"</textarea></td><td class='trow1'><input id='checkSendAuto1' type='checkbox'><label for='checkSendAuto1'>Send automatically the message ?</label></input></td></tr> <tr><td class='trow1'>Title 2 : <input type='text' id='customTextTitle2' value='"+customTextTitle[2]+"'></input></td><td class='trow1'> Text 2: <textarea style='height:25px;' cols='30' id='customText2'>"+customText[2]+"</textarea></td><td class='trow1'> <input id='checkSendAuto2' type='checkbox'><label for='checkSendAuto2'>Send automatically the message ?</label></input></td></tr>  <tr><td class='trow1'>Title 3 : <input type='text' id='customTextTitle3' value='"+customTextTitle[3]+"'></input></td><td class='trow1'> Text 3: <textarea style='height:25px;' cols='30' id='customText3'>"+customText[3]+"</textarea></td><td class='trow1'> <input id='checkSendAuto3' type='checkbox'><label for='checkSendAuto3'>Send automatically the message ?</label></input></td></tr>   <tr><td class='trow1'>Title 4 : <input type='text' id='customTextTitle4' value='"+customTextTitle[4]+"'></input></td><td class='trow1'> Text 4: <textarea style='height:25px;' cols='30' id='customText4'>"+customText[4]+"</textarea></td><td class='trow1'> <input id='checkSendAuto4' type='checkbox'><label for='checkSendAuto4'>Send automatically the message ?</label></input></td></tr>   <tr><td class='trow1'>Title 5 : <input type='text' id='customTextTitle5' value='"+customTextTitle[5]+"'></input></td><td class='trow1'> Text 5: <textarea style='height:25px;' cols='30' id='customText5'>"+customText[5]+"</textarea></td><td class='trow1'> <input id='checkSendAuto5' type='checkbox'><label for='checkSendAuto5'>Send automatically the message ?</label></input></td></tr></table><br />");
	for (i=1;i<6;i++) {
		if (sendFor[i]) { document.getElementById('checkSendAuto' + i).setAttribute('checked', 'checked'); }
	}
	
	// Auto sig settings
	$('#content').append("<table class='tborder' cellspacing='1' cellpadding='4' border='0'><tbody><tr><td class='thead' colspan='2'><strong> HF AutoSignature : Settings <button class='button' onclick='saveAutoSigSettings()'><span id='submitAutoSig'>Save</span></button></strong></td></tr><tr><td class='trow1'>Your signature : <input type='text' id='signature' value='"+signature+"'></input> </td></tr></table><br />");
	if (autoSigEnabled) { document.getElementById('checkEnable').setAttribute('checked', 'checked'); }
}

if (document.URL.indexOf("showthread.php") >= 0) {
	showRateButton();
	if (modulesEnabled[0]) { showTrustscanButton(); }
    if (modulesEnabled[1]) { addInsertTextButtons(); }
	if (modulesEnabled[3]) { addSelectCodeButton(); }
	if (modulesEnabled[4]) { autoSignature(); }
	if (modulesEnabled[5]) { showDealDisputeButton(); }
}

if (document.URL.indexOf("ref=hguscript") >= 0) {
	$('input.button:nth-child(2)').click();
}