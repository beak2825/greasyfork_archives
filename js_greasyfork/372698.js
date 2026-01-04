// ==UserScript==
// @author nik9
// @name YouTube PiP Enabler (Chromium 70+)
// @namespace Violentmonkey Scripts
// @include *://youtube.com/*
// @include *.youtube.com/*
// @version 1.0
// @description Adds PiP button in YouTube Player
// @grant none
// @downloadURL https://update.greasyfork.org/scripts/372698/YouTube%20PiP%20Enabler%20%28Chromium%2070%2B%29.user.js
// @updateURL https://update.greasyfork.org/scripts/372698/YouTube%20PiP%20Enabler%20%28Chromium%2070%2B%29.meta.js
// ==/UserScript==

var playerReady = setInterval(function() {
  if (document.querySelector("div.ytp-right-controls") && document.querySelector("video")) {
    clearInterval(playerReady);
    var btn = document.createElement("button");
    btn.type = "button";
    btn.className = "ytp-button"
    btn.title = "Toggle PiP";
    btn.innerHTML = '<svg width="100%" xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 36 36"><defs>    <style>      .cls-1 {        fill: #fff;        fill-rule: evenodd;      }      .cls-2 {        fill: none;        stroke: #fff;        stroke-width: 3px;      }    </style>  </defs>  <path id="Прямоугольник_1" data-name="Прямоугольник 1" class="cls-1" d="M18.548,17.931h7.119v4.034H18.548V17.931Z"/>  <rect id="Прямоугольник_2" data-name="Прямоугольник 2" class="cls-2" x="5" y="9" width="26" height="18"/></svg>';
    var videoReady = setInterval(function() {
      if (document.querySelector("video").readyState === 4) {
        clearInterval(videoReady);
        var video = document.querySelector("video")

        console.log("Видео пашол")

        let pipWindow;

        video.addEventListener('enterpictureinpicture', function(event) {
          console.log('Плеер вошел в PiP');
        });

        video.addEventListener('leavepictureinpicture', function(event) {
          console.log('Плеер вышел из PiP');
        });

        if ('pictureInPictureEnabled' in document) {
          setPipButton();
          video.addEventListener('loadedmetadata', setPipButton);
          video.addEventListener('emptied', setPipButton);
        } else {
          btn.hidden = true;
        }

        function setPipButton() {
          btn.disabled = (video.readyState === 0) || !document.pictureInPictureEnabled || video.disablePictureInPicture;
        }

        document.querySelector("div.ytp-right-controls").insertBefore(btn, document.querySelector("button.ytp-fullscreen-button"));
        btn.addEventListener("click", function() {
          console.log('Включение PiP...');
          btn.disabled = true;
          try {

            if (video !== document.pictureInPictureElement)
              video.requestPictureInPicture();
            else
              document.exitPictureInPicture();

          } catch(error) {
            console.log(`Бля! ${error}`);
          } finally {
            btn.disabled = false;
          }
        });
      }
    },100)
  }
},100)