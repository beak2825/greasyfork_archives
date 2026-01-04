// ==UserScript==
// @name         Fix ZZZ Opera Music
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Fixes the music not playing in the Opera Browser on the Zenless Zone Zero website.
// @author       WhiteTapeti
// @match        *://zenless.hoyoverse.com/*
// @exclude      *://zenless.hoyoverse.com/*.*
// @icon         https://animetopbtns.github.io/website/Fix%20ZZZ%20Opera%20Music/fixZZZOperaMusicV3.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/473893/Fix%20ZZZ%20Opera%20Music.user.js
// @updateURL https://update.greasyfork.org/scripts/473893/Fix%20ZZZ%20Opera%20Music.meta.js
// ==/UserScript==

var loaded = 0;
var audio = new Audio(
    "https://webstatic.hoyoverse.com/upload/static-resource/2022/04/19/aeefeb96a2a294cf1d7ab7324fd9a492_568718570249589416.mp3",
);
audio.loop = true;
var cAudioV = 1;

var elemDivMusicTooltipMainElem = document.createElement("span");
elemDivMusicTooltipMainElem.classList.add("tooltiptext");
elemDivMusicTooltipMainElem.classList.add("tooltip-bottom");
elemDivMusicTooltipMainElem.onclick = function(e) {
    e.stopPropagation();
};

elemDivMusicTooltipMainElem.innerHTML = `
<div class="slidecontainer">
  <input type="range" min="0" max="100" value="100" class="slider" id="myRange">
  <p style="font-size: medium;">Volume: <span id="demo"></span></p>
</div>
`;

setInterval(function testLoading() {
    if (loaded == 0) {
        if (document.getElementsByClassName("loading").length == 0 || document.getElementsByClassName("loading")[0].attributes.style.nodeValue == "display: none;" || document.body.contains(document.getElementsByClassName("loading")) == false) {
            audio.volume = 0;
            audio.play();
            getSoundAndFadeAudio(1);
            document.body
                .getElementsByClassName("m-audio-player header__bgm")[0]
                .appendChild(elemDivMusicTooltipMainElem);
            var slider = document.getElementById("myRange");
            var output = document.getElementById("demo");
            output.innerHTML = slider.value;

            slider.oninput = function() {
                output.innerHTML = this.value;
                cAudioV = (this.value) / 100;
                audio.volume = cAudioV;
            };
        }
    }
}, 200);

document.addEventListener("click", function(event) {
    if (event.target.classList.contains("m-audio-player__icon--active")) {
        if (!audio.paused) {
            //check audio is playing
            audio.pause();
        }
    } else if (event.target.classList.contains("m-audio-player__icon")) {
        if (audio.paused) {
            //check audio is playing
            audio.volume = 0;
            audio.play();
            getSoundAndFadeAudio(0);
        }
    }
});

function getSoundAndFadeAudio(e) {
    if (e == 1) {
        loaded = 1;
    }
    // Set the point in playback that fadein begins.
    var fadePoint = audio.duration - cAudioV;

    var fadeAudio = setInterval(function() {

        // Only fade if past the fade in point or not at one already
        if ((audio.currentTime <= fadePoint) && (audio.volume !== cAudioV)) {
            audio.volume = Number(audio.volume + 0.01).toFixed(2);
        }
        // When volume at one stop all the intervalling
        if (audio.volume === cAudioV) {
            clearInterval(fadeAudio);
        }
    }, 20);

}
var elemDivMusicTooltipMainStyle = document.createElement("style");

elemDivMusicTooltipMainStyle.innerHTML = `
.header__bgm .tooltiptext {
    visibility: hidden;
    position: absolute;
    width: 120px;
    background-color: #0a0a0a;
    outline: solid #646464;
    color: #fff;
    text-align: center;
    padding: 5px 0;
    border-radius: 6px;
    z-index: 1;
    opacity: 0;
    transition: opacity .6s;
    cursor: auto;
}

.tooltip-bottom {
    top: 135%;
    left: 50%;
    margin-left: -60px;
}

.tooltip-bottom::after {
    content: "";
    position: absolute;
    bottom: 100%;
    left: 50%;
    margin-left: -9px;
    border-width: 9px;
    border-style: solid;
    border-color: transparent transparent #0a0a0a transparent;
}

.tooltip-bottom::before {
    content: "";
    position: absolute;
    bottom: 100%;
    left: 50%;
    margin-left: -13px;
    border-width: 13px;
    border-style: solid;
    border-color: transparent transparent #646464 transparent;
}

.header__bgm:hover .tooltiptext {
    visibility: visible;
    opacity: 1;
    padding: 9px;
}

.slidecontainer {
  width: 100%;
  display: grid !important;
}

.slider {
  -webkit-appearance: none;
  width: 100%;
  height: 15px;
  border-radius: 5px;
  background: #464646;
  outline: none;
  opacity: 0.7;
  -webkit-transition: .2s;
  transition: opacity .2s;
  margin-bottom: 6px;
}

.slider:hover {
  opacity: 1;
}

.slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 25px;
  height: 25px;
  border-radius: 50%;
  background: #d8fa00;
  cursor: pointer;
}

.slider::-moz-range-thumb {
  width: 25px;
  height: 25px;
  border-radius: 50%;
  background: #d8fa00;
  cursor: pointer;
}
`;

document.body.append(elemDivMusicTooltipMainStyle);