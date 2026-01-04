// ==UserScript==
// @author nik9
// @name Twitch PiP Enabler (Chromium 70+)
// @namespace Violentmonkey Scripts
// @include *://twitch.tv/*
// @include *.twitch.tv/*
// @version 1.5
// @description Adds PiP button in Twitch Player
// @grant none
// @downloadURL https://update.greasyfork.org/scripts/372695/Twitch%20PiP%20Enabler%20%28Chromium%2070%2B%29.user.js
// @updateURL https://update.greasyfork.org/scripts/372695/Twitch%20PiP%20Enabler%20%28Chromium%2070%2B%29.meta.js
// ==/UserScript==

var playerReady = setInterval(function() {
  if (document.querySelector("div.player-buttons-right") && document.querySelector("video")) {
    console.log("Плеер пашол")
    clearInterval(playerReady);


    var btn = document.createElement("button");

    btn.className = "player-button pl-mg-r-1 pl-button__fullscreen--tooltip-left";
    btn.type = "button";
    btn.style = "display: inline-block";
    btn.id = "pip-button";
    btn.innerHTML = '<span><span class="player-tip" data-tip="Toggle PiP"></span><span class=""><svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><defs> <style>.cls-1 { fill: none; stroke-width: 4px;}.cls-1, .cls-2 {stroke: #fff;} .cls-2 {fill: #fff;stroke-width: 2px;}</style></defs><rect id="Прямоугольник_скругл._углы_1" data-name="Прямоугольник, скругл. углы 1" class="cls-1" x="9" y="25" width="82" height="50" rx="5" ry="5"/><rect id="Прямоугольник_скругл._углы_2" data-name="Прямоугольник, скругл. углы 2" class="cls-2" x="57" y="50" width="25" height="17" rx="2.5" ry="2.5"/></svg></span></span>';
    btn.style.padding = "1px 5px 1em";

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

        document.querySelector("div.player-buttons-right").insertBefore(btn, document.querySelector("button.player-button--fullscreen"));
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
      } else {
        console.log(video.readyState)
      }
    }, 100)
  }
}, 100);