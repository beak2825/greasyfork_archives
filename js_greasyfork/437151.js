// ==UserScript==
// @name        Remove ScienceDirect spam links
// @description This script removes the annoying spam links (e.g., "Learn more about Micro-Organisms from ScienceDirect's AI-generated topic pages") which are scattered throughout all articles on the site.
// @version     1.0
// @grant       none
// @match       https://www.sciencedirect.com/*
// @namespace https://greasyfork.org/users/854147
// @downloadURL https://update.greasyfork.org/scripts/437151/Remove%20ScienceDirect%20spam%20links.user.js
// @updateURL https://update.greasyfork.org/scripts/437151/Remove%20ScienceDirect%20spam%20links.meta.js
// ==/UserScript==

(async function() {
    var x = document.getElementsByClassName("topic-link");
    while(x.length == 0) {
        x = document.getElementsByClassName("topic-link");
        await new Promise(r => setTimeout(r, 100));
    }
    while (x.length > 0) {
        replaceTag(x[0]);
    }
})();

function replaceTag(that) {
    var p = document.createElement('span');
    p.innerHTML = that.innerHTML;
    that.parentNode.replaceChild(p,that);
}
