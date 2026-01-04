// ==UserScript==
// @name         Audible button to search ABB
// @namespace    https://greasyfork.org/en/users/225782
// @version      0.2
// @description  Adds "ABB" button to Audible
// @author       madnlooney
// @include      https://www.audible.co.uk/pd/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/374356/Audible%20button%20to%20search%20ABB.user.js
// @updateURL https://update.greasyfork.org/scripts/374356/Audible%20button%20to%20search%20ABB.meta.js
// ==/UserScript==

// Get current book title
var title = document.getElementsByTagName("h1")[0].innerHTML;

// Get author
var author = document.getElementsByClassName("authorLabel")[0].getElementsByTagName("a")[0].innerHTML;

// Create search-link for title
var li = document.createElement("li");
var a = document.createElement("a");
a.href = "http://audiobookbay.nl/?s=" + title;
a.target = "_new";
var text = document.createTextNode("[ Search on ABB: Title ]");
a.appendChild(text);
li.appendChild(a);


// Inject title-search on page
var list = document.getElementsByTagName("h1")[0].parentNode.parentNode; //ul
list.appendChild(li);