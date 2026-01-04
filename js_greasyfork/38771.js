// ==UserScript==
// @name  html5 videos: Click To Play
// @namespace ChoGGi.org
// @description Make "video" elements click to play
// @include http://*
// @include https://*
// @version 0.3
// @grant none
// @downloadURL https://update.greasyfork.org/scripts/38771/html5%20videos%3A%20Click%20To%20Play.user.js
// @updateURL https://update.greasyfork.org/scripts/38771/html5%20videos%3A%20Click%20To%20Play.meta.js
// ==/UserScript==

(function() {
    'use strict';

    //skip these domains (allow autoplay)
    function checkDomain() {
      let d = (window.location != window.parent.location) ? document.referrer : document.location.href;
      if (d.includes("example.com") === false &&
          //d.includes("youtube.com") === false &&
          //d.includes("gfycat.com") === false &&
          //d.includes("escapistmagazine.com") === false &&
          d.includes("example.net") === false)
        return true;
    }

    //listen for newly added videos
    let MutationObserver = window.MutationObserver;
    let vidObserver = new MutationObserver(mutationHandler);
    let observerConfig = {
      childList:true,
      subtree:true
    };

    //activated on new elements
    function mutationHandler(mutationRecords) {
      mutationRecords.forEach(function(mutation) {
        if (mutation.type == "childList" &&
            typeof mutation.addedNodes == "object" &&
            mutation.addedNodes.length) {
          for (let i = 0, length = mutation.addedNodes.length;  i < length;  ++i) {
            let node = mutation.addedNodes[i];
            //check if it's a video node
            if (node.nodeType === 1 && node.nodeName === "VIDEO") {
              //if it's a video we added; remove the function below
              if (node.ChoGGi_autoplayVideo === 1) {
                node.onplaying = null;
              } else {
                //have to do this for some annoying sites (twitch/youtube) else we get audio playing with no video
                node.onplaying = function() {
                  convertVideo(node);
                };
              }
            }
          }
        }
      });
    }

    function iterateVideos() {
      let vidList = document.getElementsByTagName("video");
      for (let i = 0; i < vidList.length; i++) {
        convertVideo(vidList[i]);
      }
    }

    //switch the video out with a button
    function convertVideo(video) {
      //get position/size of video element
      let style = window.getComputedStyle(video, null);
      //build a button to replace the video
      let clicker = document.createElement("button");
      clicker.style = "z-index: 99999; font-size: 15px; cursor: pointer; position: " + style.position + "; top: " + style.top + "; left: " + style.left +"; width: " + style.width + "; height: " + style.height + ";";
      clicker.innerHTML = "Play Video";
      clicker.className = "ChoGGi_autoplayToggle";
      //store the video as part of the button
      clicker.ChoGGi_videoObject = video;
      //fire this function when we click the button
      clicker.onclick = function() {
        let video = this.ChoGGi_videoObject;
        //we don't want the vidObserver to catch this video
        video.ChoGGi_autoplayVideo = 1;
        //add default controls to video
        //video.setAttribute("controls","");
        //add video back to webpage
        this.parentNode.appendChild(video);
        //remove any extra buttons added (thanks youtube)
        let childList = video.parentNode.children;
        for (let i = 0; i < childList.length; i++) {
          if (childList[i].className === "ChoGGi_autoplayToggle")
            this.parentNode.removeChild(childList[i]);
        }
        //video re-added so remove the button (it was probably removed by the above)
        try {
          this.parentNode.removeChild(this);
        }catch(e){}
        //if we're clicking the button we want to watch the video
        video.play();
      };
      //add button to page
      video.parentNode.appendChild(clicker);
      //remove video from page
      video.parentNode.removeChild(video);
    }

    //are we skipping this page?
    if (checkDomain()) {
      //wait before checking for video elements
      window.setTimeout(function() {
        iterateVideos();
      }, 250);
      //add listener to check for js added vids
      vidObserver.observe(document,observerConfig);
    }

})();
