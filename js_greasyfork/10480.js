// ==UserScript==
// @name        HF insertText()
// @namespace   HF
// @description Quicly insert text into your post and send it automatically (or nah)
// @include     *hackforums.net/*
// @require     http://ajax.googleapis.com/ajax/libs/jquery/1.8.2/jquery.min.js
// @version     1.2.1
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_deleteValue
// @downloadURL https://update.greasyfork.org/scripts/10480/HF%20insertText%28%29.user.js
// @updateURL https://update.greasyfork.org/scripts/10480/HF%20insertText%28%29.meta.js
// ==/UserScript==

var customText = [];
var customTextTitle = [];
var sendFor = [];
for (i=1; i<6; i++) {
  customText[i] = GM_getValue('customText['+i+']', '');
  sendFor[i] = GM_getValue('sendFor['+i+']', 'false');
	customTextTitle[i] = GM_getValue('customTextTitle['+i+']', 'Title ' + i);
}


function saveSettings() {
  for (i=1;i<6;i++) {
	if (document.getElementById('customText'+i).value.length >= 25 || document.getElementById('customText' + i).value.length === 0) { 
	  GM_setValue('customText['+i+']', document.getElementById('customText'+i).value);
	  GM_setValue('customTextTitle['+i+']',  document.getElementById('customTextTitle'+i).value);
	  if (document.getElementById('checkSendAuto' + i).checked) {
	    GM_setValue('sendFor['+i+']', true);
	  } else {
	    GM_setValue('sendFor['+i+']', false);
	  }
	document.getElementById('submitReplacer').innerHTML = "Changes saved successfully. To save again, you can click here.";
    } else { alert('You don\'t have more than 25 characters in the field #'+i+'. Please correct and submit again.'); }
  }
}
exportFunction(saveSettings, unsafeWindow, {defineAs: "saveSettings"});

function insertText(i) {
  var prevMessage = document.getElementById("message").value;
  document.getElementById('message').value = prevMessage + customText[i];
  if (sendFor[i]) { document.getElementById('quick_reply_submit').click() }
}
exportFunction(insertText, unsafeWindow, {defineAs: "insertText"});

if (document.URL.indexOf("usercp.php") >= 0) {
  var settingsHTML = "<table class='tborder' cellspacing='1' cellpadding='4' border='0'><tbody><tr><td class='thead' colspan='2'><strong> HF Replacer : Settings <button class='button' onclick='saveSettings()'><span id='submitReplacer'>Save</span></button></strong></td></tr><tr><td class='trow1'>Title 1 : <input type='text' id='customTextTitle1' value='"+customTextTitle[1]+"'></input> Text 1: <textarea style='height:19px;' cols='30' id='customText1'>"+customText[1]+"</textarea> <input id='checkSendAuto1' type='checkbox'><label for='checkSendAuto1'>Send automatically the message ?</label></input> <br/>Title 2 : <input type='text' id='customTextTitle2' value='"+customTextTitle[2]+"'></input> Text 2: <textarea style='height:19px;' cols='30' id='customText2'>"+customText[2]+"</textarea> <input id='checkSendAuto2' type='checkbox'><label for='checkSendAuto2'>Send automatically the message ?</label></input> <br/>Title 3 : <input type='text' id='customTextTitle3' value='"+customTextTitle[3]+"'></input> Text 3: <textarea style='height:19px;' cols='30' id='customText3'>"+customText[3]+"</textarea> <input id='checkSendAuto3' type='checkbox'><label for='checkSendAuto3'>Send automatically the message ?</label></input> <br/>Title 4 : <input type='text' id='customTextTitle4' value='"+customTextTitle[4]+"'></input> Text 4: <textarea style='height:19px;' cols='30' id='customText4'>"+customText[4]+"</textarea> <input id='checkSendAuto4' type='checkbox'><label for='checkSendAuto4'>Send automatically the message ?</label></input> <br/>Title 5 : <input type='text' id='customTextTitle5' value='"+customTextTitle[5]+"'></input> Text 5: <textarea style='height:19px;' cols='30' id='customText5'>"+customText[5]+"</textarea> <input id='checkSendAuto5' type='checkbox'><label for='checkSendAuto5'>Send automatically the message ?</label></input></td></tr></table><br />";
  $('.quick_keys > table:nth-child(1) > tbody:nth-child(1) > tr:nth-child(1) > td:nth-child(2) > br:nth-child(2)').after(settingsHTML);
	for (i=1;i<6;i++) {
		if (sendFor[i]) { document.getElementById('checkSendAuto' + i).setAttribute('checked', 'checked'); }
	}
}

if (document.URL.indexOf("showthread.php") >= 0) {
  var buttonsHTML = "<div style='padding-top: 10px;'>";
  if (customTextTitle[1] !== "") { buttonsHTML += "<a title='Custom Text #1' onClick='insertText(1)' class='button'>"+customTextTitle[1]+"</a> "; }
  if (customTextTitle[2] !== "") { buttonsHTML += "<a title='Custom Text #2' onClick='insertText(2)' class='button'>"+customTextTitle[2]+"</a> "; }
  if (customTextTitle[3] !== "") { buttonsHTML += "<a title='Custom Text #3' onClick='insertText(3)' class='button'>"+customTextTitle[3]+"</a> "; }
  if (customTextTitle[4] !== "") { buttonsHTML += "<a title='Custom Text #4' onClick='insertText(4)' class='button'>"+customTextTitle[4]+"</a> "; }
  if (customTextTitle[5] !== "") { buttonsHTML += "<a title='Custom Text #5' onClick='insertText(5)' class='button'>"+customTextTitle[5]+"</a> "; }
  buttonsHTML += "</div>";
  $('input.button:nth-child(2)').after(buttonsHTML);
}