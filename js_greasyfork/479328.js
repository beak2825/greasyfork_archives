// ==UserScript==
// @name         Twitter unmute sound on autoplayed videos
// @namespace    http://zezombye.dev/
// @version      0.1
// @description  Automatically unmutes the sound on autoplayed videos on Twitter.
// @author       Zezombye
// @match        https://twitter.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=twitter.com
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/479328/Twitter%20unmute%20sound%20on%20autoplayed%20videos.user.js
// @updateURL https://update.greasyfork.org/scripts/479328/Twitter%20unmute%20sound%20on%20autoplayed%20videos.meta.js
// ==/UserScript==

/*

Twitter's code is so unnecessarily complex. I could just get the video element
and do video.volume = 1 right? But nooo the twitter (sorry, X) engineers had
to create the AudioElement within pure JS. So the only way I found to access it
was to use the "m" hotkey to toggle mute. It isn't 100% reliable though. I
couldn't manage to trigger the click event.

*/

(function() {
    'use strict';

    setInterval(function() {
        let videos = document.getElementsByTagName("video");
        for (let video of videos) {
            if (video.hasAttribute("has-unmute-play-event")) {
                continue;
            }
            video.onplay = async function(e) {
                let videoKeyboardRegister = e.target.parentElement.parentElement.parentElement.children[1];
                if (videoKeyboardRegister.hasAttribute("has-been-played-once")) {
                    return;
                }
                //console.log(videoKeyboardRegister);
                videoKeyboardRegister.setAttribute("has-been-played-once", "true");
                //videoKeyboardRegister.onkeypress = function(e) {console.log(e)};
                
                //Sometimes videos don't play if it's too low. Setting it to 50 is too low. So far on 100 no problem.
                await new Promise(r => setTimeout(r, 100));
                //console.log("owo");
                videoKeyboardRegister.focus({preventScroll: true});
                videoKeyboardRegister.dispatchEvent(new KeyboardEvent("keypress", {key: "m", charCode: 109, bubbles: false, cancelable: true, code: "Semicolon", isTrusted: true, keyCode: 109, which: 109}));
            }
            video.setAttribute("has-unmute-play-event", "true");
        }
    }, 100);
})();