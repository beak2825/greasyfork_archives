// ==UserScript==
// @name         Key control for videos
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Key control for videos on jw.org
// @author       You
// @include      https://www.jw.org/en/library/videos/*
// @include      https://www.jw.org/fr/biblioth%C3%A8que/videos/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=jw.org
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/461395/Key%20control%20for%20videos.user.js
// @updateURL https://update.greasyfork.org/scripts/461395/Key%20control%20for%20videos.meta.js
// ==/UserScript==

(function() {
    window.onkeydown = function(e) {
        waitForElm('video').then((video) => {
            if(e.keyCode == 32){
                // prevent scroll
                if(e.target == document.body)
                    e.preventDefault();

                const isVideoPlaying = (video.currentTime > 0 && !video.paused && !video.ended && video.readyState > 2);
                if(isVideoPlaying)video.pause();
                else video.play();
            }
            else if(e.keyCode == 39)
                video.currentTime += 5;
            else if(e.keyCode == 37)
                video.currentTime -= 5;
        });
    }


    function waitForElm(selector) {
        return new Promise(resolve => {
            if (document.querySelector(selector)) {
                return resolve(document.querySelector(selector));
            }

            const observer = new MutationObserver(mutations => {
                if (document.querySelector(selector)) {
                    resolve(document.querySelector(selector));
                    observer.disconnect();
                }
            });

            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
        });
    }


})();