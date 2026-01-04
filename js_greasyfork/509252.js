// ==UserScript==
// @name         Audible search MAM
// @namespace    https://greasyfork.org/en/users/78880
// @version      0.8.2
// @description  Add "Search MAM" links to Audible
// @author       Slengpung
// @include      https://www.audible.tld/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/509252/Audible%20search%20MAM.user.js
// @updateURL https://update.greasyfork.org/scripts/509252/Audible%20search%20MAM.meta.js
// ==/UserScript==

// Get current book title and author
let title = document.getElementsByTagName("h1")[0].innerHTML;
let author = document.getElementsByClassName("authorLabel")[0].getElementsByTagName("a")[0].innerHTML;

// Create search-link for title and author
let atitle = document.createElement("a");
atitle.href = "https://www.myanonamouse.net/tor/browse.php?tor[text]=" + title;
let aauthor = document.createElement("a");
aauthor.href = "https://www.myanonamouse.net/tor/browse.php?tor[text]=" + title + "%20" + author;

// Style links
let aclasses = "bc-link bc-size-base bc-color-link";

// Inject after ratings
let categories = document.getElementsByClassName("authorLabel")[0];
let mam = categories.cloneNode(true);
mam.innerHTML = "Search MAM: <a class=\"" + aclasses + "\" href=\"" + atitle.href + "\" target=\"_new\">Title</a>" +
    "&nbsp;&nbsp;|&nbsp;&nbsp;<a class=\"" + aclasses + "\" href=\"" + aauthor.href + "\" target=\"_new\">Author + Title</a>";
let catparent = categories.parentElement;
let mamparent = catparent.cloneNode();
mamparent.appendChild(mam);
catparent.parentElement.appendChild(mamparent);
