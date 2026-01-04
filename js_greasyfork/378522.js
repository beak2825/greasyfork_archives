// ==UserScript==
// @name         Memeflag hider
// @version      0.1
// @description  hides memeflags
// @author       britpol
// @grant        none
// @include      http*://*.4chan.org/pol/*
// @namespace https://greasyfork.org/users/250780
// @downloadURL https://update.greasyfork.org/scripts/378522/Memeflag%20hider.user.js
// @updateURL https://update.greasyfork.org/scripts/378522/Memeflag%20hider.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var posts = document.getElementsByClassName("postContainer replyContainer"); //get all posts on page
    for (var currentPostNumber = 0; currentPostNumber < posts.length; currentPostNumber++) { //go through every post on the page
        if (posts[currentPostNumber].getElementsByClassName("countryFlag").length !== 0) { //a post only has countryFlag if it is a memeflag
            ReplyHiding.hide(posts[currentPostNumber].id.substr(2)); //it's a memeflag, hide it.
            //the hide(int postNum) function is called to gracefully hide the post instead of removing it,
            //as 4chan already supports post hiding, this script just automates it.
        }
    }
})();