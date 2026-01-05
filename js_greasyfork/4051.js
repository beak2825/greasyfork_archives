// ==UserScript==
// @name		  PureLink
// @namespace	  https://greasyfork.org/users/4390-seriousm
// @description   Removes any redirect links and use the destination url.
// @match      http://*/*
// @version    0.2
// @downloadURL https://update.greasyfork.org/scripts/4051/PureLink.user.js
// @updateURL https://update.greasyfork.org/scripts/4051/PureLink.meta.js
// ==/UserScript==

var links = document.getElementsByTagName("a");
var links = document.links;

for (var i = 0; i < links.length; i++) {
    var link = links[i];

    var linkString = link.toString();
    var indexOf = linkString.toLowerCase().indexOf('http://', 6);

    if (indexOf > 6) {
        link.href = linkString.substring(indexOf);
    }
}