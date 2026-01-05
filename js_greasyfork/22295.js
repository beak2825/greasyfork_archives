// ==UserScript==
// @name smaller yt thumbnails
// @description nogger
// @match http://www.youtube.com/*
// @match https://www.youtube.com/*
// @include http://www.youtube.com/*
// @include https://www.youtube.com/*
// @run-at document-end
// @version 0.0.1.20160813221004
// @namespace https://greasyfork.org/users/60099
// @downloadURL https://update.greasyfork.org/scripts/22295/smaller%20yt%20thumbnails.user.js
// @updateURL https://update.greasyfork.org/scripts/22295/smaller%20yt%20thumbnails.meta.js
// ==/UserScript==

var thumbnails = document.getElementsByClassName("yt-uix-simple-thumb-wrap yt-uix-simple-thumb-related");
var count = thumbnails.length
 
originalSize = [168,94]
desiredSize = [120,68]
 
function smallerThumbnails() {
 
    thumbnails = document.getElementsByClassName("yt-uix-simple-thumb-wrap yt-uix-simple-thumb-related");
    count = thumbnails.length;
 
    if(thumbnails[count-1].children[0].height == originalSize[1]) {
        var titles = document.getElementsByClassName("title");
       
        for (var i = titles.length - 1; i >= 0; i--) {
            if(titles[i].dir == "ltr"){
                titles[i].style.fontSize = "13px"
            }
        };
       
       
        var thumbWrapper = document.getElementsByClassName("video-time")
        var mixThumbs = document.getElementsByClassName("yt-pl-thumb")
        var thumbOverlays = document.getElementsByClassName("yt-pl-thumb-overlay")
        var mixThumbImage = [];
       
        var mixCount = mixThumbs.length
       
       
        for (var i = 0; i < count; i++) {
            thumbnails[i].children[0].width = desiredSize[0];
            thumbnails[i].children[0].height = desiredSize[1];
       
            thumbWrapper[i].parentElement.style.width = desiredSize[0] + "px"
            thumbWrapper[i].parentElement.style.height = desiredSize[1] + "px"
       
            document.getElementsByClassName("thumb-link")[i].parentElement.style.height = desiredSize[1] + "px"
       
       
            document.getElementsByClassName("content-wrapper")[i].children[0].style.right = originalSize[0]-desiredSize[0]+"px"
            document.getElementsByClassName("content-link")[i].style.marginBottom = desiredSize[1]-originalSize[1]+"px"
       
        };
       
        for (var i = mixCount - 1; i >= 0; i--) {
            mixThumbImage.push(document.getElementsByClassName("yt-mix-thumb")[i].children[0].children[0].children[0].children[0])
       
            mixThumbs[0].style.width = desiredSize[0] + "px"
            mixThumbs[i].parentElement.style.height = desiredSize[1] + "px"
       
            thumbOverlays[i].style.width = desiredSize[0] + "px"
            thumbOverlays[i].style.height = desiredSize[1] + "px"
       
            document.getElementsByClassName("sidebar")[i].style.height = desiredSize[1] + "px"
            document.getElementsByClassName("sidebar")[i].style.width = desiredSize[0]/2-10 + "px"
       
            document.getElementsByClassName("formatted-video-count-label")[0].style.fontSize = "8px"
            document.getElementsByClassName("formatted-video-count-label")[0].children[0].style.fontSize = "14px"
       
            mixThumbImage[i].style.position = "relative"
            mixThumbImage[i].width = desiredSize[0]
            mixThumbImage[i].height = desiredSize[1]
            mixThumbImage[i].style.top = (desiredSize[1]-originalSize[1])/2 + "px"
            mixThumbImage[i].style.left = (desiredSize[0]-originalSize[0])/2 + "px"
       
        }; 
    }
}
 
smallerThumbnails();
 
 
function checkForNewThumbs() {
    if(document.getElementsByClassName("yt-uix-simple-thumb-wrap yt-uix-simple-thumb-related").length == count) {
       window.setTimeout(checkForNewThumbs, 100);
    } else {
      smallerThumbnails();
    }
}
 
var expandButton = document.getElementsByClassName("yt-uix-button-expander")[document.getElementsByClassName("yt-uix-button-expander").length-1]
 
expandButton.onclick = function(event){
    checkForNewThumbs();
    return false;
}