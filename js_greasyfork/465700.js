// ==UserScript==
// @name        Add archive.org link - startpage.com
// @namespace   Violentmonkey Scripts
// @match       https://www.startpage.com/sp/search
// @grant       none
// @version     1.0
// @author      shouya
// @description Just show an "Archive" button beside the url that points to the archived version of the page.
// @license     WTFPL
// @downloadURL https://update.greasyfork.org/scripts/465700/Add%20archiveorg%20link%20-%20startpagecom.user.js
// @updateURL https://update.greasyfork.org/scripts/465700/Add%20archiveorg%20link%20-%20startpagecom.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var links = document.getElementsByClassName("w-gl__result-url");
    for (var i = 0; i < links.length; i++) {
        var link = links[i];
        var url = link.getAttribute("href");
        var archiveUrl = "https://web.archive.org/web/*/" + url;
        var archiveLink = document.createElement("a");
        archiveLink.setAttribute("href", archiveUrl);
        archiveLink.setAttribute("target", "_blank");
        archiveLink.setAttribute("style", "margin-left: 10px;");
        archiveLink.innerHTML = "Archive";
        link.parentNode.insertBefore(archiveLink, link.nextSibling);
    }
})();
