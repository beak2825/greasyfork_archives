// ==UserScript==
// @name        HF AutoSignature
// @namespace   HF AutoSignature
// @description Insert automatically your signature when you click on "Post Reply"
// @include     http://www.hackforums.net/*
// @include     http://hackforums.net/*
// @require     http://ajax.googleapis.com/ajax/libs/jquery/1.8.2/jquery.min.js
// @version     1.1
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_deleteValue
// @downloadURL https://update.greasyfork.org/scripts/10622/HF%20AutoSignature.user.js
// @updateURL https://update.greasyfork.org/scripts/10622/HF%20AutoSignature.meta.js
// ==/UserScript==

var signature = GM_getValue('autoSignature', '');
var enabled = GM_getValue('autoSignatureEnabled', false);


function saveAutoSigSettings() {
	GM_setValue('autoSignature', document.getElementById('signature').value);
	if (document.getElementById('checkEnable').checked) { GM_setValue('autoSignatureEnabled', true); } else { GM_setValue('autoSignatureEnabled', false); }
	document.getElementById('submitAutoSig').innerHTML = "Changes saved successfully. To save again, you can click here.";
}
exportFunction(saveAutoSigSettings, unsafeWindow, {defineAs: "saveAutoSigSettings"});

if (document.URL.indexOf("showthread.php") >= 0) {
	$('#quick_reply_submit').on("click", function () {
		if (enabled) {
		  prevMessage = document.getElementById("message").value;
		  document.getElementById("message").value = prevMessage + '\n\n' + signature;
		}
	})
}

if (document.URL.indexOf("usercp.php") >= 0) {
  var settingsAutoSigHTML = "<table class='tborder' cellspacing='1' cellpadding='4' border='0'><tbody><tr><td class='thead' colspan='2'><strong> HF AutoSignature : Settings <button class='button' onclick='saveAutoSigSettings()'><span id='submitAutoSig'>Save</span></button></strong></td></tr><tr><td class='trow1'>Your signature : <input type='text' id='signature' value='"+signature+"'></input> <input id='checkEnable' type='checkbox'><label for='checkEnable'>Enable the Auto Signature ?</label></input> </td></tr></table><br />";
  $('.quick_keys > table:nth-child(1) > tbody:nth-child(1) > tr:nth-child(1) > td:nth-child(2) > br:nth-child(2)').after(settingsAutoSigHTML);
  if (enabled) { document.getElementById('checkEnable').setAttribute('checked', 'checked'); }
 }