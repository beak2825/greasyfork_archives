// ==UserScript==
// @name         Double Click to Like YouTube Comments
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  Double click on a comment to like. Double click again to remove like.
// @author       votqanh
// @match        *://*.youtube.com/*
// @require      http://ajax.googleapis.com/ajax/libs/jquery/2.1.0/jquery.min.js
// @require      https://greasyfork.org/scripts/5392-waitforkeyelements/code/WaitForKeyElements.js?version=19641
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/428744/Double%20Click%20to%20Like%20YouTube%20Comments.user.js
// @updateURL https://update.greasyfork.org/scripts/428744/Double%20Click%20to%20Like%20YouTube%20Comments.meta.js
// ==/UserScript==

(function() {
    'use strict';

    window.addEventListener('load', function() {
        var videoBox = "#comments";
        var notifBox = "ytd-comments.ytd-multi-page-menu-renderer"

        function preventHighlight(el) {
            waitForKeyElements(el, function(jNode) {
                jNode[0].addEventListener('mousedown', function(e) {
                    if (e.detail > 1 && e.target.id != "contenteditable-root") {
                        e.preventDefault();
                    }
                });
            });
        }

        preventHighlight(videoBox);
        preventHighlight(notifBox);


        var cmt = "ytd-comment-renderer#comment";
        var reply = "[is-reply]"

        function addDbl(el) {
            waitForKeyElements(el, function(jNode) {
                jNode[0].addEventListener('dblclick', function(e) {
                    if (e.target.id != "contenteditable-root") {
                        e.target.closest(el).querySelector("#like-button").click();
                    }
                });
            });
        }

        addDbl(cmt);
        addDbl(reply);
    });
})();