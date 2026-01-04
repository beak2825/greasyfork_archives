// ==UserScript==
// @name Opendoor - Categorize Home Kitchen Islands - 0.02
// @description I'm so fancy.
// @version 2.7
// @author DCI
// @namespace www.redpandanetework.org
// @icon http://i.imgur.com/ZITD8b1.jpg
// @include https://www.mturkcontent.com/*&Opendoor*
// @groupId 301G7MYOAJAS0VP0OTG8UBRZ1EQ35C
// @auto_approve 30 days
// @timer 24 hours
// @require http://code.jquery.com/jquery-latest.min.js
// @quals Categorization Masters has been granted
// @frameurl https://www.mturkcontent.com/dynamic/hit?assignmentId=ASSIGNMENT_ID_NOT_AVAILABLE&hitId=3W5PY7V3UPKZIX3YKB3IAWLXCY8JYV&OpendoorCategorizeHomeKitchenIslands0.02
// @grant GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/32182/Opendoor%20-%20Categorize%20Home%20Kitchen%20Islands%20-%20002.user.js
// @updateURL https://update.greasyfork.org/scripts/32182/Opendoor%20-%20Categorize%20Home%20Kitchen%20Islands%20-%20002.meta.js
// ==/UserScript==

$("br").hide();

var form = $("<form>");

var div = $("<div>")
		.css('position', "fixed")
		.css('right', "25%")
		.css('top', "0px")		
		.css('padding', "3px")
		.css('background-color', "rgba(160,215,255,0.75)")
		.css('border', "1px solid rgba(130,200,220,0.75)")
		.css('border-width', "1px 0 0 1px")
		.css('border-radius', "2px 0 0 0")
		.css('font', "11pt sans-serif")

$("p", div).css('text-align', "right").css('display', "inline");
$("input", div).css('background-color', "rgba(255,255,255,0.65)").css('border', "1px solid #ddd");

var radio1 = document.querySelectorAll("input[name='question_input']")[0];
var clone1 = document.createElement("input");
clone1.type = "radio";
clone1.id = "clone1";
clone1.name = "clones";
var clone1Text = document.createTextNode("(A) " + radio1.nextSibling.textContent);
clone1.addEventListener("click", function(e){radio1.click()});
radio1.addEventListener("click", function(e){clone1.click()});

var radio2 = document.querySelectorAll("input[name='question_input']")[1];
var clone2 = document.createElement("input");
clone2.type = "radio";
clone2.id = "clone2";
clone2.style.marginLeft = "50px";
clone2.name = "clones";
var clone2Text = document.createTextNode("(S) " + radio2.nextSibling.textContent);
clone2.addEventListener("click", function(e){radio2.click()});
radio2.addEventListener("click", function(e){clone2.click()});

var radio3 = document.querySelectorAll("input[name='question_input']")[2];
var clone3 = document.createElement("input");
clone3.type = "radio";
clone3.id = "clone3";
clone3.style.marginLeft = "50px";
clone3.name = "clones";
var clone3Text = document.createTextNode("(D) " + radio3.nextSibling.textContent);
clone3.addEventListener("click", function(e){radio3.click()});
radio3.addEventListener("click", function(e){clone3.click()});

var radio4 = document.querySelectorAll("input[name='question_input']")[3];
var clone4 = document.createElement("input");
clone4.type = "radio";
clone4.id = "clone4";
clone4.style.marginLeft = "50px";
clone4.name = "clones";
var clone4Text = document.createTextNode("(F) " + radio4.nextSibling.textContent);
clone4.addEventListener("click", function(e){radio4.click()});
radio4.addEventListener("click", function(e){clone4.click()});

div.append(clone1);
div.append(clone1Text);
div.append(clone2);
div.append(clone2Text);
div.append(clone3);
div.append(clone3Text);
div.append(clone4);
div.append(clone4Text);
form.append(div);
$("body").append(form);

document.addEventListener( "keydown", function(e){
	if ( e.keyCode == 65 ) { //A
		var radio1 = document.querySelectorAll("input[name='question_input']")[0].click();
		GM_setClipboard("switch tab");
		setTimeout(function(){document.getElementById('submitButton').click();},0000);
	}
	if ( e.keyCode == 83 ) { //S
		var radio1 = document.querySelectorAll("input[name='question_input']")[1].click();
		GM_setClipboard("switch tab");
		setTimeout(function(){document.getElementById('submitButton').click();},0000);
	}
	if ( e.keyCode == 68 ) { //D
		var radio1 = document.querySelectorAll("input[name='question_input']")[2].click();
		GM_setClipboard("switch tab");
		setTimeout(function(){document.getElementById('submitButton').click();},0000);
	}
	if ( e.keyCode == 70 ) { //F
		var radio1 = document.querySelectorAll("input[name='question_input']")[3].click();
		GM_setClipboard("switch tab");
		setTimeout(function(){document.getElementById('submitButton').click();},0000);
	}
});





