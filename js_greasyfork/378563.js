// ==UserScript==
// @name     		Crowdin Translation Box Direction Inverter
// @description 	Adds a button to the Crowdin translation GUI to change the direction of translations textarea.
// @version  		1.0.1
// @include  		https://crowdin.com/translate/*
// @author   		Dev-iL
// @license     	MIT License
// @run-at      	document-idle
// @namespace https://greasyfork.org/users/250942
// @downloadURL https://update.greasyfork.org/scripts/378563/Crowdin%20Translation%20Box%20Direction%20Inverter.user.js
// @updateURL https://update.greasyfork.org/scripts/378563/Crowdin%20Translation%20Box%20Direction%20Inverter.meta.js
// ==/UserScript==
/* jshint esversion: 6 */

/*
CHANGELOG:
--- 1.0.1 --- 
The translation box' parent element's direction is modified as well.
--- 1.0.0 --- 
Initial release
*/

let ARROWS_ICON = `
<svg version="1.1" id="arrowsIcon" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
	 width="24px" height="24px" viewBox="0 -60 600 600" style="" opacity="0.75" fill=rgb(180,180,180)
	 xml:space="preserve" preserveAspectRatio="xMinYMin meet" x="0px" y="0px">
	<g>
		<path d="M146.734,331.121c10.887,10.888,19.707,7.234,19.707-8.164v-52.895h196.017c6.157,0,11.15-4.994,11.15-11.15V86.774
			c0-6.157-4.993-11.151-11.15-11.151H166.441V22.729c0-15.392-8.819-19.052-19.707-8.164L8.166,153.133
			c-10.888,10.888-10.888,28.532,0,39.419L146.734,331.121z"/>
		<path d="M414.062,229.67c-10.882-10.887-19.707-7.228-19.707,8.165v52.895H198.332c-6.157,0-11.15,4.994-11.15,11.15v172.138
			c0,6.156,4.994,11.15,11.15,11.15h196.017v52.896c0,15.392,8.825,19.051,19.706,8.164L552.63,407.658
			c10.882-10.888,10.882-28.531,0-39.419L414.062,229.67z"/>
	</g>
</svg>
`;

var currentDirection;
var translationArea;

function setLTR(){
  translationArea.style.direction = "ltr";
  translationArea.parentElement.dir = "ltr";
  currentDirection = "ltr";
}

function setRTL(){
  translationArea.style.direction = "rtl";
  translationArea.parentElement.dir = "rtl";
  currentDirection = "rtl";
}

function switchDirection(){
  if (currentDirection == "ltr")
    setRTL();
  else
    setLTR();
}

function addInversionButton(){
  // Determine whether we are on an appropriate page by looking for the relevant div:
  translationArea = document.getElementById("translation");
  if (!translationArea)
  	return;
  
  // If we are, we store the current state of the textarea:
  currentDirection = translationArea.style.direction;
  
  // Create the new button:
  var switchingButton = document.createElement("button");
  switchingButton.setAttribute("class", "btn btn-icon");
  switchingButton.setAttribute("title", "Switch direction (LTR/RTL)");
  switchingButton.addEventListener("click", switchDirection);
  
  // Add it the right place:
  var rightmostButton = document.getElementById("action_copy_source");
  rightmostButton.parentNode.appendChild(switchingButton);
  switchingButton.innerHTML += ARROWS_ICON;
}

// Make sure the page is fully loaded before running the script
// https://stackoverflow.com/a/47406751
var observer = new MutationObserver(resetTimer);
var timer = setTimeout(action, 1000, observer); // wait for the page to stay still for some time
observer.observe(document, {childList: true, subtree: true});

function resetTimer(changes, observer) {
    clearTimeout(timer);
    timer = setTimeout(action, 1000, observer);
}

function action(o) {
    o.disconnect();
    addInversionButton();
}