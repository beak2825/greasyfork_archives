// ==UserScript==
// @name        search mobilsm from audible
// @namespace 
 // @license MIT
// @version      1.0
// @description  Audible Search Mobilism
// @author       Cerinawithasea
// @match        https://www.audible.com/pd/*
// @downloadURL https://update.greasyfork.org/scripts/485658/search%20mobilsm%20from%20audible.user.js
// @updateURL https://update.greasyfork.org/scripts/485658/search%20mobilsm%20from%20audible.meta.js
// ==/UserScript==

// Get current book title and author
let title = document.getElementsByTagName("h1")[0].innerHTML;
let author = document.getElementsByClassName("authorLabel")[0].getElementsByTagName("a")[0].innerHTML;

// Create search-link for title and author
let atitle = document.createElement("a");
atitle.href = "https://forum.mobilism.org/search.php?keywords=" + title;
let aauthor = document.createElement("a");
aauthor.href = "https://forum.mobilism.org/search.php?keywords=" + title + "%20" + author;

// Style links
let aclasses = "bc-link bc-size-base bc-color-link";

// Inject after ratings
let categories = document.getElementsByClassName("authorLabel")[0];
let mam = categories.cloneNode(true);
mam.innerHTML = "Search mobilism: <a class=\"" + aclasses + "\" href=\"" + atitle.href + "\" target=\"_new\">Title</a>" +
    "&nbsp;&nbsp;|&nbsp;&nbsp;<a class=\"" + aclasses + "\" href=\"" + aauthor.href + "\" target=\"_new\">Author + Title</a>";
let catparent = categories.parentElement;
let mamparent = catparent.cloneNode();
mamparent.appendChild(mam);
catparent.parentElement.appendChild(mamparent);

(function() {
    'use strict';

    // Your code here...
})();