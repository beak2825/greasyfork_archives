// ==UserScript==
// @match        https://www.linkedin.com/
// @name         LinkedIn Grow Network.js
// @description  To grow LinkedIn network
// @compatible   chrome
// @author       Dalveer
// @license      MIT
// @version 0.0.1.20240528022703
// @namespace https://greasyfork.org/users/797771
// @downloadURL https://update.greasyfork.org/scripts/496281/LinkedIn%20Grow%20Networkjs.user.js
// @updateURL https://update.greasyfork.org/scripts/496281/LinkedIn%20Grow%20Networkjs.meta.js
// ==/UserScript==

/* Purpose: To grow LinkedIn network

How To Use: Method 1 (with Extension) (Preferred),
  1. Download any JS Extension for your preferred browser (Extension example: user-JavaScript-and-CSS);
  2. Copy this code (all, or a part of it).
  3. Create new entry in your JS extension for "https://www.linkedin.com", and and paste copied code in it.
  4. Refresh "linkedIn.com" and start browsing, this code will search for users visible on your page and send them a connection request.
  5. In Console, you will see update as "invited users:[count]"

How To Use: Method 2 (Without Extension),
  1. Open LinkedIn.com and login in your browser, and then open console (F12 in Chrome, or google it, "how to open and use console in [browser]).
  2. Copy this code (all, or a part of it), (If you are new to JS, then copy all of it).
  3. Paste copied code in console of your LinkedIn.com tab, and press enter.
  3. Start browsing LinkedIn, this code will search for users visible on your page and send them a connection request.
  4. In Console, you will see update as "invited users:[count]"
  NOTE: In this method, you will need to repeat step[2-3] every time, you page reloads, keep checking step[4].

Extension that I use: https://chromewebstore.google.com/detail/user-javascript-and-css/nbhcbdghjpllgmfilhnhkllmkecfmpld
NOTE: There is a linked weekly limit of 100-200 requests, you can use this every week.

Follow me at: https://github.com/Dalveer-Singh
source: https://github.com/Dalveer-Singh/Utility-Browser-Javascripts/blob/main/LinkedInGrowNetwork.js
*/


let count = 'userInviteCount';
let isM1Running = false;
let isM2Running = false;

if(sessionStorage.getItem(count) == null){
	sessionStorage.setItem(count, 0);
}

function connectWithDiv(){
	if (isM1Running){
		return;
	}
	isM1Running = true;
  // Select all buttons
  var buttons = document.querySelectorAll('div[aria-label]');
  
  // Iterate over the buttons and find the one that matches the pattern
  var matchingButton = null;
  buttons.forEach(function(button) {
      var ariaLabel = button.getAttribute('aria-label');
      if (ariaLabel.startsWith("Invite ") && ariaLabel.endsWith(" to connect")) {
          matchingButton = button;
      }
  });
  
  // Check if the matching button exists and perform an action
  if (matchingButton) {
      // Example action: click the button
      matchingButton.click();
      sessionStorage.setItem(count, parseInt(sessionStorage.getItem(count))+1);
      setTimeout(function() {document.querySelector('button[aria-label="Send without a note"]').click();}, 100);
  }
  isM1Running = false;
} 

function connectWithButton(){
	if (isM2Running){
		return;
	}
	isM2Running = true;
	var buttons = document.querySelectorAll('button[aria-label]');
  var matchingButton = null;
  buttons.forEach(function(button) {
    var ariaLabel = button.getAttribute('aria-label');
    if (ariaLabel.startsWith("Invite ") && ariaLabel.endsWith(" to connect")) {
        matchingButton = button;
        console.log(matchingButton.click());
        sessionStorage.setItem(count, parseInt(sessionStorage.getItem(count))+1);
    }
  });
  isM2Running = false;
}

function startConnecting(){
	connectWithButton();
	connectWithDiv();
	setTimeout(main, 2000);
	console.log("invited users: "+ sessionStorage.getItem(count));
}

// suggestion: Comment below method call, and call it from browserr console of linkedIn.com Tab, to avoid its all the time running.
startConnecting();

