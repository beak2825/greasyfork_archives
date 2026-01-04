// ==UserScript==
// @name         Youtube Distraction Blocker
// @namespace    https://youtube.com/
// @version      1.1
// @description  Blocks distractions on youtube for a more wholesome viewing experience.
// @author       Simon
// @match        https://*.youtube.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/390600/Youtube%20Distraction%20Blocker.user.js
// @updateURL https://update.greasyfork.org/scripts/390600/Youtube%20Distraction%20Blocker.meta.js
// ==/UserScript==

(function() {
    'use strict';

    setInterval(function(){
    var sidebar = document.getElementById("guide-inner-content");
    if(sidebar != null)
        sidebar.parentElement.removeChild(sidebar);

     var related = document.getElementById("related");
    if(related != null)
        related.parentElement.removeChild(related);

    var info = document.getElementById("info");
    if(info != null)
        info.parentElement.removeChild(info);

    var meta = document.getElementById("meta");
    if(meta != null)
        meta.parentElement.removeChild(meta);

    var comments = document.getElementById("comments");
    if(comments != null)
        comments.parentElement.removeChild(comments);

    var container = document.getElementById("container");
    if(container != null)
        container.parentElement.removeChild(container);
                           }, 1000);
})();