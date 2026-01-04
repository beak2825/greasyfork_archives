// ==UserScript==
// @name         Remove LeetCode share and subscribe hints and buttons
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  nake page clean
// @author       IskandarMa
// @include      http*//*leetcode.com*

// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/370435/Remove%20LeetCode%20share%20and%20subscribe%20hints%20and%20buttons.user.js
// @updateURL https://update.greasyfork.org/scripts/370435/Remove%20LeetCode%20share%20and%20subscribe%20hints%20and%20buttons.meta.js
// ==/UserScript==
document.addEventListener("keydown", function(e) {
    if (e.keyCode == 83 && (navigator.platform.match("Mac") ? e.metaKey : e.ctrlKey)) {
        e.preventDefault();
    }
}, false);
function removeVote() {
    var div = document.getElementById('interviewed-div');
    if (div) {
        div.style.display = "none";
    }
    var prem = document.getElementsByClassName("list-item-tags");
    if (prem) {
        prem.item(0).style.display = "none";
    }
    var share = document.getElementById('question-detail-share-buttons');
    if (share) {
        share.style.display = "none";
    }
    var subscribe = document.getElementsByClassName('subscribe-btn hidden-sm');
    if (subscribe) {
        subscribe.item(0).style.display = "none";
    }
    setTimeout(removeVote, 2000);
}
setTimeout(removeVote, 2000);