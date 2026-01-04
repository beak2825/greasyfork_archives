// ==UserScript==
// @name       Purge Huffington Post from Yahoo News feed - 2020
// @version    1.0
// @namespace  ezChx
// @author	   ezChx
// @description  Eliminates Huffington Post Entries from Yahoo News list. Will run through iterative cycles to continue cleaning up the page as more are loaded. Based on original code by Edward.
// @include		 http*://*.yahoo.*/*
// @grant          unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/414553/Purge%20Huffington%20Post%20from%20Yahoo%20News%20feed%20-%202020.user.js
// @updateURL https://update.greasyfork.org/scripts/414553/Purge%20Huffington%20Post%20from%20Yahoo%20News%20feed%20-%202020.meta.js
// ==/UserScript==


setInterval(removeSpam, 2000);
function removeSpam() {

    var spanTags = document.querySelectorAll("[data-publisher-id='the_huffington_post_584']");

    var found;
    for (var i = 0; i < spanTags.length; i++) {
        found = spanTags[i];
        var parentBlock = getParent(getParent(getParent(getParent(found))));
        removeAllChildren(parentBlock);
    }
}

function getParent(o) {
    return o.parentNode;
}

function contains(a, obj) {
    var i = a.length;
    while (i--) {
       if (a[i] === obj) {
           return true;
       }
    }
    return false;
}

function removeAllChildren(o) {
	while (o.firstChild) {
        o.removeChild(o.firstChild);
    }
}
