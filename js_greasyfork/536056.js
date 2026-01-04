// ==UserScript==
// @name         YouTube Watch Page Chat-Replay CSS
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Customize video and chat layout on YouTube watch page
// @match        https://www.youtube.com/watch?v=*
// @grant        none
// @license      CC0
// @downloadURL https://update.greasyfork.org/scripts/536056/YouTube%20Watch%20Page%20Chat-Replay%20CSS.user.js
// @updateURL https://update.greasyfork.org/scripts/536056/YouTube%20Watch%20Page%20Chat-Replay%20CSS.meta.js
// ==/UserScript==


(function () {
    'use strict';
		
  	let styleElement = null;
  	const css = `/* video */
#player, .html5-main-video, #movie_player {
    position: absolute !important;
    top: 0px !important;
    left: 0px !important;
    width: calc(100vw - 420px) !important;
    height: calc(105vh - 58px) !important;
    object-fit: contain !important;
    border: 1px solid #000 !important;
}
.ytp-chrome-bottom {
    width: 100vw !important;
}

/* chat */
#chat {
    position: absolute !important;
    top: -56px !important;
    left: 4px !important;
    
    width: 420px !important;
    height: 100vh !important;
    overflow-y: auto !important;
    border-radius: 0px !important;
    border: 1px solid #333 !important;
}

/* hide everything else */
#above-the-fold, .ytd-watch-metadata, #comments, #chips, .ytd-watch-next-secondary-results-renderer, .ytd-masthead, #end {
    display: none !important;
}

`
  	
    document.addEventListener('keydown', function (e) {
        // Use F2 as toggle key
        if (e.key === 'F2') {
            if (styleElement) {
                styleElement.remove();
                styleElement = null;
            
            } else {
                styleElement = document.createElement('style');
                styleElement.textContent = css;
                document.head.appendChild(styleElement);
            }
        }
    });
})();



