// ==UserScript==
// @name           Something Awful Single Post Link
// @namespace      http://www.mathemaniac.org
// @include        *://forum.somethingawful.com/showthread.php?*
// @include        *://forums.somethingawful.com/showthread.php?*
// @include        *://archives.somethingawful.com/showthread.php?*
// @description    To add a link to display that single post on each post.
// @version        1.0.3
// @downloadURL https://update.greasyfork.org/scripts/4596/Something%20Awful%20Single%20Post%20Link.user.js
// @updateURL https://update.greasyfork.org/scripts/4596/Something%20Awful%20Single%20Post%20Link.meta.js
// ==/UserScript==

// 2nd of August, 2011: Update the script to work with the "Mark as read" links enabled.

function insertAfter(newNode, node) {
  return node.parentNode.insertBefore(newNode, node.nextSibling);
}

var tds = document.getElementsByTagName('td');
for (var i = 0; i < tds.length; i++) {
    var curTD = tds[i];
    if (curTD.className == 'postdate') {
        var atag = curTD.getElementsByTagName('a');
        if (atag.length > 0) {
            var newA = document.createElement('a');
            newA.href="showthread.php?action=showpost&noseen=1&postid="+atag[1].getAttribute('href').replace(/[^0-9]*/,'');
            newA.appendChild(document.createTextNode("1"));
            insertAfter(newA, atag[1]);
            insertAfter(document.createTextNode(" "), atag[1]);
        }
    }
}
