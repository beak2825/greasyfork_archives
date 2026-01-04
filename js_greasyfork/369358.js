// ==UserScript==
// @name         Youtube loop state keeper
// @namespace    https//mmis1000.me/
// @version      0.1
// @description  To Loop or not To Loop is Yes
// @author       mmis1000
// @match        https://www.youtube.com/watch?*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/369358/Youtube%20loop%20state%20keeper.user.js
// @updateURL https://update.greasyfork.org/scripts/369358/Youtube%20loop%20state%20keeper.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const NS = "mmis1000";

    let loopState = sessionStorage.getItem(NS + '_loopState');
    let videoElement = document.querySelectorAll('video')[0];

    if (loopState) {
        setTimeout(function () {
            try {
                let oldState = JSON.parse(loopState);

                if (oldState.loop) {
                    try {
                        // force the menu to populate
                        // as youtube only populate the menu after you do a right click
                        var e = videoElement.ownerDocument.createEvent('MouseEvents');

                        e.initMouseEvent('contextmenu', true, true,
                                         videoElement.ownerDocument.defaultView, 1, 0, 0, 0, 0, false,
                                         false, false, false,2, null);

                        videoElement.dispatchEvent(e);
                        videoElement.click()

                        let loopButton = Array.prototype.slice.call(document.querySelectorAll('.ytp-menuitem'), 0).filter((el)=>el.textContent.indexOf('循環播放') >= 0)[0];
                        loopButton.click()
                        console.log('restoring loop state...')
                    } catch (e) {
                        videoElement.loop = oldState.loop;
                        console.log('restoring loop state... (fallback to set video element loop attr)')
                    }
                }
            } catch(e) {}

            let prevState = videoElement.loop;

            videoElement.addEventListener("timeupdate", function () {
                if (prevState !== videoElement.loop) {
                    console.log('updating loop state...')
                    prevState = videoElement.loop;
                    sessionStorage.setItem(NS + '_loopState', JSON.stringify({loop: videoElement.loop}));
                }
            })
        }, 0);
    }
})();