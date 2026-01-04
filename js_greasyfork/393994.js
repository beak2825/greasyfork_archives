// ==UserScript==
// @name     TMC Show Rated
// @version  0.2
// @description  Hide unrated / low rated comments in the investors threads.
// @author       Matt Porter
// @namespace    https://github.com/matt-porter/
// @include      https://teslamotorsclub.com/tmc/threads/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/393994/TMC%20Show%20Rated.user.js
// @updateURL https://update.greasyfork.org/scripts/393994/TMC%20Show%20Rated.meta.js
// ==/UserScript==

var always_show_authors = ["Fact Checking", "KarenRei"];
var show_thresholds = {
    "Informative": 1,
    "Like": 3,
    "Love": 3,
    "Helpful": 1,
    "Funny": 4
};

var posts = $(".message");
console.log("Running comment script");
$.each( posts, function( key, val )  {
    var post = $(this);
    var post_id = post.attr("id");
    if (!post_id) {
        return 1; // continue
    }
    var permalink = post.find("a.hashPermalink").text();
    var permalink_href = post.find("a.hashPermalink").attr("href");
    var author = post.attr("data-author");
    var counts = {};
    var likes = $(this).find('.likesSummary li');
    $.each(likes, function(key, val) {
        var text = $(this).text();
        var pat = /.*([A-Z][a-z]+) x (\d+).*/;
        if (pat.test(text)) {
            //console.log("Found a like");
            var match = pat.exec(text);
            counts[match[1]] = match[2];
        }
    });
//    console.log("Post with likes:" + JSON.stringify(counts));
    var include_post = false;
    if (always_show_authors.includes(author)) {
        include_post = true;
        console.log(`Including post ${post_id} for always_author ${author}`);
    }
    $.each(show_thresholds, function(key, val) {
        if (val <= counts[key]||0) {
            include_post = true;
//            console.log("Including post for " + key + " x " + counts[key]);
        }
    });
    if (!include_post) {
        console.log(`Excluding post ${post_id} by author ${author} perma ${permalink}`);
        post.html(`<p>Hidden post <a href="${permalink_href}">${permalink}</a> by ${author}</p>`);
    }
});

