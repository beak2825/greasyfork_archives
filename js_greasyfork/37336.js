// ==UserScript==
// @name         Goodreads with ABB
// @version      0.3
// @description  Add "Search ABB" button to Goodreads
// @author       original author Slengpung, edit by amisima
// @include      https://www.goodreads.com/*
// @grant        none
// @namespace https://greasyfork.org/users/166367
// @downloadURL https://update.greasyfork.org/scripts/37336/Goodreads%20with%20ABB.user.js
// @updateURL https://update.greasyfork.org/scripts/37336/Goodreads%20with%20ABB.meta.js
// ==/UserScript==

var page = window.location.pathname.split('/')[1];

if(page === 'book'){
	var bookTitle = getBookTitle(document.getElementById("bookTitle"));
  var fin = bookTitle.split(':');
  var author = document.getElementsByClassName("authorName")[0].innerHTML;
  var auth = author.split('>');
  var aut = auth[1].split('<');
  
	var abbSearchUrl = "http://audiobookbay.nl/?s=" + fin[0] + "%20" + aut[0];

	// Add 'Search ABB' button
	var buttonBar = document.getElementById("buyButtonContainer");
	if (buttonBar === null || buttonBar == "null") {
		buttonBar = document.getElementById("asyncBuyButtonContainer");
	}
	var buttonUl  = buttonBar.getElementsByTagName("ul");
	var abbButton = document.createElement("li");
	abbButton.innerHTML = '<a id="abbLink" href="' + abbSearchUrl + '" target="_blank" class="buttonBar">Search ABB</a>';
	abbButton.className = "Button";
	buttonUl[0].appendChild(abbButton);
}else if(page === 'review'){
	var bookList = document.querySelectorAll('#booksBody .title div a');
	// Loop over all the books
	for(var i=0; i<bookList.length; i++){
		var abbSearchUrl = "http://audiobookbay.nl/?s=" + getBookTitle(bookList[i]);
		// Add 'Search ABB' button
		var newLink = document.createElement('a');
		var linkText = document.createTextNode('[Search ABB]');
		newLink.appendChild(linkText);
		newLink.setAttribute('href',abbSearchUrl);
		newLink.setAttribute('style','color:#b3b3b3;font-style:italic');
		bookList[i].parentNode.parentNode.appendChild(newLink);
	}
}

// Grab book title (and only title) from the element
function getBookTitle(el){
	var bookTitle = el.innerHTML.trim().split('<', 1)+'';
	console.log("Book title: " + bookTitle.trim());
	return bookTitle.trim();
}