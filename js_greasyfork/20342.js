// ==UserScript==
// @name          this is a test 02
// @description   test 02
// @include       https://www.mturk.com/mturk/preview*
// @include       https://www.mturk.com/mturk/continue*
// @include       https://www.mturk.com/mturk/accept*
// @include       https://www.mturk.com/mturk/submit
// @include       https://www.mturk.com/mturk/return*
// @version          kjhkjhlkhh
// @namespace  kjhkjhkjhj
// @downloadURL https://update.greasyfork.org/scripts/20342/this%20is%20a%20test%2002.user.js
// @updateURL https://update.greasyfork.org/scripts/20342/this%20is%20a%20test%2002.meta.js
// ==/UserScript==

var Hit = /accept/gi;
var Page_Status = document.forms[1].action;
if(Page_Status.search(Hit) != -1) {
	insertID(findID());
	insertID2(findID2());
	}

function insertAfter(referenceNode, newNode) {
    referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
}

function findID() {
	var inputfields = document.getElementsByTagName("INPUT");
	results = "";
	for(var i = 0;i < inputfields.length;i++) {
		//if(inputfields[i].name == "Requester") {
		if(inputfields[i].name == "requesterId") {
			results = inputfields[i].value;
			break;
		}
	}
	window.alert(results);
	return results;
	
	
}

function insertID(requesterID) {
	var Tcell = document.createElement("TD");
	var Tcell3 = document.createElement("TD");
	var firstElement = document.getElementById("requester.tooltip").parentNode;
	insertAfter(firstElement.parentNode,Tcell);
	insertAfter(Tcell, Tcell3);
	Tcell.innerHTML ="<b><p style=\"color:#369;\">&nbsp;RequesterID:&nbsp;&nbsp;</p></b>";
	Tcell3.innerHTML = "<p id=\"requester.tooltip\"> " + requesterID + "</p>";
}

	
function findID2() {
	var inputfields = document.getElementsByTagName("INPUT");
	results = "";
	for(var i = 0;i < inputfields.length;i++) {
		if(inputfields[i].name == "hitAutoAppDelayInSeconds") {
			results = inputfields[i].value;
			break;
		}
	}
	return results;
}

function insertID2(AutoAppTime) {
	var Tcell2 = document.createElement("TD");
	var Tcell4 = document.createElement("TD");
	var firstElement = document.getElementById("qualifications.tooltip").parentNode.parentNode;
	var Trow = firstElement.parentNode;
	Trow.insertBefore(Tcell2, firstElement);
	insertAfter(Tcell2, Tcell4);
	Tcell2.innerHTML="<b><p style=\"color:#369;\">Auto-Approval Time:&nbsp;&nbsp;</p></b>";
	Tcell4.innerHTML= Math.floor(AutoAppTime/86400) + " days " +(AutoAppTime - (Math.floor(AutoAppTime/86400) * 86400)) + " hours";
}