// ==UserScript==
// @name         YouTube Exit Fullscreen on Video End
// @namespace    https://www.youtube.com/
// @version      1.1
// @description  Exit YouTube fullscreen when a video finishes playing (disabled for playlists)
// @author       xdpirate
// @match        *://www.youtube.com/*
// @license      GPL v2.0
// @icon         https://www.google.com/s2/favicons?domain=youtube.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/436168/YouTube%20Exit%20Fullscreen%20on%20Video%20End.user.js
// @updateURL https://update.greasyfork.org/scripts/436168/YouTube%20Exit%20Fullscreen%20on%20Video%20End.meta.js
// ==/UserScript==

function ytNavigated() {
    if(location.href.includes("/watch") && !location.href.includes("list=")) {
        let videoPlayer = document.getElementById('movie_player');
        if(videoPlayer) {
            let observer = new MutationObserver(function(event) {
                if(videoPlayer.classList.contains("ended-mode")) {
                    if(document.fullscreenElement) {
                        document.exitFullscreen();
                    }
                }
            });
        
            observer.observe(videoPlayer, {
                attributes: true,
                attributeFilter: ['class'],
                childList: false,
                characterData: false
            });
        }
    }
}

(document.body || document.documentElement).addEventListener('yt-navigate-finish', function(event) {
        ytNavigated();
}, true);

ytNavigated();
