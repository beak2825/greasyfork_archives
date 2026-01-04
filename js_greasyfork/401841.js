// ==UserScript==
// @name Set Arrival Time
// @description Set the desired arrival time in Tribal Wars and the script will automatically send the attack
// @author FunnyPocketBook
// @version 3.1
// @date 2018-05-20
// @namespace FunnyPocketBook
// @include https://*/game.php?village=*&screen=place&try=confirm
// @downloadURL https://update.greasyfork.org/scripts/401841/Set%20Arrival%20Time.user.js
// @updateURL https://update.greasyfork.org/scripts/401841/Set%20Arrival%20Time.meta.js
// ==/UserScript==

let inputMs;
let input;
let delay;
const showArrTimeTr = document.createElement("tr"); // Create button called btn as a link because any button causes the attack to launch
const showArrTimeTd = document.createElement("td");
const pEle = document.getElementById("troop_confirm_go"); // Button comes after this element
const btn = document.createElement("a"); // Create button called btn as a link because any button causes the attack to launch
btn.setAttribute("id", "arrTime"); // Set ID of btn
btn.setAttribute("class", "btn"); // Set ID of btn
btn.setAttribute("style", "cursor:pointer;"); // Set cursor to pointer
pEle.parentNode.insertBefore(btn, pEle.nextElementSibling); // Place btn after pEle
const t = document.createTextNode("Set arrival time"); // btn has this text
btn.appendChild(t); // Append text to btn

btn.onclick = function() {
	"use strict";
	let time = document.getElementsByClassName("relative_time")[0].textContent.slice(-8);
	let lalau = document.getElementById("date_arrival");
	input = prompt("Please enter desired arrival time", time);
	inputMs = parseInt(prompt("Please enter approximate milliseconds", "000"));
    delay = parseInt(delayTime) + parseInt(inputMs);
	showArrTimeTr.appendChild(showArrTimeTd);
	lalau.parentNode.parentNode.insertBefore(showArrTimeTr, lalau.parentNode[1]);
	showArrTimeTd.innerHTML = "Set arrival: ~" + input + ":" + inputMs;
	showArrTimeTd.setAttribute("colspan", "2");
	showArrTimeTd.setAttribute("id", "showArrTime");
};

let delayTime = parseInt(localStorage.delayTime);
if(delayTime == null) {
    delayTime = 0;
    localStorage.delayTime = JSON.stringify(delayTime);
}

// Create okay button to save delay
const delayTr = document.createElement("tr");
const delayTd1 = document.createElement("td");
const delayTd2 = document.createElement("td");
const parent1 = document.querySelector("#date_arrival"); // Cell of relative_time
delayTr.appendChild(delayTd1);
delayTr.appendChild(delayTd2);
parent1.parentNode.parentNode.insertBefore(delayTr, parent1.parentNode[1]); // Insert tablerow as last cell
delayTd1.innerHTML = "Offset";
delayTd2.innerHTML = "<input id = 'delayInput' value = " + delayTime + " style = 'width: 50%'></input> <a id = 'delayButton' class = 'btn'>OK</a>";

//debugger;
$("#delayButton").click(function() {
    delayTime = parseInt($("#delayInput").val());
    localStorage.delayTime =  JSON.stringify(delayTime);
    delay = parseInt(delayTime) + parseInt(inputMs); // setTimeout time
    if(delay < 0) {
        delay = 0;
    }
})

let arrival;
setInterval(function retime() {
	"use strict";
	arrival = document.getElementsByClassName("relative_time")[0].textContent;
	if(arrival.slice(-8) === input) {
		setTimeout(function() {document.getElementById("troop_confirm_go").click();}, delay);
	}
}, 1);