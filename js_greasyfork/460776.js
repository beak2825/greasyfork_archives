// ==UserScript==
// @name         Youtube  adjust playback rate using [ , ]
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  try to take over the world!
// @author       You
// @match        https://www.youtube.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=simply-how.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/460776/Youtube%20%20adjust%20playback%20rate%20using%20%5B%20%2C%20%5D.user.js
// @updateURL https://update.greasyfork.org/scripts/460776/Youtube%20%20adjust%20playback%20rate%20using%20%5B%20%2C%20%5D.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    const PATH_NAME = 'watch'
    window.addEventListener('yt-page-type-changed', function () {
        console.log('location changed!');
        initFunctionality(PATH_NAME)
    });
    if(window.location.pathname.indexOf(PATH_NAME)>-1){
        initFunctionality(PATH_NAME)
    }
    function initFunctionality(pathName){
        if(window.location.pathname.indexOf(pathName)>-1){
            let secondsOver = 0
            const myInterval = setInterval(()=>{
                secondsOver++;
                const els = document.getElementsByTagName('video')
                if(secondsOver >=5){
                    console.log("More than 5 seconds over");
                    stopColor()
                    return
                }
                if(els.length == 0){
                    console.log("Video tag not found");
                    return
                }
                const video = els[0]
                const body = document.getElementsByTagName('body')
                const element = body[0]

                function speedChangedMessageDiplay(type,time){
                    let block_to_insert = document.createElement( 'div' );
                    const DIV_ID = 'speed-change-div';
                    block_to_insert.innerHTML = `Speed ${type} to ${video.playbackRate}` ;
                    block_to_insert.id = DIV_ID;
                    block_to_insert.style.color = '#ffffff';
                    block_to_insert.style.position = 'absolute';
                    block_to_insert.style["z-index"] = 100;
                    block_to_insert.style.top = '0px';
                    block_to_insert.style.fontSize = '15px';

                    const videoPlayerWrappers = document.getElementsByClassName('html5-video-container')
                    if(videoPlayerWrappers.length == 0) return;
                    const videoPlayerWrapper = videoPlayerWrappers[0]
                    videoPlayerWrapper.appendChild(block_to_insert);

                    setTimeout(()=>{
                        const divEl = document.getElementById(DIV_ID);
                        divEl.remove()
                    },time)
                }

                element.onkeyup = (event)=>{
                    if(event.key == ']'){
                        video.playbackRate+=0.25
                        speedChangedMessageDiplay('increased',500)
                    }
                    else if(event.key == '['){
                        video.playbackRate-=0.25
                        speedChangedMessageDiplay('decreased',500)
                    }
                }
                stopColor()
            }, 1000);
            function stopColor() {
                clearInterval(myInterval);
            }
        }
    }


})();