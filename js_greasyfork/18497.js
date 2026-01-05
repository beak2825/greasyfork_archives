// ==UserScript==
// @name         SB Watch Auto Skipper
// @namespace    https://greasyfork.org/en/users/2562-arctica
// @version      0.01
// @description  auto playlist watcher
// @author       artica
// @match        http://www.swagbucks.com/watch/video/*
// @downloadURL https://update.greasyfork.org/scripts/18497/SB%20Watch%20Auto%20Skipper.user.js
// @updateURL https://update.greasyfork.org/scripts/18497/SB%20Watch%20Auto%20Skipper.meta.js
// ==/UserScript==
function do_the_shit(){
    // get the total number of videos to watch
    var total_videos = document.getElementsByClassName("sbPlaylistVideo").length;
    // get the number of videos left to watch
    var watch_string = document.getElementById("watchVideosEarn").innerText;
    watch_string = watch_string.slice(0,-6);
    // check the playlist has been watched
    if (watch_string.charAt(6) == "d") leave_this_shit();
    // isolate the number
    var upcoming_videos = watch_string.match(/\d/g);
    upcoming_videos = upcoming_videos.join("");
    // get the current playing video
    var next_video = total_videos - upcoming_videos;
    if (next_video === 0) next_video = 99999999;
    // click the next video if the current one is done
    if (document.getElementsByClassName("nowPlayingText")[0].parentElement.parentElement.parentElement.getElementsByClassName("sbPlaylistVideoNumber")[0].innerText === "") document.getElementsByClassName("sbPlaylistVideo")[next_video].click();
}
function leave_this_shit(){
    console.log("do something");
}

setInterval(do_the_shit,5000);