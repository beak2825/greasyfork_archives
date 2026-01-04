// ==UserScript==
// @name        sigma16 tab key
// @namespace   Violentmonkey Scripts
// @match       https://sigma16.herokuapp.com/Sigma16/build/release/Sigma16/Sigma16.html
// @grant       none
// @version     1.001
// @author      -
// @description 2/18/2022, 1:15:38 PM
// @license MIT

// @downloadURL https://update.greasyfork.org/scripts/440260/sigma16%20tab%20key.user.js
// @updateURL https://update.greasyfork.org/scripts/440260/sigma16%20tab%20key.meta.js
// ==/UserScript==

window.addEventListener("keydown", function (event) {
  if (event.defaultPrevented) {
    return; // Do nothing if the event was already processed
  }

  switch (event.key) {
    case "Tab": // IE/Edge specific value
    case "Tab":
        var text = "    "
        console.log(text)
        var txtarea = document.activeElement;
        var scrollPos = txtarea.scrollTop;
    	var strPos = 0;
    	var br = ((txtarea.selectionStart || txtarea.selectionStart == '0') ? 
    		"ff" : (document.selection ? "ie" : false ) );
    	if (br == "ie") { 
    		txtarea.focus();
    		var range = document.selection.createRange();
    		range.moveStart ('character', -txtarea.value.length);
    		strPos = range.text.length;
    	}
    	else if (br == "ff") strPos = txtarea.selectionStart;
    	
    	var front = (txtarea.value).substring(0,strPos);  
    	var back = (txtarea.value).substring(strPos,txtarea.value.length); 
    	txtarea.value=front+text+back;
    	strPos = strPos + text.length;
    	if (br == "ie") { 
    		txtarea.focus();
    		var range = document.selection.createRange();
    		range.moveStart ('character', -txtarea.value.length);
    		range.moveStart ('character', strPos);
    		range.moveEnd ('character', 0);
    		range.select();
    	}
    	else if (br == "ff") {
    		txtarea.selectionStart = strPos;
    		txtarea.selectionEnd = strPos;
    		txtarea.focus();
    	}
    	txtarea.scrollTop = scrollPos;
      break;
    default:
      return; // Quit when this doesn't handle the key event.
  }

  // Cancel the default action to avoid it being handled twice
  event.preventDefault();
}, true);