// ==UserScript==
// @name         Amazon search Audible
// @namespace    -
// @version      0.2
// @description  Add "Audible" button to Amazon
// @author       original author Slengpung, edit amisima
// @include      https://www.amazon.*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/443675/Amazon%20search%20Audible.user.js
// @updateURL https://update.greasyfork.org/scripts/443675/Amazon%20search%20Audible.meta.js
// ==/UserScript==

// Get current book title
var title = document.getElementById("productTitle").innerHTML;
var tits = title.split(':'); 
var author = document.querySelector("a.a-link-normal.contributorNameID").innerHTML;

// Create search-link
var li = document.createElement("li");
var a = document.createElement("a");
a.href = "https://www.audible.com/search/ref=a_hp_tseft?filterby=field-keywords&advsearchKeywords=" + tits[0] + "%20" + author;
a.target = "_new";
var text = document.createTextNode("[ Search on Audible ]");
a.appendChild(text);
li.appendChild(a);

// Inject text on page
var list = document.getElementById("formats");
list.appendChild(a);
