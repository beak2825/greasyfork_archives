// ==UserScript==
// @name         MetaFilter comments sorter
// @version      1.1
// @description  Sort MetaFilter comments by favourites count
// @author       Dot
// @require      https://cdnjs.cloudflare.com/ajax/libs/babel-standalone/6.18.2/babel.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/babel-polyfill/6.16.0/polyfill.js
// @match        https://*.metafilter.com/*
// @namespace https://greasyfork.org/users/125127
// @downloadURL https://update.greasyfork.org/scripts/29857/MetaFilter%20comments%20sorter.user.js
// @updateURL https://update.greasyfork.org/scripts/29857/MetaFilter%20comments%20sorter.meta.js
// ==/UserScript==

/* jshint esversion: 6 */

function insertFragment(elem, frag) {
	elem.parentNode.insertBefore(frag, elem.nextSibling);
}

function sortByFavourites(a, b) {
	let getFavourites = 'a[href*="/favorited"]';

	var a_text = a.querySelector(getFavourites),
		b_text = b.querySelector(getFavourites),
		a_favourites = extractFavourites(a_text),
		b_favourites = extractFavourites(b_text);

	return a_favourites > b_favourites ? -1 : 1;
}

function extractFavourites(anchor) {
	if (anchor === null) { return 0; }

	let favourite = anchor.text.split(" ")[0];
	if (isNumber(favourite)) { return Number(favourite); }
	else { return 0 }
}

function isNumber(num) {
	return !isNaN(num);
}

function cleanCSS() {
	var style = document.createElement('style');
	style.type = 'text/css';
	style.innerHTML = `.dot-favourites body.fixed-header-visible a[name] { padding-top: 0; }
						.dot-favourites div.content { margin-bottom: 50px; }
						.dot-favourites div.comments { padding-top: 45px; } 
						.dot-favourites a[name] + br { display: none; } 
						.dot-favourites a[name] + br + br { display: none; }
						.sortButton { 
							background-color: #88C2D8; 
							color: #FFFFFF; 
							display: block; 
							float: left; 
							font-size: 17px; 
							height: 30px; 
							width: 150px; }
						button[disabled] { background-color: #E6E6E6; }
						button { 
							border:none;
						    background-image:none;
						    background-color:transparent;
						    -webkit-box-shadow: none;
						    -moz-box-shadow: none;
						    box-shadow: none; } `;
	document.querySelector('head').appendChild(style);
}

function createButton() {
	var parent = document.querySelector('#threadside');
	var button = document.createElement('button');
	button.innerHTML = "Sort by favourites";
	button.className = "sortButton";
	button.addEventListener('click', initSort);

	insertFragment(parent, button);
}

function initSort(event) {
	var body = document.querySelector('body');
	var comments = body.querySelectorAll('a + div.comments, .dot-comment'); 
	var sorted = [].slice.call(comments).sort(sortByFavourites);
	var fragment = document.createDocumentFragment();
	let fpp = body.querySelector('h1.posttitle + div.copy');

	sorted.forEach(comment => {
		if (!comment.classList.contains('dot-comment')) {
    		comment.classList.add('dot-comment');
		}
		fragment.appendChild(comment);
	});

	insertFragment(fpp, fragment);
	body.classList.add('dot-favourites');

	// event.target.disabled = true;
}

function init() {
	cleanCSS()
	createButton()
}

init();