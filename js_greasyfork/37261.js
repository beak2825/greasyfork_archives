// ==UserScript==
// @name         Audible search ABB
// @namespace    -
// @version      -
// @description  Add "ABB" button to Audible
// @author       original author Slengpung, edit amisima
// @include      https://www.audible.*/pd/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/37261/Audible%20search%20ABB.user.js
// @updateURL https://update.greasyfork.org/scripts/37261/Audible%20search%20ABB.meta.js
// ==/UserScript==
var title = document.getElementsByTagName("h1")[0].innerHTML;
var tits = title.split(':'); 
var author = document.querySelector("li.bc-list-item.authorLabel").innerHTML;
var bla = author.split('>');
var bla1 = bla[1].split('<');

// Create search-link
var li = document.createElement("li");
var a = document.createElement("a");
a.href = "http://audiobookbay.nl/?s=" + tits[0] + "%20" + bla1[0];
a.target = "_new";
var text = document.createTextNode("[ Search on ABB ]");
a.appendChild(text);
li.appendChild(a);

// Inject text on page
var list = document.getElementsByTagName("h1")[0].parentNode.parentNode; //ul
list.appendChild(a);