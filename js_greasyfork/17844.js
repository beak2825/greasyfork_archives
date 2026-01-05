// ==UserScript==
// @name        Post Count for IPB
// @namespace   G4JC
// @description Adds post numbers back to any forums running IPBv4+
// @include     http://*
// @include     https://*
// @version     1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/17844/Post%20Count%20for%20IPB.user.js
// @updateURL https://update.greasyfork.org/scripts/17844/Post%20Count%20for%20IPB.meta.js
// ==/UserScript==
var elements = document.getElementsByClassName('fa-share-alt');
var x = 1

//find posts by element
for (var i = 0; i < elements.length; i++) {
var thisElem = elements[i];
    //start a post counter, counting up from 1
    thisElem.innerHTML = " <b>#" + (x++) + "</b>";
}