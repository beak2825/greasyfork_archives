// ==UserScript==
// @name         SB Toolbar Auto
// @namespace    https://greasyfork.org/en/scripts/12604-sb-toolbar-auto
// @version      1.0
// @description  Automatically goes to the next video for SB Toolbar.
// @author       Allen
// @match        http://toolbartv.swagbucks.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/12604/SB%20Toolbar%20Auto.user.js
// @updateURL https://update.greasyfork.org/scripts/12604/SB%20Toolbar%20Auto.meta.js
// ==/UserScript==

prepareVid();

// alert(document.getElementsByClassName('selected')[0].id);
// alert(document.getElementById('menuFeed239').id);

// In case playlist is bugged without showing the current video icon. 

// Do have a visual on the current video in the playlist?
var gotCurrentVid = false;

// 45 seconds until next video
var time = 45000;

// If this video is marked as "Watched", decrease the time to next video to only 3 seconds.
if (document.getElementById('meterDuplicateVideo').getAttribute('style') != "display:none"){
    time = 3000;
}


setTimeout(function(){
    nextPlaylist();
}, 1500);

// If you can't see the current video on the playlist, keep clicking right tab.
function nextPlaylist(){

    if (document.getElementsByClassName('thumb-container active')[0] != null){
        gotCurrentVid = true;

        setTimeout(function(){
            NextVideo();
        }, time);

    }
    else if (document.getElementsByClassName('thumb-container active')[0] == null &&
             document.getElementsByClassName('feed-ajax-next')[0] != null){
        document.getElementsByClassName('feed-ajax-next')[0].click();
    }

    if (gotCurrentVid == false){
        setTimeout(function(){
            nextPlaylist();
        }, 1000);
    }
}







function prepareVid(){
    document.getElementById('banner_ad').outerHTML = "";
    document.getElementById('content').outerHTML = "";
}

function NextVideo(){

    // If video #2 or #3 is the next video.
    if (document.getElementsByClassName('thumb-container next-item')[0] != null){
        top.location.href = document.getElementsByClassName('thumb-container next-item')[0].getElementsByClassName('thumb-link')[0].getAttribute('href');
    }

    // If video #4 is the next video.
    else if (document.getElementsByClassName('thumb-container next-item lastItem')[0] != null){
        top.location.href = document.getElementsByClassName('thumb-container next-item lastItem')[0].getElementsByClassName('thumb-link')[0].getAttribute('href');
    }

    // If the current video is video #4, then click next page and then run next video.
    else if (document.getElementsByClassName('thumb-container next-item')[0] == null &&
             document.getElementsByClassName('thumb-container next-item lastItem')[0] == null &&
             document.getElementsByClassName('feed-ajax-next')[0] != null){

        document.getElementsByClassName('feed-ajax-next')[0].click();

        setTimeout(function(){
            // If the previous tab has active video at #4, then start with video #1 regardless.
            if (document.getElementsByClassName('thumb-container active')[0] == null && 
                document.getElementsByClassName('thumb-container next-item')[0] == null){
                top.location.href = document.getElementsByClassName('thumb-container')[0].getElementsByClassName('thumb-link')[0].getAttribute('href');
            }
            // If the active video is on the last #4 tab and this #1 list, then run the function again to go to the next video. 
            else {
                NextVideo();
            }
        }, 2000);

    }
    // If this is the last video of the playlist, go to the next category.
    else{
        var currId = document.getElementsByClassName('selected')[0].getAttribute('id');

        top.location.href = nextCate(currId);

    }

}




function nextCate(s){
    switch (s){
        case "menuFeed239":
            return "http://toolbartv.swagbucks.com/feed/moviefone/70";
            break;
        case "menuFeed70":
            return "http://toolbartv.swagbucks.com/feed/reuters/69";
            break;
        case "menuFeed69":
            return "http://toolbartv.swagbucks.com/feed/splashnews/291";
            break;
        case "menuFeed291":
            return "http://toolbartv.swagbucks.com/feed/tekzilla/292";
            break;
        case "menuFeed292":
            return "http://toolbartv.swagbucks.com/feed/uzoo/279";
            break;
        case "menuFeed279":
            return "http://toolbartv.swagbucks.com/feed/styleetc/239";
            break;
    }
}
