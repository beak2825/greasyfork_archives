// ==UserScript==
// @name         Youtube Idle Prevention
// @namespace    http://tampermonkey.net/
// @version      3.2
// @description  non-intrusive page refresh when nearing idle or at idle
// @author       You
// @grant window.focus
// @include *www.youtube.com*
// @include *https://youtube.com*
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/441827/Youtube%20Idle%20Prevention.user.js
// @updateURL https://update.greasyfork.org/scripts/441827/Youtube%20Idle%20Prevention.meta.js
// ==/UserScript==

var currentURL = window.location.href;
var vidCounter = 0;
var timesincelastvid = 0;
var timesincePause = 0;
var yt = "https://www.youtube.com/";
var pausetrack = 0;
var videoLong = 0;
function reset() {

    vidCounter++;
    var status = document.querySelector("#movie_player").getPlayerState();
    console.log(vidCounter);
    var moviePlayer = document.querySelector("#movie_player");
    var currentTimem = Math.floor( moviePlayer.getCurrentTime() / 60);
    var currentTimes = Math.floor( moviePlayer.getCurrentTime() - 60*currentTimem);
    var videoDuration = Math.floor( moviePlayer.getDuration() / 60);
        console.log(videoDuration);

 //   pause tracking for when initially paused, if its before 30 mins then the script returns, if its paused after 30 mins the page should refresh
    if(status === 2 && vidCounter <= 450){
     timesincePause++;
     pausetrack = 1;
        console.log("returned");
        return
    }

// check if the video is over 30 minutes long

    if(status === 2 && vidCounter <=5 && videoDuration >= 30){
        videoLong = 1;
        return
    }
    if(videoDuration < 30){
        videoLong = 0;
}

// refresh if the video hasnt been refreshed recently and the video length is greater than 30mins
    if(status === 2 && vidCounter >=5 && videoDuration >=30 && videoLong != 1){
    window.location.replace(currentURL + "&t=" + currentTimem + "m" + currentTimes + "s")
    }

// return while video is considered a long video
    if (videoLong != 0){
     return
    }

    if (status === 2 && pausetrack == 1) {
    return
    }

    if(status != 2){
    timesincePause = 0;
    pausetrack = 0;
    }

    if( (status === -1 || status === 3) && timesincelastvid >= 1) {
    window.focus;
    }

    if( currentURL != window.location.href ) {
    currentURL = window.location.href;
    timesincelastvid = 0;
    }

    if(vidCounter >=450 && window.location.href != yt) {
    window.location.replace(currentURL + "&t=" + currentTimem + "m" + currentTimes + "s");
    }

    if(vidCounter >=400 && timesincelastvid <=5 && window.location.href != yt) {
    window.location.replace(currentURL + "&t=" + currentTimem + "m" + currentTimes + "s");
    }

    if( currentURL === window.location.href){
    timesincelastvid++;
    }
    console.log("endofscript");

};
setInterval(reset,5000);