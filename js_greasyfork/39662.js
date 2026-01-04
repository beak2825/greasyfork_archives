// ==UserScript==
// @name         Press "." and do Quoting things on 4chanX
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Allows you to quote text without creating a quote link item in your post
// @author      	ECHibiki - Sage
// @match        *://boards.4chan.org/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/39662/Press%20%22%22%20and%20do%20Quoting%20things%20on%204chanX.user.js
// @updateURL https://update.greasyfork.org/scripts/39662/Press%20%22%22%20and%20do%20Quoting%20things%20on%204chanX.meta.js
// ==/UserScript==


var THAT_FIELD_YOU_CHANGE_TO_SET_YOUR_HOTKEY_CHARACTER = ".";



var qr_open = false;

document.addEventListener("keydown", function(e){
	if(e.key == THAT_FIELD_YOU_CHANGE_TO_SET_YOUR_HOTKEY_CHARACTER && !(document.activeElement.tagName == "INPUT" || document.activeElement.tagName == "TEXTAREA")){
		var text = getSelectionText().split("\n");
        var intermed = text;
        text = (text.map(function(line){return line.trim() != "" ? ">" + line : line;})).join("\n");
		e.preventDefault();
		e.stopPropagation();
		if(!qr_open) document.getElementsByClassName("qr-link")[0].click();
		setTimeout(function(){
			document.getElementById("qr").getElementsByTagName("TEXTAREA")[0].value += text + "\n";
		},100);
		return false;
	}
});



function getSelectionText() {
    var text = "";
    if (window.getSelection) {
        text = window.getSelection().toString();
    } else if (document.selection && document.selection.type != "Control") {
        text = document.selection.createRange().text;
    }
    return text;
}
