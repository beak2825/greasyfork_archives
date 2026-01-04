// ==UserScript==
// @name         Maximum Audio output for Youtube
// @namespace    https://greasyfork.org/de/users/777213-tripzz-ѕкιηѕ-lpwsand
// @version      0.8.1
// @description  It will make some of your youtube videos louder, the reason why this is possible is because sometimes you can slide to 100% music output, but youtube validates it in it's javascript to a lower music output then 100%, in this skript I make a new slider which makes your youtube videos always the maximux output when you make your videos on 100%
// @author       ReconSvG
// @match        https://www.youtube.com/w*
// @match        http://www.youtube.com/w*
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/427173/Maximum%20Audio%20output%20for%20Youtube.user.js
// @updateURL https://update.greasyfork.org/scripts/427173/Maximum%20Audio%20output%20for%20Youtube.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let speakerSymbol = document.querySelector("#movie_player > div.ytp-chrome-bottom > div.ytp-chrome-controls > div.ytp-left-controls > span");
    let speakerSymbolButton = document.querySelector("#movie_player > div.ytp-chrome-bottom > div.ytp-chrome-controls > div.ytp-left-controls > span.ytp-volume-area > button");
    let MuteFalseOrTrue;

    // to get a perfect x.xx pattern
    function pad(volumeSkriptSliderValue) {
        // checks length, if it's under 4 length, then it adds the necessary string to the variable and returns it as a result
        switch (volumeSkriptSliderValue.length) {
            case 1:
                volumeSkriptSliderValue += ".00"
                break;
            case 3:
                volumeSkriptSliderValue += "0";
                break;
        };
        return volumeSkriptSliderValue;
    };

    // place a element on the left side of the reference element
    function insertAfter(referenceNode, newNode) {
        referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
    };

    // get the speaker element of youtube
    let volumeSign = document.getElementsByClassName("ytp-next-button ytp-button")[0];


    // create a new element and append it on the left side of the speaker symbol, this symbol tells you numerically how loud the video is relative to how loud it can be
    // for example 0.5 tells you it's only 50% loud relative to its maximum output
    var representVolume = document.createElement("span");
    representVolume.setAttribute("id", "represent");
    representVolume.style.color = "#ddd";
    representVolume.textContent = "?";
    representVolume.style.width = "23.354px";
    representVolume.style.textAlign = "center";
    representVolume.style.position = "relative";
    representVolume.style.top = "1px";
    representVolume.style.width = "23px";

    // put the representVolume value on the left side of the volumeSign on youtube
    insertAfter(volumeSign, representVolume);


    // the new youtube slider
    var volumeSkriptSlider = document.createElement("input");
    volumeSkriptSlider.setAttribute("id","volumeSkriptSlider");
    volumeSkriptSlider.setAttribute("type","range");
    volumeSkriptSlider.setAttribute("step","0.01");
    volumeSkriptSlider.setAttribute("min","0");
    volumeSkriptSlider.setAttribute("max","1");

    volumeSkriptSlider.style.position = "relative";
    volumeSkriptSlider.style.marginRight = "3px";

    let styleSlider = document.createElement("style");
    styleSlider.type = 'text/css';


    // make the css indentical to the youtube volume slider
    styleSlider.innerHTML = `
input[type="range"] {
  -webkit-appearance: none;
  appearance: none;
  width: 52px;
  background: transparent;
  cursor: pointer;
}

input[type="range"]::-webkit-slider-runnable-track {
  background: #fff;
  height: 0.3rem;
}

input[type="range"]::-moz-range-track {
  background: #fff;
  height: 0.3rem;
}

input[type="range"]::-webkit-slider-thumb {
   -webkit-appearance: none; /* Override default look */
   appearance: none;
   margin-top: -4px; /* Centers thumb on the track */
   background-color: #FFFF;
   height: 1.2rem;
   width: 1.2rem;
   border-radius: 8px;
}

input[type="range"]::-moz-range-thumb {
    border: none;
    border-radius: 8px;
    background-color: #FFFF;
    height: 1.2rem;
    width: 1.2rem;
}

`;
    // Append the styles to the new slider
    document.getElementsByTagName('head')[0].appendChild(styleSlider);

    // code to not display the original volume slider from youtube
    if (document.querySelector("#movie_player > div.ytp-chrome-bottom > div.ytp-chrome-controls > div.ytp-left-controls > span.ytp-volume-area > div")) {
        document.querySelector("#movie_player > div.ytp-chrome-bottom > div.ytp-chrome-controls > div.ytp-left-controls > span.ytp-volume-area > div").style.display = "none";
    };


    // append our own volume slider to youtube
    speakerSymbol.insertBefore(volumeSkriptSlider, null);

    // if video is muted
    if (document.querySelector("#movie_player > div.ytp-chrome-bottom > div.ytp-chrome-controls > div.ytp-left-controls > span.ytp-volume-area > button > svg").outerHTML == '<svg height="100%" version="1.1" viewBox="0 0 36 36" width="100%"><use class="ytp-svg-shadow" xlink:href="#ytp-id-17"></use><path class="ytp-svg-fill" d="m 21.48,17.98 c 0,-1.77 -1.02,-3.29 -2.5,-4.03 v 2.21 l 2.45,2.45 c .03,-0.2 .05,-0.41 .05,-0.63 z m 2.5,0 c 0,.94 -0.2,1.82 -0.54,2.64 l 1.51,1.51 c .66,-1.24 1.03,-2.65 1.03,-4.15 0,-4.28 -2.99,-7.86 -7,-8.76 v 2.05 c 2.89,.86 5,3.54 5,6.71 z M 9.25,8.98 l -1.27,1.26 4.72,4.73 H 7.98 v 6 H 11.98 l 5,5 v -6.73 l 4.25,4.25 c -0.67,.52 -1.42,.93 -2.25,1.18 v 2.06 c 1.38,-0.31 2.63,-0.95 3.69,-1.81 l 2.04,2.05 1.27,-1.27 -9,-9 -7.72,-7.72 z m 7.72,.99 -2.09,2.08 2.09,2.09 V 9.98 z" id="ytp-id-17"></path></svg>') {
        MuteFalseOrTrue = true;
        document.querySelector("#volumeSkriptSlider").value = 0;
    } else {
        // video is not muted
        MuteFalseOrTrue = false;
    };


    // if speaker symbol is clicked do...
    speakerSymbolButton.addEventListener("click", () => {
        // if video is clicked to get unmuted then do...
        if (MuteFalseOrTrue) {
            MuteFalseOrTrue = false;
            document.querySelector("#volumeSkriptSlider").value = 1;

            // if video is clicked to get muted then do...
        } else {
            MuteFalseOrTrue = true;
            document.querySelector("#volumeSkriptSlider").value = 0;

        };
    });


    // update volume = Interval 1ms
    setInterval(() => {

        // get the value of the new made slider, and make it the volume value
        document.getElementsByClassName("video-stream")[0].volume = document.querySelector("#volumeSkriptSlider").value;

        // if there was a change in volume, then update it
        if (representVolume.textContent !== pad(document.getElementsByClassName("video-stream")[0].volume.toString())) {


            representVolume.textContent = pad(document.querySelector("#volumeSkriptSlider").value);


            // only if the mute button is not clicked should this run
            if (!MuteFalseOrTrue) {
                // modify speaker symbol to it's normal behavior
                if (document.getElementsByClassName("video-stream")[0].volume < 0.5 && document.getElementsByClassName("video-stream")[0].volume !== 0) {
                    document.querySelector("#movie_player > div.ytp-chrome-bottom > div.ytp-chrome-controls > div.ytp-left-controls > span > button").innerHTML = '<svg height="100%" version="1.1" viewBox="0 0 36 36" width="100%"><use class="ytp-svg-shadow" xlink:href="#ytp-id-15"></use><use class="ytp-svg-shadow" xlink:href="#ytp-id-16"></use><defs><clipPath id="ytp-svg-volume-animation-mask"><path d="m 14.35,-0.14 -5.86,5.86 20.73,20.78 5.86,-5.91 z"></path><path d="M 7.07,6.87 -1.11,15.33 19.61,36.11 27.80,27.60 z"></path><path class="ytp-svg-volume-animation-mover" d="M 9.09,5.20 6.47,7.88 26.82,28.77 29.66,25.99 z" transform="translate(0, 0)"></path></clipPath><clipPath id="ytp-svg-volume-animation-slash-mask"><path class="ytp-svg-volume-animation-mover" d="m -11.45,-15.55 -4.44,4.51 20.45,20.94 4.55,-4.66 z" transform="translate(0, 0)"></path></clipPath></defs><path class="ytp-svg-fill ytp-svg-volume-animation-speaker" clip-path="url(#ytp-svg-volume-animation-mask)" d="M8,21 L12,21 L17,26 L17,10 L12,15 L8,15 L8,21 Z M19,14 L19,22 C20.48,21.32 21.5,19.77 21.5,18 C21.5,16.26 20.48,14.74 19,14 Z" fill="#fff" id="ytp-id-15"></path><path class="ytp-svg-fill ytp-svg-volume-animation-hider" clip-path="url(#ytp-svg-volume-animation-slash-mask)" d="M 9.25,9 7.98,10.27 24.71,27 l 1.27,-1.27 Z" fill="#fff" id="ytp-id-16" style="display: none;"></path></svg>';
                } else if (document.getElementsByClassName("video-stream")[0].volume > 0.5) {
                    document.querySelector("#movie_player > div.ytp-chrome-bottom > div.ytp-chrome-controls > div.ytp-left-controls > span > button").innerHTML = '<svg height="100%" version="1.1" viewBox="0 0 36 36" width="100%"><use class="ytp-svg-shadow" xlink:href="#ytp-id-15"></use><use class="ytp-svg-shadow" xlink:href="#ytp-id-16"></use><defs><clipPath id="ytp-svg-volume-animation-mask"><path d="m 14.35,-0.14 -5.86,5.86 20.73,20.78 5.86,-5.91 z"></path><path d="M 7.07,6.87 -1.11,15.33 19.61,36.11 27.80,27.60 z"></path><path class="ytp-svg-volume-animation-mover" d="M 9.09,5.20 6.47,7.88 26.82,28.77 29.66,25.99 z" transform="translate(0, 0)"></path></clipPath><clipPath id="ytp-svg-volume-animation-slash-mask"><path class="ytp-svg-volume-animation-mover" d="m -11.45,-15.55 -4.44,4.51 20.45,20.94 4.55,-4.66 z" transform="translate(0, 0)"></path></clipPath></defs><path class="ytp-svg-fill ytp-svg-volume-animation-speaker" clip-path="url(#ytp-svg-volume-animation-mask)" d="M8,21 L12,21 L17,26 L17,10 L12,15 L8,15 L8,21 Z M19,14 L19,22 C20.48,21.32 21.5,19.77 21.5,18 C21.5,16.26 20.48,14.74 19,14 ZM19,11.29 C21.89,12.15 24,14.83 24,18 C24,21.17 21.89,23.85 19,24.71 L19,26.77 C23.01,25.86 26,22.28 26,18 C26,13.72 23.01,10.14 19,9.23 L19,11.29 Z" fill="#fff" id="ytp-id-15"></path><path class="ytp-svg-fill ytp-svg-volume-animation-hider" clip-path="url(#ytp-svg-volume-animation-slash-mask)" d="M 9.25,9 7.98,10.27 24.71,27 l 1.27,-1.27 Z" fill="#fff" id="ytp-id-16" style="display: none;"></path></svg>';
                } else if (document.getElementsByClassName("video-stream")[0].volume == 0) {
                    document.querySelector("#movie_player > div.ytp-chrome-bottom > div.ytp-chrome-controls > div.ytp-left-controls > span > button").innerHTML = '<svg height="100%" version="1.1" viewBox="0 0 36 36" width="100%"><use class="ytp-svg-shadow" xlink:href="#ytp-id-139"></use><path class="ytp-svg-fill" d="m 21.48,17.98 c 0,-1.77 -1.02,-3.29 -2.5,-4.03 v 2.21 l 2.45,2.45 c .03,-0.2 .05,-0.41 .05,-0.63 z m 2.5,0 c 0,.94 -0.2,1.82 -0.54,2.64 l 1.51,1.51 c .66,-1.24 1.03,-2.65 1.03,-4.15 0,-4.28 -2.99,-7.86 -7,-8.76 v 2.05 c 2.89,.86 5,3.54 5,6.71 z M 9.25,8.98 l -1.27,1.26 4.72,4.73 H 7.98 v 6 H 11.98 l 5,5 v -6.73 l 4.25,4.25 c -0.67,.52 -1.42,.93 -2.25,1.18 v 2.06 c 1.38,-0.31 2.63,-0.95 3.69,-1.81 l 2.04,2.05 1.27,-1.27 -9,-9 -7.72,-7.72 z m 7.72,.99 -2.09,2.08 2.09,2.09 V 9.98 z" id="ytp-id-139"></path></svg>';
                };
            };
        };
    },1);
})();