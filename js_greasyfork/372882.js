// ==UserScript==
// @name         Scroll to the bottom
// @namespace    -
// @version      0.2
// @description  Scroll to the bottom of the page
// @author       -
// @include      http://audiobookbay.nl/audio-books/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/372882/Scroll%20to%20the%20bottom.user.js
// @updateURL https://update.greasyfork.org/scripts/372882/Scroll%20to%20the%20bottom.meta.js
// ==/UserScript==

function gobottom() {
scroll(0, document.body.scrollHeight);
}

var li = document.createElement("li");
var a = document.createElement("a");
a.href = "javascript:void(0);";
a.addEventListener("click", gobottom, false);
var oImg = document.createElement("img");
oImg.setAttribute('src', 'https://cdn3.iconfinder.com/data/icons/line/36/arrow_down-512.png');
oImg.setAttribute('alt', 'na');
oImg.setAttribute('height', '20px');
oImg.setAttribute('width', '20px');
a.appendChild(oImg);
li.appendChild(a);

// Inject goodreads on page
list = document.getElementsByTagName("h1")[0];
list.appendChild(a);
