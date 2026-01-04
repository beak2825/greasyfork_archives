// ==UserScript==
// @name         Bypass COPPA Miniplayer
// @namespace    http://tampermonkey.net/
// @version      1.2.6
// @description  Re-enable YouTube Miniplayer on COPPA-flagged (supposedly kids) videos.
// @author       jaytohe
// @match        https://www.youtube.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/397258/Bypass%20COPPA%20Miniplayer.user.js
// @updateURL https://update.greasyfork.org/scripts/397258/Bypass%20COPPA%20Miniplayer.meta.js
// ==/UserScript==

(function() {
  'use strict';
    var miniplayer_height = null;
    var prevent_running =false; //variable used to ensure that checkminivideo interval function is run only once.
   function stop(myvar) {
          clearInterval(myvar);
   }
   function allowcontrols() { //re-enables miniplayer controls on kids videos.
        var controls = document.getElementById("blocking-container");
          if (!controls.hasAttribute("hidden")) {
              controls.setAttribute("hidden", "");
          }
    }
    function getminiheight (vid) {
        return vid.clientHeight;
    }
    function setglobalminiheight(val) {
        miniplayer_height = val;
    }
    function checkminivideo(old_url, play_btn, vid) {
        setInterval(function() { //check if another video loads up on the miniplayer.
            if (old_url !== vid.src && vid.src !== "" && miniplayer_height === getminiheight(vid)) { //if true
                //console.log(vid.src); DEBUG OUTPUT
                console.log("Video change detected. Re-injecting...");
                vid.onpause = function u() {vid.play();}; //prevent yt from pausing "kid" video.
                var t = setInterval(function(){
                  if (vid.paused === true) {
                    console.log("Clicking video to unpause...");
                    play_btn.click(); //hacky solution in case onpause doesn't prevent yt from pausing kid video.
                    vid.play();
                  } else {clearInterval(t);}
                }, 800);
                allowcontrols();
                setTimeout(function() { vid.onpause=null;}, 1500); //re-allow pausing of video after 1.5 seconds
                old_url = vid.src;
            }
        },500);
    }
  function inject() {
  var waitforvid = setInterval(function() { //continually check if user has loaded up a video.
      var vid = document.getElementsByClassName("html5-main-video")[0]; //find video element in page.
      //console.log("Type is : "); DEBUG
      //console.log(typeof vid); DEBUG
      if (typeof vid !== "undefined") {
          //console.log("Video Found!");
          var minibtn = document.getElementsByClassName("ytp-miniplayer-button")[0]; //find miniplayer button.
          if (typeof minibtn === "undefined") {
               stop(waitforvid);
               return;
          } else {
      /* START OF UNBLOCK FUNCTION */
      var unblock = function () {
        vid.onpause = function u() {vid.play();}; //ignore any pause video requests. Just continue playing the damn video.
        var oldHeight = getminiheight(vid); //get height of current video element.
          var wmini = window.setInterval(function() { //continuously check if height has changed i.e. miniplayer bottom right window has appeared?
              if (oldHeight !== getminiheight(vid)) {
                  allowcontrols();
                  clearInterval(wmini);
                  vid.onpause = null; //re-allow pausing of video on miniplayer.
                  if (prevent_running === false) {
                  var old_url = vid.src;
                  var play_btn = document.getElementsByClassName("ytp-play-button")[0];
                  checkminivideo(old_url, play_btn, vid);
                  }
                  setglobalminiheight(getminiheight(vid));
                  prevent_running=true;
              }
          }, 1000);
      };
      /* END OF UNBLOCK FUNCTION */
      minibtn.addEventListener("click", unblock, false); //hijack miniplayer button.
      addEventListener("keydown", function(event) {
          if (event.keyCode === 73) {
              unblock.call();
          }
      }, false);
      stop(waitforvid); //cease checking if any video has loaded up.
      }
  }
}, 1000); //check if a video has loaded up every second.
  };
    inject();
}) ();