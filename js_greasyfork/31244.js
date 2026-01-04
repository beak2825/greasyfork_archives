// ==UserScript==
// @name         Reddit_Comments_Tab
// @name:en      Reddit_Comments_Tab
// @namespace    Reddit_Comments_Tab
// @version      0.3
// @description  Add a comments tab to the main nav bar.
// @author       https://github.com/kimpeek
// @include      *reddit.com*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/31244/Reddit_Comments_Tab.user.js
// @updateURL https://update.greasyfork.org/scripts/31244/Reddit_Comments_Tab.meta.js
// ==/UserScript==

var current_url = document.URL;
var no_button = new RegExp("comments|inbox|user|overview|prefs|about|message");
var multireddit = new RegExp("^http(s)?:\/\/(www|old).reddit.com\/me\/m\/[A-Za-z0-9_]+");
var subreddit = new RegExp("^http(s)?:\/\/(www|old).reddit.com\/r\/[A-Za-z0-9_]+");

function main(){
    // Check if on a page to ignore
    if (no_button.test(current_url)) {
        return;
    }

    // Check if a multireddit --> extract multi --> create button with multi
    if (multireddit.test(current_url)) {
        const multi = current_url.match(multireddit);
        create_button(multi[0].concat("/comments/"));
        return;
    }

    // Check if a subreddit --> extract sub --> create button with sub
    else if (subreddit.test(current_url)) {
        const sub = current_url.match(subreddit);
        create_button(sub[0].concat("/comments/"));
        return;
    }

    // Return frontpage + comments
    else {
        create_button("https://www.reddit.com/comments/");
        return;
    }
}

function create_button(redirect_url){
    var menu = document.getElementsByClassName("tabmenu ")[0];
    var gilded = menu.getElementsByTagName('li')[5];
    var comments = document.createElement("li");
    var comment_anchor = document.createElement("a");

    menu.insertBefore(comments, gilded);
    comments.appendChild(comment_anchor);
    comment_anchor.innerHTML = "comments";
    comment_anchor.setAttribute('href', redirect_url);
}

main();
