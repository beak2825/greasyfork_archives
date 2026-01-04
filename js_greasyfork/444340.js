// ==UserScript==
// @name         YouTube Shorts Autoscroll and Seek
// @version      1.2
// @description  Scrolls in YT Shorts automatically after a video finished
// @author       Taki7o7 aka. WaGi-Coding
// @match        *://www.youtube.com/shorts/*
// @require      http://code.jquery.com/jquery-latest.js
// @run-at       document-idle
// @license MIT
// @namespace https://greasyfork.org/users/772124
// @downloadURL https://update.greasyfork.org/scripts/444340/YouTube%20Shorts%20Autoscroll%20and%20Seek.user.js
// @updateURL https://update.greasyfork.org/scripts/444340/YouTube%20Shorts%20Autoscroll%20and%20Seek.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var $ = window.jQuery;
    var vid = null;


    function GetVidAndBtn(){
        if (document.querySelector("#shorts-player > div.html5-video-container > video") != null) {

            vid = document.querySelector("#shorts-player > div.html5-video-container > video");

            $(vid).removeAttr('loop');

            $(vid).on('ended',function(){

                console.log("ended!");

                $('#navigation-button-down').find("button").first().click();

            });
        }
    }

    var timer = setInterval(() => {
        addEventListener("keydown", function(e) {
          switch (e.key.toUpperCase()) {

              case "ARROWLEFT":
              case "A":
                  vid.currentTime=vid.currentTime-2;
                  break;
              case "ARROWRIGHT":
              case "D":
                  vid.currentTime=vid.currentTime+2;
                  break;

              default:
                  console.log(e.key.toUpperCase());
                  break;
          }
      });
        GetVidAndBtn();
        //vid.currentTime = vid.currentTime - 1;
        clearInterval(timer);
    }, 500);

    var timer2 = setInterval(() => {
        GetVidAndBtn();
        if ($('ytd-reel-video-renderer').length >= 28) {
            $('ytd-reel-video-renderer:lt(9)').remove();
        }
    }, 500);

})();