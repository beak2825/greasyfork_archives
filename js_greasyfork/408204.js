// ==UserScript==
// @name         Audible search MAM DEV
// @namespace    https://greasyfork.org/en/users/78880
// @version      0.8.2
// @description  Add "Search MAM" links to Audible
// @author       Slengpung
// @include      https://www.audible.tld/pd/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/408204/Audible%20search%20MAM%20DEV.user.js
// @updateURL https://update.greasyfork.org/scripts/408204/Audible%20search%20MAM%20DEV.meta.js
// ==/UserScript==

// Get current book title and author
console.log("[MAM] Grabbing title and author...");
let title = document.getElementsByTagName("h1")[0].innerHTML;
let author = document.getElementsByClassName("authorLabel")[0].getElementsByTagName("a")[0].innerHTML;
console.log("[MAM] Got '" + title + "' and '" + author + "'");

// Create search-link for title and author
console.log("[MAM] Creating link-objects...");
let atitle = document.createElement("a");
atitle.href = "https://www.myanonamouse.net/tor/browse.php?tor[text]=" + title;
let aauthor = document.createElement("a");
aauthor.href = "https://www.myanonamouse.net/tor/browse.php?tor[text]=" + title + "%20" + author;
console.log("[MAM] Links created");

// Style links
console.log("[MAM] Creating classes");
let aclasses = "bc-link bc-size-base bc-color-link";
console.log("[MAM] Classes created");

// Inject after ratings
console.log("[MAM] Grabbing authorLabel...");
let categories = document.getElementsByClassName("authorLabel")[0];
console.log("[MAM] Got authorLabel");

console.log("[MAM] Cloning authorLabel...");
let mam = categories.cloneNode(true);
console.log("[MAM] authorLabel cloned");

console.log("[MAM] Replacing innerHTML...");
mam.innerHTML = "Search MAM: <a class=\"" + aclasses + "\" href=\"" + atitle.href + "\" target=\"_new\">Title</a>" +
    "&nbsp;&nbsp;|&nbsp;&nbsp;<a class=\"" + aclasses + "\" href=\"" + aauthor.href + "\" target=\"_new\">Author + Title</a>";
console.log("[MAM] innerHTML replaced");

console.log("[MAM] Grabbing parent...");
let catparent = categories.parentElement;
console.log("[MAM] Parent grabbed");

console.log("[MAM] Cloning parent...");
let mamparent = catparent.cloneNode();
console.log("[MAM] Parent cloned");

console.log("[MAM] Appending mam...");
mamparent.appendChild(mam);
catparent.parentElement.appendChild(mamparent);
console.log("[MAM] mam appended");
