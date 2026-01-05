// ==UserScript==
// @name        GameFAQs Sig Box
// @author      Metallia
// @namespace   Cats
// @description Appearifies the sig box while avoiding a reset on your custom sig with edits.
// @include     http://www.gamefaqs.com/*
// @version     2.0
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/20040/GameFAQs%20Sig%20Box.user.js
// @updateURL https://update.greasyfork.org/scripts/20040/GameFAQs%20Sig%20Box.meta.js
// ==/UserScript==

// Feel free to edit, redistribute, all that good stuff.

function decodeHtml(html) { // http://stackoverflow.com/a/7394787
    var txt = document.createElement("textarea");
    txt.innerHTML = html;
    return txt.value;
}

var hiddenSigField = document.querySelector("input[name='custom_sig']");
if (hiddenSigField) {
	var newP = document.createElement("p");
	var newTextArea = document.createElement("textarea");
	hiddenSigField.parentNode.insertBefore(newP,hiddenSigField);
	hiddenSigField.parentNode.removeChild(hiddenSigField);
	newP.appendChild(newTextArea);
	
	newTextArea.setAttribute("name","custom_sig");
	newTextArea.setAttribute("maxlength","165");
	newTextArea.setAttribute("style","width: 100% !important; height: 46px !important;");
	
	var postPreview = document.evaluate('//table[@class="board message"]//td[@class="msg"]//div[@class="msg_body"]//div[@class="signature"]//div[@class="sig_text"]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
	if (postPreview) {
		var sig = postPreview.innerHTML;
		sig = sig.replace("<br>","\n");
		newTextArea.textContent = decodeHtml(sig);
	}
}

function myFightMoney(item,id,sig) { // Yes, this is stupid, but I couldn't find any better way to handle this without the loop overwriting information or the event listener throwing a fit.
	item.addEventListener("mouseleave", function () {profoundSadness(item,id,sig)}, false);
}

function profoundSadness(item,id,sig) {
	if ((item.getAttribute("onmousedown") === null) && (document.getElementById("sig_box_"+id) === null)) {
		var newSigBox = document.createElement('textarea');
		newSigBox.value = sig;
		newSigBox.id= "sig_box_"+id;
		newSigBox.style = "width: 100% !important; height: 46px !important;"; // May need to adjust the css depending on your own settings.
		newSigBox.maxlength = "165";
		item.parentNode.parentNode.parentNode.parentNode.childNodes[0].insertBefore(newSigBox,item.parentNode.parentNode.parentNode.parentNode.childNodes[0].childNodes[2]);
		
		// There might be more than one input[name=custom_sig] on the page if you open multiple edit fields, so I just set its value to the 'current' sig box repeatedly.
		document.querySelector("input[name='custom_sig']").value = sig;
		newSigBox.addEventListener("change", function () {document.querySelector("input[name='custom_sig']").value = this.value}, false);
		
		var saveButton = document.querySelector("input[name='"+id+"']");
		saveButton.addEventListener("focus", function () {document.querySelector("input[name='custom_sig']").value = newSigBox.value}, false);
		saveButton.addEventListener("mouseover", function () {document.querySelector("input[name='custom_sig']").value = newSigBox.value}, false);
	} else {
		return;
	}
}

var editButtons = document.evaluate('//span[@class="postaction"]//a[text()="edit"]', document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
if (editButtons.snapshotItem(0)) {
	var currentPostSig = new Array();
	var currentPostID = new Array();
	
	for (var i = 0; i < editButtons.snapshotLength; i++) {
		currentPostSig[i] = editButtons.snapshotItem(i).parentNode.parentNode.parentNode.parentNode.childNodes[0].getElementsByClassName("sig_text")[0].innerHTML.replace("<br>","\n");
		currentPostID[i] = editButtons.snapshotItem(i).getAttribute('onclick').split(',')[2].split(')')[0];
		editButtons.snapshotItem(i).setAttribute("onmousedown",editButtons.snapshotItem(i).getAttribute("onclick").substring(7)+"this.removeAttribute('onmousedown');");
		editButtons.snapshotItem(i).removeAttribute("onclick");
		myFightMoney(editButtons.snapshotItem(i),currentPostID[i],currentPostSig[i]);
	}
}