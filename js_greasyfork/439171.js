// ==UserScript==
// @name            Videos Comment Counter on Youtube Playlist pages
// @description     Print the number of comments for each video in youtube playlists
// @namespace       https://greasyfork.org/users/869370
// @icon            https://s.ytimg.com/yts/img/favicon_96-vflW9Ec0w.png
// @match           *://www.youtube.com/playlist?list=WL
// @require         https://code.jquery.com/jquery-3.4.1.min.js
// @version         1.0
// @author          javalinex
// @license MIT

// @downloadURL https://update.greasyfork.org/scripts/439171/Videos%20Comment%20Counter%20on%20Youtube%20Playlist%20pages.user.js
// @updateURL https://update.greasyfork.org/scripts/439171/Videos%20Comment%20Counter%20on%20Youtube%20Playlist%20pages.meta.js
// ==/UserScript==


$("<style type='text/css'> .numerodecomentarios:before{ content: attr(data-before);background-color: #b7b7b7;padding: 1px 8px;color: white;letter-spacing: 1px;border-radius: 4px;} </style>").appendTo("head");
$("h3 a.yt-simple-endpoint").addClass("numerodecomentarios"); 


$(document).ready(function () {


let videos = Array.prototype.slice.call(document.querySelectorAll("h3 a.yt-simple-endpoint"));
for (let videolistindex = 0; videolistindex < videos.length; videolistindex++) {
    let videoURL = videos[videolistindex].getAttribute("href");
    console.log(videoURL);
    let videoID = videoURL.match(/[?&]v=([^#\&\?]+)/);
    console.log(videoID[1]);
    $.getJSON("https://www.googleapis.com/youtube/v3/videos?part=statistics&id="+videoID+"&key={{{{{{{{{{{{YOUR-API-KEY-HERE}}}}}}}}}}}}}", function(data) {
        videos[videolistindex].setAttribute("data-before", "💬 " + data.items[0].statistics.commentCount);
    });
}

MutationObserver = window.MutationObserver || window.WebKitMutationObserver;

var observer = new MutationObserver(function(mutations, observer) {
  // fired when a mutation occurs
let videos = Array.prototype.slice.call(document.querySelectorAll("h3 a.yt-simple-endpoint"));
for (let videolistindex = 0; videolistindex < videos.length; videolistindex++) {
    let videoURL = videos[videolistindex].getAttribute("href");
    console.log(videoURL);
    let videoID = videoURL.match(/[?&]v=([^#\&\?]+)/);
    console.log(videoID[1]);
    $.getJSON("https://www.googleapis.com/youtube/v3/videos?part=statistics&id="+videoID+"&key={{{{{{{{{{{{YOUR-API-KEY-HERE}}}}}}}}}}}}}", function(data) {
        videos[videolistindex].setAttribute("data-before", "💬 " + data.items[0].statistics.commentCount);
    });
}
$("h3 a.yt-simple-endpoint").addClass("numerodecomentarios");
});

// define what element should be observed by the observer
// and what types of mutations trigger the callback
observer.observe(document.querySelector('ytd-playlist-video-list-renderer'), {
  attributes: false,
  childList: true,
  characterData: false,
  subtree: true
});


  });
