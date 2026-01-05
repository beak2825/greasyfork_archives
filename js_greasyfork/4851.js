// ==UserScript==
// @name          HIT Area Expander (with compact interface mod)
// @author        unknown + clickhappier
// @namespace     clickhappier
// @version       0.1c
// @description   Adds a button to change the height of the working area for the hit.
// @include       https://www.mturk.com/mturk/preview*
// @include       https://www.mturk.com/mturk/continue*
// @include       https://www.mturk.com/mturk/accept*
// @include       https://www.mturk.com/mturk/submit
// @include       https://www.mturk.com/mturk/return*
// @downloadURL https://update.greasyfork.org/scripts/4851/HIT%20Area%20Expander%20%28with%20compact%20interface%20mod%29.user.js
// @updateURL https://update.greasyfork.org/scripts/4851/HIT%20Area%20Expander%20%28with%20compact%20interface%20mod%29.meta.js
// ==/UserScript==

// modified by clickhappier to remove line break between input field and button,
// set input field size, and change button text from "Expand" to ">";
// all to make it fit on 1 line within the width of the 'Requester' cell

var Page_Status = document.forms[1].action;

insertButton();
changeHeight();

function insertAfter(referenceNode, newNode) {
    referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
}

function changeHeight() {
	var iframes = document.getElementsByTagName('iframe');
	var height = document.getElementById("new_size").value;
	for(var i = 0; i < iframes.length; i++) {
		iframes[i].height = height;
	}
}

function insertButton() {
	var firstElement = document.getElementById("requester.tooltip").parentNode;

	var button = document.createElement("div");
	button.innerHTML = 'New Height: <input type="number" name="new_size" id="new_size" value="1200" size="4"><button id="sizeChange" type="Button">&gt;</button>';
	button.setAttribute('id','buttonContainer');

	firstElement.appendChild(button);

	document.getElementById('sizeChange').addEventListener("click",changeHeight);
}