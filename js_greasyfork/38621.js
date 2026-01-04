// ==UserScript==
// @name           Spinics Fedora mailing lists URL fixer
// @version        1.1
// @namespace      spinics-fedora-url-fixer
// @author         Samuel Rakitničan
// @description    Fixes URLs pointing to Fedora mailing lists
// @include        https://*.spinics.net/lists/*
// @grant          none
// @downloadURL https://update.greasyfork.org/scripts/38621/Spinics%20Fedora%20mailing%20lists%20URL%20fixer.user.js
// @updateURL https://update.greasyfork.org/scripts/38621/Spinics%20Fedora%20mailing%20lists%20URL%20fixer.meta.js
// ==/UserScript==

var links = document.getElementsByTagName("a"); //array
var regex = /(https:\/\/lists\.fedoraproject\.org\/archives\/list\/[^.]+@)xxxxxxxxxxxxxxxxxxxxxxx/ig;
for (var i=0,imax=links.length; i<imax; i++) {
  links[i].href = links[i].href.replace(regex,"$1lists.fedoraproject.org");
  links[i].innerHTML = links[i].innerHTML.replace(regex,"$1lists.fedoraproject.org");
}