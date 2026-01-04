// ==UserScript==
// @name Set Arrival Time alternative linovlo
// @description Set the desired arrival time in Tribal Wars and the script will automatically send the attack
// @author FunnyPocketBook
// @version 1.1.2.6
// @date 21-11-2017
// @namespace FunnyPocketBook
// @include https://*/game.php?village=*&screen=place&try=confirm
// @downloadURL https://update.greasyfork.org/scripts/389767/Set%20Arrival%20Time%20alternative%20linovlo.user.js
// @updateURL https://update.greasyfork.org/scripts/389767/Set%20Arrival%20Time%20alternative%20linovlo.meta.js
// ==/UserScript==

// DON'T MESS WITH THIS IF YOU DON'T KNOW WHAT YOU ARE DOING

// Add new table row for offset
window.offsetTr = document.createElement("tr");
window.offsetTd = document.createElement("td");
var arrTimeNow = document.getElementById("date_arrival");
window.offsetTr.appendChild(window.offsetTd); // Append td to tr
arrTimeNow.parentNode.parentNode.insertBefore(window.offsetTr, arrTimeNow.parentNode[1]);
window.offsetTd.innerHTML = "Offset: ";
window.offsetTd.setAttribute("colspan", "2");
window.offsetTd.setAttribute("id", "offset");

// Set Offset
var pEle = document.getElementById("offset"); // Button comes after this element
var inputOffset = document.createElement("input");
inputOffset.setAttribute("id", "inputOffset");
inputOffset.setAttribute("type", "text");
inputOffset.setAttribute("style", "font-size:15px;")
var callOffset1 = localStorage.getItem("saveOffset");
if (callOffset1 !== null) {
	 var offsetInput = localStorage.getItem("saveOffset");
} else {
	var offsetInput = "15";
}
inputOffset.setAttribute("value", offsetInput);
inputOffset.setAttribute("style", "margin-top:10px; width:50px;");
pEle.appendChild(inputOffset, pEle.nextElementSibling);

// Create "Set Offset" button
var parentSetOffset = document.getElementById("inputOffset"); // Button comes after this element
var buttonOffset = document.createElement("a"); // Create button called buttonOffset as a link because any button causes the attack to launch
buttonOffset.setAttribute("id", "buttonOffset"); // Set ID of buttonOffset
buttonOffset.setAttribute("class", "btn");
buttonOffset.setAttribute("style", "cursor:pointer;"); // Set cursor to pointer
parentSetOffset.parentNode.insertBefore(buttonOffset, parentSetOffset.nextElementSibling); // Place buttonOffset after parentSetOffset
var text = document.createTextNode("Set Offset"); // buttonOffset has this text
buttonOffset.appendChild(text); // Append text to buttonOffset

buttonOffset.onclick = function() {
	"use strict";
	var saveOffset = document.getElementById("inputOffset").value;
	localStorage.setItem("saveOffset", saveOffset);
	var callOffset = localStorage.getItem("saveOffset");
	console.log(callOffset);
};

// Add new table row for arrival time
window.showArrTimeTr = document.createElement("tr");
window.showArrTimeTd = document.createElement("td");
var arrTimeNow = document.getElementById("date_arrival");
window.showArrTimeTr.appendChild(window.showArrTimeTd); // Append td to tr
arrTimeNow.parentNode.parentNode.insertBefore(window.showArrTimeTr, arrTimeNow.parentNode[1]);
window.showArrTimeTd.innerHTML = "Please enter the desired arrival time: ";
window.showArrTimeTd.setAttribute("colspan", "2");
window.showArrTimeTd.setAttribute("id", "showArrTime");

// Create "Set Arrival Time" button
var pEle = document.getElementById("showArrTime"); // Button comes after this element
var para = document.createElement("p"); // Create new paragraph
para.setAttribute("style", "width:100%");
var btn = document.createElement("a"); // Create button called btn as a link because any button causes the attack to launch
btn.setAttribute("id", "arrTime"); // Set ID of btn
btn.setAttribute("class", "btn");
btn.setAttribute("style", "cursor:pointer;"); // Set cursor to pointer
pEle.parentNode.insertBefore(para, pEle.nextElementSibling); // Place para after pEle
para.parentNode.parentNode.appendChild(btn); // Set the paragraph after the table
var t = document.createTextNode("Set arrival time"); // btn has this text
btn.appendChild(t); // Append text to btn

// Create input for time
var defaultTime = document.getElementsByClassName("relative_time")[0].textContent.slice(-8);
var parentInput = document.getElementById("showArrTime"); // Button comes after this element
var inputTime = document.createElement("input");
inputTime.setAttribute("id", "inputTime");
inputTime.setAttribute("type", "text");
inputTime.setAttribute("value", defaultTime);
inputTime.setAttribute("style", "margin-top:10px; width:80px;font-size:15px;");
parentInput.appendChild(inputTime, parentInput.nextElementSibling);

// Create input for MS
var parentInputMs = document.getElementById("showArrTime"); // Button comes after this element
var inputTimeMs = document.createElement("input");
inputTimeMs.setAttribute("id", "inputTimeMs");
inputTimeMs.setAttribute("type", "text");
inputTimeMs.setAttribute("value", "000");
inputTimeMs.setAttribute("style", "margin-top:10px; width:30px;font-size:15px;");
parentInputMs.appendChild(inputTimeMs, parentInputMs.nextElementSibling);

window.setArrTimeTr = document.createElement("tr");
window.setArrTimeTd = document.createElement("td");

btn.onclick = function() {
	"use strict";
	var delayTime = parseInt(localStorage.getItem("saveOffset"));
	var intervalTime = 10; // Set interval in ms
	console.log("delayTime: " + delayTime);

	// Add new table row for the set arrival time
	var arrTimeNow = document.getElementById("date_arrival");
	window.setArrTimeTr.appendChild(window.setArrTimeTd); // Append td to tr
	arrTimeNow.parentNode.parentNode.insertBefore(window.setArrTimeTr, arrTimeNow.parentNode[1]);
	window.setArrTimeTd.innerHTML = "You set the arrival time to: " + document.getElementById("inputTime").value + ":" + document.getElementById("inputTimeMs").value + ", offset is " + delayTime;
	window.setArrTimeTd.setAttribute("colspan", "2");
	window.setArrTimeTd.setAttribute("id", "setArrTime");
	
	var arrivalTime = document.getElementById("inputTime").value;
	var arrivalTimeMs = parseInt(document.getElementById("inputTimeMs").value);
	var totalDelay;
	if (arrivalTimeMs - delayTime <= 0) {
		totalDelay = arrivalTimeMs;
	} else {
		totalDelay = arrivalTimeMs - delayTime;
	}
	console.log("totalDelay: " + totalDelay);
    var a =	document.getElementById("troop_confirm_go")

	
	setInterval(function retime() {
	//	setInterval(function arrival() {
			window.arrival = document.getElementsByClassName("relative_time")[0].textContent;
	//	}, 10);
		if(window.arrival.slice(-8) === arrivalTime) {
            a.click();
			setTimeout(function() {
			}, totalDelay);
		}
	}, intervalTime);
};