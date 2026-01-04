// ==UserScript==
// @name        Open Tags Links in New Tab for W3School
// @namespace   w3school_newtab
// @description This script opens tags links on www.w3school.com.cn in a new tab.
// @author      AustinL
// @include     https://www.w3school.com.cn/*
// @version     1.3
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/468379/Open%20Tags%20Links%20in%20New%20Tab%20for%20W3School.user.js
// @updateURL https://update.greasyfork.org/scripts/468379/Open%20Tags%20Links%20in%20New%20Tab%20for%20W3School.meta.js
// ==/UserScript==

(function() {
    function modifyLinks() {
        var anchors = document.getElementsByTagName("a");
        for (var i = 0; i < anchors.length; i++) {
            if (anchors[i].href.startsWith("https://www.w3school.com.cn/tags/")) {
                anchors[i].setAttribute("target", "_blank");
            }
        }
    }

    var observer = new MutationObserver(modifyLinks);
    observer.observe(document, { childList: true, subtree: true });

    modifyLinks();  // Handle existing links on the page
})();