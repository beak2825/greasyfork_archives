// ==UserScript==
// @name         Ad watcher
// @namespace    https://github.com/CupCaker
// @version      0.2
// @description  Automatically watches ads to receive coins
// @author       CupCaker
// @license      CC BY 4.0
// @match        https://*.sfgame.net/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=sfgame.net
// @grant        none
// @homepageURL  https://github.com/CupCaker/Shakes-And-Fidget-Ad-Watcher/
// @downloadURL https://update.greasyfork.org/scripts/444334/Ad%20watcher.user.js
// @updateURL https://update.greasyfork.org/scripts/444334/Ad%20watcher.meta.js
// ==/UserScript==

/*
    TODO:
        - Manually request a vid? Maybe not worth it as it seems to do it automatically after
            some time anyway.
        - Make use of VideoAdRequester fields and callback funcs, example:
            - AyetVideoSdk.callbackComplete
            - AyetVideoSdk.callbackRewarded
            - _status
            - _modal
*/

(function() {
    'use strict';

    function setup() {
        console.log('setup')
        
        let timeSinceInvalid = null;

        let interval = setInterval(function () {
            var videoModal = document.querySelector('.video-modal');
            var videoModalFooter = document.querySelector('.video-modal-footer');
            var videoModalClose = document.querySelector('.video-close');

            if (videoModal != null && videoModal.style.display !== 'none') {
                let content = videoModalFooter.textContent;

                if (!content || content === '') {
                    console.log('not finished yet → seconds not displayed yet');

                    if (!timeSinceInvalid) {
                        timeSinceInvalid = new Date();
                        return;
                    } else if ((new Date() - timeSinceInvalid) / 1000 < 5) {
                        console.log('invalid < 5 seconds');
                        return;
                    }

                    console.log('invalid, close and retry next time');
                } else if (!isNaN(parseInt(content.charAt(0)))) {
                    timeSinceInvalid = null;
                    console.log('not finished yet → time remaining');
                    return;
                } 

                timeSinceInvalid = null;
                videoModalClose.click();

                return;
            }

            window.videoAdRequester.showVideo();
        }, 1000);
    }

    // load logic shit
    window.addEventListener('load', function() {
        let interval = null;

        function checkReady() {
            console.log('start checking if ad shit is ready');

            try {
                window.videoAdRequester.showVideo();
            } catch {
                // do nothing
                return;
            }

            setup()

            clearInterval(interval);
        }
        interval = setInterval(checkReady, 1000);
    }, false);
})();
