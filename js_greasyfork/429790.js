// ==UserScript==
// @name         Substack User Block
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Hide spammers/trolls
// @author       Kronzky
// @match        *://*.substack.com/*
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/429790/Substack%20User%20Block.user.js
// @updateURL https://update.greasyfork.org/scripts/429790/Substack%20User%20Block.meta.js
// ==/UserScript==


let blockedNames = ["ForHimItWas", "e.pierce", "Boris Petrov", "Iconoclast"]; // Names to block (case-insensitive)
let minLikes = 2; // Show post anyway, if likes are above this minimum


let commentCount = 0
function hideStuff() {
    var comments = document.getElementsByTagName('table');
    if (comments.length==commentCount) {return};
    commentCount = comments.length;
    for (var comment of comments) {
        if (((comment.className.indexOf("comment-content"))!=-1) && ((comment.className.indexOf("CHECKED"))==-1)) {
            comment.className += " CHECKED";
            let commenterMeta = comment.getElementsByClassName('commenter-name')[0];
            if (commenterMeta.getElementsByTagName('a').length!=0) {
                let commenterName = commenterMeta.getElementsByTagName('a')[0].innerHTML;
                for (var blocked of blockedNames) {
                    if (blocked.toUpperCase() === commenterName.toUpperCase()) {
                        let commentBody = comment.getElementsByClassName('comment-body')[0];
                        let commentActions = comment.getElementsByClassName('comment-actions')[0];
                        if (commentActions.innerHTML.indexOf("Unhide")==-1) {
                            let likelink = commentActions.getElementsByTagName('a')[0].innerHTML;
                            let likes = Number(likelink.substr(likelink.lastIndexOf('>')+2));
                            if (likes<=minLikes) {
                                commentBody.style = "display:none";
                                commentActions.innerHTML += "<span><a href='#' onclick='unhide(this);return false'>Unhide</a></span>";
                            };
                        };
                        break;
                    };
                };
            };
        };
    };
};

window.unhide = function (elem) {
    elem.style = "display:none";
    elem.parentElement.parentElement.parentElement.getElementsByClassName('comment-body')[0].style = "display:block";
};

(function() {
    'use strict';
    hideStuff();
    window.addEventListener("scroll", hideStuff, false);
})();