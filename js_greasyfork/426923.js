// ==UserScript==
// @name MAM Daily Auto Gift yyywwwyyyhhh
// @namespace yyyzzz999
// @author yyyzzz999
// @description Sends bonus points and FL to a MAM friend every day 4/8/23
// @match https://www.myanonamouse.net/u/185092
// @version 0.8
// @icon    https://cdn.myanonamouse.net/pic/smilies/horse.gif
// @license MIT
// @run-at document-end

// @downloadURL https://update.greasyfork.org/scripts/426923/MAM%20Daily%20Auto%20Gift%20yyywwwyyyhhh.user.js
// @updateURL https://update.greasyfork.org/scripts/426923/MAM%20Daily%20Auto%20Gift%20yyywwwyyyhhh.meta.js
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
//var reloadTime = milliseconds(24, 0, 0); // Script actions do not affect reload time <--**********

var headr = document.querySelector("div[class='blockHeadCon']");
var now = new Date();
var then = new Date(now);
//then.setUTCHours(0, 10, 0); //10 minutes after UTC midnight target time to run
then.setUTCHours(0, Math.floor(Math.random() * 16) + 5, Math.floor(Math.random() * 60)); //random time between 0:05am and 0:20am UTC
var ddiff = then - now;
if (DEBUG) console.log("now: ", now," then: ",then, "then - now: ",ddiff );
if (now.getTime() < then.getTime()) { console.log("It isn't then yet.") } else {
    then.setUTCDate(then.getUTCDate() + 1); // set then to tomorrow UTC
    ddiff = then - now;
    console.log("then is " + then.toUTCString());
}
//headr.innerText = "Loaded at: " + now.toUTCString();
  headr.innerText = "Loaded at: " + now.toUTCString() + " -> Reloading at: " + then.toUTCString() + " or locally " + then.toLocaleString();
// https://davidwalsh.name/automatically-refresh-page-javascript-meta-tags
// Set page to reload every reloadTime

function auto_reload() {
	// window.location = window.location.href; // v.5 No more need to copy URL here!
    location.reload();
}

// This line reloads the page after reloadTime, and then the script starts all over then next day
setTimeout(auto_reload,ddiff); // Works in Tampermonkey etc.
// was setTimeout(auto_reload,reloadTime); v.4
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
var buttons = document.getElementsByTagName('button');
var bl = buttons.length; // Pop up dialog will have the most recently added buttons
var x; // Undefined to start

function getOkButtonIndex() {
  buttons = document.getElementsByTagName('button');
  bl = buttons.length;
  for (var i = 0; i < bl; i++) {
    if (buttons[i].textContent === 'Ok') {
      return i;
    }
  }
}

// Gift Bonus Points
if(bp > 3000){ // Keep some points for vault and VIP <--**********


// Problem if jQuery functions not yet loaded when DOM complete
    setTimeout(function(){ // This finally made the 1st click work!
 // https://stackoverflow.com/questions/41088878/button-click-doesnt-work-in-greasemonkey-tampermonkey-script-already-tried-sta
    document.getElementById("bonusgift").value = 1000; // Amount to gift between 5 and 1000
    // Wait for other scripts to finish dinking w/default script!
	document.getElementById("sendPointsDetailP").dispatchEvent(new MouseEvent('click')); // Send Points
	if (DEBUG) console.log("Clicked Send Points");
	}, 3000);  // Wait 3 seconds for site.js jQuery to load and finish running, and Max Gift to run!

/* Rather than count buttons (which seems to work OK) this might work better when the button has a unique class to use:
	document.getElementsByClassName("ui-button ui-corner-all ui-widget")[1].style.color="Violet"; // OK button still 2nd
*/
	setTimeout(function(){
    x = getOkButtonIndex();
	if (DEBUG) console.log("Now " + bl + " buttons on this page.");
  	if (x) buttons[x].dispatchEvent(new MouseEvent('click')); //Click the OK Button on pop up dialog to confirm
	}, 5500); // 1.5 seconds after send, click confirm button.

	setTimeout(function(){
    x = getOkButtonIndex()
	if (DEBUG) console.log("Then " + bl + " buttons on this page.");
  	if (x) buttons[x].dispatchEvent(new MouseEvent('click')); //Click the OK Button on pop up dialog to confirm
	}, 7500); // 1 seconds after confirm button, close the send PM dialog
}
// Gift FL wedge (Note to self: Add check for minimum FL reserve in next version!) <--**********

/*     setTimeout(function(){ // 8 seconds after page load
	document.getElementById("sendWedge").dispatchEvent(new MouseEvent('click')); // Comment out this line to only send bp
	if (DEBUG) console.log('Clicked "Send a Freeleech wedge"');
	}, 8000);  // Wait until after bonus point PM dialog is closed to send FL

	setTimeout(function(){ // 9.5 seconds after page load
	buttons = document.getElementsByTagName('button'); // update buttons to match latest dialog
	bl = buttons.length;
	if (DEBUG) console.log("After 2nd dialog there are " + bl + " buttons on this page."); // Also comment out this line when only sending bp
  	buttons[buttons.length-2].dispatchEvent(new MouseEvent('click')); //Click the OK Button on 2nd pop up dialog
	}, 9500); */

// These timeout functions could be written in any order, but I list them in order of execution for my own sanity!  ;-)

// There will be a 4th dialog, but it can just sit there for a day until we reload the page again.

// TODO add some kind of cute page alteration every 30 seconds or so to show AutoGift is running, and remind me not to close this TAB!
// Perhaps cycle the text color of the Points and Send Freeleech text?