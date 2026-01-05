// ==UserScript==
// @name Thor Russell:Rate the audio file	
// @namespace None
// @version 1.0.2
// @description Rate audio files easily
// @author Kintsugi
// @include https://www.mturk.com/*
// @grant GM_log
// @require http://code.jquery.com/jquery-2.1.0.min.js
// @downloadURL https://update.greasyfork.org/scripts/25593/Thor%20Russell%3ARate%20the%20audio%20file.user.js
// @updateURL https://update.greasyfork.org/scripts/25593/Thor%20Russell%3ARate%20the%20audio%20file.meta.js
// ==/UserScript==

var i = 0;
var answer = "Answer_";
var thisAnswer = "";
var linkMP3 = document.querySelector('a[href$=".mp3"]').getAttribute("href");
var audio = document.createElement('audio');
audio.src = linkMP3;
window.focus();

$('input[name="Answer_1"][value="Selection_Nw--"]').click();
$('input[name="Answer_2"][value="Selection_Nw--"]').click();
$('input[name="Answer_3"][value="Selection_Nw--"]').click();
$('input[name="Answer_4"][value="Selection_Nw--"]').click();

// Keybinds
$(document).keydown(function (e) {
	  switch (e.which) {
	  	case 96: // Numpad 0 (Data Problem)
        case 48: // 0
        case 68: // d
          i++;
          thisAnswer = answer.concat(i.toString());
		  $('input[name="' + thisAnswer + '"][value="Selection_MA--"]').click();
		  break;
		case 97: // Numpad 1
        case 49: // 1
          i++;
          thisAnswer = answer.concat(i.toString());
		  $('input[name="' + thisAnswer + '"][value="Selection_MQ--"]').click();
		  break;
		case 98: // Numpad 2
        case 50: // 2
          i++;
          thisAnswer = answer.concat(i.toString());
		  $('input[name="' + thisAnswer + '"][value="Selection_Mg--"]').click();
		  break;
        case 99: // Numpad 3
        case 51: // 3
          i++;
          thisAnswer = answer.concat(i.toString());
		  $('input[name="' + thisAnswer + '"][value="Selection_Mw--"]').click();
		  break;
        case 100: // Numpad 4
        case 52: // 4
          i++;
          thisAnswer = answer.concat(i.toString());
		  $('input[name="' + thisAnswer + '"][value="Selection_NA--"]').click();
		  break;
        case 101: // Numpad 5
        case 53: // 5
          i++;
          thisAnswer = answer.concat(i.toString());
		  $('input[name="' + thisAnswer + '"][value="Selection_NQ--"]').click();
		  break;
		case 102: // Numpad 6
        case 54: // 6
          i++;
          thisAnswer = answer.concat(i.toString());
		  $('input[name="' + thisAnswer + '"][value="Selection_Ng--"]').click();
		  break;
		case 103: // Numpad 7
        case 55: // 7
          i++;
          thisAnswer = answer.concat(i.toString());
		  $('input[name="' + thisAnswer + '"][value="Selection_Nw--"]').click();
		  break;
        case 67: // c (clears input and resets to default values and allows you to cycle through questions from top)
          i = 0;
          $('input[name="Answer_1"][value="Selection_Nw--"]').click();
          $('input[name="Answer_2"][value="Selection_Nw--"]').click();
          $('input[name="Answer_3"][value="Selection_Nw--"]').click();
          $('input[name="Answer_4"][value="Selection_Nw--"]').click();
        break;      
        case 80: // p
        audio.play();
          break;
		case 13: // Enter
		  $("input[name*='/submit']").click();
          break;
	  }
	});