// ==UserScript==
// @name         FP Read Page Sorter
// @namespace    member.php?u=197522
// @version      1.0
// @description  Sorts threads by most unread posts
// @author       Xemit
// @match        https://facepunch.com/fp_read.php
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/34255/FP%20Read%20Page%20Sorter.user.js
// @updateURL https://update.greasyfork.org/scripts/34255/FP%20Read%20Page%20Sorter.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Count the threads to sort
    var threadcount = 0;
    var t = document.getElementById("threads").children[0];
    var limit = t.children.length;
    var i;

    for(i = 1; i < limit; i++) {
        if(t.children[i].className != "threadlisthead") {
            threadcount++;
        } else {
            break;
        }
    }

    console.log("Sorting " + threadcount + " threads");

    // We need to get the threads to sort
    var threads = [];
    for(i = 0; i < threadcount; i++) {
        threads[i] = document.getElementById("threads").children[0].children[i + 1];
    }

    // Now make a map (I guess) of thread indexes and how many new posts they have
    var posts = [];
    for(i = 0; i < threads.length; i++) {
        var s = threads[i].getElementsByClassName("newposts");
        if(!s) {
            console.error("There's a thread with no new posts in there somehow, aborting!");
            return false;
        }
        s = s[0].innerText.trimLeft().substr(0, s[0].innerText.trimLeft().indexOf(" "));
        posts[i] = { index: i, posts: s };
    }

    // Finally sort those posts baby
    posts.sort(function(a, b) {
        return a.posts - b.posts;
    });

    // Making an array of sorted threads
    var sortedThreads = [];
    for(i = 0; i < threads.length; i++) {
        sortedThreads[i] = threads[posts[i].index].cloneNode(true);
    }

    // Remove old unsorted threads
    for(i = 0; i < threads.length; i++) {
        threads[i].parentNode.removeChild(threads[i]);
    }

    // Put those cool new sorted threads into place
    for(i = 0; i < sortedThreads.length; i++) {
        t = document.getElementById("threads").children[0];
        t.insertBefore(sortedThreads[i], t.children[1]);
    }

    console.log("Probably sorted threads successfully");
})();