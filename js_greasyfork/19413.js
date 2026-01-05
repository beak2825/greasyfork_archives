// ==UserScript==
// @name        grim's wikia content warning auto-skip
// @namespace   https://greasyfork.org/en/users/4367-d-p
// @description Automatically skip Wikia's content warning disclaimer
// @include     http*.wikia.com/*
// @version     1.3
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/19413/grim%27s%20wikia%20content%20warning%20auto-skip.user.js
// @updateURL https://update.greasyfork.org/scripts/19413/grim%27s%20wikia%20content%20warning%20auto-skip.meta.js
// ==/UserScript==


// see:
// http://stackoverflow.com/questions/23783774/using-a-regular-expression-in-a-greasemonkey-include
// https://wiki.greasespot.net/Include_and_exclude_rules
// http://stackoverflow.com/questions/12897446/greasemonkey-wait-for-page-to-load-before-executing-code-techniques
// http://stackoverflow.com/questions/16873323/javascript-sleep-wait-before-continuing

// 2016-06-05 for some reason, this script isn't working anymore
// it looks like the button pops up a little bit after the page is completely loading all its assets

// surround everything with the '/' to specify regex matching
// regex means http or https
// including any subdomain, including the domain wikia.com by itself. 
// subdomain can be any length with any characters, with a dot at the end. subdomain optional
// * in a regex match is not a typical wildcard. I need .* because the * in regex means that any character (.) appears 0 or more times.
// so in regex, 'https://example.com/xx-xx/Asset/*' means '/' appears 0 or more times
// outside of regex matching, like in greasemonkey's case, * means wildcard
// so 'https://example.com/xx-xx/Asset/*' means anything can appear after '/'
// at .com top level domain
// with anything proceeding afterwards

// So your https://example.com/xx-xx/Asset/* pattern would become:
// @include  /^https:\/\/example\.com\/[a-z]{2}\-[a-z]{2}\/Asset\/.*$/

// you can use either of these includes
// include     http*.wikia.com/*
// include     /^https?://(.*\.)?wikia\.com/.*$/

// <button id="ContentWarningApprove" class="approve">I understand and I wish to continue</button>

// test code to see if the document status is loading at the time of execution
// at this point, the document readystate should be 'interactive'
/*
if ('loading' == document.readyState) {
  alert("This script is running at document-start time.");
} else {
  alert("This script is running with document.readyState: " + document.readyState);
}
// */

// call script after the page loads
// unlike blogspot, wikia needs time to load because the buttons popup afterwards



window.addEventListener('load', function() {
    // your code here
	
	// test code to see if the document status is loading at the time of execution
	// for some strange reason, sometimes the clicking line never executes.
	// if I add the alert, only then will my script click the content warning approve button
	// that means the alert adds some delay after the document readystate is completed
	//*
	if ('loading' == document.readyState) {
		//alert("This script is running at document-start time.");
	} else {
		// at this point, the document readystate should be 'completed'
		//alert("This script is running with document.readyState: " + document.readyState);
	}
	// */
	
	// next, click the button once it pops into view for the user
	
	// temporarily set a timer until I figure out a way to click the button without using unreliable manual timers
	// do note that in the case of timers, the rest of the code will continue to execute.
	// all the timer does is delay execution of a set of code until the set amount of time expires
	// other parts of code will still continue to execute when the timer is going on
	setTimeout(function(){
		document.getElementById('ContentWarningApprove').click();
	}, 100);
	
	//document.getElementsByClassName('approve').click();
	// this does not work
	
	//document.getElementsByClassName('approve')[0].click();
	// this works. however, ID is preferred over class
	// for some reason getElementsByClassName doesn't work sometimes. maybe ajax is still trying to load?
	
	//document.getElementById('ContentWarningApprove').click();
	// this works
	

	
	
}, false);



