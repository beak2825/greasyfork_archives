// ==UserScript==
// @name        Fix src of Flash content
// @namespace   https://greasyfork.org/users/19523
// @description Internet Archive
// @match       http://web.archive.org/web/*/*
// @match       https://web.archive.org/web/*/*
// @version     0.13
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/369561/Fix%20src%20of%20Flash%20content.user.js
// @updateURL https://update.greasyfork.org/scripts/369561/Fix%20src%20of%20Flash%20content.meta.js
// ==/UserScript==


(function () {
  var embeds = document.querySelectorAll('embed[src$=".swf"]');
  var i = 0;
  (function rewriteSrc(embed) {
    if (!embed) {
      return;
    }
    if (embed.src.match(/\/\d{14,}\//)) {
      embed.src = embed.src.replace(/(\/\d{14,})\//, '$1im_/');
    }
    setTimeout(function () { rewriteSrc(embeds[++i]) }, 500);
  })(embeds[i]);
})();
