// ==UserScript==
// @name [PTP] Hide Seeding
// @description Hide seeding/snatched/etc torrents
// @match *://passthepopcorn.me/torrents.php*
// @match *://passthepopcorn.me/collages.php?*
// @grant none
// @version 0.2
// @namespace kannibalox
// @license WTFPL
// @downloadURL https://update.greasyfork.org/scripts/441153/%5BPTP%5D%20Hide%20Seeding.user.js
// @updateURL https://update.greasyfork.org/scripts/441153/%5BPTP%5D%20Hide%20Seeding.meta.js
// ==/UserScript==

// SETTINGS -- Uncomment/comment lines to enable/disable hiding
var config = [
  "seeding",
  "snatched",
  // "uploaded",
  // "downloaded",
  // "leeching",
]


function hide() {
  config.forEach(function(c, i) {
    document.querySelectorAll("a.torrent-info-link.torrent-info-link--user-" + c).forEach(function(el, i) {
      if (window.location.href.indexOf("collages.php") > -1) {
        var node = el.parentNode.parentNode;
        // Clear elems up
        var prev = node.previousElementSibling;
        while (prev !== null && !prev.matches('.group')) {
          prev.remove();
          prev = node.previousElementSibling;
        }
        if (node.previousElementSibling) {
          node.previousElementSibling.remove()
        }
        // Clear elems down
        var next = node.nextElementSibling;
        while (next !== null && !next.matches('.group')) {
          next.remove();
          next = node.nextElementSibling;
        }
        node.remove();
      } else {
        el.parentNode.parentNode.parentNode.parentNode.remove();
      }
    });
  });
}

if (document.readyState != 'loading') {
  hide();
} else {
  document.addEventListener('DOMContentLoaded', hide);
}
// This will actually cause it to fire twice on page change, but that seems acceptable.
Array.prototype.forEach.call(document.querySelectorAll('.js-pagination'), function(el, i){
    el.addEventListener('DOMSubtreeModified', hide);
});