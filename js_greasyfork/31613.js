// ==UserScript==
// @name         Overview Redirect
// @name:en      Overview Redirect
// @version      4.1
// @description  Change all username urls to point to overviews instead of profiles
// @namespace    Overview Redirect
// @author       https://github.com/kimpeek
// @include      https://www.reddit.com*
// @downloadURL https://update.greasyfork.org/scripts/31613/Overview%20Redirect.user.js
// @updateURL https://update.greasyfork.org/scripts/31613/Overview%20Redirect.meta.js
// ==/UserScript==

// Define the regex for a username link
var username_link = new RegExp("(\/u\/|\/user\/)[A-Za-z0-9_-]+\/?$");
// Choose the page to replace with
//   Must be valid www.reddit.com/user/<USER>/*
//   eg. 'overview' or 'submitted'
var page_to_link = "overview";

// Find all links that point to a username
// and add 'page_to_link' to the end
function find_username_links(item, index){
    if (item.href.match(username_link)){
        item.href = change_username_link(item.href);
    }
}

// Conditionally add 'page_to_link' to the link
function change_username_link(link){
    if (link.endsWith("/")){
        link = link + page_to_link;
    }
    else {
        link = link + "/" + page_to_link;
    }
    return link;
}

// Wrapper for main functionality
function take_action(msg){
    // Gather all the links on the page
    var anchors = document.getElementsByTagName("a");
    // Transform the HTML Collection to an array
    var list = Array.from(anchors);
    // Execute the primary functionality
    list.forEach(find_username_links);
}

// Normal reddit and RES first page
window.addEventListener ("load", take_action());
// Never Ending Reddit
window.addEventListener ("neverEndingLoad", function(){take_action();});
