// ==UserScript==
// @name         SB Watch Auto Skipper
// @version      2.0
// @description  Auto skip SB Watch Vids
// @author       Toni
// @match        https://www.swagbucks.com/swagtv
// @match        https://www.swagbucks.com/watch
// @match        https://www.swagbucks.com/watch/unavailable*
// @match        https://www.swagbucks.com/watch/video/*
// @match        https://www.swagbucks.com/watch/playlist/*
// @match        https://www.swagbucks.com/watch/playlists/*
// @match        https://blank.org
// @match        https://www.swagbucks.com
// @match        https://www.swagbucks.com/html/404.html?*
// @namespace https://greasyfork.org/users/249948
// @downloadURL https://update.greasyfork.org/scripts/378265/SB%20Watch%20Auto%20Skipper.user.js
// @updateURL https://update.greasyfork.org/scripts/378265/SB%20Watch%20Auto%20Skipper.meta.js
// ==/UserScript==
const mins = [5, 35];
const errorURLs = ["https://blank.org/","https://www.swagbucks.com/"];

function skipVideos() {
    var d = new Date();
    if (mins.includes(d.getMinutes()) && d.getSeconds() < 10) window.location.reload();

    var allVids = document.getElementsByClassName("sbPlaylistVideo");
    var n = allVids.length
    var vidFound = false;
    var vidWatching = false;
    var i = 0;
    while (!vidFound && !vidWatching && i < n) {
        if (allVids[i].getElementsByClassName("iconWatch iconCheckmark").length == 0) {
            if (allVids[i].href == window.location.href) {
                vidWatching = true;
            }
            else {
                vidFound = true;
            }
        }
        i++;
    }
    if (vidFound) allVids[i-1].click()
    else {
        if (!vidWatching) pickCategory();
    }
//     // get the number of videos left to watch
//     var watch_string = document.getElementById("watchVideosEarn").innerText;
//     watch_string = watch_string.slice(0,-6);
//     // check the playlist has been watched
//     if (watch_string.charAt(6) == "d") pickCategory();
//     // isolate the number
//     var upcoming_videos = watch_string.match(/\d/g);
//     upcoming_videos = upcoming_videos.join("");
//     // get the current playing video
//     var next_video = total_videos - upcoming_videos;
//     if (next_video === 0) next_video = 99999999;
//     // click the next video if the current one is done
//     if (document.getElementsByClassName("nowPlayingText")[0].parentElement.parentElement.parentElement.getElementsByClassName("sbPlaylistVideoNumber")[0].innerText === "") document.getElementsByClassName("sbPlaylistVideo")[next_video].click();
}

const allCategoryURLs = ["https://www.swagbucks.com/watch/playlists/111/editors-pick",
                       "https://www.swagbucks.com/watch/playlists/133/entertainment",
                       "https://www.swagbucks.com/watch/playlists/98/fashion",
                       "https://www.swagbucks.com/watch/playlists/3/food",
                       "https://www.swagbucks.com/watch/playlists/4/health",
                       "https://www.swagbucks.com/watch/playlists/650/hobbies",
                       "https://www.swagbucks.com/watch/playlists/12/home-garden",
                       "https://www.swagbucks.com/watch/playlists/333/news-politics",
                       "https://www.swagbucks.com/watch/playlists/138/parenting",
                       "https://www.swagbucks.com/watch/playlists/91/pets-animals",
                       "https://www.swagbucks.com/watch/playlists/17/sports",
                       "https://www.swagbucks.com/watch/playlists/22/technology",
                       "https://www.swagbucks.com/watch/playlists/129/travel"];
const allCategoryNames = ["Editor's Pick",
                          "Entertainment",
                          "Fashion",
                          "Food",
                          "Health",
                          "Hobbies",
                          "Home & Garden",
                          "News & Politics",
                          "Parenting",
                          "Pets & Animals",
                          "Sports",
                          "Technology",
                          "Travel"];
const blacklistPL = ["This Week In Sports","The Queen of Soul"];

function pickCategory() {
    var j = Math.floor(Math.random() * (allCategoryURLs.length-1));
    var k = Math.random();
    var i = 0;
    if (k > 0.4) i = j + 1;
    console.log("Redirecting to " + allCategoryNames[i] + " category...");
    window.location.href = allCategoryURLs[i];
}

function pickPlaylist() {
    var allPlaylists = document.getElementsByClassName("sbTrayListItemHeader watchItemHeader");
    var numOfPlaylists = allPlaylists.length;
    var unwatchedFound = false;
    var i = 0;
    while ((!unwatchedFound) && (i < numOfPlaylists)) {
        if ((allPlaylists[i].getElementsByClassName("playlistWatchAgain").length == 0) &&
            (allPlaylists[i].getElementsByClassName("playlistWasWatched").length == 0) &&
            (!blacklistPL.includes(allPlaylists[i].getElementsByClassName("sbTrayListItemHeaderCaption")[0].innerText))) {
            unwatchedFound = true;
        }
        i++;
    }

    if (unwatchedFound) allPlaylists[i-1].click();
    else {
        var watchedOnceFound = false;
        i = 0;
        while ((!watchedOnceFound) && (i < numOfPlaylists)) {
            if ((allPlaylists[i].getElementsByClassName("playlistWasWatched").length == 0) &&
                (!blacklistPL.includes(allPlaylists[i].getElementsByClassName("sbTrayListItemHeaderCaption")[0].innerText))){
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
        if ((window.location.href.includes("https://www.swagbucks.com/watch/playlist/")) ||
            (window.location.href.includes("https://www.swagbucks.com/watch/video/"))) skipVideos();
        else {
            if (window.location.href == "https://www.swagbucks.com/watch/unavailable") {
                window.location.href = "https://blank.org"
            }
            else {
                if (errorURLs.includes(window.location.href)) {
                    var curMin = new Date().getMinutes();
                    if (mins.includes(curMin)) pickCategory();
                }
                else {
                    pickCategory();
                }
            }
        }
    }
}

setInterval(main,2000);