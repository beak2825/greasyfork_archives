// ==UserScript==
// @name         NYT Search MAM
// @namespace    https://greasyfork.org/en/users/78880
// @version      0.2.5
// @description  Add "MAM" button to NYT best sellers list
// @author       Slengpung
// @match        https://www.nytimes.com/books/best-sellers/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/30844/NYT%20Search%20MAM.user.js
// @updateURL https://update.greasyfork.org/scripts/30844/NYT%20Search%20MAM.meta.js
// ==/UserScript==

window.addEventListener("load", Greasemonkey_main, false);

function Greasemonkey_main() {

    // Grab the books
    var lis = document.getElementsByClassName("css-1mr03gh");
    for (var i = 0; i < lis.length; ++i) {
	    // Get current book title
	    var title = lis[i].querySelector('[itemprop=name]').textContent;

	    // Create new button which searches MAM for the given title
	    var a = document.createElement("a");
	    a.href = "https://www.myanonamouse.net/tor/browse.php?tor[text]=" + encodeURIComponent(title);
	    a.target = "_new";
	    var mambutton = document.createElement("div");
	    var button = document.createElement("button");
	    var text = document.createTextNode("MAM");
	    button.appendChild(text);
	    button.className += "css-80zux2";
	    mambutton.appendChild(button);
	    mambutton.className += "css-79elbk";
	    a.appendChild(mambutton);

	    // Insert new button
	    lis[i].appendChild(a);

    }
}