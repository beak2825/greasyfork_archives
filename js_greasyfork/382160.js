// ==UserScript==
// @name         MyPoints Watch Auto
// @version      2.1
// @description  MyPoints Videos
// @author       Toni
// @match        http*://www.mypoints.com/videos
// @match        http*://www.mypoints.com/videos/category/*
// @match        http*://www.mypoints.com/videos/video/*
// @namespace https://greasyfork.org/users/249948
// @downloadURL https://update.greasyfork.org/scripts/382160/MyPoints%20Watch%20Auto.user.js
// @updateURL https://update.greasyfork.org/scripts/382160/MyPoints%20Watch%20Auto.meta.js
// ==/UserScript==
const mins = [5, 35];

function skipVideos() {
    if (document.getElementById("blockerDetect").style.display == "block") window.location.reload();

    var d = new Date();
    if (mins.includes(d.getMinutes()) && d.getSeconds() < 10) window.location.reload();

    var allVids = document.getElementsByClassName("video-slide");
    var n = allVids.length
    var vidFound = false;
    var vidWatching = false;
    var i = 0;
    while (!vidFound && !vidWatching && i < n) {
        if (allVids[i].getElementsByClassName("watched").length == 1) {
            if (allVids[i].firstElementChild.className.includes("watching")) {
                vidWatching = true
            }
            else {
                vidFound = true;
            }
        }
        i++;
    }
    if (vidFound) allVids[i-1].firstElementChild.click()
    else {
        if (!vidWatching) pickCategory();
    }
}

const allCategoryURLs = ["https://www.mypoints.com/videos/category/111/editors-pick",
                         "https://www.mypoints.com/videos/category/133/entertainment",
                         "https://www.mypoints.com/videos/category/98/fashion",
                         "https://www.mypoints.com/videos/category/3/food",
                         "https://www.mypoints.com/videos/category/4/health",
                         "https://www.mypoints.com/videos/category/650/hobbies",
                         "https://www.mypoints.com/videos/category/12/home-garden",
                         "https://www.mypoints.com/videos/category/447/music",
                         "https://www.mypoints.com/videos/category/333/news-politics",
                         "https://www.mypoints.com/videos/category/138/parenting",
                         "https://www.mypoints.com/videos/category/91/pets-animals",
                         "https://www.mypoints.com/videos/category/22/technology",
                         "https://www.mypoints.com/videos/category/129/travel"];
const blacklistPL = ["Business",
                     "Fashion Wire",
                     "Travel Therapy",
                     "Celeb Tune",
                     "Culture Pop",
                     "Where Are They?",
                     "Postables",
                     "Hopeful Headlines"];

function pickCategory() {
    var j = Math.floor(Math.random() * (allCategoryURLs.length-1));
    var k = Math.random();
    var i = 0;
    if (k > 0.4) i = j + 1;
    window.location.href = allCategoryURLs[i];
}

function pickPlaylist() {
    //var moreBtn = document.getElementById("show-more-videos")
    //if (moreBtn != null) moreBtn.click();

    var allPlaylists = document.getElementsByClassName("video-tile");
    var numOfPlaylists = allPlaylists.length;
    var unwatchedFound = false;
    var i = 0;
    while (!unwatchedFound && i < numOfPlaylists) {
        if (allPlaylists[i].lastElementChild.children.length == 1 &&
            !blacklistPL.includes(allPlaylists[i].lastElementChild.lastElementChild.getAttribute("title"))) {
            unwatchedFound = true;
        }
        i++;
    }
    if (unwatchedFound) allPlaylists[i-1].click();
    else {
        var watchedOnceFound = false;
        i = 0;
        while (!watchedOnceFound && i < numOfPlaylists) {
            if (!allPlaylists[i].className.includes("watched") &&
                !blacklistPL.includes(allPlaylists[i].lastElementChild.lastElementChild.getAttribute("title"))) {
                watchedOnceFound = true;
            }
            i++;
        }
        if (watchedOnceFound) allPlaylists[i-1].click();
        else pickCategory();
    }
}

function main() {
    if (allCategoryURLs.includes(window.location.href)) pickPlaylist();
    else {
        if (window.location.href.includes("https://www.mypoints.com/videos/video/")) skipVideos();
        else {
            pickCategory();
        }
    }
}
setInterval(main, 5000);