// ==UserScript==
// @name         Video Volume Control
// @namespace    GamateKID
// @version      1.7
// @license      MIT
// @author       GamateKID
// @description  Adds volume control with mouse scroll on page video.
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/373428/Video%20Volume%20Control.user.js
// @updateURL https://update.greasyfork.org/scripts/373428/Video%20Volume%20Control.meta.js
// ==/UserScript==

(function() {

    'use strict';

    function secondsElapsed(){
        var endTime = new Date();
        var timeDiff = endTime - startTime; //in ms
        timeDiff /= 1000;
        // return seconds
        return Math.round(timeDiff);
    }

    function onReady(){
        if(secondsElapsed()<15){
            window.condition()?setTimeout(onReady,9):window.callback();
        }
    }

    var startTime = new Date();

    window.condition = function () {
        return (document.readyState == 'complete');
    };
    window.callback = function () {

        let VOLUME_DELTA = 0.05;

        const style = document.createElement('style');
        document.querySelector('head').appendChild(style);

        initStyles();

        window.condition = function () {
            return (document.getElementsByTagName('video')[0]==null);
        };
        window.callback = function(){
            var video = document.getElementsByTagName('video')[0];

            console.log(video);

            var volume = document.createElement('div');
            volume.className = 'myvolume'

            var container = video.parentNode;
            container.appendChild(volume);

            var isMouseOverVideo = false;

            video.addEventListener('loadeddata', function() {
                volume.innerText = parseInt(video.volume * 100);
                volume.style.display = 'block';
                setTimeout(function() { volume.style.display = 'none' }, 5000);
            }, false);

            video.addEventListener("mouseover", (event) => {
                isMouseOverVideo = true;
            }, false);

            video.addEventListener("mouseleave", (event) => {
                isMouseOverVideo = false;
            }, false);

            document.addEventListener("wheel", (event) => {
                if(isMouseOverVideo){
                    event.preventDefault();
                    volume.style.display = 'block';
                    var volumeValue = video.volume;
                    if (event.deltaY < 0) {
                        if(video.muted) video.muted = false;
                        if(video.volume <= (1-VOLUME_DELTA)){
                            volumeValue = video.volume + VOLUME_DELTA;
                        }else{
                            video.volume = 1;
                        }
                    }
                    if (event.deltaY > 0) {
                        if(video.volume >= VOLUME_DELTA){
                            volumeValue = video.volume - VOLUME_DELTA;
                        }else{
                            video.volume = 0;
                        }
                    }
                    volumeValue = Math.round((volumeValue) * 100);
                    volumeValue = Math.ceil(volumeValue / 5) * 5;
                    volumeValue = volumeValue / 100;
                    video.volume = volumeValue;
                    volume.innerText = parseInt(video.volume * 100);
                    setTimeout(function() { volume.style.display = 'none' }, 5000);
                }
            }, false);

            document.addEventListener("keydown", (event) => {

                if (event.keyCode === 37 /*left*/ || event.keyCode === 65 /*left*/ ) {
                    video.currentTime -= 5;
                }

                if(event.keyCode === 39 /*right*/ || event.keyCode === 68 /*right*/){
                    video.currentTime += 5;
                }

            }, false);

        };
        onReady();
        //CSS styles override
        function initStyles() {
           /* style.innerHTML = `
.myvolume {
display: none;
position: absolute;
color: orangered;
left: 1em;
font-size: xx-large;
font-weight: bold;
top: 0.7em;
}
`;*/
            style.innerHTML = `
.myvolume {
width: 100%;
position: absolute;
z-index: 9999;
top: 0.7em;
color: lime;
font-weight: bold;
font-size: 40px;
text-align: right;
-webkit-text-stroke: 1px black;
right: 20px;
}
`;

        }
    };
    onReady();
})();