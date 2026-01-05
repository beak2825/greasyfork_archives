// ==UserScript==
// @author /u/noeatnosleep
// @name filtered_queue_link_swap
// @version 1.3
// @namespace filtered_queue_link_swap
// @description Swap 'filter out subreddits' link for the link to the unmod queue. On non-filtered page, it goes to the filtered unmod. On the filtered page, it goes back to the unfiltered unmod queue.
// @include http://*reddit.com/*
// @require http://ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/5132/filtered_queue_link_swap.user.js
// @updateURL https://update.greasyfork.org/scripts/5132/filtered_queue_link_swap.meta.js
// ==/UserScript==

document.addEventListener("DOMContentLoaded", replaceLinks, false );

if( document.readyState === "complete" ) {
    replaceLinks();
}

function replaceLinks() {
    Array.forEach( document.links, function(a) {
        a.href = a.href.replace( "/mod", "mod/about/unmoderated/" );
    });
}