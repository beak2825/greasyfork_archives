// ==UserScript==
// @name     Schlandhut
// @version  1.5
// @grant    none
// @description Ersetzt das rote X (Deppenkreuz) durch einen Schlandhut. Nur auf TWITTER DOT COM.
// @include http://twitter.com/*
// @include http://*.twitter.com/*
// @include https://twitter.com/*
// @include https://*.twitter.com/*
// @namespace https://greasyfork.org/users/207156
// @downloadURL https://update.greasyfork.org/scripts/371506/Schlandhut.user.js
// @updateURL https://update.greasyfork.org/scripts/371506/Schlandhut.meta.js
// ==/UserScript==

function escapeRegExp(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); // $& means the whole matched string
}

String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    return target.replace(new RegExp(search, 'g'), replacement);
};

search = escapeRegExp('https://abs.twimg.com/emoji/v2/72x72/274c.png');
replace = escapeRegExp('https://pbs.twimg.com/media/DlT_Ky4XgAYjsej.png');

document.body.innerHTML = document.body.innerHTML.replaceAll(search,replace);
