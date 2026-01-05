// ==UserScript==
// @name            Coursera - auto play next video
// @description     Coursera Extension to automatically go to the next video when the video is over (prevents annoying purchase certificate banners)
// @version         1.0
// @namespace       https://www.github.com/sh0oki/coursera-autoplay
// @source          https://www.github.com/sh0oki/coursera-autoplay
// @include         https://*.coursera.org/learn/*/lecture/*/*
// @match           https://*.coursera.org/learn/*/lecture/*/*
// @require         https://code.jquery.com/jquery-2.2.3.min.js
// @copyright       2016, sh0oki
// @downloadURL https://update.greasyfork.org/scripts/24232/Coursera%20-%20auto%20play%20next%20video.user.js
// @updateURL https://update.greasyfork.org/scripts/24232/Coursera%20-%20auto%20play%20next%20video.meta.js
// ==/UserScript==

function mainWrapper() {
    var debug = false;
    var US_SHORT_NAME = 'CEXT';
    var US_VERSION = 1.0;
    
    function debugLog(msg) {
        if (!debug) return;
        console.log(US_SHORT_NAME + ": " + msg);
    }
    
    function main() {
        v = $('video');
        if (v.length === 0) {
            setTimeout(main, 300);
            return;
        }
        v[0].addEventListener("ended", function(){
            debugLog("Video ended");
            if (configuredAutoNext()) {
                $('div.right-actions a').last()[0].click()
            }
        });
    }
    
    function configuredAutoNext() {
        b = $('.c-autoplay-button-container button.selected')[0];
        return b.classList.contains("c-autoplay-on-button");
    }
    
    main();
};

$(document).ready(function() {
    mainWrapper()
});
