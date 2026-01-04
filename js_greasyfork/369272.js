// ==UserScript==
// @name         Goodreads Libgen Search
// @namespace    
// @version      0.23
// @description  Add "Search Libgen" button to Goodreads
// @author       
// @include      https://www.goodreads.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/369272/Goodreads%20Libgen%20Search.user.js
// @updateURL https://update.greasyfork.org/scripts/369272/Goodreads%20Libgen%20Search.meta.js
// ==/UserScript==
// copied from Slengpeung
console.log("[G+] Tweaking Goodreads...");

var page = window.location.pathname.split('/')[1];

if(page === 'book'){
	var bookTitle = getBookTitle(document.getElementById("bookTitle"));
	var libgenSearchUrl = "http://libgen.is/search.php?req=" + bookTitle;

	// Add 'Search Libgen' button
	var buttonBar = document.getElementById("buyButtonContainer");
	if (buttonBar === null || buttonBar == "null") {
		buttonBar = document.getElementById("asyncBuyButtonContainer");
	}
	var buttonUl = buttonBar.getElementsByTagName("ul");
	var libgenButton = document.createElement("li");
	libgenButton.innerHTML = '<a id="libgenLink" href="' + libgenSearchUrl + '" target="_blank" class="buttonBar">Search LibGen</a>';
	libgenButton.className = "Button";
	buttonUl[0].appendChild(libgenButton);
	console.log("[G+] 'Search LibGen' button added!");
}
/*else if(page === 'review'){
	var bookList = document.querySelectorAll('#booksBody .title div a');
	// Loop over all the books
	for(var i=0; i<bookList.length; i++){
		var libgenSearchUrl = "http://libgen.is/search.php?req=" + getBookTitle(bookList[i]);
		// Add 'Search LibGen' button
		var newLink = document.createElement('a');
		var linkText = document.createTextNode('[Search LibGen]');
		newLink.appendChild(linkText);
		newLink.setAttribute('href',libgenSearchUrl);
		newLink.setAttribute('style','color:#b3b3b3;font-style:italic');
		bookList[i].parentNode.parentNode.appendChild(newLink);
	}
	console.log("[G+] 'Search LibGen' buttons added!");
}*/

// Grab book title (and only title) from the element
function getBookTitle(el){
	var bookTitle = el.innerHTML.trim().split('<', 1)+'';
	console.log("Book title: " + bookTitle.trim());
	return bookTitle.trim();
}