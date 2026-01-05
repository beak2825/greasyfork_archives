// ==UserScript==
// @name         Trello Background
// @namespace    None
// @version      0.4
// @description  Automatically Sets Trello Background Image
// @author       Shakil Shahadat
// @include      https://trello.com/b/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/13436/Trello%20Background.user.js
// @updateURL https://update.greasyfork.org/scripts/13436/Trello%20Background.meta.js
// ==/UserScript==

function setBG ()
{
    if ( document.body.style.backgroundImage === '' ) document.body.style.backgroundImage = "url( 'http://wallpaper-gallery.net/images/nature-wallpaper/nature-wallpaper-11.jpg' )";
}

var trelloBG = setInterval( setBG, 1000 );