// ==UserScript==
// @name         Goodreads Jackett Search
// @namespace    
// @version      0.311
// @description  Add "Search Jacket" button to Goodreads
// @author       
// @include      https://www.goodreads.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/369295/Goodreads%20Jackett%20Search.user.js
// @updateURL https://update.greasyfork.org/scripts/369295/Goodreads%20Jackett%20Search.meta.js
// ==/UserScript==
// copied from Slengpeung
console.log("[G+] Tweaking Goodreads...");

var page = window.location.pathname.split('/')[1];

if(page === 'book'){
	var bookTitle = getBookTitle(document.getElementById("bookTitle"));
    var bookAuthor = getBookAuthor(document.querySelector('.authorName span'));
	var jackettSearchUrl = "http://cnmain:9117/UI/Dashboard#search=" + bookAuthor + "&category=3000,3010,3020,3030,3040,3050";
  
	// Add 'Search Jackett' button
	var buttonBar = document.getElementById("buyButtonContainer");
	if (buttonBar === null || buttonBar == "null") {
		buttonBar = document.getElementById("asyncBuyButtonContainer");
	}
	var buttonUl  = buttonBar.getElementsByTagName("ul");
	var jackettButton = document.createElement("li");
	jackettButton.innerHTML = '<a id="jackettLink" href="' + jackettSearchUrl + '" target="_blank" class="buttonBar">Search Jackett(A)</a>';
	jackettButton.className = "Button";
	buttonUl[0].appendChild(jackettButton);
	console.log("[G+] 'Search Jackett' button added!");
}
/* else if(page === 'review'){
	/*var bookList = document.querySelectorAll('#booksBody .title div a');
	// Loop over all the books
	for(var i=0; i<bookList.length; i++){
		var jackettSearchUrl = "http://cnmain:9117/UI/Dashboard#search=" + getBookAuthor(bookList[i]) + "&category=3000,3010,3020,3030,3040,3050";
		// Add 'Search Jackett' button
		var newLink = document.createElement('a');
		var linkText = document.createTextNode('[Search Jackett(A)]');
		newLink.appendChild(linkText);
		newLink.setAttribute('href',jackettSearchUrl);
		newLink.setAttribute('style','color:#b3b3b3;font-style:italic');
		bookList[i].parentNode.parentNode.appendChild(newLink);
	}
	console.log("[G+] 'Search jackett' buttons added!");
} */

// Grab book title (and only title) from the element
function getBookTitle(el){
	var bookTitle = el.innerHTML.trim().split('<', 1)+'';
	console.log("Book title: " + bookTitle.trim());
	return bookTitle.trim();
}
//Grab author only
function getBookAuthor(el){
  var bookAuthor = el.innerHTML.trim().split('<',1)+'';
  console.log("Book Author:" + bookAuthor.trim());
  return bookAuthor.trim();
}
