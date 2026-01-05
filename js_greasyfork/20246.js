// ==UserScript==
// @name         Reddit Youtube Playlist Maker
// @namespace    https://greasyfork.org/en/scripts/20246-reddit-youtube-playlist-maker
// @version      0.1.3
// @description  This will create a small link at the bottom left of reddit.com/r/videos to open a playlist of the videos on the page.
// @author       You
// @match        *://www.reddit.com/r/videos*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/20246/Reddit%20Youtube%20Playlist%20Maker.user.js
// @updateURL https://update.greasyfork.org/scripts/20246/Reddit%20Youtube%20Playlist%20Maker.meta.js
// ==/UserScript==

(function() {
    'use strict';
    if (document.URL.indexOf("reddit.com/r/videos") > -1){
    
    var re1 = /youtube.com\/watch\?v=\S{11}/g;
    var re2 = /youtu.be\/\S{11}/g;
    var videos = document.body.innerHTML.match(re2);
    videos = videos.concat(document.body.innerHTML.match(re1));
    
    //Remove duplicat videos
    videos = Array.from(new Set(videos));
    
    //Filter to just video ids
    for (var i = 0; i < videos.length; i++){
        videos[i] = videos[i].replace(/youtu.be\//, '');
        videos[i] =  videos[i].replace(/youtube.com\/watch\?v=/, '');
    }
    
    var crap = '">youtu.be<';
    videos.splice(videos.indexOf(crap),1);
    
    //console.log(videos);
    
    // Create youtube link
    var videoUrl = "http://www.youtube.com/watch_videos?video_ids=";
    videoUrl += videos;
    
    var html = '<a target="_blank" style="position: fixed; bottom: 10px;"  \
    title="Note: Youtube Limits this to 20 videos, no way around it." href="'
    +videoUrl +'">Open Youtube Playlist</a>';
    
    document.body.innerHTML = html + document.body.innerHTML;
    }
})();