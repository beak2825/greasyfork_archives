// ==UserScript==
// @name         Spoiler Free NBC Athletics
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Remove spoilers for NBC Sports Athletics videos on YouTube
// @author       dietrich.wambach@protonmail.ch
// @match        https://www.youtube.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/473525/Spoiler%20Free%20NBC%20Athletics.user.js
// @updateURL https://update.greasyfork.org/scripts/473525/Spoiler%20Free%20NBC%20Athletics.meta.js
// ==/UserScript==

// create a list of track and field event keywords
const safe_keywords = [
    "100", "200", "400", "800", "1500", "3000", "5000", "10000", "110", "400", "4x100", "4x400",
    "100m", "200m", "400m", "800m", "1500m", "3000m", "5000m", "10000m", "110m", "400m",
    "4x100m", "4x400m", "5k", "10k", "20k", "35k", "walk", "marathon", "shot", "put", "discus",
    "hammer", "javelin", "high", "long", "triple", "jump", "pole", "vault", "decathlon",
    "heptathlon", "steeplechase", "hurdles", "relay", "throw", "final", "finals", "title",
    "qualifying", "qualifier", "prelim", "preliminary", "semifinal", "semis", "semifinals",
    "heat", "men's", "women's", "mixed",
]

const title_placeholder = "Spoiler Free!";
var playlistObserverSet = false;
var playlistObserver = new MutationObserver(function() {
    var ytd_titles = document.querySelectorAll("#video-title");
    ytd_titles.forEach(function(ytd_title) {
        // setting the title removes hover-over spoiler,
        // and also makes it easy to skip sanitizing a title which is time consuming
        if (ytd_title.title !== title_placeholder) {
            ytd_title.title = title_placeholder;
            var safe_title = "";
            var title = ytd_title.innerText.toLowerCase();
            title = title.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g,""); // strip punctuations
            var title_words = title.split(" ");
            title_words.forEach(function(title_word) {
            if (safe_keywords.includes(title_word)) {
                    safe_title += title_word + " ";
                }
            });
            ytd_title.innerText = safe_title;
        }
    });
    // hide thumbnails
    var ytd_thumbnails = document.querySelectorAll('ytd-thumbnail');
    if(ytd_thumbnails.length > 0){
        ytd_thumbnails.forEach(function(thumbnail) {thumbnail.style.display = "none";});
    }
    if (document.URL.includes("playlist") == true) {
        const playlist_img = document.querySelector("#page-manager > ytd-browse > ytd-playlist-header-renderer > div > div.immersive-header-content.style-scope.ytd-playlist-header-renderer > div.thumbnail-and-metadata-wrapper.style-scope.ytd-playlist-header-renderer > a > div");
        if (playlist_img !== null){playlist_img.style.display = "none";}
    }
    // hide video descriptions
    var ytd_descriptions = document.querySelectorAll("#dismissible > div > div.metadata-snippet-container.style-scope.ytd-video-renderer.style-scope.ytd-video-renderer > yt-formatted-string");
    ytd_descriptions.forEach(function(ytd_description) {ytd_description.innerText = "";});
});

// Entry Point: determine which kind of youtube page we're on between a watch page or list of vods page
if (document.URL.includes("watch") == true) {
    document.title = title_placeholder;
    // hide everything but the video player
    var watchpageObserver = new MutationObserver(function() {
        if (document.title !== title_placeholder) {
            document.title = title_placeholder;
        }
        var columns = document.querySelector("#columns");
        if (columns == null) { return false; }
        columns.style.display = "none";
    });
    watchpageObserver.observe(document, { subtree: true, childList: true });
} else {
    var playlistStartObserver = new MutationObserver(function() {
        // wait for #contents to be loaded, then set observer on it
        if (playlistObserverSet === false) {
            var ytd_contents = document.querySelector("#contents");
            if (ytd_contents !== null) {
                playlistObserver.observe(ytd_contents, { subtree: true, childList: true });
                playlistObserverSet = true;
                playlistStartObserver.disconnect();
            }
        }
    });
    playlistStartObserver.observe(document, { subtree: true, childList: true });
}
