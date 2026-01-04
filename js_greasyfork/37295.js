// ==UserScript==
// @name         Amazon search ABB
// @namespace    -
// @version      -
// @description  Add "ABB" button to Amazon
// @author       original author Slengpung, edit amisima
// @include      https://www.amazon.*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/37295/Amazon%20search%20ABB.user.js
// @updateURL https://update.greasyfork.org/scripts/37295/Amazon%20search%20ABB.meta.js
// ==/UserScript==

// Get current book title
var title = document.getElementById("productTitle").innerHTML;
var tits = title.split(':'); 
var author = document.querySelector("a.a-link-normal.contributorNameID").innerHTML;

// Create search-link
var li = document.createElement("li");
var a = document.createElement("a");
a.href = "http://audiobookbay.nl/?s=" + tits[0] + "%20" + author;
a.target = "_new";
var text = document.createTextNode("[ Search on ABB ]");
a.appendChild(text);
li.appendChild(a);

// Inject text on page
var list = document.getElementById("formats");
list.appendChild(a);
