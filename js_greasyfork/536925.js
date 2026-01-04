// ==UserScript==
// @name         Auto Facebook Reels Scroller
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Automatically scrolls through Reels when a video ends!!! You should use ViolentMonkey because Tampermonkey requires enabling developer mode!!!
// @author       hiensumi
// @match        *://www.facebook.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/536925/Auto%20Facebook%20Reels%20Scroller.user.js
// @updateURL https://update.greasyfork.org/scripts/536925/Auto%20Facebook%20Reels%20Scroller.meta.js
// ==/UserScript==

(function () {
    'use strict';
    let pollingInterval = null;
    let lastUrl = 'nothing';
    let enabled = false;

    function log(...args) {
        console.log('[AutoReels]', ...args);
    }

    function scrollToNextReel() {
        const nextButton = document.querySelector('[aria-label="Next Card"][role="button"]');
        if (nextButton) {
            nextButton.click();
            log('Scrolled to next reel');
        }
    }

    function activateReelsScript() {
        enabled = true;
        if (pollingInterval) clearInterval(pollingInterval);

        log('Activated for Reels page');
        let scrolled = false;

        pollingInterval = setInterval(() => {
            // console.log(enabled);
            if(!enabled) return;
            let vids = document.querySelectorAll('video');
            if(window.location.href.includes('reel') == true && vids.length){
                let vid = vids[vids.length - 1]
                //log(vid.duration - vid.currentTime);

                if (vid.duration > 2.0 && (vid.duration - vid.currentTime <= 1)) {
                    if (!scrolled) {
                        log('Video ends, scrolling');
                        scrolled = true;
                        setTimeout(() => {
                            scrollToNextReel();
                        }, 2000);
                    }
                } else {
                    scrolled = false;
                }
            }
            else{
                enabled = false;
                setTimeout(() => {
                    log('False activation');
                }, 1000);
                return;
            }
        }, 500);
    }

    function deactivateReelsScript() {
        enabled = false;
        if (pollingInterval) {
            clearInterval(pollingInterval);
            pollingInterval = null;
            log('Deactivated (not on Reels page)');
        }
    }

    navigation.addEventListener("navigate", e => {
        setTimeout(() => {
            log('Navigation: ' + window.location.href);
            if(window.location.href.includes('reel')){
                deactivateReelsScript();
                setTimeout(() => {
                    activateReelsScript();
                }, 1000);
            }
            else{
                deactivateReelsScript();
            }
        }, 3000);
    });
})();
