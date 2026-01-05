// ==UserScript==
// @name        ~ Thread Deleter ~
// @namespace   SecurityHub Project
// @description Enhances your experience on Hack Forums! c:
// @include     *http://www.hackforums.net/*
// @version     1.0
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/10129/~%20Thread%20Deleter%20~.user.js
// @updateURL https://update.greasyfork.org/scripts/10129/~%20Thread%20Deleter%20~.meta.js
// ==/UserScript==

var titles = document.querySelectorAll(".subject_new, .subject_old")
var keywords = [];

for (var i = 0; i < titles.length; ++i) {
    for (var t = 0; t < keywords.length; ++t) {
        if (titles[i].innerHTML.toLowerCase().indexOf(keywords[t]) > -1) {
            titles[i].parentNode.parentNode.parentNode.parentNode.style.display = 'none';
            break;
        }
    }
}