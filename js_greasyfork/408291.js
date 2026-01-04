// ==UserScript==
// @name         Amazon search MAM DEV
// @namespace    https://greasyfork.org/en/users/78880
// @version      1.1.3
// @description  Add "Search MAM" button to Amazon
// @author       Slengpung
// @include      https://www.amazon.tld/*
// @include      https://smile.amazon.tld/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/408291/Amazon%20search%20MAM%20DEV.user.js
// @updateURL https://update.greasyfork.org/scripts/408291/Amazon%20search%20MAM%20DEV.meta.js
// ==/UserScript==

let ul;

// If this is a book, inject search-button
try {
	let tmm = document.getElementById("tmmSwatches");
	ul = tmm.getElementsByTagName("ul")[0];
	console.log("MAM plugin: Looks like a book! Injecting MAM box...");
}
catch(err) {
	console.log("MAM plugin: This does not look like a book, won't inject search button!");
	return;
}

// Grab title and author
let title = document.getElementById("title").getElementsByTagName("span")[0].innerHTML;
let author = "";
let spans = document.getElementsByTagName("span");
for (let i = 0, len = spans.length; i < len; i++) {
	if(spans[i].innerHTML === "(Author)") {
		author = spans[i-2].innerText;
	}
}

// Create search-box
let li = document.createElement("li");
li.className += "swatchElement unselected resizedSwatchElement";

// Create search for title
let span = document.createElement("span");
span.className += "a-spacing-mini format";
let a = document.createElement("a");
a.href = "https://www.myanonamouse.net/tor/browse.php?tor[srchIn][title]=true&tor[text]=" + title;
a.target = "_new";
let text = document.createTextNode("MAM: Title");
a.appendChild(text);
span.style.cssText += "background: #EDB91F; text-align: left; border: none";
span.appendChild(a);

// Create search for title + author
let aauth = document.createElement("a");
aauth.href = "https://www.myanonamouse.net/tor/browse.php?tor[text]=" + title + "%20" + author;
aauth.target = "_new";
let textauth = document.createTextNode("MAM: Title + Author");
aauth.appendChild(textauth);
let br = document.createElement("br");
span.appendChild(br);
span.appendChild(aauth);

li.style.cssText += "height: 50px; padding: 5px 10px; background: #EDB91F; color: black; min-width:150px; border:1px; border-color: gray";
li.appendChild(span);

// Inject title-search on page
ul.insertBefore(li, ul.childNodes[0]);