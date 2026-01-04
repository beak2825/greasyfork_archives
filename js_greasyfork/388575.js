// ==UserScript==
// @name        Twitter to Birdcries
// @author      @tux0r
// @namespace   birdcries.net
// @description Replaces all twitter.com status links (outside Twitter and birdcries) by birdcries.net links.
// @include     *
// @exclude     /^http(s|)://(www\.|)twitter\.com/.*$/
// @exclude     /^http(s|)://birdcries\.net/.*$/
// @version     1.1
// @downloadURL https://update.greasyfork.org/scripts/388575/Twitter%20to%20Birdcries.user.js
// @updateURL https://update.greasyfork.org/scripts/388575/Twitter%20to%20Birdcries.meta.js
// ==/UserScript==

var links = document.links;

for (var i = links.length-1; i >= 0; i--) {
  let link = links[i];
  link.href = link.href.replace(/(mobile.)?twitter.com\/([^/]+)\/status\//, "birdcries.net/$2/status/");
}