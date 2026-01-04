// ==UserScript==
// @name         Reddit Double Click to Upvote
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Doublick click on a Reddit post page to toggle upvote and downvote
// @author       dwbfox
// @match        https://www.reddit.com/r/*/comments/*
// @icon         https://www.google.com/s2/favicons?domain=reddit.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/433907/Reddit%20Double%20Click%20to%20Upvote.user.js
// @updateURL https://update.greasyfork.org/scripts/433907/Reddit%20Double%20Click%20to%20Upvote.meta.js
// ==/UserScript==
/*jshint esversion: 6 */
(function() {
    'use strict'
    let upvoted = false;
    let upvote = function () {
        document.querySelectorAll('.voteButton')[0].click()
    }
    let downvote = function() {
        document.querySelectorAll('.voteButton')[1].click()
    }

    function init() {
        document.querySelector('body').addEventListener('dblclick', function(e) {
            e.preventDefault();
            if (this.upvoted === false) {
                upvote();
                this.upvoted = true;
                return;
            }
            downvote();
            this.upvoted = false;

        });
    }
    window.onload = init;

})();