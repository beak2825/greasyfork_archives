// ==UserScript==
// @name         Goodreads Overdrive Search
// @namespace    
// @version      0.21
// @description  Add "Search Overdrive" button to Goodreads
// @author       
// @include      https://www.goodreads.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/370865/Goodreads%20Overdrive%20Search.user.js
// @updateURL https://update.greasyfork.org/scripts/370865/Goodreads%20Overdrive%20Search.meta.js
// ==/UserScript==
// copied from Slengpeung
console.log("[G+] Tweaking Goodreads...");

var page = window.location.pathname.split('/')[1];

if(page === 'book'){
	var bookTitle = getBookTitle(document.getElementById("bookTitle"));
	var overdriveSearchUrl = "http://www.overdrive.com/search?q=" + bookTitle;

	// Add 'Search Overdrive' button
	var buttonBar = document.getElementById("buyButtonContainer");
	if (buttonBar === null || buttonBar == "null") {
		buttonBar = document.getElementById("asyncBuyButtonContainer");
	}
	var buttonUl  = buttonBar.getElementsByTagName("ul");
	var overdriveButton = document.createElement("li");
	overdriveButton.innerHTML = '<a id="overdriveLink" href="' + overdriveSearchUrl + '" target="_blank" class="buttonBar">Search Overdrive</a>';
	overdriveButton.className = "Button";
	buttonUl[0].appendChild(overdriveButton);
	console.log("[G+] 'Search OverDrive' button added!");
}/*else if(page === 'review'){
	var bookList = document.querySelectorAll('#booksBody .title div a');
	// Loop over all the books
	for(var i=0; i<bookList.length; i++){
		var overdriveSearchUrl = "http://www.overdrive.com/search?q=" + getBookTitle(bookList[i]);
		// Add 'Search Overdrive' button
		var newLink = document.createElement('a');
		var linkText = document.createTextNode('[Search Overdrive]');
		newLink.appendChild(linkText);
		newLink.setAttribute('href',overdriveSearchUrl);
		newLink.setAttribute('style','color:#b3b3b3;font-style:italic');
		bookList[i].parentNode.parentNode.appendChild(newLink);
	}
	console.log("[G+] 'Search OverDrive' buttons added!");
}*/

// Grab book title (and only title) from the element
function getBookTitle(el){
	var bookTitle = el.innerHTML.trim().split('<', 1)+'';
	console.log("Book title: " + bookTitle.trim());
	return bookTitle.trim();
}