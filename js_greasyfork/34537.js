// ==UserScript==
// @name         Duolingo Auto-Follow Fix
// @namespace    mog86uk-duo-autofollowfix
// @version      2.01
// @description  Fixing the things Duo breaks. Auto-follow discussions upon posting either a comment or a reply. (Works for sentence discussions too.)
// @author       mog86uk (aka. testmoogle)
// @match        https://www.duolingo.com/comment/*
// @match        https://www.duolingo.com/topic/*
// @match        https://www.duolingo.com/discussion
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/34537/Duolingo%20Auto-Follow%20Fix.user.js
// @updateURL https://update.greasyfork.org/scripts/34537/Duolingo%20Auto-Follow%20Fix.meta.js
// ==/UserScript==

(function() {
    'use strict';
    document.addEventListener('click', function(evt) {
        var el = evt.target;
        var followButtonNotClicked = document.querySelector('button#watch:not(.checkmark)');
        if (followButtonNotClicked !== null) {
            if (el.nodeName === 'BUTTON' && (el.id === 'post-reply' || el.id === 'post-comment')) {
                followButtonNotClicked.click();
            }
        }
    }, true);
})();