// ==UserScript==
// @name         SB watch script
// @version      0.1
// @description  A script that plays all the videos in swagbucks watch automatically
// @match        http://www.swagbucks.com/watch
// @match        http://www.swagbucks.com/watch?fromToDoList=1
// @match        http://www.swagbucks.com/watch/*
// @grant        none
// @namespace https://greasyfork.org/users/149171
// @downloadURL https://update.greasyfork.org/scripts/32293/SB%20watch%20script.user.js
// @updateURL https://update.greasyfork.org/scripts/32293/SB%20watch%20script.meta.js
// ==/UserScript==

// Variables for getVids function
var editors_picks_id = "sbTrayInner138";
var news_politics_id = "sbTrayInner503";
var tv_film_id = "sbTrayInner142";
var food_id = "sbTrayInner130";
var health_tips_id = "sbTrayInner131";
var progres_bar_id = "videoProgressBar";

// Variables for checkWatch function
var newProgress = 0;
var curProgress = 0;
var index = 0;

var videoStrip;
var run;

function start () {
    var sb_videos = "http://www.swagbucks.com/watch/video/";

    if(window.location.href.indexOf("watch/video") == -1){
        getVids([editors_picks_id, news_politics_id, tv_film_id, food_id, health_tips_id]);
    }
    else{
        videoStrip = document.getElementById("sbPlaylistVideos").getElementsByTagName("a");
        curProgress = parseInt(document.getElementById("videoProgressBar").style.width.slice(0,-1));
        index = parseInt(document.getElementsByClassName("nowPlayingText")[0].parentElement.parentElement.parentElement.getAttribute("index"));

        run = setInterval(function(){ checkWatch(); }, 5000);
    }
}

function getVids (IDs){
    var vids;
    for(var j=0;j<IDs.length;j++){
        vids = document.getElementById(IDs[j]);
        for(var i=0;i<vids.childNodes.length;i++){
            if (vids.childNodes[i].childNodes[0].childNodes[1].innerText != "WATCHED"){
                vids.childNodes[i].click();
            }
        }
    }
    // no videos left :(
    console.warn("No videos left! :(");
    clearInterval(run);
}

function checkWatch(){
    newProgress = parseInt(document.getElementById("videoProgressBar").style.width.slice(0,-1));
    index = parseInt(document.getElementsByClassName("nowPlayingText")[0].parentElement.parentElement.parentElement.getAttribute("index"));

    if((videoStrip[index].getElementsByClassName("iconWatch iconCheckmark").length !== 0) && (index !== videoStrip.length-1)){
        console.warn("Already watched this video! Playing next video");
        videoStrip[index+1].click();
    }

    if (curProgress < newProgress){
        curProgress = newProgress;
        if(parseInt(index) != videoStrip.length-1){
            console.log("index: " + index);
            console.log("Progress changed!");
            console.log("current progress: "+curProgress);
            videoStrip[index+1].click();
        }
        else{
            console.warn("playlist finished! Returning to watch page ...");
            window.location.href = 'http://www.swagbucks.com/watch/';
        }
    }
}

start();
