// ==UserScript==
// @name        CSC WinLoss Usernames
// @namespace   cocksizecontest.com
// @description Show the usernames of people who have compared with you on cocksizecontest
// @include     https://www.cocksizecontest.com/wins-losses/
// @version     1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/28151/CSC%20WinLoss%20Usernames.user.js
// @updateURL https://update.greasyfork.org/scripts/28151/CSC%20WinLoss%20Usernames.meta.js
// ==/UserScript==

function csc_thumbs() {
  var thumbs = document.querySelectorAll(".cscResultsThumbs > a");
  thumbs.forEach(function(node) {
    var href = node.getAttribute('href');
    var splits = href.split('/');
    if (splits[splits.length-1].length < 1) {
      splits.length--;
    }
    var username = splits[splits.length-1];

    node.appendChild(document.createTextNode(username));
    node.style.float = 'left';
    node.style.minWidth = '10em';
  });
}
document.addEventListener("DOMContentLoaded", csc_thumbs);