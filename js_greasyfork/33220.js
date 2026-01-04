// ==UserScript==
// @name         Hide Reddit post metadata
// @namespace    https://greasyfork.org/users/14470
// @version      1.0.1
// @description  Hides the title and the tagline on reddit posts.
// @author       Simon Haga
// @match        https://www.reddit.com/*
// @grant        none
// @require      https://cdn.rawgit.com/uzairfarooq/arrive/2a6ccfc7f069222b260c52225a812317b0aa06c3/minified/arrive.min.js
// @downloadURL https://update.greasyfork.org/scripts/33220/Hide%20Reddit%20post%20metadata.user.js
// @updateURL https://update.greasyfork.org/scripts/33220/Hide%20Reddit%20post%20metadata.meta.js
// ==/UserScript==

// post tagline
hideInnerHTMLByClassName("tagline big-tagline");
document.arrive(".tagline.big-tagline", function() {
    this.innerHTML = '';
});

// post title
hideInnerHTMLByClassName("title may-blank loggedin");
document.arrive(".title.may-blank.loggedin", function() {
    this.innerHTML = '';
});

function hideInnerHTMLByClassName(className) {
    var elements = document.getElementsByClassName(className);
    for(var i = 0; i < elements.length; i++) {
        var element = elements[i];
        element.innerHTML = '';
    }
}