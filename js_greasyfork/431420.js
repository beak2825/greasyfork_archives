// ==UserScript==
// @name         Rewrite deceptive links in Google custom search engines
// @namespace    https://greasyfork.org/en/users/808835-xuv
// @version      0.1
// @license      Public domain
// @description  CSE links display as direct links until clicked, then they pass through a google.com redirect. This rewrites the link to be the displayed URL.
// @author       xuv
// @website      https://greasyfork.org/en/users/808835-xuv
// @match        *://*/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/431420/Rewrite%20deceptive%20links%20in%20Google%20custom%20search%20engines.user.js
// @updateURL https://update.greasyfork.org/scripts/431420/Rewrite%20deceptive%20links%20in%20Google%20custom%20search%20engines.meta.js
// ==/UserScript==

(function() {
    'use strict';

    addEventListener("load", function() {

        var links = document.getElementsByClassName("gs-title")
        for (var i=0;i<links.length;++i) {
            var ctOrig = links[i].getAttribute("data-ctorig")
            if (ctOrig) {
                links[i].setAttribute("href", ctOrig)
                links[i].removeAttribute("data-cturl")
            }
        }
    })
})();