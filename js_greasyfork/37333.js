// ==UserScript==
// @name         NYT Search ABB
// @namespace    -
// @version      0.1
// @description  Add "ABB" button to NYT best sellers list
// @author       original author Slengpung, edit amisima
// @include      https://www.nytimes.com/books/best-sellers/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/37333/NYT%20Search%20ABB.user.js
// @updateURL https://update.greasyfork.org/scripts/37333/NYT%20Search%20ABB.meta.js
// ==/UserScript==

// Grab the books
var uls = document.getElementsByClassName("action-menu");
for (var i = 0; i < uls.length; ++i) {
	// Get current book title
	var buybutton = uls[i].getElementsByClassName("buy-button");
	var title = buybutton[0].getAttribute("data-title").toLowerCase();
	
	// Create new button which searches ABB for the given title
	var ul = uls[i];
	var li = document.createElement("li");
	var a = document.createElement("a");
	a.href = "http://audiobookbay.nl/?s=" + title;
	a.target = "_new";
	var button = document.createElement("button");
	var text = document.createTextNode("ABB");
	button.appendChild(text);
	button.className += "button";
	
	// Style the button
	button.style.width = '60px';
	button.style.fontSize = '14px';
	button.style.lineHeight = '14px';
	button.style.borderColor = '#326891';
	button.style.color = '#326891';
	button.style.transition = 'none';
	
	// Inject button on page
	a.appendChild(button);
	li.appendChild(a);
	ul.appendChild(li);
	
}