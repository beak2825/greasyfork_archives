// ==UserScript==
// @name        ~ Thread deleter ~
// @namespace   SecurityHub Project.
// @description Enhances your experience on HackForums! c:
// @include     *http://www.hackforums.net/*
// @version     1.0
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/10128/~%20Thread%20deleter%20~.user.js
// @updateURL https://update.greasyfork.org/scripts/10128/~%20Thread%20deleter%20~.meta.js
// ==/UserScript==

var titles = document.querySelectorAll(".subject_new, .subject_old")
var keywords = ["dox"];

for (var i = 0; i < titles.length; ++i) {
    for (var h = 0; h < keywords.length; ++h) {
        if (titles[i].innerHTML.toLowerCase().indexOf(keywords[h]) > -1){
            titles[i].parentNode.parentNode.parentNode.parentNode.style.display = 'none';
            break;
        }
    }
}