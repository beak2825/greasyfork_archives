// ==UserScript==
// @name         Remove these darn Channel Trailers
// @namespace    https://greasyfork.org/en/users/782754-picblick
// @version      0.1.2
// @description  Remove these darn Channel Trailers!
// @author       Picblick
// @match        https://www.youtube.com/@*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @grant        unsafeWindow
// @run-at       document-idle
// @sandbox      JavaScript
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/466754/Remove%20these%20darn%20Channel%20Trailers.user.js
// @updateURL https://update.greasyfork.org/scripts/466754/Remove%20these%20darn%20Channel%20Trailers.meta.js
// ==/UserScript==
(function() {
    'use strict';
    const removeVids = () => {
        console.log('Going to search for trailers');
        const vids = document.getElementsByTagName('ytd-channel-video-player-renderer');
        console.log("Found " + vids.lenght + " trailers to hide");
        for(let i = 0; i < vids.length; i++) {
            if(vids[i]) {
                console.log('removing ' + vids[i].className);
                vids[i].remove();
            }
        }
    }

    //interval does not seem to work and I am too lazy to do a more fancy solution than this
    window.setTimeout(removeVids, 100);
    window.setTimeout(removeVids, 1000);
    window.setTimeout(removeVids, 2000);
    /*
    const interval = setInterval(removeVids, 100);
    setTimeout(clearInterval(interval),100_000);
    */
})();