// ==UserScript==
// @name XKCD Title
// @namespace http://jellefresen.nl/XKCD
// @description Adds the very important title of the XKCD Strips below the picture.
// @include http://xkcd.com/*
// @include http://www.xkcd.com/*
// @exclude http://xkcd.com/archive
// @exclude http://www.xkcd.com/archive
// @exclude http://xkcd.com/store
// @exclude http://www.xkcd.com/store
// @exclude http://xkcd.com/about
// @exclude http://www.xkcd.com/about
// @version 0.0.1.20140829170814
// @downloadURL https://update.greasyfork.org/scripts/3030/XKCD%20Title.user.js
// @updateURL https://update.greasyfork.org/scripts/3030/XKCD%20Title.meta.js
// ==/UserScript==

var image = document.getElementById("comic").getElementsByTagName('img')[0];

// create a div
var title_text = document.createElement("div");
title_text.setAttribute('style', 'margin: auto; width:70%; font-size:small; font-style:italic');

// apply a bold "Title: "
var title_header = document.createElement("b");
var title_header_content = document.createTextNode("Title: ");
title_header.appendChild(title_header_content);
title_text.appendChild(title_header);

// add the Title text
var title_content = document.createTextNode(image.title);
title_text.appendChild(title_content);

// Throw it after the big picture
var root = image.parentNode;
var next = image.nextSibling;
root.insertBefore(document.createElement("br"), next);
root.insertBefore(title_text, next);
root.removeChild(next);

//.user.js
