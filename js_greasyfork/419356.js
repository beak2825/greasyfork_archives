// ==UserScript==
// @name        Starnieuws - AdBlock
// @namespace   AdBlocker for Starnieuws
// @match       *://*.starnieuws.com/*
// @grant       none
// @version     3.0
// @author      K.D.
// @description Removes ads on Starnieuws!
// @downloadURL https://update.greasyfork.org/scripts/419356/Starnieuws%20-%20AdBlock.user.js
// @updateURL https://update.greasyfork.org/scripts/419356/Starnieuws%20-%20AdBlock.meta.js
// ==/UserScript==

let style= document.createElement("style");
document.body.append(style);

style.innerHTML= `#topstory{
background-color: white;
background-image: none;
}

.overig_nieuws + .overig_nieuws,
#overig_nieuws ~ #overig_nieuws,
div[style="text-align: center"]:not(#header1),
div[style*="background-color : #FFFFFF"]{
display: none!important;
}`;