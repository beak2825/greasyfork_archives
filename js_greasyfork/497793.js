// ==UserScript==
// @name         redsave
// @namespace    http://tampermonkey.net/
// @version      1
// @description  adds feature in libreddit/redlib to save/unsave posts, which is saved in localStorage as post ids (won't work over incognito sessions)
// @author       @yokelman
// @match        https://libreddit.kavin.rocks/*
// @icon         https://libreddit.kavin.rocks/favicon.ico
// @grant        none
// @license      GNU AGPL-3.0
// @downloadURL https://update.greasyfork.org/scripts/497793/redsave.user.js
// @updateURL https://update.greasyfork.org/scripts/497793/redsave.meta.js
// ==/UserScript==

(function() {
    // !!!!!! THE SCRIPT CAN ACT WEIRDLY IF USING MULTIPLE TABS TO BROWSE THE SITE SINCE AFAIK LOCALSTORAGE ISN'T SYNCHRONIZED IN REAL TIME TO WORK ACROSS MULTIPLE TABS
    // !!!!!! EXAMPLE: IF YOU SAVE POST A AND B ON THE MAIN PAGE, THEN OPEN POST A ON A NEW TAB, THEN UNSAVE POST B ON THE MAIN PAGE TAB AND THEN UNSAVE POST A THROUGH THE NEWLY OPENED TAB (WHICH ONLY CONTAINS A)...
    // !!!!!! POST B (WHICH SHOULD HAVE BEEN UNSAVED THROUGH MAIN PAGE TAB) WILL STILL BE IN LOCALSTORAGE
    // !!!!!! MORAL: DON'T GO SAVING/UNSAVING ON MULTIPLE PAGES AS FAR AS POSSIBLE, AND AFTER SAVING/UNSAVING ON ONE TAB IDEALLY RELOAD ALL THE OTHER TABS

    // tested on v0.30.1, v0.31.0, v0.31.2, v0.34.0 on both libreddit and redlib which should be the majority of public instances

    'use strict';

    var domain = "https://libreddit.kavin.rocks/";

    // load savedPosts from localStorage and handle if empty
    var savedPosts = window.localStorage.getItem("savedPosts");
    if (!savedPosts) {
        savedPosts = [];
    }
    else {
        savedPosts = savedPosts.split(",");
        // if localStorage has savedPosts="", splitting gives you [""], don't want that empty string as an element
        if (!savedPosts[0]) {
            savedPosts.splice(0);
        }
    }

    // adds an option to view saved posts when user clicks on Feeds at top left corner (if saved posts exist)
    if (savedPosts.length) {
        var link = document.createElement("a");
        link.textContent = "Saved";
        link.onclick = showSaved;
        if (document.getElementById("feed_list").querySelectorAll("p").length == 2) {
            document.getElementById("feed_list").insertBefore(link, document.getElementById("feed_list").children[4]);
        }
        else {
            document.getElementById("feed_list").appendChild(link);
        }
    }

    // manage saving/unsaving when save/unsave button is clicked
    function manageSaved(id) {
        if (document.getElementsByClassName(id)[0].textContent == "save") {
            savedPosts.push(id);
            document.getElementsByClassName(id)[0].textContent = "unsave";
        }
        else {
            savedPosts.splice(savedPosts.indexOf(id), 1);
            document.getElementsByClassName(id)[0].textContent = "save";
        }
        window.localStorage.setItem("savedPosts", savedPosts);
    }

    var post_footer = document.getElementsByClassName("post_footer");

    // go post by post and add the save/unsave element
    for (var i = 0; i < post_footer.length; i++) {
        var save = document.createElement("a");
        // the below is basically a somehow-works hack to get the post id (because the page could either have a collection of posts, or just a single post and i don't want to code for different cases) - can definitely lead to errors if site layout changes
        var postId = post_footer[i].querySelector("a").href.split("/")[6];
        if ((savedPosts.includes(postId))) {
            save.textContent = "unsave";
        }
        else {
            save.textContent = "save";
        }
        save.style = "font-weight: bold;";
        save.className = post_footer[i].querySelector("a").href.split("/")[6];
        (function(localPostId) {save.onclick = function() {manageSaved(localPostId);};})(postId);
        // if url includes comments, it means you're viewing an individual post (hopefully there's no loophole in this)
        if (!window.location.href.includes("comments")) {
            post_footer[i].appendChild(save);
        }
        else {
            document.getElementById("post_links").appendChild(save);
        }
    }

    // function to make a div (manipulate the existing div tbh) to show all the saved posts
    // function is async so posts will show in chronological order but it's a compromise for speed as posts load one by one (speed depends on your network and libreddit/redlib server chosen)
    async function showSaved() {
        if (window.location.href != domain) {
            alert("You can only see Saved posts from home page. Try from there.");
        }
        else {
            if (!savedPosts.length) {
                alert("No saved posts yet. Go ahead and save some!");
            }
            else {
                // no pagination for now
                if (document.querySelectorAll("footer").length == 2) {
                    document.querySelector("footer").remove();
                }
                if (document.querySelectorAll("form").length == 2) {
                    document.querySelectorAll("form")[1].remove();
                }
                document.title = "loading saved...";
                var postPage;
                var hr = document.createElement("hr");
                hr.className = "sep";
                document.getElementById("posts").innerHTML = "";

                for (var j = savedPosts.length - 1; j > -1; j--) {
                    document.getElementById("posts").appendChild(hr);
                    await fetch(domain + "comments/" + savedPosts[j])
                        .then(response => {return response.text();})
                        .then(html => {postPage = new DOMParser().parseFromString(html, "text/html");
                                       document.getElementById("posts").appendChild(postPage.getElementsByClassName("post")[0]);
                                       console.log(j);
                                       document.getElementsByClassName("post")[document.getElementsByClassName("post").length - 1].id = savedPosts[j];})
                        .catch(err => console.error("Error occurred: " + err));
                }
                for (var k = 0; k < savedPosts.length; k++) {
                    var save = document.createElement("a");
                    save.style = "font-weight: bold;";
                    save.className = savedPosts[k];
                    save.textContent = "unsave";
                    (function(index) {save.onclick = function() {manageSaved(savedPosts[index]);};})(k);
                    document.getElementById(savedPosts[k]).querySelector(".post_footer").children[0].appendChild(save);
                }
                document.title = "saved";
            }
        }
    }
})();