// ==UserScript==
// @name        grim's steam queue skipper
// @namespace   https://greasyfork.org/en/users/4367-d-p
// @description Automatically skip Steam's queue if you're on their app page
// @include     http://store.steampowered.com/app/*
// @include     https://store.steampowered.com/app/*
// @version     1.1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/20867/grim%27s%20steam%20queue%20skipper.user.js
// @updateURL https://update.greasyfork.org/scripts/20867/grim%27s%20steam%20queue%20skipper.meta.js
// ==/UserScript==

// v1.1 2018-06-22, add https

// based off of: grims_wikia_content_warning_auto-skip.user.js

//*
// method 1: works, but it continually polls the website.
// you need to turn off this userscript once you're doing using this method

window.addEventListener('load', function() {

	setTimeout(function(){
		document.getElementsByClassName('next_in_queue_content')[0].click();
	}, 222);
	// this works. however, ID is preferred over class
	// steam has no ID though, only class
	
}, false);

// */


/*
// method 2: does not work
// I don't know why. maybe it registers the next_in_queue_content is here, but clicking doesn't work or something
// it doesn't make sense. I tried increasing the delays

var totalMillisecondsPassed = 0; // an extremely rough guesstimate of how much time has passed
var milliseconds = 10; // setTimeout delay
var maxWaitTimeUntilTimeout = 1000; //how long you want to wait before you stop trying to click the button
(function init(){
	var counter = document.getElementById('next_in_queue_content');
	if (counter) { 
		// do something with counter element
		document.getElementsByClassName('next_in_queue_content')[0].click();
		//btn_next_in_queue, next_in_queue_content
		//alert("Element found. This script is running with document.readyState: " + document.readyState);
	} 
	else { 
		setTimeout(init, milliseconds); // set the timer to use a user-defined delay. I chose 10 ms just as a precaution. this causes the program to check roughly every 10 ms for the button. it's actually a good bit longer than 10 ms because of execution time.
		//setTimeout(init, 0); // using 0 didn't seem to affect performance
		// uncomment to see the alert line runs indefinitely if element is not found
		// probably because init references itself, making it a recursive function
		//alert("This script is running with document.readyState: " + document.readyState + totalMillisecondsPassed);
		
		totalMillisecondsPassed += milliseconds;
		//alert("totalMillisecondsPassed: " + totalMillisecondsPassed); // make sure you hold down enter. else it will keep going on
		if (totalMillisecondsPassed >= maxWaitTimeUntilTimeout)
		{
			//alert(maxWaitTimeUntilTimeout + " totalMillisecondsPassed have passed. either modify the setTimeOut or exit the function: " + totalMillisecondsPassed);
			milliseconds = 7777; // increase the delay so that the timer is not a problem anymore
		}
	}
})();

// */