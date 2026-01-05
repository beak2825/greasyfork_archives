// ==UserScript==
// @name        Universal Copy/Paste to HIT
// @description copy/paste to text fields in HIT
// @author      DCI
// @namespace   www.redpandanetework.org
// @include     *
// @version     1.5
// @grant       GM_addValueChangeListener
// @grant       GM_setValue
// @grant       GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/20261/Universal%20CopyPaste%20to%20HIT.user.js
// @updateURL https://update.greasyfork.org/scripts/20261/Universal%20CopyPaste%20to%20HIT.meta.js
// ==/UserScript==
/*
Highlight text to be copied from a window or tab opened by a userscript back to it's parent HIT.

Also works for pasting text inside of a HIT to it's own text field. ASDF will not close the window in this case.

Hotkeys active on all pages but will only function if text is currently highlighted.

A = Paste highlighted text to first field of the parent window and close the pop up window.
S = Paste highlighted text to second field of the parent window and close the pop up window.
D = Paste highlighted text to third field of the parent window and close the pop up window.
F = Paste highlighted text to third field of the parent window and close the pop up window.

Q = Paste highlighted text to first field of the parent window without closing the pop up window.
W = Paste highlighted text to second field of the parent window without closing the pop up window.
E = Paste highlighted text to third field of the parent window without closing the pop up window.
R = Paste highlighted text to fourth field of the parent window without closing the pop up window.

T = Close pop up window.
G = Paste "NA" to first field of parent window and close pop up (still requires highlighting having text highlighted).
*/

GM_setValue("messages",'');

var is_chrome = navigator.userAgent.toLowerCase().indexOf('chrome') > -1;

if (is_chrome === true){
	GM_addValueChangeListener("messages", function() {
        j = GM_getValue("messages").substr(5, 1);
        document.querySelectorAll("input[type='text']")[j-1].value = GM_getValue("messages").substring(6);
	});
}

function GetSelectedText(){
	if (window.getSelection){
		var range = window.getSelection();
		var stringified = range.toString();
        highlighted = stringified.trim();
	}
}

function press(i) {
	if ( i.keyCode === 65 ) { // A
		GetSelectedText();
		if (highlighted.length > 0){
			if (is_chrome === false){
				if (window.opener){
					window.opener.postMessage("Field1" + highlighted, '*');
					window.close();
				}
				else {
					window.postMessage("Field1" + highlighted, '*');
				}
			}
			else {
				GM_setValue("messages","Field1" + highlighted);
				if (window.opener){
					window.close();
				}
			}
		}
	}
	if ( i.keyCode === 83 ) { // S
		GetSelectedText();
		if (highlighted.length > 0){
			if (is_chrome === false){
				if (window.opener){
					window.opener.postMessage("Field2" + highlighted, '*');
					window.close();
				}
				else {
					window.postMessage("Field2" + highlighted, '*');
				}
			}
			else {
				GM_setValue("messages","Field2" + highlighted);
				if (window.opener){
					window.close();
				}
			}
		}
	}
	if ( i.keyCode === 68 ) { // D
		GetSelectedText();
		if (highlighted.length > 0){
			if (is_chrome === false){
				if (window.opener){
					window.opener.postMessage("Field3" + highlighted, '*');
					window.close();
				}
				else {
					window.postMessage("Field3" + highlighted, '*');
				}
			}
			else {
				GM_setValue("messages","Field3" + highlighted);
				if (window.opener){
					window.close();
				}
			}
		}
	}
	if ( i.keyCode === 70 ) { // F
		GetSelectedText();
		if (highlighted.length > 0){
			if (is_chrome === false){
				if (window.opener){
					window.opener.postMessage("Field4" + highlighted, '*');
					window.close();
				}
				else {
					window.postMessage("Field4" + highlighted, '*');
				}
			}
			else {
				GM_setValue("messages","Field4" + highlighted);
				if (window.opener){
					window.close();
				}
			}
		}
	}
	if ( i.keyCode === 71 ) { // G
		GetSelectedText();
		if (highlighted.length > 0){
			if (is_chrome === false){
				if (window.opener){
					window.opener.postMessage("Field1" + "NA", '*');
					window.close();
				}
				else {
					window.postMessage("Field1" + "NA", '*');
				}
			}
			else {
				GM_setValue("messages","Field1" + "NA");
				if (window.opener){
					window.close();
				}
			}
		}
	}	
	if ( i.keyCode === 81 ) { // Q
		GetSelectedText();
		if (highlighted.length > 0){
			if (is_chrome === false){
				if (window.opener){
					window.opener.postMessage("Field1" + highlighted, '*');
				}
				else {
					window.postMessage("Field1" + highlighted, '*');
				}
			}
			else {
				GM_setValue("messages","Field1" + highlighted);
			}
		}
	}
	if ( i.keyCode === 87 ) { // W
		GetSelectedText();
		if (highlighted.length > 0){
			if (is_chrome === false){
				if (window.opener){
					window.opener.postMessage("Field2" + highlighted, '*');
				}
				else {
					window.postMessage("Field2" + highlighted, '*');
				}
			}
			else {
				GM_setValue("messages","Field2" + highlighted);
			}
		}
	}
	if ( i.keyCode === 69 ) { // E
		GetSelectedText();
		if (highlighted.length > 0){
			if (is_chrome === false){
				if (window.opener){
					window.opener.postMessage("Field3" + highlighted, '*');
				}
				else {
					window.postMessage("Field3" + highlighted, '*');
				}
			}
			else {
				GM_setValue("messages","Field3" + highlighted);
			}
		}
	}
	if ( i.keyCode === 82 ) { // R
		GetSelectedText();
		if (highlighted.length > 0){
			if (is_chrome === false){
				if (window.opener){
					window.opener.postMessage("Field4" + highlighted, '*');
				}
				else {
					window.postMessage("Field4" + highlighted, '*');
				}
			}
			else {
				GM_setValue("messages","Field4" + highlighted);
			}
		}
	}
	if ( i.keyCode === 84 ) { // T
		GetSelectedText();
		if (highlighted.length > 0){
			if (window.opener){
				window.close();
			}
		}
	}	
}
document.addEventListener( "keydown", press, false);

function receiveMessage(event){
	var msg = event.data;
    if (msg.toString().indexOf('Field') !== -1){
		i = msg.substr(5, 1); 
        document.querySelectorAll("input[type='text']")[i-1].value = msg.substring(6);
	} 
}
window.addEventListener("message", receiveMessage, false);


