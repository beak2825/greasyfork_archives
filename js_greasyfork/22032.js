// ==UserScript==
// @name        No more Fox/Newsmax on Yahoo News
// @namespace   bbstats
// @version     8
// @author      edward
// @description Remove Fox and Newsmax from Yahoo News feed.  Variation on another script by Edward.
// @include		 http*://*.yahoo.*/*
// @grant          unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/22032/No%20more%20FoxNewsmax%20on%20Yahoo%20News.user.js
// @updateURL https://update.greasyfork.org/scripts/22032/No%20more%20FoxNewsmax%20on%20Yahoo%20News.meta.js
// ==/UserScript==
setInterval(removeSpam, 2000);
function removeSpam() {
var spanTags = document.getElementsByTagName('span');
var spamNames = ['Fox News Insider','Fox News', 'Fox Nation', 'FOX News Videos', 'Fox Business Videos', 'Newsmax', 'CNS News', 'The Federalist', 'The New York Observer', 'New York Post'];
var found;
for (var i = 0; i < spanTags.length; i++) {
  if (contains(spamNames, spanTags[i].textContent)) {
    console.log("blocking " + spanTags[i].textContent)
    found = spanTags[i];
    parentBlock = getParent(getParent(getParent(getParent(getParent(found)))));
    removeAllChildren(parentBlock);
  }
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