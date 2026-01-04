// ==UserScript==
// @name        Add an image to a web page
// @version     1.0
// @include     https://dragonbound.net/*
// @require     http://ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js
// @description testing
// @namespace https://greasyfork.org/users/19912
// @downloadURL https://update.greasyfork.org/scripts/431556/Add%20an%20image%20to%20a%20web%20page.user.js
// @updateURL https://update.greasyfork.org/scripts/431556/Add%20an%20image%20to%20a%20web%20page.meta.js
// ==/UserScript==

$("body").append (
    '<img id="myNewImage" src="https://i.postimg.cc/YCYKYGZs/ruler-gunbound.png">'
);
$("#myNewImage").css ( {
    position:   "fixed",
    width:      "",
    height:     "",
    top:        "",
    left:       "",
    margin:     "auto"
} );