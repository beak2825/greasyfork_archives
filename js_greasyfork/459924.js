// ==UserScript==
// @name        Fyyd.de redesign
// @namespace   https://fyyd.de
// @description Improve the user interface of fyyd podcasts with just the audio element.
// @include     https://fyyd.de/episode/*
// @version     1.2
// @license     MIT
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/459924/Fyydde%20redesign.user.js
// @updateURL https://update.greasyfork.org/scripts/459924/Fyydde%20redesign.meta.js
// ==/UserScript==

// anonymous function closure to avoid global variables
(function() {

  // use strict mode with variable declaration
  "use strict";

  var newDate = "unknown_date";

  // get the HTML element with the class "uk-width-2-5" for the date of the podcast
  var spanElement = document.querySelector("div.uk-width-2-5 span");

  if (spanElement) {
    var titleContent = spanElement.title;

    // extract the date from the title
    var myDate = titleContent.match(/\d{2}\.\d{2}\.\d{4}/)[0];

    // format the date
    var dateParts = myDate.split(".");
    newDate = dateParts[2] + "-" + dateParts[1] + "-" + dateParts[0];
    console.log(newDate);
  }

  // functions for button presses
  function skipSeconds(event) {
    // console.log("event: " + event.target.textContent);
    audioElement.currentTime += parseInt(event.target.textContent);
  }

  function setSpeed(event) {
    audioElement.playbackRate = parseFloat(event.target.textContent);
  }

  // get URL for mp3 file
  var audioSrc = document.querySelector("meta[name='twitter:player:stream']").content;

  if (audioSrc) {
    console.log("URL: " + audioSrc);

/*
    fetch(audioSrc)
      .then(response => response.blob())
      .then(blob => {
        var urlBlob = URL.createObjectURL(blob);
*/

        var urlBlob = audioSrc;

        // create the new webpage
        var audioElement = document.createElement("audio");
        audioElement.src = urlBlob;
        audioElement.controls = true;
        audioElement.autoplay = true;

        var linkElement = document.createElement("a");
        linkElement.href = urlBlob;
        linkElement.download = newDate + "_hakendran.mp3";
        linkElement.textContent = newDate;

        var divElement = document.createElement("div");
        divElement.className = "side";

        var divElement2 = document.createElement("div");
        divElement2.className = "side";

        var style = document.createElement("style");
        style.innerHTML = "* { background: black; color: white; font-size: 30px; text-align: center; margin-left: auto; margin-right: auto; }\n" +
          "body { height: 150% }\n" +
          "audio {width: 100%; max-width: 800px; margin-top: 20vh}\n" +
          ".bigButton { display: block; width: 100%; max-width: 800px; margin-top: 20px; }\n" +
          ".mybutton { float: left; width: 25%; margin-top: 20px; }\n" +
          "a { height: 50px; display: block; margin-top: 20px; width: 100%}\n" +
          ".side { display: block; overflow: auto; max-width: 600px; }";
        document.head.appendChild(style);

        var playElement = document.createElement("button");
        playElement.textContent = "play / pause";
        playElement.className = "bigButton";
        playElement.addEventListener("click", function() {
          if (audioElement.paused) {
            audioElement.play();
          } else {
            audioElement.pause();
          }
        });

        document.body.innerHTML = "";
        document.body.appendChild(audioElement);
        document.body.appendChild(playElement);

        var times = [ "-60", "-10", "+10", "+60" ];
        var button = new Array(4);
        var index = 0;
        for ( index = 0; index < times.length; index++) {
          button[index] = document.createElement("button");
          button[index].textContent = times[index];
          button[index].className = "mybutton";
          button[index].addEventListener("click", skipSeconds);
          divElement.appendChild(button[index]);
        }

        var speeds = [ "1.0", "1.2", "1.3", "1.5" ];
        var button2 = new Array(4);
        for ( index = 0; index < speeds.length; index++) {
          button2[index] = document.createElement("button");
          button2[index].textContent = speeds[index];
          button2[index].className = "mybutton";
          button2[index].addEventListener("click", setSpeed);
          divElement2.appendChild(button2[index]);
        }

        document.body.appendChild(divElement);
        document.body.appendChild(divElement2);
        document.body.appendChild(linkElement);

//      });

  } else {
    console.log("audioSrc not found");
  }


})();
