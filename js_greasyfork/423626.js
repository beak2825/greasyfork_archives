// ==UserScript==
// @name         AimIsADick Blocker 9000
// @description     Hides AimIsADick posts on teamfortress.tv website
// @include      *://*teamfortress.tv/*
// @include      *://*tf.gg/*
// @version 0.0.1.20210320153402
// @namespace https://greasyfork.org/users/749376
// @downloadURL https://update.greasyfork.org/scripts/423626/AimIsADick%20Blocker%209000.user.js
// @updateURL https://update.greasyfork.org/scripts/423626/AimIsADick%20Blocker%209000.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var thread_container = document.getElementById("thread-container");
    if(thread_container) {
        var post_array = thread_container.getElementsByClassName("post");
        var remove_posts = [];
        for (let post of post_array) {
            if(post.querySelector(".post-header .post-author").innerHTML.includes("AimIsADick")) {
                remove_posts.push(post);
            }
        }
        while(remove_posts.length > 0) {
            let post = remove_posts.shift();
            if (!post.querySelector(".post-header .post-frag-container .minus").className.includes("clicked")) {
                fetch('/post/frag/'+post.id.replace(/[^\d]*/g,'')+'/minus');
            }
            post.parentNode.removeChild(post);
        }
    }
})();