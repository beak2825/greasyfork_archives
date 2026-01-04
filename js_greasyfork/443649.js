// ==UserScript==
// @name         Search in forum
// @namespace    -
// @version      0.24.1
// @description  Add "forum search" button to ABB
// @author       -
// @match      https://audiobookbay.fi/abss/*
// @match      https://audiobookbay.li/abss/*
// @match      https://audiobookbay.lu/abss/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/443649/Search%20in%20forum.user.js
// @updateURL https://update.greasyfork.org/scripts/443649/Search%20in%20forum.meta.js
// ==/UserScript==

// Get current book title
var title = document.getElementsByTagName("h1")[0].innerHTML;
var tits = title.split('-'); 
var fin = tits[0].split(':');

// Create search-icon goodreads
var li = document.createElement("li");
var a = document.createElement("a");
a.href = "https://audiobookbay.lu/forum/search2/?search=" + '"' + fin[0] + '"';
a.target = "_new";
var oImg = document.createElement("img");
oImg.setAttribute('src', 'https://m.media-amazon.com/images/I/41gYkruZM2L.png');
oImg.setAttribute('alt', 'na');
oImg.setAttribute('height', '20px');
oImg.setAttribute('width', '20px');
a.appendChild(oImg);
li.appendChild(a);

// Inject goodreads on page
var list = document.getElementsByTagName("h1")[0];
list.appendChild(a);