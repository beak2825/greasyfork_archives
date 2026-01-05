// ==UserScript==
// @name            Expand Subreddit Header
// @version         0.5
// @description     Expand subreddit header on Reddit
// @author          Drazen Bjelovuk
// @match           *://www.reddit.com/*
// @grant           none
// @run-at          document-start
// @namespace       https://greasyfork.org/users/11679
// @contributionURL https://goo.gl/dYIygm
// @downloadURL https://update.greasyfork.org/scripts/12571/Expand%20Subreddit%20Header.user.js
// @updateURL https://update.greasyfork.org/scripts/12571/Expand%20Subreddit%20Header.meta.js
// ==/UserScript==

var css = document.createElement("style");
css.type = "text/css";
css.innerHTML = 
    "#sr-header-area .flat-list > li  { white-space: initial !important; } " + 
    "#sr-header-area .dropdown.srdrop { padding-left: 0 !important; }" +
    ".sr-list                         { display: inline !important; visibility: hidden; } " +
    "#sr-header-area                  { height: initial !important; } " +
    "#sr-header-area > .width-clip    { position: initial !important; padding-left: 5px !important; } " +
    "#sr-more-link                    { position: initial !important; } " +
    ".dropdown.srdrop                 { display: none !important; }";

document.head.appendChild(css);

document.addEventListener("DOMContentLoaded", function() {
    var list = document.querySelectorAll('.sr-list')[0].children[2];
    var subs = list.children;
    subs[0].innerHTML = '<span class="separator">-</span>' + subs[0].innerHTML;
    var sorted = Array.prototype.slice.call(subs).sort(function(a, b) {
        return a.lastChild.textContent.toLowerCase() > b.lastChild.textContent.toLowerCase() ? 1 : -1; 
    });

    var firstSeparator = sorted[0].getElementsByClassName('separator')[0];
    if (firstSeparator) firstSeparator.remove();

    sorted.forEach(function(node) {
        list.appendChild(node); 
    });
    list.parentNode.style.visibility = 'visible';
});