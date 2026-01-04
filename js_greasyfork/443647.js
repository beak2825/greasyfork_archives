// ==UserScript==
// @name         ABB search on Goodreads and Audible
// @namespace    -
// @description  Add "Goodreads and Audible" buttons to ABB
// @author       -
// @match      http://audiobookbay.nl/abss/*
// @match      https://audiobookbay.fi/abss/*
// @match      https://audiobookbay.li/abss/*
// @match      https://audiobookbay.lu/abss/*
// @grant        none
// @version 0.0.24
// @downloadURL https://update.greasyfork.org/scripts/443647/ABB%20search%20on%20Goodreads%20and%20Audible.user.js
// @updateURL https://update.greasyfork.org/scripts/443647/ABB%20search%20on%20Goodreads%20and%20Audible.meta.js
// ==/UserScript==

// Get current book title
var title = document.getElementsByTagName("h1")[0].innerHTML;
var tits = title.split('-'); 
var fin = tits[0].split(':');

// Create search-icon goodreads
var li = document.createElement("li");
var a = document.createElement("a");
a.href = "https://www.goodreads.com/search?q=" + fin[0] + "%20" + tits[1];
a.target = "_new";
//var text = document.createTextNode(" [Goodreads]");
var oImg = document.createElement("img");
oImg.setAttribute('src', 'https://lh4.ggpht.com/Ksf60_xLEKF-d7WagctjCJObB51JXRgQGZrtRAFiZTkJ_zvt3ejRyaSrC6zcX3As0UM=w300');
oImg.setAttribute('alt', 'na');
oImg.setAttribute('height', '20px');
oImg.setAttribute('width', '20px');
var space = document.createTextNode(" ");
a.appendChild(space);
a.appendChild(oImg);
li.appendChild(a);

// Inject goodreads on page
var list = document.getElementsByTagName("h1")[0];
list.appendChild(a);

// Create search-icon audible
var li = document.createElement("li");
var a = document.createElement("a");
a.href = "https://www.audible.com/search/ref=a_hp_tseft?filterby=field-keywords&advsearchKeywords=" + fin[0] + "%20" + tits[1];
a.target = "_new";
var oImg = document.createElement("img");
oImg.setAttribute('src', 'https://assets.materialup.com/uploads/5ea9523a-fb01-48cc-9400-2d5cd9363a9d/0x0ss-85.jpg');
oImg.setAttribute('alt', 'na');
oImg.setAttribute('height', '20px');
oImg.setAttribute('width', '20px');
a.appendChild(oImg);
li.appendChild(a);

// Inject goodreads on page
list = document.getElementsByTagName("h1")[0];
list.appendChild(a);