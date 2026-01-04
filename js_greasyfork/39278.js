// ==UserScript==
// @name         New Userscript
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://gradebook.myvolusiaschools.org/Volusia/Gradebook/InternetViewer/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/39278/New%20Userscript.user.js
// @updateURL https://update.greasyfork.org/scripts/39278/New%20Userscript.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...

    var logos = document.getElementsByClassName("media-object person-photo img-rounded");

for( var i = 0; i < logos.length; i++ )
{
    // true for all img tags with the fb_logo class name
    if( logos[ i ].tagName == "IMG" )
    {
        logos[ i ].src = "https://serving.photos.photobox.com/15690730e9f2869b4529343c820a4d0e277356657d826fca51d5d99b96fed273ca7e8b0e.jpg";
    }
}
})();