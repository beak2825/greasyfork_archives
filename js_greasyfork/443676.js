// ==UserScript==
// @name         Audible search Goodreads
// @namespace    -
// @version      -
// @description  Add "Goodreads" button to Audible
// @author       -
// @include      https://www.audible.*/pd/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/443676/Audible%20search%20Goodreads.user.js
// @updateURL https://update.greasyfork.org/scripts/443676/Audible%20search%20Goodreads.meta.js
// ==/UserScript==
var title = document.getElementsByTagName("h1")[0].innerHTML;
var tits = title.split(':'); 
var author = document.querySelector("li.bc-list-item.authorLabel").innerHTML;
var bla = author.split('>');
var bla1 = bla[1].split('<');

// Create search-link
var li = document.createElement("li");
var a = document.createElement("a");
a.href = "https://www.goodreads.com/search?q=" + tits[0] + "%20" + bla1[0];
a.target = "_new";
var text = document.createTextNode("[ Search on Goodreads ]");
a.appendChild(text);
li.appendChild(a);

// Inject text on page
var list = document.getElementsByTagName("h1")[0].parentNode.parentNode; //ul
list.appendChild(a);