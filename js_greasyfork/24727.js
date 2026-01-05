// ==UserScript==
// @name Saurav Sahay: Stress annotation	
// @namespace None
// @version 1.0.0
// @description Rate stress levels easily
// @author Kintsugi
// @include *.mturkcontent.com/*
// @include https://s3.amazonaws.com/*
// @grant GM_log
// @require http://code.jquery.com/jquery-2.1.0.min.js
// @downloadURL https://update.greasyfork.org/scripts/24727/Saurav%20Sahay%3A%20Stress%20annotation.user.js
// @updateURL https://update.greasyfork.org/scripts/24727/Saurav%20Sahay%3A%20Stress%20annotation.meta.js
// ==/UserScript==

var x = document.getElementsByTagName("audio");

window.focus();

$('input[name="activation"][value="zero"]').click();
$('input[name="confidence"][value="5"]').click();

// Keybinds
$(document).keydown(function (e) {
	  switch (e.which) {
		case 97: // Numpad 1 
		  $('input[name="confidence"][value="1"]').click();
		  break;
		case 98: // Numpad 2 
		  $('input[name="confidence"][value="2"]').click();
		  break;
        case 99: // Numpad 3 
		  $('input[name="confidence"][value="3"]').click();
		  break;
        case 100: // Numpad 4
		  $('input[name="confidence"][value="4"]').click();
		  break;
        case 101: // Numpad 5
		  $('input[name="confidence"][value="5"]').click();
		  break;
        case 76: // l
		  $('input[name="activation"][value="low"]').click();
		  break;
        case 77: // m
		  $('input[name="activation"][value="medium"]').click();
		  break;
        case 72: // h
		  $('input[name="activation"][value="high"]').click();
		  break;
        case 78: // n
		  $('input[name="activation"][value="zero"]').click();
		  break;  
        case 102: // Numpad 6
          $(x).get(0).play();
          break;
		case 13: // Enter
		  $('#submitButton').click();
		  break;
	  }
	});