// ==UserScript==
// @name            Add spoiler tag for PSE
// @description     Add the "add spoiler" button in the right click menu
// @version         1
// @author          Lord of dark
// @require       http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @include         http://puzzling.stackexchange.com/*
// @namespace https://greasyfork.org/users/49190
// @downloadURL https://update.greasyfork.org/scripts/20799/Add%20spoiler%20tag%20for%20PSE.user.js
// @updateURL https://update.greasyfork.org/scripts/20799/Add%20spoiler%20tag%20for%20PSE.meta.js
// ==/UserScript==

this.$ = this.jQuery = jQuery.noConflict(true);  // use jquery has no conflict

if (!("contextMenu" in document.documentElement &&
      "HTMLMenuItemElement" in window)) return;

var body = document.body;
body.addEventListener("contextmenu", initMenu, false);

var menu = body.appendChild(document.createElement("menu"));
menu.outerHTML = '<menu id="userscript-spoiler" type="context">\
                    <menuitem label="add spoiler"></menuitem>\
                  </menu>';

document.querySelector("#userscript-spoiler menuitem")
        .addEventListener("click", addspoiler, false);

function initMenu(aEvent) {
  // Executed when user right click on web page body
  // aEvent.target is the element you right click on
  var node = aEvent.target;
  var item = document.querySelector("#userscript-spoiler menuitem");
  if (node.localName == "textarea") {
    body.setAttribute("contextmenu", "userscript-spoiler");
  } else {
    body.removeAttribute("contextmenu");
  }
}

function addspoiler(aEvent) {
   var textareas = document.getElementsByTagName("textarea");
   var nb = textareas.length;
   for (var i=0;i<nb;i++){
	var textarea=textareas[i];
	var len = textarea.value.length;
	var start = textarea.selectionStart;
	var end = textarea.selectionEnd;
	var sel = textarea.value.substring(start, end);
	if (sel.length>0){
		// Select text and edit it
		var spoilered = sel.replace(/^[>! ]*/,">! ");
		spoilered=spoilered.replace(/ *\n[>! ]*/g, "  \n>! ");

 		// Replace the selected text with this one
 		textarea.value =  textarea.value.substring(0,start) + spoilered + textarea.value.substring(end,len);
		
		// trigger event to update the "preview"
		var ev = document.createEvent("KeyboardEvent");
    		ev.initKeyEvent("keypress", true, false, window, 0, 0, 0, 0, 13, 13);
		textarea.dispatchEvent(ev);
		break;
	}
   }
}
