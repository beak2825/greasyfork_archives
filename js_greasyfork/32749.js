// ==UserScript==
// @name Set Arrival Time
// @description Set the desired arrival time in Tribal Wars and the script will automatically send the attack
// @author FunnyPocketBook
// @version 1.16.2.2
// @date 03-10-2017
// @namespace FunnyPocketBook
// @include https://*/game.php?village=*&screen=place&try=confirm
// @downloadURL https://update.greasyfork.org/scripts/32749/Set%20Arrival%20Time.user.js
// @updateURL https://update.greasyfork.org/scripts/32749/Set%20Arrival%20Time.meta.js
// ==/UserScript==

// CHANGE THESE NUMBERS TO GET THE CORRECT ARRIVAL TIME - higher number means more delay. Change "windows.delayTime" before "intervalTime" and only change "intervalTime" if you can't get it quite correct with only "delayTime"
window.delayTime = 11; // Set delay in ms
window.intervalTime = 1; // Set interval in ms

// DON'T MESS WITH THIS IF YOU DON'T KNOW WHAT YOU ARE DOING
window.showArrTimeTr = document.createElement("tr"); // Create button called btn as a link because any button causes the attack to launch
window.showArrTimeTd = document.createElement("td");
var pEle = document.getElementById("troop_confirm_go"); // Button comes after this element
var btn = document.createElement("a"); // Create button called btn as a link because any button causes the attack to launch
btn.setAttribute("id", "arrTime"); // Set ID of btn
btn.setAttribute("style", "cursor:pointer;"); // Set cursor to pointer
pEle.parentNode.insertBefore(btn, pEle.nextElementSibling); // Place btn after pEle
var t = document.createTextNode("Set arrival time"); // btn has this text
btn.appendChild(t); // Append text to btn

btn.onclick = function() {
	"use strict";
	var time = document.getElementsByClassName("relative_time")[0].textContent.slice(-8);
	var lalau = document.getElementById("date_arrival");
	window.input = prompt("Please enter desired arrival time", time);
	window.ms = parseInt(prompt("Please enter approximate milliseconds", "000"));
	window.showArrTimeTr.appendChild(window.showArrTimeTd);
	lalau.parentNode.parentNode.insertBefore(window.showArrTimeTr, lalau.parentNode[1]);
	window.showArrTimeTd.innerHTML = "You set the arrival time to: ~" + window.input + ":" + window.ms;
	window.showArrTimeTd.setAttribute("colspan", "2");
	window.showArrTimeTd.setAttribute("id", "showArrTime");
};

setInterval(function captcha() {
    if(document.getElementsByClassName("rc-anchor-center-item").length > 0) {
		document.getElementsByClassName("rc-anchor-center-item")[0].click();
	} else{}
}, 10);

setInterval(function retime() {
	"use strict";
	var arrival = document.getElementsByClassName("relative_time")[0].textContent;
	if(arrival.slice(-8) === window.input)
		{
			setTimeout(function() {document.getElementById("troop_confirm_go").click();}, window.ms + window.delayTime);
		} else {}
}, window.intervalTime);
