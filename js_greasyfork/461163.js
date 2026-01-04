// ==UserScript==
// @name         Netflix adjust playback rate using [ , ]
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  You can now adjust playback rate of Netflix using [ , ] on keyboard
// @author       You
// @match        https://www.netflix.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=simply-how.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/461163/Netflix%20adjust%20playback%20rate%20using%20%5B%20%2C%20%5D.user.js
// @updateURL https://update.greasyfork.org/scripts/461163/Netflix%20adjust%20playback%20rate%20using%20%5B%20%2C%20%5D.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Your code here...
    (function () {
        var pushState = history.pushState;
        var replaceState = history.replaceState;

        history.pushState = function () {
            pushState.apply(history, arguments);
            window.dispatchEvent(new Event('pushstate'));
            window.dispatchEvent(new Event('locationchange'));
        };

        history.replaceState = function () {
            replaceState.apply(history, arguments);
            window.dispatchEvent(new Event('replacestate'));
            window.dispatchEvent(new Event('locationchange'));
        };

        window.addEventListener('popstate', function () {
            window.dispatchEvent(new Event('locationchange'))
        });
    })();


    // Usage example:
    const PATH_NAME = "watch"
    const INTERVAL_TIME_LIMIT = 20; // in seconds
    window.addEventListener('locationchange', function () {
        console.log('onlocationchange event occurred!');
        if(window.location.pathname.includes(PATH_NAME)){
            initFunctionality()
        }
    })

    if(window.location.pathname.includes(PATH_NAME)){
        initFunctionality()
    }

    function initFunctionality(){
        let secondsOver = 0
        const myInterval = setInterval(() => {
            secondsOver++;
            const els = document.getElementsByTagName('video')
            if (secondsOver >= INTERVAL_TIME_LIMIT) {
                console.log(`More than ${INTERVAL_TIME_LIMIT} seconds over`);
                stopColor()
                return
            }
            if (els.length == 0) {
                console.log("Video tag not found");
                return
            }
            const video = els[0]
            video.style["background"] = '#000000';
            console.log("Updated background color to black");

            const body = document.getElementsByTagName('body')
            const element = body[0]

            function speedChangedMessageDiplay(type, time) {
                let block_to_insert = document.createElement('div');
                const DIV_ID = 'speed-change-div';
                block_to_insert.innerHTML = `Speed ${type} to ${video.playbackRate}`;
                block_to_insert.id = DIV_ID;
                block_to_insert.style.color = '#ffffff';
                block_to_insert.style.position = 'absolute';
                block_to_insert.style["z-index"] = 100;
                block_to_insert.style.top = '0px';
                block_to_insert.style.fontSize = '15px';

                const videoPlayerWrapper = video.parentElement;
                videoPlayerWrapper.appendChild(block_to_insert);

                setTimeout(() => {
                    const divEl = document.getElementById(DIV_ID);
                    divEl.remove()
                }, time)
            }

            element.onkeyup = (event) => {
                if (event.key == ']') {
                    video.playbackRate += 0.25
                    speedChangedMessageDiplay('increased', 500)
                }
                else if (event.key == '[') {
                    video.playbackRate -= 0.25
                    speedChangedMessageDiplay('decreased', 500)
                }
            }
            stopColor()
        }, 1000);
        function stopColor() {
            clearInterval(myInterval);
        }
    }



})();