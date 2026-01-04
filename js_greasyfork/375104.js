// ==UserScript==
// @name Cinemagia IMDB Button
// @description Adds an imdb button on cinemagia movie pages that redirects you to the imdb page of that movie.
// @copyright 2018, George-Daniel Gagiu (https://danybv.eu)
// @license MIT; https://opensource.org/licenses/MIT
// @match *://www.cinemagia.ro/filme/*/
// @version 1.0.0
// @grant none
// @namespace https://greasyfork.org/users/36398
// @downloadURL https://update.greasyfork.org/scripts/375104/Cinemagia%20IMDB%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/375104/Cinemagia%20IMDB%20Button.meta.js
// ==/UserScript==

// ==OpenUserJS==
// @author DanyBv98
// ==/OpenUserJS==

function insertAfter(newNode, referenceNode)
{
    referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
}

function addImdbButton()
{
	var titleElement = document.querySelector('div.col_left h1.inline.pr2');
	if(titleElement === null) return false;
	
	var jsonData = JSON.parse(document.querySelector('script[type="application/ld+json"]').innerHTML);
	if(jsonData.sameAs === undefined) return false;
	
	const imdbImageHTML = '<img src="https://i.imgur.com/nQPsI9f.png" height="20">';
	var imdbLink = jsonData.sameAs;
	
	var imdbButton = document.createElement("a");
	imdbButton.href = imdbLink;
	imdbButton.innerHTML = imdbImageHTML;
	imdbButton.setStyle({float: "right"});
	insertAfter(imdbButton, titleElement);
	return true;
}

addImdbButton();