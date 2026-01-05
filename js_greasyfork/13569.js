// ==UserScript==
// @name        BibSonomy BibTeX Link
// @namespace   notableTieView
// @description Insert a Link to the BibTeX of the publications shown in a publication list into the main menu. When a BibSonomy page contains a list of publications, a link is appended to the main menu. The link's target is the BibTeX mass export of all publications in the list.
// @include     http://www.bibsonomy.org/
// @include     http://www.bibsonomy.org/*
// @version     1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/13569/BibSonomy%20BibTeX%20Link.user.js
// @updateURL https://update.greasyfork.org/scripts/13569/BibSonomy%20BibTeX%20Link.meta.js
// ==/UserScript==

bibtexLink = $("#bibtexListExport");
if (bibtexLink.length!=0) {
  $("#bs-navbar-collapse ul").eq(0).append('<li class=""><a href="'.concat(bibtexLink.attr('href')).concat('">BibTeX</a></li>'));
}
