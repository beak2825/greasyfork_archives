// ==UserScript==
// @name MAM Daily Auto Gift Spawvn
// @namespace yyyzzz999
// @author yyyzzz999
// @description Sends bonus points and FL to a MAM friend every day (5/27/21)
// @match https://www.myanonamouse.net/u/203586
// @license MIT
// @version 0.3
// @run-at document-end
// @grant unsafeWindow
// @grant window.close
// @grant window.focus
// @grant window.onurlchange
// @downloadURL https://update.greasyfork.org/scripts/461898/MAM%20Daily%20Auto%20Gift%20Spawvn.user.js
// @updateURL https://update.greasyfork.org/scripts/461898/MAM%20Daily%20Auto%20Gift%20Spawvn.meta.js
// ==/UserScript==
/*jshint esversion: 6 */
/*eslint no-multi-spaces:0 */ //stop pestering me 'cause I learned to type with double spaces!

/*
This script makes gifting easy when travelling on vacation w/o putting MAM account in vacation mode.

To simplify coding, make a copy of this script for every user you wish to send daily gifts,
give it a unique name, and run each in a separate tab.  Start well after midnight UTC to avoid missing a day.

Next script, Max daily vault contributions!
https://www.myanonamouse.net/millionaires/donate.php?
*/

// Function from https://stackoverflow.com/questions/41296950/
const milliseconds = (h, m, s) => ((h*60*60+m*60+s)*1000);

let DEBUG =1; // Debugging mode on (1) or off (0)

if (DEBUG) console.log("MAM Daily Auto Gift loaded"); // Just run confirmation for console window

// Specify page reload time in hours, minutes, and seconds
const reloadTime = milliseconds(23, 59, 33); // Script actions do not affect reload time <--**********

// https://davidwalsh.name/automatically-refresh-page-javascript-meta-tags
// Set page to reload every reloadTime

function auto_reload()
{
	window.location = 'https://www.myanonamouse.net/u/185092'; // Must match @include URL above <--**********
}

// This line reloads the page after reloadTime, and then the script starts all over then next day
setTimeout(auto_reload,reloadTime); // Works in Tampermonkey etc.
// switch to setInterval() if userscript manager does not restart script.
//setInterval(auto_reload,reloadTime); // For Scratchpad testing

// Hack to make sure an object is actually clicked when .click(); doesn't work...

// https://stackoverflow.com/questions/6337197/greasemonkey-button-click
// element.dispatchEvent(new MouseEvent('click'));

// Get the mouse Bonus Points
let bp = document.getElementById("tmBP").textContent.split(":")[1].trim(); //Should be current as we act seconds after page load
bp = bp.split(" ")[0]; // remove (+/- nnnn) from MAM+ if running
//let bp = document.getElementById("currentBonusPoints").textContent
if (DEBUG) console.log("Bonus Points: " + bp);

// Count page buttons so we can click buttons in dialogs later
let buttons = document.getElementsByTagName('button');
let bl = buttons.length; // Pop up dialog will have the most recently added buttons

// Gift Bonus Points
if(bp > 3000){ // Keep some points for vault and VIP <--**********

document.getElementById("bonusgift").value = 1000; // Amount to gift between 5 and 1000

// Problem if jQuery functions not yet loaded when DOM complete
    setTimeout(function(){ // This finally made the 1st click work!
 // https://stackoverflow.com/questions/41088878/button-click-doesnt-work-in-greasemonkey-tampermonkey-script-already-tried-sta
	document.getElementById("sendPointsDetailP").dispatchEvent(new MouseEvent('click')); // Send Points
	if (DEBUG) console.log("Clicked Send Points");
	}, 1000);  // Wait 1 second for site.js jQuery to load and finish running

/* Rather than count buttons (which seems to work OK) this might work better when the button has a unique class to use:
	document.getElementsByClassName("ui-button ui-corner-all ui-widget")[1].style.color="Violet"; // OK button still 2nd
*/
	setTimeout(function(){
	buttons = document.getElementsByTagName('button'); // add new buttons from dialog to our aray
	bl = buttons.length;
	if (DEBUG) console.log("Now " + bl + " buttons on this page.");
  	if (bl>1) buttons[bl-2].dispatchEvent(new MouseEvent('click')); //Click the OK Button on pop up dialog to confirm
	}, 2500); // 2.5 seconds after send, click confirm button.

	setTimeout(function(){
	buttons = document.getElementsByTagName('button'); // add new buttons from dialog to our aray
	bl = buttons.length;
	if (DEBUG) console.log("Then " + bl + " buttons on this page.");
  	if (bl>1) buttons[bl-2].dispatchEvent(new MouseEvent('click')); //Click the OK Button on pop up dialog to confirm
	}, 3500); // 3.5 seconds after confirm button, close the send PM dialog
}
// Gift FL wedge (Note to self: Add check for minimum FL reserve in next version!) <--**********
    setTimeout(function(){ // 8 seconds after page load
//	document.getElementById("sendWedge").dispatchEvent(new MouseEvent('click')); // Comment out this line to only send bp
//	if (DEBUG) console.log('Clicked "Send a Freeleech wedge"');
	}, 8000);  // Wait until after bonus point PM dialog is closed to send FL

	setTimeout(function(){ // 9.5 seconds after page load
	buttons = document.getElementsByTagName('button'); // update buttons to match latest dialog
	bl = buttons.length;
	if (DEBUG) console.log("After 2nd dialog there are " + bl + " buttons on this page."); // Also comment out this line when only sending bp
  	buttons[buttons.length-2].dispatchEvent(new MouseEvent('click')); //Click the OK Button on 2nd pop up dialog
	}, 9500);

// These timeout functions could be written in any order, but I list them in order of execution for my own sanity!  ;-)

// There will be a 4th dialog, but it can just sit there for a day until we reload the page again.

// TODO add some kind of cute page alteration every 30 seconds or so to show AutoGift is running, and remind me not to close this TAB!
// Perhaps cycle the text color of the Points and Send Freeleech text?