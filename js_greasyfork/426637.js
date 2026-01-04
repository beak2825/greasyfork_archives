// ==UserScript==
// @name         Reddit Comment Expander
// @version      1.1
// @description  Expands reddit comments by default to mitigate the Crowd Control feature
// @author       /u/Tural-
// @match        https://*.reddit.com/*
// @grant        none
// @namespace https://greasyfork.org/users/280996
// @downloadURL https://update.greasyfork.org/scripts/426637/Reddit%20Comment%20Expander.user.js
// @updateURL https://update.greasyfork.org/scripts/426637/Reddit%20Comment%20Expander.meta.js
// ==/UserScript==
 
(function() {
    'use strict';
 
    // Get all the comments that are not 'collapsed for a reason'
    // "collapsed-for-reason" class is used by reddit to define comments that were collapsed because they are below the viewer's score threshold and we don't want to supersede that functionality
    // We only want to expand comments that were collapsed by moderators as part of the feature explained here: https://old.reddit.com/r/redditsecurity/comments/b0a8he/detecting_and_mitigating_content_manipulation_on/
    let comments = document.querySelectorAll(".thing.collapsed:not(.collapsed-for-reason)");
 
    // Loop through the comment array
    comments.forEach(function (el, i) {
        el.classList.remove("collapsed");
        el.classList.add("noncollapsed");
    });
 
})();