// ==UserScript==
// @name        TwitterHideFollow
// @description just hide the numbers of your followers / followings on Twitter
// @namespace   http://tteeddii.starfree.jp/
// @include     /^https?://twitter\.com/[^/]+$/
// @version     1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/419246/TwitterHideFollow.user.js
// @updateURL https://update.greasyfork.org/scripts/419246/TwitterHideFollow.meta.js
// ==/UserScript==

new MutationObserver(function(m) {
    document.querySelectorAll("a[href$=\\/followers]").forEach(function (a) {
        a.parentNode.parentNode.style.visibility = "hidden";
    });
}).observe(document, {childList: true, subtree: true});