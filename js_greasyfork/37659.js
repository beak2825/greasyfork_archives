// ==UserScript==
// @name         search in forum
// @namespace    -
// @version      0.3
// @description  Add "forum search" button to ABB
// @author       -
// @include      http://audiobookbay.nl/audio-books/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/37659/search%20in%20forum.user.js
// @updateURL https://update.greasyfork.org/scripts/37659/search%20in%20forum.meta.js
// ==/UserScript==

// Get current book title
var title = document.getElementsByTagName("h1")[0].innerHTML;
var tits = title.split('-'); 
var fin = tits[0].split(':');

// Create search-icon goodreads
var li = document.createElement("li");
var a = document.createElement("a");
a.href = "http://audiobookbay.nl/forum/search2/?search=" + '"' + fin[0] + '"';
a.target = "_new";
var oImg = document.createElement("img");
oImg.setAttribute('src', 'http://www.primevil.co.uk/wp-content/uploads/2016/08/forum_icon1.png');
oImg.setAttribute('alt', 'na');
oImg.setAttribute('height', '20px');
oImg.setAttribute('width', '20px');
a.appendChild(oImg);
li.appendChild(a);

// Inject goodreads on page
var list = document.getElementsByTagName("h1")[0];
list.appendChild(a);