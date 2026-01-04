// ==UserScript==
// @name       Nofollow Links - Red Dotted Border
// @namespace  https://www.gratissaker.com/
// @version    0.3
// @description  This script adds a red dotted border to all nofollow links on all URLs.
// @match      *://*/*
// @copyright  2017+, CodeNode - https://www.gratissaker.com/
// @license GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/35901/Nofollow%20Links%20-%20Red%20Dotted%20Border.user.js
// @updateURL https://update.greasyfork.org/scripts/35901/Nofollow%20Links%20-%20Red%20Dotted%20Border.meta.js
// ==/UserScript==

(function() {
  
    var links = document.getElementsByTagName("a");
  
    for (i = 0; i < links.length; i++) {
        var link = links[i];
        var rel = link.rel;

        if(rel.indexOf("nofollow") !== -1) {
            link.style["border"] = "dotted red";
            link.style["border-width"] = "1px 1px 1px 1px";
        }
    }
  
})();